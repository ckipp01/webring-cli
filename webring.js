#!/usr/bin/env node
'use strict'

const fs = require('fs')
const homedir = require('os').homedir()
const path = require('path')
const program = require('commander')

const { dim, red } = require('./utils/general')
const { enterHallway } = require('./commands/hallway')
const { syncWebring } = require('./commands/sync')
const { goToRandom } = require('./commands/random')
const { listSites, listRss } = require('./commands/list')
const wcli = require('./package.json')

const webringBase = path.join(homedir, '.webring')
const siteListLoc = path.join(webringBase, 'sites.json')
const feedCacheLoc = path.join(webringBase, 'feed.json')
const configFileLoc = path.join(webringBase, 'config.json')

if (!fs.existsSync(webringBase)) {
  fs.mkdir(webringBase, err => {
    if (err) {
      console.error(red, err.message)
      process.exit(1)
    }
  })
}

program
  .version(wcli.version)
  .command('sync')
  .description('syncs latest sites.js file from the xxiivv webring and the hallway feeds')
  .action(() => syncWebring(siteListLoc, feedCacheLoc))

program
  .command('sites')
  .description('lists all the sites in the webring')
  .action(() => listSites(siteListLoc))

program
  .command('random')
  .description('brings you to a random site in the webring')
  .action(() => goToRandom(siteListLoc))

program
  .command('rss')
  .description('shows you a list of all available rss feeds in the webring')
  .action(() => listRss(siteListLoc))

program
  .command('hallway')
  .description('a voice echoes in the hallway')
  .option('gander <user | channel | tag>', 'take a gander at the hallway')
  .option('write <message>', 'write a message on the wall')
  .option('setup', 'setup location of twtxt file')
  .action((options, message) => enterHallway(feedCacheLoc, configFileLoc, options, message))

program.parse(process.argv)

if (program.args.length === 0) {
  console.info(dim, '\nThis webring is an attempt to inspire artists & developers to create and maintain their own website and share traffic among each other.')
}
