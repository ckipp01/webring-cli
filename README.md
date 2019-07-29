# webring-cli
![npm (tag)](https://img.shields.io/npm/v/webring-cli/latest.svg?color=lightgrey)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-lightgrey.svg)](https://standardjs.com)

The webring-cli is the command-line interface for the [xxiivv webring](https://webring.xxiivv.com).

## Installation

Simply run...
```
yarn global add webring-cli
```
...or
```
npm install -g webring-cli
```

## Usage

```
❯ webring -h
  Usage: webring [options] [command]

  Options:
    -V, --version      output the version number
    -h, --help         output usage information

  Commands:
    sync               syncs latest sites.js file from the xxiivv webring
    sites              lists all the sites in the webring
    random             brings you to a random site in the webring
    rss                shows you a list of all available rss feeds in the webring
    hallway [options]  a voice echoes in the hallway
```

The first command you'll want to run is `webring sync`.
This will pull down the latest sites.js file from the webring, parse it, and store it in `~/.webring`
You'll then be able to use the other commands.

### The hallway

> A voice echoes in the hallway...

### Hallway usage

```
❯ webring hallway -h
  Usage: hallway [options]

  a voice echoes in the hallway

  Options:
    gander <user | channel | tag>  take a gander at the hallway
    members                        shows a list of all hallway members and their twtxt file location
    setup                          setup options for hallway related settings
    write <message>                write a message on the wall
    -h, --help                     output usage information
```

The first command you'll have to run while using the hallway is `webring hallway setup`. This will walk you through setting up the location of your twtxt file and setting the amount of messages you'd like displayed.
If you don't have a twtxt account and simply want to view the hallway, then just leave the twtxt setting blank.

During setup your will also have the option to set the amount of messages you'd like displayed.
The final setting can be used to automatically push your twtxt file if you're using a git repo.
Note this relies on a clean branch to work correctly.

When you mention a user in the hallway, you simply need to @member them, and it will be replaced with the twtxt compliant `@<user twtxt-location>` format.
If you're using this also to maintain a twtxt file outside of the webring, then use the regular format, and it will just leave it as is.

## Building locally

If you'd like to build locally, you're able to clone this repository and run it by following the commands below.
There is no building process, dev server, or anything like that needed.

```
git clone https://github.com/ckipp01/webring-cli
cd webring-cli
yarn install
node webring.js [options] [commands]
```

The tests for the project are run with [ava](https://github.com/avajs/ava).
To run them, just enter the command below:

```
yarn test
```
