'use strict'

const { exec } = require('child_process')
const fetch = require('node-fetch')
const fs = require('fs')
const he = require('he')
const parser = require('fast-xml-parser')
const path = require('path')
const os = require('os')

const {
  checkIfExistsOrThrow,
  dim,
  formatDate,
  style
} = require('../utils/general')

const handleEnclosure = enclosureObject => {
  if (enclosureObject._type === 'audio/mpeg') {
    return `<audio controls> <source src="${enclosureObject._url}" type="audio/mpeg">
                Your browser doesn't support audio</audio>
              </source>
            </audio>`
  } else {
    return 'This type of enclosure is not supported yet'
  }
}

const parseAtomFeed = feed => {
  const title = feed.feed.title || 'Missing Title'
  const link = feed.feed.id || ''
  const content = feed.feed.entry
  return content.map(atomPost => {
    const postTitle = atomPost.title || 'Missing Title'
    const postDate = formatDate(atomPost.published) || '0000-00-00'
    const postLink = atomPost.link['_href'] || ''
    const postContent = atomPost.summary['#text'] || 'Missing Summary'
    const post = { postTitle, postDate, postLink, postContent }
    return { title, link, post }
  })
}

const parseRssFeed = feed => {
  const title = feed.rss.channel.title || 'Missing Title'
  const link = feed.rss.channel.link || ''
  const content = feed.rss.channel.item
  return content.map(rssPost => {
    const postTitle = rssPost.title || 'Missing Title'
    const postDate = formatDate(rssPost.pubDate) || '0000-00-00'
    const postLink = rssPost.link || ''
    let postContent = ''
    if (rssPost.enclosure) {
      postContent = handleEnclosure(rssPost.enclosure)
    } else if (rssPost['content:encoded']) {
      postContent = rssPost['content-encoded']
    } else {
      postContent = rssPost.description
    }
    const post = { postTitle, postDate, postLink, postContent }
    return { title, link, post }
  })
}

const orderByDate = arr => {
  return arr.slice().sort((a, b) => {
    return a.post.postDate > b.post.postDate ? -1 : 1
  })
}

const fetchFeed = site => {
  const parserOptions = {
    attributeNamePrefix: '_',
    ignoreAttributes: false,
    attrValueProcessor: a => he.decode(a, { isAttributeValue: true }),
    tagValueProcessor: a => he.decode(a)
  }

  return fetch(site, { timeout: 3000 })
    .then(response => response.text())
    .then(str => parser.parse(str, parserOptions))
    .catch(err => { throw err })
}

const fetchFeedUrls = (feedOrDefaultObject, siteListLoc) =>
  new Promise((resolve, reject) => {
    checkIfExistsOrThrow(siteListLoc, 'Please run webring sync first')

    const filter = typeof feedOrDefaultObject === 'string'
      ? feedOrDefaultObject
      : null

    const filterFeeds = feedObject => {
      return filter
        ? feedObject.rss && feedObject.author === filter
        : feedObject.rss
    }

    const rawJson = fs.readFileSync(siteListLoc)
    const siteObjects = JSON.parse(rawJson)
    const feedObjects = siteObjects
      .filter(filterFeeds)
      .map(site => ({ author: site.author, rss: site.rss }))

    feedObjects.length > 0
      ? resolve(feedObjects)
      : reject(new Error(`No feeds matching ${filter}`))
  })

const header = `<html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>${style}</style>
                  </head>`

const htmlifyFeed = feed => {
  const allContent = feed.reduce((html, entry) => {
    const postTitleLink = entry.post.postLink !== ''
      ? `<a target="_blank" href="${entry.post.postLink}">${entry.post.postTitle}</a>`
      : entry.post.postTitle
    return `${html}<div class='rss'>
              <h2><a target="_blank" href="${entry.link}">${entry.title}</a></h2>
              <h3>${postTitleLink}</h3>
              <p>${entry.post.postDate}</p>
            <div>${entry.post.postContent}</div>
           </div>`
  }, '')

  const html = `
    ${header}
    <body>
      <div>
        <h1>
          <a target="_blank" href="https://webring.xxiivv.com">XXIIVV Webring Feed</a>
        </h1>
        ${allContent}
        </div>
    </body>`

  const tmpdir = os.tmpdir()
  const tmpRssFeed = path.join(tmpdir, 'rss.html')
  fs.writeFileSync(tmpRssFeed, html)

  console.log(dim, 'Attempting to open feed...')
  const platform = os.platform()
  if (platform === 'linux' || platform === 'freebsd' || platform === 'openbsd') {
    exec(`xdg-open ${tmpRssFeed}`, error => {
      if (error) {
        throw new Error('Unable to execute xdg-open. If you\'re not running X this command won\'t work')
      }
    })
  } else if (platform === 'darwin') {
    exec(`open ${tmpRssFeed}`)
  } else if (platform === 'win32') {
    exec(`explorer ${tmpRssFeed}`)
  } else {
    throw new Error(`Sorry, I don't support ${platform} yet`)
  }
}

module.exports = {
  fetchFeed,
  fetchFeedUrls,
  htmlifyFeed,
  orderByDate,
  parseAtomFeed,
  parseRssFeed
}
