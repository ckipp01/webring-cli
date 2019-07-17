'use strict'

const { exec } = require('child_process')
const fs = require('fs')
const platform = require('os').platform()

const goToRandom = sitesLocation => {
  if (!fs.existsSync(sitesLocation)) {
    console.error('Please run webring sync first')
    process.exit(1)
  }
  const rawJson = fs.readFileSync(sitesLocation)
  const siteObjects = JSON.parse(rawJson)

  const randomSite = siteObjects[Math.floor((Math.random() * siteObjects.length))]

  console.info(`Navigating to ${randomSite.url}`)

  if (platform === 'linux') {
    exec(`xdg-open ${randomSite.url}`)
  } else if (platform === 'darwin') {
    exec(`open ${randomSite.url}`)
  } else if (platform === 'win32') {
    exec(`explorer ${randomSite.url}`)
  } else {
    console.info(`Sorry, I don't support ${platform} yet.`)
  }
}

module.exports = { goToRandom }
