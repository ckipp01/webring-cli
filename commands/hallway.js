'use strict'

const fs = require('fs')
const Table = require('cli-table3')

const { dim, red } = require('../utils/general')

const enterHallway = async (feedCacheLoc, configFileLoc, option, subOption) => {
  if (!fs.existsSync(feedCacheLoc)) {
    console.error(red, 'Please run webring sync first')
    process.exit()
  }

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
      console.log(dim, `No author, tags, or channel matches ${subOption} in the last 20 messages`)
      process.exit()
    } else {
      console.log(table.toString())
    }
  }

  if (option === 'write') {
    if (typeof subOption !== 'string') {
      console.error(red, `Your message can't be empty`)
      process.exit(1)
    }
    if (!fs.existsSync(configFileLoc)) {
      console.error(red, 'You need to run webring hallway setup first before writing in the hallway')
      process.exit()
    } else {
      const rawJson = fs.readFileSync(configFileLoc)
      const config = JSON.parse(rawJson)
      const txtLoc = config.hallwayFileLocation

      const d = new Date().toISOString()

      if (!fs.existsSync(txtLoc)) {
        console.error(red, `Unable to find your twtxt file at ${txtLoc}`)
        process.exit(1)
      }

      const txt = fs.readFileSync(txtLoc, 'utf8')
      console.log(dim, `Found ${txt.split('\n').length} entries.`)
      console.log(dim, `Adding entry #${txt.split('\n').length + 1}\n${d} ${subOption}`)

      fs.writeFileSync(txtLoc, d + '\t' + subOption + '\n' + txt)
    }
  }

  if (option === 'setup') {
    const standardInput = process.stdin
    standardInput.setEncoding('utf-8')
    console.log(dim, `Please enter your twtxt file location`)
    standardInput.on('data', answer => {
      if (answer.trim() === 'exit') {
        console.log(dim, 'You will not be able to write on the wall until the configuration is complete')
        process.exit()
      } else {
        const config = { hallwayFileLocation: answer.trim() }
        fs.writeFileSync(configFileLoc, JSON.stringify(config))
        console.log(dim, `Created config file. You may now write on the wall`)
        process.exit()
      }
    })
  }
}

module.exports = { enterHallway }
