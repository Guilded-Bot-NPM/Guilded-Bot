const { EventEmitter } = require("events");
const { WebSocket } = require("ws");
const Message = require("../structures/message.js");
const User = require("../structures/user/user.js");
const Member = require("../structures/member/member.js");
const MemberBan = require("../structures/member/memberBan.js");
const Webhook = require("../structures/webhook.js");
const Reaction = require("../structures/reaction.js");
const { version } = require("../../../package.json");

/**
 * The ClientWebSocket class
 * @class ClientWebSocket
 * @extends EventEmitter
 * @param {Client} client The client object
 * @returns {ClientWebSocket} The ClientWebSocket object
 * @constructor
 * @private
 */
class ClientWebSocket extends EventEmitter {
  /**
   * Create a new WebSocket connection
   * @param {Client} client
   * @returns {ClientWebSocket}
   * @constructor
   * @private
   */
  constructor(client) {
    super();

    /**
     * The WebSocket connection
     * @type {WebSocket}
     * @private
     */
    this.ws = null;

    /**
     * The client object
     * @type {Client}
     * @private
     */
    this.client = client;

    //The version of the library
    this.client.version = version;
    // The platform the bot is running on, convert like this: process.platform === 'win32' ? 'Windows' : process.platform === 'darwin' ? 'MacOS' : 'Linux'
    this.client.platform =
      process.platform === "win32"
        ? "Windows"
        : process.platform === "darwin"
        ? "MacOS"
        : "Linux";

    /**
     * Whether the WebSocket is connected or not
     * @type {boolean}
     * @private
     * @readonly
     */
    this.connected = false;

    /**
     * The bot's ID
     * @type {string}
     * @private
     */
    this.botID = null;

    global.cache = new Map();
    global.cache.users = new Map();
    global.cache.members = new Map();

    /**
     * The bot cache object
     * @type {Map}
     * @private
     */
    this.client.cache = global.cache;
  }

  /**
   * Connects the bot to the Guilded API
   * @returns {Promise<void>}
   * @example
   * client.ws.connect();
   * @example
   * client.ws.connect().then(() => {
   *   console.log('Bot is ready!');
   * });
   * @private
   */
  connect() {
    const token = this.client.token;

    this.ws = new WebSocket(`wss://api.guilded.gg/v1/websocket`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": `Guilded-Bot/${this.client.version} (${this.client.platform}) Node.js (${process.version})`
      },
    });

    this.ws.on("open", () => {
      this.connected = true;
    });

    this.ws.on("message", (data) => {
      if (JSON.parse(data).op === 1) {
        this.client.user = JSON.parse(data).d.user;
        //Time in unix epoch
        this.client.readyAt = new Date().getTime();
        //Make function to get uptime
        this.client.uptime = () => {
          return Math.round(
            (new Date().getTime() - this.client.readyAt) / 1000
          );
        };
        let bot_data = JSON.parse(data).d;
        this.botID = toString(bot_data.user.id);
        bot_data.user = new User(bot_data.user, this.client);
        this.emit("open", bot_data);
      }

      const { t: eventType, d: eventData } = JSON.parse(data);

      try {
        switch (eventType) {
          case "ChatMessageCreated":
            if (eventData.message.createdBy === this.botID) break;
            this.emit(
              "messageCreated",
              new Message(eventData.message, this.client)
            );
            break;
          case "ChatMessageUpdated":
            if (eventData.message.createdBy === this.botID) break;
            this.emit(
              "messageUpdated",
              new Message(eventData.message, this.client)
            );
            break;
          case "ChatMessageDeleted":
            if (eventData.message.createdBy === this.botID) break;
            this.emit(
              "messageDeleted",
              new Message(eventData.message, this.client)
            );
            break;
          case "TeamMemberJoined":
            this.emit("memberAdded", new Member(eventData));
            break;
          case "TeamMemberRemoved":
            this.emit("memberRemoved", new Member(eventData));
            break;
          case "TeamMemberBanned":
            this.emit("memberBanned", new MemberBan(eventData));
            break;
          case "TeamMemberUnbanned":
            this.emit("memberUnbanned", new MemberBan(eventData));
            break;
          case "TeamMemberUpdated":
            this.emit("memberUpdated", new Member(eventData));
            break;
          case "teamRolesUpdated":
            this.emit("memberRolesUpdated", new Member(eventData));
            break;
          case "TeamWebhookCreated":
            this.emit("webhookCreated", new Webhook(eventData));
            break;
          case "TeamWebhookUpdated":
            this.emit("webhookUpdated", new Webhook(eventData));
            break;
          case "ChannelMessageReactionCreated":
            this.emit("messageReactionCreated", new Reaction(eventData));
          case "ChannelMessageReactionDeleted":
            this.emit("messageReactionDeleted", new Reaction(eventData));
        }
      } catch (e) {
        this.emit("error", e);
      }
    });

    this.ws.on("close", () => {
      this.connected = false;
      this.emit("closed");
    });

    this.ws.on("error", (error) => {
      this.emit("error", error);
    });
  }
}

module.exports = ClientWebSocket;
