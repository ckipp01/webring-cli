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
  new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    if (!checkIfExists(configFileLoc)) {
      console.log(yellow, ' Enter hallway twtxt file location')
      readline.question(` ${dimBegin} --> `, answer => {
        if (answer.trim() === '') {
          readline.close()
          resolve('Your current value is blank. If you want to change this later, just run setup again')
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
  new Promise((resolve, reject) => {
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
      } else if (isNaN(answer)) {
        readline.close()
        reject(new Error('Value must be a valid number'))
      } else {
        const newValue = { messageAmountToShow: Number(answer.trim()) }
        const newConf = Object.assign(config, newValue)
        readline.close()
        fs.writeFileSync(configFileLoc, JSON.stringify(newConf))
        resolve(' Successfully set new amount')
      }
    })
  })

const setGitRepo = configFileLoc =>
  new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    const rawConfig = fs.readFileSync(configFileLoc)
    const config = JSON.parse(rawConfig)
    const currentValue = config.gitRepo
    console.log(yellow, ' Is your twtxt file in a git repo? If this is set to true, it will automatically be deployed')
    console.log(dim, ` Current value: ${currentValue}`)
    readline.question(` ${dimBegin}--> `, answer => {
      if (answer.trim() === '') {
        readline.close()
        resolve(' Keeping current amount')
      } else {
        const newValue = { gitRepo: (answer.trim() === 'true') }
        const newConf = Object.assign(config, newValue)
        readline.close()
        fs.writeFileSync(configFileLoc, JSON.stringify(newConf))
        resolve(` Successfully set git repo to ${answer}`)
      }
    })
  })

module.exports = {
  createConfigAndEnterTwtxtLocation,
  setGitRepo,
  setMessageLimit
}
