'use strict'

const path = require('path')
const test = require('ava')

const { writeInHallway } = require('../commands/hallway-write')

const invalidConfigFileLoc = path.join(__dirname, 'resources', 'invalid', 'fake-config.json')
const nonExistantConfigFileLoc = path.join(__dirname, 'resources', 'tmp', 'fake-config.json')
const siteListLoc = path.join(__dirname, 'resources', 'valid', 'sites.json')

test('Hallway write tells you to run setup first if there is no config file', async t => {
  try {
    await writeInHallway(nonExistantConfigFileLoc, siteListLoc, 'here is a fake message')
  } catch (err) {
    t.is(err.message, ` ${nonExistantConfigFileLoc} does not exist\nYou need to run \`webring hallway setup\` first before writing on the hallway`)
  }
})

test('Hallway write errors correctly if it can\'t find the twtxt file', async t => {
  try {
    await writeInHallway(invalidConfigFileLoc, siteListLoc, 'here is a fake message')
  } catch (err) {
    t.is(err.message, ' /fake/location/hallway.txt does not exist\nUnable to locate your twtxt file')
  }
})
