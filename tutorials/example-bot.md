guilded Bot is a package that allows you to easily create a bot for the [Guilded](https://www.guilded.gg) chat platform.

Now, we will make a simple bot that will respond to the message "ping" with "pong".

```javascript
const Guilded = require("guilded-bot");
const client = new Guilded.Client("Your-Token-Here");

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.content === "ping") {
    message.channel.send("pong");
  }
});

client.login();
```