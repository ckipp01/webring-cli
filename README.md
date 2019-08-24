# webring-cli
![npm (tag)](https://img.shields.io/npm/v/webring-cli/latest.svg?color=ebcb8b)

The webring-cli is the command-line interface for the [xxiivv webring](https://webring.xxiivv.com).

The webring is an attempt to inspire artists & developers to create and maintain their own website and share traffic among each other.

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
    sync               syncs latest sites.js file from the xxiivv webring and cache's wikis
    sites              lists all the sites in the webring
    random             brings you to a random site in the webring
    rss [options]      rss feeds are alive and well
    hallway [options]  a voice echoes in the hallway
    wiki               a decentralized encyclopedia REPL
```

The first command you'll want to run is `webring sync`.
This will pull down the latest sites.js file from the webring, parse it, and store it in `~/.webring`.
It will also then find the existing sites that have wikis and store a copy to be able to navigated with the wiki REPL.
You'll then be able to use the other commands.

### The hallway

> A voice echoes in the hallway...

### hallway usage

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

### rss usage

```
❯ webring rss -h
  Usage: rss [options]

  rss feeds are alive and well

  Options:
    feeds          shows you a list of all available rss feeds and their authors
    gander <feed>  shows you either all of the feeds combined or a specific feed
    -h, --help     output usage information
```
The rss reader works by fetching either all the rss feeds or a single feed, parsing it, creating html out of it, and then printing it to a temp file.
Then that temp file is opened up in your browser. If you look in your os's temp directory, you'll find the file there labeled as rss.html.

### wiki usage

Upon entering `webring wiki` you'll be dropped into a REPL that will allow you to navigate around the webrings wikis.
The REPL is modeled after [Josh's Compendium](https://gitlab.com/jrc03c/compendium).
The available commands in the REPL are below

```
❯ webring wiki

  Usage: [command]

  Commands:
    ls          list directory contents
    cd <index>  change directory
    exit        to exit the repl
    help        display all commands

wiki >
```

## Building locally

If you'd like to build locally, you're able to clone this repository and run it by following the commands below.
There is no building process, dev server, or anything like that needed.

```
git clone https://github.com/ckipp01/webring-cli
cd webring-cli
yarn install
node webring.js [options] [commands]
```

### Issues?

If you come accross any issues, please submit a [issue](https://github.com/ckipp01/webring-cli/issues).

