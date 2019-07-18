# webring-cli
![npm (tag)](https://img.shields.io/npm/v/webring-cli/latest.svg?color=lightgrey)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-lightgrey.svg)](https://standardjs.com)

The webring-cli is a cli client for the [xxiivv webring](https://webring.xxiivv.com).

## Installation

```
yarn global add webring-cli
---
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
    sync               syncs latest sites.js file from the xxiivv webring and the hallway feeds
    sites              lists all the sites in the webring
    random             brings you to a random site in the webring
    rss                shows you a list of all available rss feeds in the webring
    hallway [options]  a voice echoes in the hallway
```

The first command you'll want to run is `webring sync`.
This will pull down the latest sites.js file from the webring, parse it, and store it in `~/.webring`
You'll then be able to use the other commands.
It's probably a good idea to run `webring sync` often to ensure you're always getting the latest webring sites and hallway feeds.


### The hallway

> A voice echoes in the hallway...

### Hallway usage

```
❯ webring hallway -h
  Usage: hallway [options]

  a voice echoes in the hallway

  Options:
    gander <user | channel | tag>  take a gander at the hallway
    write <message>                write a message on the wall
    setup                          setup location of twtxt file
    -h, --help                     output usage information
```

You will be able to `webring hallway gander` right away, but if you want the ability to write to your hallway twtxt file, you'll need to run `webring hallway setup` first.
This will ask you for the path to your twtxt file in order to write to it.

