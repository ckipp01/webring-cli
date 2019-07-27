'use strict'

const fetch = require('node-fetch')
const fs = require('fs')

const cleanLine = line => {
  const dirtyString = line.slice(line.indexOf('{'), line.indexOf('}') + 1)
  const cleanJSON = dirtyString
    .replace(/\s/g, '')
    .replace((/([\w]+)(:')/g), '"$1"$2')
    .replace(/'/g, '"')
  return JSON.parse(cleanJSON)
}

const fetchSites = (webringSitesUrl, siteListLoc) =>
  new Promise((resolve, reject) => {
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

const getMostRecent = () => new Promise((resolve, reject) => {
  const options = {
    headers: {
      accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
    },
    timeout: 2000
  }

  const latest = fetch('https://registry.npmjs.org/webring-cli', options)
    .then(rawResponse => rawResponse.text())
    .then(data => JSON.parse(data)['dist-tags'].latest)
    .catch(err => { reject(err.message) })

  resolve(latest)
})

module.exports = { fetchSites, getMostRecent }
