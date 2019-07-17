'use strict'

const fs = require('fs')

const listSites = siteList => {
  if (!fs.existsSync(siteList)) {
    console.error('Please run webring sync irst')
    process.exit(1)
  }

  const rawJson = fs.readFileSync(siteList)
  const siteObjects = JSON.parse(rawJson)
  siteObjects.forEach(site => { console.info(site.url) })
}

const listRss = siteList => {
  if (!fs.existsSync(siteList)) {
    console.error('Please run webring sync first')
    process.exit(1)
  }

  const rawJson = fs.readFileSync(siteList)
  const siteObjects = JSON.parse(rawJson)
  siteObjects
    .filter(site => site.rss)
    .forEach(site => { console.info(site.rss) })
}

module.exports = { listSites, listRss }
