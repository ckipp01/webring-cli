#!/usr/bin/env node
'use strict'

const fs = require('fs')
const homedir = require('os').homedir()
const path = require('path')
const program = require('commander')

const { dim, red } = require('./utils/general')
const { enterHallway } = require('./commands/hallway')
const { fetchHallway } = require('./commands/hallway-gander')
const { fetchSites, getMostRecent } = require('./commands/sync')
const { goToRandom } = require('./commands/random')
const { listHallwayMembers, listSites, listRss } = require('./commands/list')
const pkg = require('./package.json')

const webringBase = path.join(homedir, '.webring')
const siteListLoc = path.join(webringBase, 'sites.json')
const configFileLoc = path.join(webringBase, 'config.json')

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
  .description('syncs latest sites.js file from the xxiivv webring and the hallway feeds')
  .action(async () => {
    try {
      const latest = await getMostRecent()
      if (pkg.version < latest) {
        console.log(red, `You're currently using ${pkg.version}, but a newer version, ${latest} is available`)
      }
    } catch (err) {
      console.error(`Unable to see if your version is the latest webring-cli\n${err.message}`)
    }

    try {
      const sitesSucces = await fetchSites(webringSitesUrl, siteListLoc)
      console.log(dim, sitesSucces)
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
  .description('shows you a list of all available rss feeds in the webring')
  .action(() => {
    try {
      const rssTable = listRss(siteListLoc)
      console.log(rssTable.toString())
    } catch (err) {
      console.error(red, err.message)
    }
  })

program
  .command('hallway')
  .description('a voice echoes in the hallway')
  .option('gander <user | channel | tag>', 'take a gander at the hallway')
  .option('members', 'shows a list of all hallway members and their twtxt file location')
  .option('setup', 'setup location of twtxt file')
  .option('write <message>', 'write a message on the wall')
  .action(async (options, subOption) => {
    try {
      if (options === 'gander') {
        const ganderResponse = await fetchHallway(siteListLoc, subOption)
        console.log(ganderResponse.toString())
      } else if (options === 'members') {
        const memberTable = listHallwayMembers(siteListLoc)
        console.log(memberTable.toString())
      } else if (options === 'setup') {
        const hallwayResponse = await enterHallway(configFileLoc, options, subOption)
        console.log(hallwayResponse)
        process.exit()
      } else if (options === 'write') {
        const hallwayResponse = await enterHallway(configFileLoc, options, subOption)
        console.log(hallwayResponse)
      } else {
        console.error(red, `This isn't a valid command for the hallway`)
      }
    } catch (err) {
      console.error(red, err.message)
    }
  })

program.parse(process.argv)

if (program.args.length === 0) {
  console.info(dim, '\nxxiivv webring\n\nThis webring is an attempt to inspire artists & developers to create and maintain their own website and share traffic among each other')
}
