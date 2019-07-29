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

module.exports = {
  checkIfExistsOrThrow,
  checkIfExists,
  dim,
  dimBegin,
  end,
  red,
  yellow,
  yellowBegin
}
