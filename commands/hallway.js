'use strict'

const fs = require('fs')

const enterHallway = async (feedCacheLoc, configFileLoc, options, message) => {
  if (!fs.existsSync(feedCacheLoc)) {
    console.error('Please run webring sync first')
    process.exit(1)
  }

  if (options === 'gander') {
    const rawJson = fs.readFileSync(feedCacheLoc)
    const wallPosts = JSON.parse(rawJson)

    const latest = wallPosts.slice(0, 20).reverse()
    latest.forEach(post => console.info(`${post.author}  -  ${post.body}  - ${post.date}\n`))
  }

  if (options === 'write') {
    console.log(options)
    if (typeof message !== 'string') {
      console.error(`Your message can't be empty`)
      process.exit(1)
    }
    if (!fs.existsSync(configFileLoc)) {
      console.error('You need to run webring hallway setup first before writing in the hallway')
      process.exit(1)
    } else {
      const rawJson = fs.readFileSync(configFileLoc)
      const config = JSON.parse(rawJson)
      const txtLoc = config.hallwayFileLocation

      const d = new Date().toISOString()

      if (!fs.existsSync(txtLoc)) {
        console.error(`Unable to find your twtxt file at ${txtLoc}`)
        process.exit(1)
      }

      const txt = fs.readFileSync(txtLoc, 'utf8')
      console.info(`Found ${txt.split('\n').length} entries.`)
      console.info(`Adding entry #${txt.split('\n').length + 1}\n${d} ${message}`)

      fs.writeFileSync(txtLoc, d + '\t' + message + '\n' + txt)
    }
  }

  if (options === 'setup') {
    const standardInput = process.stdin
    standardInput.setEncoding('utf-8')
    console.info(`Please enter your twtxt file location`)
    standardInput.on('data', answer => {
      if (answer.trim() === 'exit') {
        console.info('You will not be able to write on the wall until the configuration is complete')
        process.exit(1)
      } else {
        const config = { hallwayFileLocation: answer.trim() }
        fs.writeFileSync(configFileLoc, JSON.stringify(config))
        console.info(`Created config file. You may now write on the wall`)
        process.exit(1)
      }
    })
  }
}

module.exports = { enterHallway }
