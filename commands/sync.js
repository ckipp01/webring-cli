'use strict'

const fetch = require('node-fetch')
const fs = require('fs')

const { checkIfExists, red } = require('../utils/general')

const cleanLine = line => {
  const dirtyString = line.slice(line.indexOf('{'), line.indexOf('}') + 1)
  const cleanJSON = dirtyString
    .replace(/\s/g, '')
    .replace((/([\w]+)(:')/g), '"$1"$2')
    .replace(/'/g, '"')
  return JSON.parse(cleanJSON)
}

const fetchSites = (webringSitesUrl, siteListLoc) => {
  return new Promise((resolve, reject) => {
    fetch(webringSitesUrl)
      .then(rawResponse => rawResponse.text())
      .then(data => {
        const begin = data.indexOf('[') + 1
        const end = data.indexOf(']')

        const siteObjects = data
          .slice(begin, end)
          .split('\n')
          .filter(url => url !== '')
          .map(cleanLine)

        fs.writeFileSync(siteListLoc, JSON.stringify(siteObjects))
        resolve(`Synced ${Object.keys(siteObjects).length} sites`)
      })
      .catch(err => {
        reject(new Error(`Unable to fetch and parse sites.js -> ${err.message}`))
      })
  })
}

const reTag = /([^&]|^)#([a-zA-Z0-9]+)/g

const timeAgo = dateParam => {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam)
  const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
  const today = new Date()
  const yesterday = new Date(today - DAY_IN_MS)
  const seconds = Math.round((today - date) / 1000)
  const minutes = Math.round(seconds / 60)
  const isToday = today.toDateString() === date.toDateString()
  const isYesterday = yesterday.toDateString() === date.toDateString()

  if (seconds < 5) {
    return 'just now'
  } else if (seconds < 60) {
    return `${seconds} seconds ago`
  } else if (seconds < 90) {
    return 'a minute ago'
  } else if (minutes < 60) {
    return `${minutes} minutes ago`
  } else if (isToday) {
    return `${Math.floor(minutes / 60)} hours ago`
  } else if (isYesterday) {
    return 'yesterday'
  }

  return `${Math.floor(minutes / 1440)} days ago`
}

const parseFeed = (author, feed) => {
  const lines = feed.split('\n')
  const entries = []
  for (const id in lines) {
    const line = lines[id].trim()
    if (line === '' || line.charAt(0) === '#') { continue }
    const parts = line.replace('   ', '\t').split('\t')
    const date = parts[0].trim()
    const body = parts[1].trim()
    const channel = body.substr(0, 1) === '/' ? body.split(' ')[0].substr(1).toLowerCase() : body.substr(0, 1) === '@' ? 'veranda' : 'lobby'
    const tags = (body.match(reTag) || []).map(a => a.substr(a.indexOf('#') + 1).toLowerCase())
    const offset = new Date() - new Date(date)
    entries.push({ date, body, author, offset, channel, tags })
  }
  return entries
}

const fetchFeed = site => {
  return fetch(site.feed)
    .then(rawResponse => rawResponse.text())
    .then(data => ({ author: site.author, feed: parseFeed(site.author, data) }))
    .catch(_ => {
      console.error(red, `Unable to correctly fetch ${site.author}'s feed correctly`)
    })
}

const simplifyPosts = allPosts => {
  return allPosts.map(post => {
    return post.feed.map(post => ({
      author: post.author,
      date: timeAgo(Date.parse(post.date)),
      offset: post.offset,
      body: post.body
    }))
  })
}

const fetchHallway = (siteListLoc, feedCacheLoc) => {
  return new Promise((resolve, reject) => {
    checkIfExists(siteListLoc, 'Please run webring fetch first')

    const rawJson = fs.readFileSync(siteListLoc)
    const siteObjects = JSON.parse(rawJson)
    const feedObjects = siteObjects
      .filter(site => site.feed)
      .map(site => ({ author: site.author, feed: site.feed }))

    Promise.all(feedObjects.map(feed => fetchFeed(feed)))
      .then(allPosts => allPosts.filter(post => post !== undefined))
      .then(filteredPosts => simplifyPosts(filteredPosts))
      .then(simplified => [].concat.apply([], simplified))
      .then(merged => merged.sort((a, b) => a.offset - b.offset))
      .then(finalizedFeeds => {
        fs.writeFileSync(feedCacheLoc, JSON.stringify(finalizedFeeds))
        resolve(`Synced ${finalizedFeeds.length} hallway feed entries`)
      })
      .catch(err => reject(new Error(`Unable to fetch and sync hallway feeds -> ${err.message}`)))
  })
}

module.exports = { fetchHallway, fetchSites }
