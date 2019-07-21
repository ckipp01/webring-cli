'use strict'

const path = require('path')
const test = require('ava')

const { fetchHallway, fetchSites } = require('../commands/sync')

const validSitesUrl = 'https://webring-cli-test.now.sh/valid-sites.js'
const invalidSitesUrl = 'https://webring-cli-test.now.sh/invalid-sites.js'

const siteLoc = path.join(__dirname, 'resources', 'tmp', 'sites.json')
const feedCacheLoc = path.join(__dirname, 'resources', 'tmp', 'feed.json')
const fakeValidSiteLoc = path.join(__dirname, 'resources', 'valid', 'fake-sites.json')
const fakeInvalidSiteLoc = path.join(__dirname, 'resources', 'invalid', 'fake-sites.json')

test('Sync works to parse a valid sites.js file and store it', async t => {
  const sitesSucces = await fetchSites(validSitesUrl, siteLoc)
  t.is(sitesSucces, 'Synced 6 sites')
})

test(`Sync displays the correct error if it's unable to parse the sites.js file`, async t => {
  try {
    await fetchSites(invalidSitesUrl, siteLoc)
  } catch (err) {
    t.is(err.message, 'Unable to fetch and parse sites.js -> Unexpected token t in JSON at position 52')
  }
})

test('Sync works to fetch hallway feeds correctly from a valid twtxt file', async t => {
  const feedsSuccess = await fetchHallway(fakeValidSiteLoc, feedCacheLoc)
  t.is(feedsSuccess, 'Synced 9 hallway feed entries')
})

test(`Sync displays the correct error if it encounters a twtxt feed it can't parse`, async t => {
  const feedsSuccess = await fetchHallway(fakeInvalidSiteLoc, feedCacheLoc)
  t.is(feedsSuccess, 'Synced 9 hallway feed entries')
})
