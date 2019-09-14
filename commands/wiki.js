'use stric'

// Many thanks to Josh and his work on compendium which this wiki viewer is based off of
// https://gitlab.com/jrc03c/compendium

const fs = require('fs')
const process = require('process')
const readline = require('readline')
const Table = require('cli-table3')

const {
  dimBegin,
  end,
  red,
  redBegin,
  yellow,
  yellowBegin
} = require('../utils/general')

const compendium = wikiCacheLoc => {
  const wikis = JSON.parse(fs.readFileSync(wikiCacheLoc, 'utf8'))
  const currentLocation = []

  const getCurrentObject = (path, obj) => {
    if (path.length === 0) {
      return obj
    } else {
      return path.length > 1
        ? getCurrentObject(path.slice(1), obj[path[0]])
        : obj[path[0]]
    }
  }

  function list () {
    const current = getCurrentObject(currentLocation, wikis)

    const handleType = current => (acc, val) => {
      if (typeof current[val] === 'object' && !Array.isArray(current[val])) {
        acc[0].push(val)
      } else if (typeof current[val] === 'string' || Array.isArray(current[val])) {
        acc[1].set(val, current[val])
      } else {
        console.error(red, ` Unsure how to hand the value for ${val}`)
      }
      return acc
    }

    const grouped = Object.keys(current).reduce(handleType(current), [[], new Map()])

    if (grouped[0].length > 0) {
      const catTable = new Table()
      catTable.push([{ colSpan: 2, content: currentLocation.length > 0 ? `${yellowBegin}${currentLocation[currentLocation.length - 1]}${end}` : `${yellowBegin}COMPENDIUM${end}` }])
      grouped[0].forEach(item => catTable.push([Object.keys(current).indexOf(item), item]))
      console.log(catTable.toString())
    }

    if (grouped[1].size > 0) {
      const defTable = new Table({
        colWidths: [20, 60],
        wordWrap: true
      })

      defTable.push([{ colSpan: 2, content: currentLocation.length > 0 ? `${yellowBegin}${currentLocation[currentLocation.length - 1]}${end}` : `${yellowBegin}COMPENDIUM${end}` }])
      grouped[1].forEach((value, key) => {
        Array.isArray(value)
          ? defTable.push([key, value.join('\n')])
          : defTable.push([key, value])
      })
      console.log(defTable.toString())
    }
  }

  function cd (arg) {
    if (arg === undefined) {
      currentLocation.length = 0
      list()
    } else if (arg === '..') {
      currentLocation.splice(currentLocation.length - 1, 1)
      list()
    } else if (isNaN(arg)) {
      console.error(red, ' Argument must be a numeric index')
    } else {
      const current = getCurrentObject(currentLocation, wikis)

      if (arg < 0 || arg > Object.keys(current).length - 1) {
        console.error(red, ' Invalid index')
      } else {
        const key = Object.keys(current)[arg]

        const child = current[key]
        const type = typeof (child)

        if (type === 'string' || type === 'number') {
          console.error(` ${redBegin}You can't go any further here. Use ${dimBegin}cd ..${end}${redBegin} to move to the parent directory.${end}`)
          return
        }

        currentLocation.push(key)
        list()
      }
    }
  }

  console.log(yellow, ' Welcome to the webring wiki!')

  const help = `
  Usage: [command]

  Commands:
    ls                list directory contents
    cd <index>        change directory
    exit              to exit the repl
    help              display all commands
  `

  console.log(help)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${yellowBegin}wiki >${end} `
  })

  rl.prompt()

  rl.on('line', line => {
    const command = line.trim()
    const args = command.split(' ')

    if (args[0] === 'help') console.log(help)
    if (args[0] === 'exit' || args[0] === 'quit') return rl.close()

    if (args[0] === 'ls') list()
    if (args[0] === 'cd') cd(args[1])

    rl.prompt()
  })

  rl.on('close', function () {
    console.log('\nGoodbye')
    process.exit(0)
  })
}

module.exports = compendium
