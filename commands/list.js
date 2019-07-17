'use strict'

const fs = require('fs')
const Table = require('cli-table3')

const groupGroupByTwo = (group, next) => {
  if (group.length === 0) {
    group.push([next])
  } else {
    if (group[group.length - 1].length < 2) {
      group[group.length - 1].push(next)
    } else {
      group.push([next])
    }
  }
  return group
}

const listSites = siteList => {
  if (!fs.existsSync(siteList)) {
    console.error('Please run webring sync irst')
    process.exit(1)
  }

  const table = new Table({
    head: ['webring sites', '']
  })

  const rawJson = fs.readFileSync(siteList)
  const siteObjects = JSON.parse(rawJson)
  const urls = siteObjects.map(site => site.url)
  const grouped = urls.reduce(groupGroupByTwo, [])
  grouped.forEach(group => { table.push(group) })

  console.log(table.toString())
}

const listRss = siteList => {
  if (!fs.existsSync(siteList)) {
    console.error('Please run webring sync first')
    process.exit(1)
  }

  const table = new Table({
    head: ['rss feeds', '']
  })

  const rawJson = fs.readFileSync(siteList)
  const siteObjects = JSON.parse(rawJson)
  const sitesFeeds = siteObjects
    .filter(site => site.rss)
    .map(site => site.rss)

  const grouped = sitesFeeds.reduce(groupGroupByTwo, [])
  grouped.forEach(group => { table.push(group) })

  console.log(table.toString())
}

module.exports = { listSites, listRss }
