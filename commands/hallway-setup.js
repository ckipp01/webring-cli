'use strict'

const {
  checkIfExists,
  dim,
  dimBegin,
  yellow
} = require('../utils/general')
const fs = require('fs')

const baseConfig = {
  hallwayFileLocation: '',
  messageAmountToShow: 20,
  gitRepo: false
}

const createConfigAndEnterTwtxtLocation = configFileLoc =>
  new Promise((resolve, reject) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    if (!checkIfExists(configFileLoc)) {
      console.log(yellow, ' Enter hallway twtxt file location')
      readline.question(` ${dimBegin} --> `, answer => {
        if (answer.trim() === '') {
          readline.close()
          reject(new Error('You will not be able to write on the wall until setup is complete'))
        } else {
          const newValue = { hallwayFileLocation: answer.trim() }
          const newConf = Object.assign(baseConfig, newValue)
          readline.close()
          fs.writeFileSync(configFileLoc, JSON.stringify(newConf))
          resolve(' Successfully captured twtxt location')
        }
      })
    } else {
      const rawConfig = fs.readFileSync(configFileLoc)
      const config = JSON.parse(rawConfig)
      const currentLocation = config.hallwayFileLocation
      console.log(yellow, ' Enter the new location of your twtxt file or hit ENTER to keep the current value')
      console.log(dim, ` Current setting: ${currentLocation}`)
      readline.question(` ${dimBegin}--> `, answer => {
        if (answer.trim() === '') {
          readline.close()
          resolve(' Keeping current twtxt location')
        } else {
          const newValue = { hallwayFileLocation: answer.trim() }
          const newConf = Object.assign(config, newValue)
          readline.close()
          fs.writeFileSync(configFileLoc, JSON.stringify(newConf))
          resolve(' Successfully captured twtxt location')
        }
      })
    }
  })

const setMessageLimit = configFileLoc =>
  new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    const rawConfig = fs.readFileSync(configFileLoc)
    const config = JSON.parse(rawConfig)
    const currentAmount = config.messageAmountToShow
    console.log(yellow, ' How many messages would you like gander to display or hit ENTER to accept current amount')
    console.log(dim, ` Current amount: ${currentAmount}`)
    readline.question(` ${dimBegin}--> `, answer => {
      if (answer.trim() === '') {
        readline.close()
        resolve(' Keeping current amount')
      } else {
        const newValue = { messageAmountToShow: answer.trim() }
        const newConf = Object.assign(config, newValue)
        readline.close()
        fs.writeFileSync(configFileLoc, JSON.stringify(newConf))
        resolve(' Successfully set new amount')
      }
    })
  })

module.exports = { createConfigAndEnterTwtxtLocation, setMessageLimit }
