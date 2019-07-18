'use strict'

const { exec } = require('child_process')
const fs = require('fs')
const platform = require('os').platform()

const { dim, red } = require('../utils/general')

const goToRandom = sitesLocation => {
  if (!fs.existsSync(sitesLocation)) {
    console.error(red, 'Please run webring sync first')
    process.exit()
  }
  const rawJson = fs.readFileSync(sitesLocation)
  const siteObjects = JSON.parse(rawJson)

  const randomSite = siteObjects[Math.floor((Math.random() * siteObjects.length))]

  console.log(dim, `Attempting to Navigate to ${randomSite.url}`)

  if (platform === 'linux' || platform === 'freebsd' || platform === 'openbsd') {
    exec(`xdg-open ${randomSite.url}`, error => {
      if (error) {
        console.error(red, `Unable to execute xdg-open. If you're not running X this command won't work`)
        process.exit(1)
      }
    })
  } else if (platform === 'darwin') {
    exec(`open ${randomSite.url}`)
  } else if (platform === 'win32') {
    exec(`explorer ${randomSite.url}`)
  } else {
    console.log(dim, `Sorry, I don't support ${platform} yet.`)
  }
}

module.exports = { goToRandom }
