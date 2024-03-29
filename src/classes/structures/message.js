const msgs = require("../../helper/messages.js");
const guser = require("../../helper/members.js");
const User = require("./user/user.js");
const Reaction = require("./reaction.js");

/**
 * Represents a message
 */
class Message {
  /**
   * Creates a new message object
   * @param {Object} messageData The message data
   * @param {Object} client The client object
   * @returns {Message}
   * @example
   * const { Message } = require('guilded.js');
   * const message = new Message(messageData, client);
   */
  constructor(messageData, client) {
    /**
     * Client object
     * @type {Client}
     * @readonly
     */
    this.client = client;
    /**
     * The message id
     * @type {String}
     * @readonly
     */
    this.id = messageData.id;
    /**
     * The content of the message
     * @type {String}
     * @readonly
     */
    this.content = messageData.content ?? "";
    /**
     * The attachments of the message
     * @type {Array}
     * @readonly
     */
    this.attachments = [];
    /**
     * The message channel id
     * @type {Channel}
     * @readonly
     */
    this.channel = {
      /**
       * The channel id
       * @type {String}
       * @readonly
       */
      id: messageData.channelId,

      /**
       * Send a message to the current channel
       * @param {String | Object} content The content of the message, this can be a string or an object
       * @param {String} content.content The content of the message
       * @param {Boolean} content.isPrivate Whether the message is private or not
       * @param {Boolean} content.isSilent Whether the message is silent or not
       * @param {Array} content.replyMessageIds The message ids to reply to
       * @param {Array} content.embeds The embeds to send
       * @param {Array} content.attachments The attachments to send
       * @returns {Promise} The message object
       * @private
       */
      send: (content) => {
        switch (typeof content) {
          case "string":
            return msgs.sendMessage(
              {
                content,
                channelId: messageData.channelId,
                isPrivate: false,
                isSilent: false,
                client: this.client,
              }
            );
          case "object":
            return msgs.sendMessage(
              {
                content: content.content,
                channelId: messageData.channelId,
                isPrivate: !!content.isPrivate,
                isSilent: !!content.isSilent,
                replyMessageIds: content.replyMessageIds
                  ? content.replyMessageIds
                  : null,
                embeds: content.embeds ? content.embeds : null,
                attachments: content.attachments ? content.attachments : null,
                client: this.client,
              }
            );
        }
      },
    };

    /**
     * The server Object
     * @type {Server | null}
     * @readonly
     */
    this.serverId = messageData.serverId ?? null;

    // Check if message have attachments
    if (this.content.includes("![")) {
      const attachments = this.content.match(/!\[(.*?)\]\((.*?)\)/g);
      if (attachments) {
        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];
          const attachmentUrl = attachment.match(/\((.*?)\)/)[1];
          this.attachments[i] = attachmentUrl;
        }
      }
    }

    if (this.attachments && this.attachments.length > 0) {
      for (let i = 0; i < this.attachments.length; i++) {
        this.attachments[i] = this.attachments[i]
          .replace("![](", "")
          .slice(0, -1);
      }
    }

    // Convert the message to a better format
    // Example of message: "Hello\n" + "\n" + "Goodbye\n" + "![](https://s3-us-west-2.amazonaws.com/www.guilded.gg/ContentMedia/42237368ad7882d89108acccf777c2ac-Full.webp?w=100&h=100)"
    // To: "Hello \n \n Goodbye \n ![](https://s3-us-west-2.amazonaws.com/www.guilded.gg/ContentMedia/42237368ad7882d89108acccf777c2ac-Full.webp?w=100&h=100)"

    this.content = this.content
      .replace(/\n/g, " \n ")
      .replace(/\n {2}\n/g, "\n \n");

    // Delete all files of the content
    // Example of message: "Hello ![](https://s3-us-west-2.amazonaws.com/www.guilded.gg/ContentMedia/42237368ad7882d89108acccf777c2ac-Full.webp?w=100&h=100)"
    // To: "Hello"

    this.content = this.content.replace(/!\[(.*?)\]\((.*?)\)/g, "");

    if (messageData.mentions) {
      this.mentions = {};
      if (messageData.mentions.users) {
        this.mentions.users = new Map();
        for (let i = 0; i < messageData.mentions.users.length; i++) {
          const mention = messageData.mentions.users[i];
          mention.server = {
            id: messageData.serverId,
          };
          const user = new User(mention);
          this.mentions.users.set(user.id, user);
        }
        this.mentions.users.first = () => {
          return this.mentions.users.values().next().value;
        };
      }

      if (messageData.mentions.roles) {
        this.mentions.roles = [];
        for (let i = 0; i < messageData.mentions.roles.length; i++) {
          this.mentions.roles.push(messageData.mentions.roles[i].id);
        }
      }
    }

    /**
     * Check if the message has replies
     * @type {Boolean}
     * @readonly
     */
    this.hasReplies = Boolean(messageData.replyMessageIds);
    /**
     * The message replies
     * @type {Array<String>}
     * @readonly
     */
    this.replyMessageIds = messageData.replyMessageIds ?? null;
    /**
     * Check if the message is private
     * @type {Boolean}
     * @readonly
     */
    this.private = messageData.isPrivate ?? false;
    /**
     * The created date of the message
     * @type {Date}
     * @readonly
     */
    this.createdAt = new Date(messageData.createdAt);
    /**
     * The author of the message
     * @type {User}
     * @readonly
     */
    this.author = null;

    if (global.cache.users.has(messageData.createdBy)) {
      // Check properties and update them
      const newAuthor = new User(
        {
          id: messageData.createdBy,
          serverId: messageData.serverId,
        },
        client
      );
      const oldAuthor = global.cache.users.get(messageData.createdBy);
      for (const property in newAuthor) {
        if (
          newAuthor[property] !== oldAuthor[property] &&
          property !== null &&
          property !== undefined &&
          property !== NaN
        ) {
          oldAuthor[property] = newAuthor[property];
        }
      }
      this.author = oldAuthor;
      global.cache.users.set(messageData.createdBy, oldAuthor);
    } else {
      this.author = new User(
        {
          id: messageData.createdBy,
          serverId: messageData.serverId,
        },
        client
      );
      global.cache.users.set(this.author.id, this.author);
    }

    /**
     * The webhook id of the message
     * @type {String | null}
     * @readonly
     */
    this.webhookId = messageData.createdByWebhookId ?? null;

    /**
     * The updated date (if the message was edited)
     * @type {Date | null}
     * @readonly
     */
    this.editedAt = messageData.updatedAt
      ? new Date(messageData.updatedAt)
      : null;

    /**
     * All data of the message (for debugging)
     * @type {Object}
     * @readonly
     */
    this.raw = messageData;

    /**
     * Send a message to the current channel to the user who sent the message
     * @param {String | Object} content The content of the message, this can be a string or an object
     * @param {String} content.content The content of the message
     * @param {Boolean} content.isPrivate Whether the message is private or not
     * @param {Boolean} content.isSilent Whether the message is silent or not
     * @param {Array} content.replyMessageIds The message ids to reply to
     * @param {Array} content.embeds The embeds to send
     * @param {Array} content.attachments The attachments to send
     * @returns {Message} The message object
     * @example
     * message.reply("Hello");
     */
    this.reply = (content) => {
      switch (typeof content) {
        case "string":
          return msgs.sendMessage(
            {
              content,
              channelId: messageData.channelId,
              isPrivate: false,
              isSilent: false,
              replyMessageIds: [this.id],
              client: this.client,
            }
          );
        case "object":
          return msgs.sendMessage(
            {
              content: content.content,
              channelId: messageData.channelId,
              isPrivate: !!content.isPrivate,
              isSilent: !!content.isSilent,
              replyMessageIds: [this.id],
              embeds: content.embeds ? content.embeds : null,
              attachments: content.attachments ? content.attachments : null,
              client: this.client,
            }
          );
      }
    };

    /**
     * Edit the current message
     * @param {String | Object} content The content of the message, this can be a string or an object
     * @param {String} content.content The content of the message
     * @param {Boolean} content.isPrivate Whether the message is private or not
     * @param {Boolean} content.isSilent Whether the message is silent or not
     * @param {Array} content.replyMessageIds The message ids to reply to
     * @param {Array} content.embeds The embeds to send
     * @param {Array} content.attachments The attachments to send
     * @returns {Message} The message object
     * @example
     * message.edit("Hello world!");
     */
    this.edit = (content) => {
      switch (typeof content) {
        case "string":
          return msgs.editMessage(
            {
              id: this.id,
              content,
              channelId: messageData.channelId,
              isPrivate: false,
              isSilent: false,
              client: this.client,
            }
          );
        case "object":
          return msgs.editMessage(
            {
              id: this.id,
              content: content.content,
              channelId: messageData.channelId,
              isPrivate: !!content.isPrivate,
              isSilent: !!content.isSilent,
              replyMessageIds: [this.id],
              embeds: content.embeds ? content.embeds : null,
              attachments: content.attachments ? content.attachments : null,
              client: this.client,
            }
          );
      }
    };

    /**
     * Delete the current message
     * @param {Object} options The options for the delete
     * @param {Number} options.timeout The timeout for the delete
     * @returns {Message} The message object
     * @example
     * message.delete();
     * message.delete({ timeout: 5000 });
     */
    this.delete = (object) => {
      return msgs.deleteMessage(
        {
          id: this.id,
          channelId: messageData.channelId,
          timeout: object.timeout ? object.timeout : 0,
          client: this.client,
        }
      );
    };

    /**
     * Add a reaction to the current message
     * @param {Number} emoji The emoji to react with
     * @returns {Reaction} The reaction object
     * @example
     * message.react(90001164);
     */
    this.react = (emoji) => {
      if (typeof emoji !== "number") emoji = 90001164;

      return msgs.reactMessage(
        {
          id: this.id,
          channelId: messageData.channelId,
          emojiId: emoji ?? 90001164,
          client: this.client,
        }
      );
    };

    /**
     * Get the user object of the author of the message or the user you want to get
     * @param {string} userId optional - The user id of the user you want to get info from
     * @returns {User} - The user object
     * @example
     * message.getUser();
     * message.getUser("123456789");
     */
    this.getUser = async (userId) => {
      // Check if the user id is in cache
      if (client.cache.users.get(userId ?? this.author.id)) {
        return client.cache.users.get(userId ?? this.author.id);
      } else {
        // If not, get the user from the api
        const newUser = await guser.getUser(
          {
            id: userId ?? this.author.id,
            serverId: messageData.serverId,
            client: client,
          }
        );

        // Add the user to the cache
        client.cache.users.set(userId, newUser);

        return newUser;
      }
    };

    /**
     * Get the member object of the author of the message or the member you want to get
     * @param {string} userId optional - The user id of the member you want to get info from
     * @returns {Member} - The member object
     * @example
     * message.getMember();
     * message.getMember("123456789");
     */

    this.getMember = async (userId) => {
      const member = await guser.getMember(
        {
          id: userId ?? this.author.id,
          serverId: messageData.serverId,
          client: client,
        }
      );
      return member;
    };
  }
}

module.exports = Message;
