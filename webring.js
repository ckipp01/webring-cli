#!/usr/bin/env node
'use strict'

const fs = require('fs')
const homedir = require('os').homedir()
const path = require('path')
const program = require('commander')

const compendium = require('./commands/wiki')
const {
  fetchFeed,
  fetchFeedUrls,
  htmlifyFeed,
  orderByDate,
  parseAtomFeed,
  parseRssFeed } = require('./commands/rss-gander')
const {
  checkIfExistsOrThrow,
  dim,
  dimBegin,
  end,
  red,
  yellow,
  yellowBegin
} = require('./utils/general')
const { fetchHallway } = require('./commands/hallway-gander')
const {
  fetchSites,
  fetchWikis,
  getMostRecent,
  storeWikis
} = require('./commands/sync')
const { goToRandom } = require('./commands/random')
const {
  createConfigAndEnterTwtxtLocation,
  setGitRepo,
  setMessageLimit
} = require('./commands/hallway-setup')
const { listHallwayMembers, listSites, listRss } = require('./commands/list')
const { writeInHallway } = require('./commands/hallway-write')
const pkg = require('./package.json')

const webringBase = path.join(homedir, '.webring')
const configFileLoc = path.join(webringBase, 'config.json')
const siteListLoc = path.join(webringBase, 'sites.json')
const wikiCacheLoc = path.join(webringBase, 'wiki.json')

const webringSitesUrl = 'https://raw.githubusercontent.com/XXIIVV/Webring/master/scripts/sites.js'

if (!fs.existsSync(webringBase)) {
  fs.mkdir(webringBase, err => {
    if (err) {
      console.error(red, err.message)
      process.exit(1)
    }
  })
}

program
  .version(pkg.version, '-v, --version')
  .command('sync')
  .description('syncs webring sites and wikis')
  .action(async () => {
    try {
      const latest = await getMostRecent()
      if (pkg.version < latest) {
        console.log(red, ` You're currently using ${pkg.version}, but a newer version, ${latest} is available`)
      }
    } catch (err) {
      console.error(red, ` Unable to see if your version is the latest webring-cli\n${err.message}`)
    }

    try {
      const sitesSucces = await fetchSites(webringSitesUrl, siteListLoc)
      console.log(dim, ` ${sitesSucces}`)
    } catch (err) {
      console.error(red, err.message)
    }

    try {
      const wikis = await fetchWikis(siteListLoc)
      const stored = await storeWikis(wikiCacheLoc, wikis)
      console.log(dim, ` ${stored}`)
    } catch (err) {
      console.error(red, err.message)
    }
  })

program
  .command('sites')
  .description('lists all the sites in the webring')
  .action(() => {
    try {
      const sitesTable = listSites(siteListLoc)
      console.log(sitesTable.toString())
    } catch (err) {
      console.error(red, err.message)
    }
  })

program
  .command('random')
  .description('brings you to a random site in the webring')
  .action(() => {
    try {
      goToRandom(siteListLoc)
    } catch (err) {
      console.error(red, err.message)
    }
  })

program
  .command('rss')
  .description('rss feeds are alive and well')
  .option('feeds', 'shows you a list of all available rss feeds and their authors')
  .option('gander <feed>', 'shows you either all of the feeds combined or a specific feed')
  .action(async (options, subOption) => {
    try {
      if (options === 'feeds') {
        const rssTable = listRss(siteListLoc)
        console.log(rssTable.toString())
      } else if (options === 'gander') {
        const feedUrls = await fetchFeedUrls(subOption, siteListLoc)
        const feeds = await Promise.all(feedUrls.map(feed => fetchFeed(feed.rss)))
        const standardized = await feeds.map(feed => {
          return 'feed' in feed
            ? parseAtomFeed(feed)
            : parseRssFeed(feed)
        })
        const flattend = [].concat.apply([], standardized)
        const ordered = orderByDate(flattend)
        await htmlifyFeed(ordered)
      }
    } catch (err) {
      console.error(red, err.message)
    }
  })

program
  .command('hallway')
  .description('a voice echoes in the hallway')
  .option('gander <user | channel | tag>', 'take a gander at the hallway')
  .option('members', 'shows a list of all hallway members and their twtxt file location')
  .option('setup', 'setup for hallway related settings')
  .option('write <message>', 'write a message on the wall')
  .action(async (options, subOption) => {
    try {
      if (options === 'gander') {
        const ganderResponse = await fetchHallway(siteListLoc, configFileLoc, subOption)
        console.log(ganderResponse.toString())
      } else if (options === 'members') {
        const memberTable = listHallwayMembers(siteListLoc)
        console.log(memberTable.toString())
      } else if (options === 'setup') {
        const twtxtResponse = await createConfigAndEnterTwtxtLocation(configFileLoc)
        console.log(dim, twtxtResponse)
        const messageLimitResponse = await setMessageLimit(configFileLoc)
        console.log(dim, messageLimitResponse)
        const gitRepoResponse = await setGitRepo(configFileLoc)
        console.log(gitRepoResponse)
      } else if (options === 'write') {
        const hallwayResponse = await writeInHallway(configFileLoc, siteListLoc, subOption)
        console.log(dim, hallwayResponse)
      } else {
        console.log(yellow, ' a voice echoes in the hallway...')
      }
    } catch (err) {
      console.error(red, err.message)
    }
  })

program
  .command('wiki')
  .description('a decentralized encyclopedia REPL')
  .action(() => {
    try {
      checkIfExistsOrThrow(wikiCacheLoc, ' You must run webring setup before viewing the wiki')
      compendium(wikiCacheLoc)
    } catch (err) {
      console.error(red, err)
    }
  })

program.parse(process.argv)

if (program.args.length === 0) {
  console.info(`
  ${yellowBegin}xxiivv webring${end}

  ${dimBegin}This webring is an attempt to inspire artists & developers to create
  and maintain their own website and share traffic among each other${end}`
  )
}
