# hallway

> A voice echoes in the hallway...

The hallway is a small WIP bash script to interact with the [xxiivv webring hallway](https://webring.xxiivv.com/hallway.html) if you don't want to use the [twtxt](https://twtxt.readthedocs.io/en/stable/index.html) client, but still want to interact with the hallway.

## Installation

Clone this repo

```bash
git clone git@github.com:ckipp01/hallway-bash.git
```

Make sure the script is executable and then either put it somewhere in your `$PATH` or link it like I do below.
You'll also need to either fill out the variables at the top of the script or include them in a `~/.env` file.

```bash
chmod +x hallway

ln -s /path/to/git/repo/hallway ~/bin/hallway
```

## Currently available commands

```bash
hallway
  Usage: hallway [command]
      -h, --help      List commands
      authors   View all available authors in the hallway
      feeds     View a listing of all feed urls
      gander    Take a gander at the hallway
      sync      Syncs list of members in the hallway
      write     Write new message for the hallway
```

## Usage

The first thing you should do is run `hallway sync` which will call the [webring-checker api](https://github.com/ckipp01/webring-checker) to retrieve a list of users and thier feed urls.

To then write on the wall use the following format

```bash
hallway write "Here is an example for @ckipp to show how this works"
```

The mention in this message will be transformed to twtxt format of `@<ckipp https://chronica.xyz/hallway.txt>;`

After writing a message, you'll then be asked whether you'd like to publish the file. I currently have this set up so that it pushes my repo to github which triggers by build. You can change this to whatever your publish method is.

### TODO

- [ ] Impliment a list of channels
- [ ] Impliment a list of tags
- [ ] Figure out a nice way to display the feed when `gander` is called
- [ ] Add in an optional flag to filter on tags or channels

