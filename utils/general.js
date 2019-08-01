'use strict'

const fs = require('fs')

const dim = '\x1b[2m%s\x1b[0m'
const dimBegin = '\x1b[2m'
const yellowBegin = '\x1b[33m'
const yellow = '\x1b[33m%s\x1b[0m'
const red = '\x1b[31m%s\x1b[0m'
const end = '\x1b[0m'

const checkIfExistsOrThrow = (fileLoc, msg) => {
  if (!fs.existsSync(fileLoc)) {
    throw new Error(`${fileLoc} does not exist\n${msg}`)
  }
}

const checkIfExists = fileLoc => fs.existsSync(fileLoc)

const padDate = n => n < 10 ? '0' + n : n

const formatDate = date => {
  const d = new Date(date)
  const month = padDate(d.getMonth() + 1)
  const day = padDate(d.getDate())
  const year = d.getFullYear()
  return [year, month, day].join('-')
}

const reTag = /([^&]|^)#([a-zA-Z0-9]+)/g

const timeAgo = dateParam => {
  const date = new Date(dateParam)
  const today = new Date()
  const yesterday = new Date(today - 86400000)
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

const style = `
  * { margin:0;padding:0;border:0;outline:0;text-decoration:none;font-weight:inherit;font-style:inherit;color:inherit;font-size:100%;font-family:inherit;vertical-align:baseline;list-style:none;border-collapse:collapse;border-spacing:0; -webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}
  body { background:#111; padding:0px; margin:0px; line-height: 1.5; }
  div { background: #f4f4f4;margin: 15px;color: #333;padding: 15px;font-family:'Monospaced','Courier New',courier;font-size:12px;border-radius: 2px; }
  div.rss { max-width: 986px; margin: auto; }
  img, video { max-width: 100%; margin: 5px; height: auto; }
  th { font-size: 13px;border-bottom: 2px solid; }
  a { text-decoration: underline black; }
  td { padding: 0 0 0 1em; }
  h1 > a, h2 > a, h3 > a { text-decoration: none; }
  a:hover { text-decoration: underline black; }
  td.wiki::after { content:"<wiki>"; color: #A8A8A8; padding: 0 1em 0 0; }
  td.blog::after { content:"<blog>"; color: #A8A8A8; padding: 0 1em 0 0; }
  tr { line-height: 20px; }
  tr.error { color:#F03; }
  pre { background: white; padding: 5px; }
  h1 { font-size: 2em; text-align: center; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.24em; }
  h5 { margin: 1em }
`
module.exports = {
  checkIfExistsOrThrow,
  checkIfExists,
  dim,
  dimBegin,
  end,
  formatDate,
  reTag,
  timeAgo,
  red,
  style,
  yellow,
  yellowBegin
}
