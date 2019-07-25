'use strict'

const fs = require('fs')

const { checkIfExists, dim } = require('../utils/general')

const enterHallway = (configFileLoc, option, subOption) => {
  return new Promise((resolve, reject) => {
    if (option === 'write') {
      checkIfExists(configFileLoc, 'You need to run webring hallway setup first before writing on the hallway')
      if (typeof subOption !== 'string') {
        reject(new Error(`Your message can't be empty`))
      } else {
        const rawJson = fs.readFileSync(configFileLoc)
        const config = JSON.parse(rawJson)
        const txtLoc = config.hallwayFileLocation

        const d = new Date().toISOString()

        checkIfExists(txtLoc, 'Unable to locate your twtxt file')

        const txt = fs.readFileSync(txtLoc, 'utf8')
        console.log(dim, `Found ${txt.split('\n').length} entries.`)
        console.log(dim, `Adding entry #${txt.split('\n').length + 1}`)

        fs.writeFileSync(txtLoc, d + '\t' + subOption + '\n' + txt)
        resolve(`Added ${d} ${subOption}`)
      }
    }

    if (option === 'setup') {
      const standardInput = process.stdin
      standardInput.setEncoding('utf-8')
      console.log(dim, `Please enter your twtxt file location`)
      standardInput.on('data', answer => {
        if (answer.trim() === 'exit') {
          reject(new Error('You will not be able to write on the wall until the configuration is complete'))
        } else {
          const config = { hallwayFileLocation: answer.trim() }
          fs.writeFileSync(configFileLoc, JSON.stringify(config))
          resolve('Created config file, you may now write on the wall')
        }
      })
    }
  })
}

module.exports = { enterHallway }
