'use strict'

const fs = require('fs')

const { checkIfExists, dim } = require('../utils/general')

const writeInHallway = (configFileLoc, siteListLoc, subOption) => {
  return new Promise((resolve, reject) => {
    checkIfExists(configFileLoc, 'You need to run webring hallway setup first before writing on the hallway')
    checkIfExists(siteListLoc, 'You need to run webring sync before writing in the hallway')
    if (typeof subOption !== 'string') {
      reject(new Error(`Your message can't be empty`))
    } else {
      const rawConfig = fs.readFileSync(configFileLoc)
      const config = JSON.parse(rawConfig)
      const txtLoc = config.hallwayFileLocation

      checkIfExists(txtLoc, 'Unable to locate your twtxt file')

      const rawSites = fs.readFileSync(siteListLoc)
      const sites = JSON.parse(rawSites)

      const d = new Date().toISOString()

      const splitMessage = subOption.split(' ').filter(word => word !== '')

      const mentionHandledMessage = splitMessage.map(word => {
        if (word.startsWith('@')) {
          const target = sites.find(u => word.substring(1).includes(u.author))
          return target
            ? word.replace(`@${target.author}`, `@<${target.author} ${target.feed}>`)
            : word
        } else {
          return word
        }
      })

      const finalMessage = mentionHandledMessage.join(' ')

      const txt = fs.readFileSync(txtLoc, 'utf8')
      console.log(dim, `Found ${txt.split('\n').length} entries.`)
      console.log(dim, `Adding entry #${txt.split('\n').length + 1}`)

      fs.writeFileSync(txtLoc, d + '\t' + finalMessage + '\n' + txt)
      resolve(`Added ${d} ${finalMessage}`)
    }
  })
}

const hallwaySetup = configFileLoc => {
  return new Promise((resolve, reject) => {
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
  })
}

module.exports = { hallwaySetup, writeInHallway }
