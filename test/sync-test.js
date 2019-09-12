'use strict'

const path = require('path')
const test = require('ava')

const { fetchSites, getMostRecent } = require('../commands/sync')
const pkg = require('../package')

const validSitesUrl = 'https://webring-cli-test.now.sh/valid-sites.js'
const invalidSitesUrl = 'https://webring-cli-test.now.sh/invalid-sites.js'

const siteLoc = path.join(__dirname, 'resources', 'tmp', 'sites.json')

test('Sync works to parse a valid sites.js file and store it', async t => {
  const sitesSucces = await fetchSites(validSitesUrl, siteLoc)
  t.is(sitesSucces, 'Synced 6 sites')
})

test('Sync displays the correct error if it\'s unable to parse the sites.js file', async t => {
  try {
    await fetchSites(invalidSitesUrl, siteLoc)
  } catch (err) {
    t.is(err.message, 'Unable to fetch and parse sites.js -> Unexpected token t in JSON at position 335')
  }
})

test('Sync works to check to ensure your version is the most up to date', async t => {
  const version = await getMostRecent()
  t.is(version, pkg.version)
})
