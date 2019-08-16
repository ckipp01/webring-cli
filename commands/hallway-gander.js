'use strict'

const fetch = require('node-fetch')
const fs = require('fs')
const Table = require('cli-table3')

const {
  checkIfExistsOrThrow,
  red,
  reTag,
  timeAgo
} = require('../utils/general')

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
  return fetch(site.feed, { timeout: 5000 })
    .then(rawResponse => rawResponse.text())
    .then(data => ({ author: site.author, feed: parseFeed(site.author, data) }))
    .catch(_ => {
      console.error(red, `Unable to correctly fetch ${site.author}'s feed`)
    })
}

const fetchHallway = (siteListLoc, configFileLoc, subOption) =>
  new Promise((resolve, reject) => {
    checkIfExistsOrThrow(siteListLoc, 'Please run webring sync first')
    checkIfExistsOrThrow(configFileLoc, 'Please run webring hallway setup first')

    const rawJson = fs.readFileSync(siteListLoc)
    const siteObjects = JSON.parse(rawJson)
    const rawConfig = fs.readFileSync(configFileLoc)
    const amountToDisplay = JSON.parse(rawConfig).messageAmountToShow

    const feedObjects = siteObjects
      .filter(site => site.feed)
      .map(site => ({ author: site.author, feed: site.feed }))

    Promise.all(feedObjects.map(feed => fetchFeed(feed)))
      .then(allPosts => allPosts.filter(post => post))
      .then(filteredPosts => simplifyPosts(filteredPosts))
      .then(simplified => [].concat.apply([], simplified))
      .then(merged => merged.sort((a, b) => a.offset - b.offset))
      .then(feeds => {
        const filter = typeof subOption === 'string'
          ? subOption
          : null

        const filteredFeeds = filter
          ? feeds.filter(post => post.author === filter || post.body.search('#' + filter) !== -1 || post.body.startsWith('/' + filter)).slice(0, amountToDisplay).reverse()
          : feeds.slice(0, amountToDisplay).reverse()

        if (filteredFeeds.length < 1) {
          reject(new Error(`No author, tags, or channel matches ${subOption} in the last ${amountToDisplay} messages`))
        }

        const table = new Table({
          style: {
            head: ['yellow']
          },
          head: ['author', 'post', 'date'],
          colWidths: [15, 60, 15],
          wordWrap: true
        })

        filteredFeeds.forEach(post => { table.push([post.author, post.body, post.date]) })
        resolve(table)
      })
      .catch(err => reject(new Error(`Unable to fetch and display hallway feeds -> ${err.message}`)))
  })

module.exports = { fetchHallway, timeAgo }
