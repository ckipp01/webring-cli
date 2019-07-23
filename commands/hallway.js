'use strict'

const fs = require('fs')
const Table = require('cli-table3')

const { checkIfExists, dim } = require('../utils/general')

const enterHallway = (feedCacheLoc, configFileLoc, option, subOption) => {
  return new Promise((resolve, reject) => {
    checkIfExists(feedCacheLoc, 'Please run webring sync first')

    if (option === 'gander') {
      const rawJson = fs.readFileSync(feedCacheLoc)
      const wallPosts = JSON.parse(rawJson)

      const latest = wallPosts.slice(0, 20).reverse()

      const table = new Table({
        style: {
          head: ['grey']
        },
        head: ['author', 'post', 'date'],
        colWidths: [15, 60, 15],
        wordWrap: true
      })

      const filter = typeof subOption === 'string'
        ? subOption
        : null

      latest.forEach(post => {
        if (filter) {
          if (post.author === filter || post.body.search('#' + filter) !== -1 || post.body.startsWith('/' + filter)) {
            table.push([post.author, post.body, post.date])
          }
        } else {
          table.push([post.author, post.body, post.date])
        }
      })

      if (table[0] === undefined) {
        reject(new Error(`No author, tags, or channel matches ${subOption} in the last 20 messages`))
      } else {
        resolve(table)
      }
    }

    // TODO break these out into seperate functions
    if (option === 'write') {
      checkIfExists(configFileLoc, 'You need to run webring hallway setup first before writing on the hallway')
      if (typeof subOption !== 'string') {
        reject(new Error(`Your message can't be empty`))
      } else {
        const rawJson = fs.readFileSync(configFileLoc)
        const config = JSON.parse(rawJson)
        const txtLoc = config.hallwayFileLocation

        const d = new Date().toISOString()

        checkIfExists(txtLoc, `Unable to find your twtxt file at ${txtLoc}`)

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
