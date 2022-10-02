const { EventEmitter } = require("events");
const { WebSocket } = require("ws");
const { Message } = require("../structures/message");
const { User } = require("../structures/user/user");
const { Member } = require("../structures/user/member");
const { MemberBan } = require("../structures/user/memberban");
const { Webhook } = require("../structures/webhook");
const { Reaction } = require("../structures/reaction");

/**
 * The ClientWebSocket class
 * @class ClientWebSocket
 * @extends EventEmitter
 * @param {Client} client
 * @returns {ClientWebSocket}
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

    this.ws = null;
    this.client = client;
    this.connected = false;
    this.botID = null;
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
      },
    });

    // Events
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
        bot_data.user = new User(bot_data.user);
        this.emit("open", bot_data);
      }

      const { t: eventType, d: eventData } = JSON.parse(data);

      try {
        switch (eventType) {
          case "ChatMessageCreated":
            if (eventData.message.createdBy === this.botID) break;
            this.emit(
              "messageCreated",
              new Message(token, eventData.message, this.client)
            );
            break;
          case "ChatMessageUpdated":
            if (eventData.message.createdBy === this.botID) break;
            this.emit(
              "messageUpdated",
              new Message(token, eventData.message, this.client)
            );
            break;
          case "ChatMessageDeleted":
            if (eventData.message.createdBy === this.botID) break;
            this.emit(
              "messageDeleted",
              new Message(token, eventData.message, this.client)
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

module.exports.ClientWebSocket = ClientWebSocket;
