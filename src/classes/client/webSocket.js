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

    /**
     * The heartbeat interval
     * @type {Number}
     * @private
     */
    this.heartbeatInterval = null;

    /**
     * The last heartbeat sent
     * @type {Number}
     * @private
     */
    this.lastHeartbeat = null;

    /**
     * The last heartbeat acknowledged
     * @type {Number}
     * @private
     */
    this.lastHeartbeatAck = null;

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

    try {
      this.ws = new WebSocket(`wss://www.guilded.gg/websocket/v1`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": `Guilded-Bot/${this.client.version} (${this.client.platform}) Node.js (${process.version})`,
        },
      });
    } catch (err) {
      //If the error is the link being invalid, throw a new error
      if (err.message === "Invalid WebSocket frame: invalid status code 400")
        throw new Error(
          "Invalid token! Please make sure you are using a valid token."
        );
      //If the error is the token being invalid, throw a new error
      if (err.message === "Invalid WebSocket frame: invalid status code 401")
        throw new Error(
          "Invalid token! Please make sure you are using a valid token."
        );
      this.emit("clientDebug", "[WS] Error connecting to Guilded WebSocket");
      this.emit("clientError", err);
      return;
    }

    this.ws.on("open", () => {
      this.emit("clientDebug", "[WS] Connected to the Guilded API");
      this.connected = true;
    });

    this.ws.on("message", (data) => {
      if (JSON.parse(data).op === 1) {
        this.emit("clientDebug", "[WS] Received heartbeat");
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
        this.heartbeatInterval = bot_data.heartbeatIntervalMs;
        this.emit("clientDebug", "[WS] Received bot data");
        this.emit("clientDebug", "[WS] Sending heartbeat");
        this.ws.ping(
          JSON.stringify({
            op: 1,
            d: null,
          })
        );
        this.lastHeartbeat = new Date().getTime();
        this.emit("clientReady", bot_data);
        const heartbeat = setInterval(() => {
          if (!this.lastHeartbeatAck && !this.heartbeatInterval) return;
          if (
            new Date().getTime() - this.lastHeartbeatAck >
            this.heartbeatInterval + 2500
          ) {
            this.emit("clientDebug", "[WS] No heartbeat ack");
            this.emit("clientDebug", "[WS] Reconnecting");
            clearInterval(heartbeat);
            this.heartbeatInterval = null;
            this.ws.close();
            this.connect();
          }

          this.emit("clientDebug", "[WS] Sending heartbeat");
          this.ws.ping(
            JSON.stringify({
              op: 1,
              d: null,
            })
          );
          this.lastHeartbeat = new Date().getTime();
        }, this.heartbeatInterval);
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
        this.emit("clientError", e);
      }
    });

    this.ws.on("pong", (response) => {
      const r = JSON.parse(response);
      if (r.op === 1) {
        this.emit("clientDebug", "[WS] Received heartbeat");
        this.lastHeartbeatAck = new Date().getTime();
      }

      if (r.op === 8) {
        this.emit("clientDebug", "[WS] Failed to send heartbeat");
        this.emit("clientError", new Error("Failed to send heartbeat"));
      }
    });

    this.ws.on("close", () => {
      this.connected = false;
      this.emit("debug", "[WS] Disconnected from the Guilded API");
      // Try to reconnect
      this.emit("debug", "[WS] Attempting to reconnect...");
    });

    this.ws.on("error", (error) => {
      this.emit("clientError", error);
    });
  }
}

module.exports = ClientWebSocket;
