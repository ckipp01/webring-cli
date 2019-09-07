'use strict'

const fs = require('fs')
const Table = require('cli-table3')

const { checkIfExistsOrThrow } = require('../utils/general')

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
  checkIfExistsOrThrow(siteListLoc, 'Please run `webring sync` first')

  const table = new Table({
    style: {
      head: ['yellow']
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
  checkIfExistsOrThrow(siteListLoc, 'Please run `webring sync` first')

  const table = new Table({
    style: {
      head: ['yellow']
    },
    head: ['author', 'rss feed']
  })

  const rawJson = fs.readFileSync(siteListLoc)
  const siteObjects = JSON.parse(rawJson)
  const sitesFeeds = siteObjects
    .filter(site => site.rss)

  sitesFeeds.forEach(group => { table.push([group.author, group.rss]) })

  return table
}

const listHallwayMembers = siteListLoc => {
  checkIfExistsOrThrow(siteListLoc, 'Please run `webring sync` first')

  const table = new Table({
    style: {
      head: ['yellow']
    },
    head: ['member', 'twtxt location']
  })

  const rawJson = fs.readFileSync(siteListLoc)
  const siteObjects = JSON.parse(rawJson)
  const sitesFeeds = siteObjects
    .filter(site => site.feed)

  sitesFeeds.forEach(group => { table.push([group.author, group.feed]) })

  return table
}

module.exports = { listHallwayMembers, listSites, listRss }
