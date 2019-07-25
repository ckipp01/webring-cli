'use strict'

const path = require('path')
const test = require('ava')

const { enterHallway } = require('../commands/hallway')

const invalidConfigFileLoc = path.join(__dirname, 'resources', 'invalid', 'fake-config.json')
const nonExistantConfigFileLoc = path.join(__dirname, 'resources', 'tmp', 'fake-config.json')

test('Hallway write tells you to run setup first if there is no config file', async t => {
  try {
    await enterHallway(nonExistantConfigFileLoc, 'write', 'here is a fake message')
  } catch (err) {
    t.is(err.message, `${nonExistantConfigFileLoc} does not exist\nYou need to run webring hallway setup first before writing on the hallway`)
  }
})

test(`Hallway write errors correctly if it can't find the twtxt file`, async t => {
  try {
    await enterHallway(invalidConfigFileLoc, 'write', 'here is a fake message')
  } catch (err) {
    t.is(err.message, `/fake/location/hallway.txt does not exist\nUnable to locate your twtxt file`)
  }
})
