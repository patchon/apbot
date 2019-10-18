# apbot

apbot is Discord bot that can create GitHub. It is is written in javascript and
runs on anything that has nodejs.

The recommended way to run the bot is within a container, preferrably handled 
by podman (but you can of course use Docker, or whichever container enghine you
prefer). 

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
$ > podman run --env-file apbot_config apbot
```

Yep, it's that simple. On other OS, you would simply do the same thing. Once you
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

## License
[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)