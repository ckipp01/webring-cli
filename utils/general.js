'use strict'

const fs = require('fs')

const dim = '\x1b[2m'
const red = '\x1b[31m%s\x1b[0m'

const checkIfExists = (fileLoc, msg) => {
  if (!fs.existsSync(fileLoc)) {
    throw new Error(`${fileLoc} does not exist\n${msg}`)
  }
}

module.exports = { checkIfExists, dim, red }
