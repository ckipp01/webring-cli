'use strict'

const fs = require('fs')
const Table = require('cli-table3')

const { checkIfExists } = require('../utils/general')

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

const listSites = siteListLoc => {
  checkIfExists(siteListLoc, 'Please run webring sync first')

  const table = new Table({
    style: {
      head: ['grey']
    },
    head: ['webring sites', '']
  })

  const rawJson = fs.readFileSync(siteListLoc)
  const siteObjects = JSON.parse(rawJson)
  const urls = siteObjects.map(site => site.url)
  const grouped = urls.reduce(groupGroupByTwo, [])
  grouped.forEach(group => { table.push(group) })

  return table
}

const listRss = siteListLoc => {
  checkIfExists(siteListLoc, 'Please run webring sync first')

  const table = new Table({
    style: {
      head: ['grey']
    },
    head: ['rss feeds', '']
  })

  const rawJson = fs.readFileSync(siteListLoc)
  const siteObjects = JSON.parse(rawJson)
  const sitesFeeds = siteObjects
    .filter(site => site.rss)
    .map(site => site.rss)

  const grouped = sitesFeeds.reduce(groupGroupByTwo, [])
  grouped.forEach(group => { table.push(group) })

  return table
}

module.exports = { listSites, listRss }
