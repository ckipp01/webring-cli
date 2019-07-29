'use strict'

const path = require('path')
const Table = require('cli-table3')
const test = require('ava')

const { fetchHallway, timeAgo } = require('../commands/hallway-gander')

const validConfigLoc = path.join(__dirname, 'resources', 'valid', 'config.json')
const validSiteListLoc = path.join(__dirname, 'resources', 'valid', 'sites.json')
const validSiteInvalidFeedLoc = path.join(__dirname, 'resources', 'valid', 'valid-sites-invalid-feed.json')

test('hallway gander with no filtering should display correct table', async t => {
  const hallwayTable = await fetchHallway(validSiteListLoc, validConfigLoc, null)

  const testTable = new Table({
    style: {
      head: ['yellow']
    },
    head: ['author', 'post', 'date'],
    colWidths: [15, 60, 15],
    wordWrap: true
  })

  testTable.push(
    ['ckipp', 'Hello everyone #twtxt.', timeAgo(`2019-07-04T05:04:52+00:00`)],
    ['ckipp', '@neauoire it\'s good to be here!', timeAgo(`2019-07-04T14:39:13+00:00`)],
    ['ckipp', '/meta Is the top /hallway on the right bar a catchall, and then the bottom /hallway for when someone targets that channel? It\'s sort of confusing that there\'s two.', timeAgo(`2019-07-05T06:01:22+00:00`)],
    ['ckipp', '/meta I started and couldn\'t stop. I made a cli app for the webring, including the hallway. I had a ton of fun with this, and still have some improvements to make https://github.com/ckipp01/webring-cli', timeAgo(`2019-07-17T14:26:20.203Z`)]
  )

  t.deepEqual(hallwayTable, testTable)
})

test('hallway gander with an added filter for the user works as expected', async t => {
  const hallwayTable = await fetchHallway(validSiteListLoc, validConfigLoc, 'ckipp')

  const testTable = new Table({
    style: {
      head: ['yellow']
    },
    head: ['author', 'post', 'date'],
    colWidths: [15, 60, 15],
    wordWrap: true
  })

  testTable.push(
    ['ckipp', 'Hello everyone #twtxt.', timeAgo(`2019-07-04T05:04:52+00:00`)],
    ['ckipp', '@neauoire it\'s good to be here!', timeAgo(`2019-07-04T14:39:13+00:00`)],
    ['ckipp', '/meta Is the top /hallway on the right bar a catchall, and then the bottom /hallway for when someone targets that channel? It\'s sort of confusing that there\'s two.', timeAgo(`2019-07-05T06:01:22+00:00`)],
    ['ckipp', '/meta I started and couldn\'t stop. I made a cli app for the webring, including the hallway. I had a ton of fun with this, and still have some improvements to make https://github.com/ckipp01/webring-cli', timeAgo(`2019-07-17T14:26:20.203Z`)]
  )

  t.deepEqual(hallwayTable, testTable)
})

test('hallway gander with an added filter for the channel works as expected', async t => {
  const hallwayTable = await fetchHallway(validSiteListLoc, validConfigLoc, 'meta')

  const testTable = new Table({
    style: {
      head: ['yellow']
    },
    head: ['author', 'post', 'date'],
    colWidths: [15, 60, 15],
    wordWrap: true
  })

  testTable.push(
    ['ckipp', '/meta Is the top /hallway on the right bar a catchall, and then the bottom /hallway for when someone targets that channel? It\'s sort of confusing that there\'s two.', timeAgo(`2019-07-05T06:01:22+00:00`)],
    ['ckipp', '/meta I started and couldn\'t stop. I made a cli app for the webring, including the hallway. I had a ton of fun with this, and still have some improvements to make https://github.com/ckipp01/webring-cli', timeAgo(`2019-07-17T14:26:20.203Z`)]
  )

  t.deepEqual(hallwayTable, testTable)
})

test('hallway gander with an added filter on tag works as expected', async t => {
  const hallwayTable = await fetchHallway(validSiteListLoc, validConfigLoc, 'twtxt')

  const testTable = new Table({
    style: {
      head: ['yellow']
    },
    head: ['author', 'post', 'date'],
    colWidths: [15, 60, 15],
    wordWrap: true
  })

  testTable.push(
    ['ckipp', 'Hello everyone #twtxt.', timeAgo(`2019-07-04T05:04:52+00:00`)]
  )

  t.deepEqual(hallwayTable, testTable)
})

test('hallway gander returns correct error when unable to find what you are filtering on', async t => {
  try {
    await fetchHallway(validSiteListLoc, validConfigLoc, 'orange')
  } catch (err) {
    t.is(err.message, 'No author, tags, or channel matches orange in the last 5 messages')
  }
})

test(`hallway gander returns correct error when it's unable to parse the feeds correctly`, async t => {
  try {
    await fetchHallway(validSiteInvalidFeedLoc, validConfigLoc, null)
  } catch (err) {
    t.is(err.message, 'No author, tags, or channel matches null in the last 5 messages')
  }
})
