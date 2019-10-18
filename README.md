# apbot

apbot is Discord bot that can create GitHub Issues. It is is written in Javascript and
runs on anything that has Node.js.

The recommended way to run the bot is within a container, preferably handled 
by podman (but you can of course use Docker, or whichever container engine you
prefer). One major advantage of podman is that you can run it as a non-privileged user (ie. non-root), also I'm a Red Hat fanboy. 

## Prerequisites 

* A GitHub User.
* A GitHub Repository.
* A Discord User.
* A Discord Channel.
* [A Discord Bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) - You need a Discord Bot (it's very easy to setup).
* [A GitHub Token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) - You need a GitHub token (it's very easy to create). 
* A container engine with internet access.

## Installation

On Fedora you simply run, 

```bash
$ > sudo dnf install -y podman 
$ > git clone https://github.com/patchon/apbot
$ > cd apbot
$ > podman build . -t apbot
$ > < edit apbot_config >
$ > podman run --env-file apbot_config --rm -dt apbot
```

Yep, it's that simple. On other OS's, you would simply do the same thing. Once you
have the container, just edit the apbot_config and start the container. 

If you have trouble starting the container, add 
```
AP_DEBUG=true
``` 
to the apbot_config and there should be a pretty clear message about why it won't
work. 

## Usage

```bash
To create an GitHub issue you simply run, 
!issue "My first issue" "Long description text" "Optional Labels" 
```
from the channel where you and the bot chill.

## Contributing
Pull requests are welcome. 

## Mentions
This bot is inspired by [https://github.com/LeagueSandbox/IssueBot](https://github.com/LeagueSandbox/IssueBot)

## License
[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
