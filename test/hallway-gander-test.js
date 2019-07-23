'use strict'

const path = require('path')
const Table = require('cli-table3')
const test = require('ava')

const { enterHallway } = require('../commands/hallway')

const invalidFeedCacheLoc = path.join(__dirname, 'resources', 'invalid', 'feed.json')
const validFeedCacheLoc = path.join(__dirname, 'resources', 'valid', 'feed.json')
const validConfigFileLoc = path.join(__dirname, 'resources', 'tmp', 'config.json')

test('hallway gander with no filtering should display correct table', async t => {
  const hallwayTable = await enterHallway(validFeedCacheLoc, validConfigFileLoc, 'gander', null)

  const testTable = new Table({
    style: {
      head: ['grey']
    },
    head: ['author', 'post', 'date'],
    colWidths: [15, 60, 15],
    wordWrap: true
  })

  testTable.push(
    ['amorris', '/lab  https://www.ietf.org/rfc/rfc4880.txt', '2 days ago'],
    ['ckipp', '/meta ckipp01/webring-cli', '1 days ago'],
    ['quite', 'wow! #twtxt lives on indeed https://webring.xxiivv.com/hallway.html', 'yesterday'],
    ['ckipp', 'Welcome @<quite https://lublin.se/twtxt.txt>!', '6 hours ago']
  )

  t.deepEqual(hallwayTable, testTable)
})

test('hallway gander with an added filter for the user works as expected', async t => {
  const hallwayTable = await enterHallway(validFeedCacheLoc, validConfigFileLoc, 'gander', 'ckipp')

  const testTable = new Table({
    style: {
      head: ['grey']
    },
    head: ['author', 'post', 'date'],
    colWidths: [15, 60, 15],
    wordWrap: true
  })

  testTable.push(
    ['ckipp', '/meta ckipp01/webring-cli', '1 days ago'],
    ['ckipp', 'Welcome @<quite https://lublin.se/twtxt.txt>!', '6 hours ago']
  )

  t.deepEqual(hallwayTable, testTable)
})

test('hallway gander with an added filter for the channel works as expected', async t => {
  const hallwayTable = await enterHallway(validFeedCacheLoc, validConfigFileLoc, 'gander', 'meta')

  const testTable = new Table({
    style: {
      head: ['grey']
    },
    head: ['author', 'post', 'date'],
    colWidths: [15, 60, 15],
    wordWrap: true
  })

  testTable.push(
    ['ckipp', '/meta ckipp01/webring-cli', '1 days ago']
  )

  t.deepEqual(hallwayTable, testTable)
})

test('hallway gander with an added filter on tag works as expected', async t => {
  const hallwayTable = await enterHallway(validFeedCacheLoc, validConfigFileLoc, 'gander', 'twtxt')

  const testTable = new Table({
    style: {
      head: ['grey']
    },
    head: ['author', 'post', 'date'],
    colWidths: [15, 60, 15],
    wordWrap: true
  })

  testTable.push(
    ['quite', 'wow! #twtxt lives on indeed https://webring.xxiivv.com/hallway.html', 'yesterday']
  )

  t.deepEqual(hallwayTable, testTable)
})

test('hallway gander returns correct error when unable to find what you are filtering on', async t => {
  try {
    await enterHallway(validFeedCacheLoc, validConfigFileLoc, 'gander', 'orange')
  } catch (err) {
    t.deepEqual(err.message, 'No author, tags, or channel matches orange in the last 20 messages')
  }
})

test(`hallway gander returns correct error when it's unable to parse the feeds correct`, async t => {
  try {
    await enterHallway(invalidFeedCacheLoc, validConfigFileLoc, 'gander', null)
  } catch (err) {
    t.deepEqual(err.message, 'Unexpected token \' in JSON at position 20')
  }
})
