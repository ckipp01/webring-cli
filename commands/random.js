'use strict'

const { exec } = require('child_process')
const fs = require('fs')
const platform = require('os').platform()

const { checkIfExists, dim } = require('../utils/general')

const goToRandom = sitesLocation => {
  checkIfExists(sitesLocation, 'Please run webring sync first')

  const rawJson = fs.readFileSync(sitesLocation)
  const siteObjects = JSON.parse(rawJson)

  const randomSite = siteObjects[Math.floor((Math.random() * siteObjects.length))]

  console.log(dim, `Attempting to Navigate to ${randomSite.url}`)

  if (platform === 'linux' || platform === 'freebsd' || platform === 'openbsd') {
    exec(`xdg-open ${randomSite.url}`, error => {
      if (error) {
        throw new Error(`Unable to execute xdg-open. If you're not running X this command won't work`)
      }
    })
  } else if (platform === 'darwin') {
    exec(`open ${randomSite.url}`)
  } else if (platform === 'win32') {
    exec(`explorer ${randomSite.url}`)
  } else {
    throw new Error(`Sorry, I don't support ${platform} yet`)
  }
}

module.exports = { goToRandom }
