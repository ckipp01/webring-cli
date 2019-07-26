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
    setup                          setup location of twtxt file
    write <message>                write a message on the wall
    -h, --help                     output usage information
```

You will be able to `webring hallway gander` right away, but if you want the ability to write to your hallway twtxt file, you'll need to run `webring hallway setup` first.
This will ask you for the path to your twtxt file in order to write to it.


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
