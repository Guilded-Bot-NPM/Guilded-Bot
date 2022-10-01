const { EventEmitter } = require("events");
const { ClientWebSocket } = require("./WebSocket");

class Client extends EventEmitter {
  /**
   * Creates a new bot instance.
   * See {@tutorial example-bot} for an example
   * @param {String} token Your guilded bot's Auth Token
   * @returns {Client}
   * @example
   * const { Client } = require('guilded.js');
   * const client = new Client('token');
   */
  constructor(token = String) {
    super();

    this.token = token;
    this.ws = null;
  }

  /**
   * Connects the bot to the Guilded API
   * @returns {Promise<void>}
   * @example
   * client.login();
   * @example
   * client.login().then(() => {
   *    console.log('Bot is ready!');
   * });
   */
  login() {
    this.ws = new ClientWebSocket(this);
    this.ws.connect();

    this.ws.on("open", (client) => {
      this.emit("ready", client);
    });

    this.ws.on("messageCreated", (message) => {
      this.emit("serverMessageCreate", message);
    });

    this.ws.on("messageUpdated", (message) => {
      this.emit("serverMessageUpdate", message);
    });

    this.ws.on("messageDeleted", (message) => {
      this.emit("serverMessageDelete", message);
    });

    this.ws.on("memberAdded", (member) => {
      this.emit("serverMemberJoin", member);
    });

    this.ws.on("memberRemoved", (member) => {
      this.emit("serverMemberLeft", member);
    });

    this.ws.on("memberBanned", (member) => {
      this.emit("serverMemberBan", member);
    });

    this.ws.on("memberUnbanned", (member) => {
      this.emit("serverMemberUnban", member);
    });

    this.ws.on("memberRolesUpdated", (member) => {
      this.emit("serverMemberUpdate", member);
    });

    this.ws.on("webhookCreated", (webhook) => {
      this.emit("serverWebhookCreate", webhook);
    });

    this.ws.on("webhookUpdated", (webhook) => {
      this.emit("serverWebhookUpdate", webhook);
    });

    this.ws.on("messageReactionCreated", (reaction) => {
      this.emit("messageReactionCreated", reaction);
    });

    this.ws.on("ChannelMessageReactionDeleted", (reaction) => {
      this.emit("ChannelMessageReactionDeleted", reaction);
    });

    this.ws.on("closed", () => {
      this.emit("disconnect");
    });

    this.ws.on("error", (error) => {
      this.emit("error", error);
    });
  }
}

module.exports.Client = Client;
