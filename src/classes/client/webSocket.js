const { EventEmitter } = require("events");
const { WebSocket } = require("ws");
const Message = require("../structures/message.js");
const User = require("../structures/user/user.js");
const Member = require("../structures/member/member.js");
const MemberRemoved = require("../structures/member/memberRemove.js");
const MemberBan = require("../structures/member/memberBan.js");
const Webhook = require("../structures/webhook.js");
const Reaction = require("../structures/reaction.js");
const MemberUpdated = require("../structures/member/memberUpdated.js");
const RolesUpdated = require("../structures/roles/rolesUpdated.js");

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
     * @readonly
     */
    this.lastHeartbeat = null;

    /**
     * The last heartbeat acknowledged
     * @type {Number}
     * @private
     * @readonly
     */
    this.lastHeartbeatAck = null;

    /**
     * The last heartbeat received
     * @type {Number}
     * @private
     * @readonly
     */
    this.lastHeartbeatReceived = null;

    /**
     * Number of max tries to reconnect
     * @type {Number}
     * @private
     * @readonly
     * @default Infinity
     */
    this.reconnectTries = client.options?.maxReconnectTries || Infinity;

    /**
     * The current number of tries to reconnect
     * @type {Number}
     * @private
     * @readonly
     */
    this.currentReconnectTries = 0;

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
   * @private
   * @example
   * client.ws.connect();
   * @example
   * client.ws.connect().then(() => {
   *   console.log('Bot is ready!');
   * });
   */
  async connect() {
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

      // return this.connect(); wait for the new reconnect system

      await new Promise((resolve) => setTimeout(resolve, this.currentReconnectTries * 5000));

      this.currentReconnectTries++;

      if (this.currentReconnectTries >= this.reconnectTries) {
        this.emit("clientDebug", "[WS] Max reconnect tries reached");
        this.emit("clientError", err);
        return;
      }

      this.emit("clientDebug", "[WS] Reconnecting...");
      this.connect();
    }

    this.ws.on("open", () => {
      this.emit("clientDebug", "[WS] Connected to the Guilded API");
      this.connected = true;
    });

    this.ws.on("message", (data) => {
      if (JSON.parse(data).op === 1) {
        this.client.user = JSON.parse(data).d.user;
        this.client.readyAt = new Date().getTime();
        
        this.client.uptime = () => {
          return Math.round(
            (new Date().getTime() - this.client.readyAt) / 1000
          );
        };

        let allData = JSON.parse(data).d;
        let bot_data = JSON.parse(data).d.user;
        this.botID = toString(bot_data.id);
        bot_data.user = new User(bot_data, this.client);
        this.heartbeatInterval = allData.heartbeatIntervalMs;
        this.emit("clientDebug", "[WS] Received bot data");
        this.emit("clientDebug", "[WS] Sending first heartbeat");
        this.ws.ping(
          JSON.stringify({
            op: 1,
            d: {
              heartbeatIntervalMs: this.heartbeatInterval,
            }
          })
        );
        this.lastHeartbeat = new Date().getTime();
        this.lastHeartbeatAck = new Date().getTime();
        this.emit("clientReady", allData);
        const heartbeat = setInterval(async () => {
          if (!this.lastHeartbeatAck && !this.heartbeatInterval) return;
          if (
            new Date().getTime() - this.lastHeartbeat >
            this.heartbeatInterval + 2500
          ) {
            this.emit("clientDebug", "[WS] No heartbeat ack");
            this.emit("clientDebug", "[WS] Reconnecting");
            clearInterval(heartbeat);
            this.heartbeatInterval = null;
            this.connected = false;
            this.ws.close();

            // Wait the this.currentReconnectTries * 5000 before reconnecting
            if (this.currentReconnectTries < this.reconnectTries) {
              this.currentReconnectTries++;
              await new Promise((r) => setTimeout(r, this.currentReconnectTries * 5000));
              this.connect();
            } else {
              this.emit("clientDebug", "[WS] Max reconnect tries reached");
              this.emit("clientError", new Error("Max reconnect tries reached"));
              return;
            }
          }

          this.emit("clientDebug", "[WS] Sending heartbeat");
          this.ws.ping(
            JSON.stringify({
              op: 1,
              d: null,
            })
          );
          this.lastHeartbeat = new Date().getTime();
          this.lastHeartbeatAck = null;
        }, this.heartbeatInterval);
      }
    });

    this.ws.on("message", (data) => {
      const { t: eventType, d: eventData } = JSON.parse(data);

      switch (eventType) {
        case "ChatMessageCreated":
          this.emit(
            "messageCreated",
            new Message(eventData.message, this.client)
          );
          break;
        case "ChatMessageUpdated":
          this.emit(
            "messageUpdated",
            new Message(eventData.message, this.client)
          );
          break;
        case "ChatMessageDeleted":
          this.emit(
            "messageDeleted",
            new Message(eventData.message, this.client)
          );
          break;
        case "TeamMemberJoined":
          eventData.member.serverId = eventData.serverId;
          this.emit("memberAdded", new Member(eventData.member, this.client));
          break;
        case "TeamMemberRemoved":
          this.emit("memberRemoved", new MemberRemoved(eventData, this.client));
          break;
        case "TeamMemberBanned":
          this.emit("memberBanned", new MemberBan(eventData, this.client));
          break;
        case "TeamMemberUnbanned":
          this.emit("memberUnbanned", new MemberBan(eventData, this.client));
          break;
        case "TeamMemberUpdated":
          this.emit("memberUpdated", new MemberUpdated(eventData, this.client));
          break;
        case "teamRolesUpdated":
          this.emit("memberRolesUpdated", new RolesUpdated(eventData, this.client));
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
      this.connect();
    });

    this.ws.on("error", (error) => {
      this.emit("clientError", error);
    });
  }
}

module.exports = ClientWebSocket;
