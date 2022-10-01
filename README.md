
# Guilded Bot

Guilded Bot is a package that allows you to easily create a bot for the [Guilded](https://www.guilded.gg) chat platform.


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Guilded Bot.

```bash
npm install guilded-bot
```
## Usage/Examples

```javascript
const Guilded = require("../index.js");
const client = new Guilded.Client("Your-Token-Here");

client.on("ready", () => {
  console.log("I am ready!");
});
```


## Documentation

You can find the documentation [here](https://guildedbot.js.org/).

## Badges

![NPM](https://img.shields.io/npm/l/guilded-bot?style=for-the-badge) ![npm bundle size](https://img.shields.io/bundlephobia/min/guilded-bot?style=for-the-badge) ![npms.io (final)](https://img.shields.io/npms-io/final-score/guilded-bot?style=for-the-badge)