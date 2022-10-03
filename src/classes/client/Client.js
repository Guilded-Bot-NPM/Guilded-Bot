const { EventEmitter } = require('events')
const { ClientWebSocket } = require('./websocket')

/**
 * The main class for the Guilded.js library
 * @class Client
 * @extends EventEmitter
 * @param {String} token The token of the bot
 */
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
  constructor (token = String) {
    super()

    /**
     * The token of the bot
     * @type {String}
     * @readonly
     */
    this.token = token

    /**
     * The websocket of the bot
     * @type {ClientWebSocket}
     * @readonly
     */
    this.ws = null
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
  login () {
    /**
     * Create a new WebSocket connection
     * @param {Client} client
     * @returns {ClientWebSocket}
     * @constructor
     * @private
     * @ignore
     */
    this.ws = new ClientWebSocket(this)
    /**
     * Connects the bot to the Guilded API
     * @returns {Promise<void>}
     * @example
     * client.ws.connect();
     * @example
     * client.ws.connect().then(() => {
     *  console.log('Bot is ready!');
     * });
     * @private
     * @ignore
     */
    this.ws.connect()

    /**
     * Emitted when the bot is ready
     * @event Client#ready
     * @param {Client} client The client that emitted the event
     * @example
     * client.on('ready', () => {
     *   console.log('Bot is ready!');
     * });
     */
    this.ws.on('open', (client) => {
      this.emit('ready', client)
    })

    /**
     * Emitted when the bot receives a message
     * @event Client#message
     * @param {Message} message
     * @example
     * client.on('serverMessageCreate', (message) => {
     *   console.log(message.content); 
     * });
     */
    this.ws.on('messageCreated', (message) => {
      this.emit('serverMessageCreate', message)
    })

    /**
     * Emitted when the bot receives a updated message
     * @event Client#messageUpdate
     * @param {Message} message
     * @example
     * client.on('serverMessageUpdate', (message) => {
     *  console.log(message.content);
     * });
     */
    this.ws.on('messageUpdated', (message) => {
      this.emit('serverMessageUpdate', message)
    })

    /**
     * Emitted when the bot receives a deleted message
     * @event Client#messageDelete
     * @param {Message} message
     * @example
     * client.on('serverMessageDelete', (message) => {
     *  console.log(message.content);
     * });
     */
    this.ws.on('messageDeleted', (message) => {
      this.emit('serverMessageDelete', message)
    })

    /**
     * Emitted when the bot receives a member join
     * @event Client#memberJoin
     * @param {Member} member
     * @example
     * client.on('serverMemberJoin', (member) => {
     *    console.log(member.nickname);
     * });
     */
    this.ws.on('memberAdded', (member) => {
      this.emit('serverMemberJoin', member)
    })

    /**
     * Emitted when the bot receives a member leave
     * @event Client#memberLeave
     * @param {Member} member
     * @example
     * client.on('serverMemberLeft', (member) => {
     *   console.log(member.nickname);
     * });
     */
    this.ws.on('memberRemoved', (member) => {
      this.emit('serverMemberLeft', member)
    })

    /**
     * Emitted when the bot receives a member ban
     * @event Client#memberBan
     * @param {MemberBan} memberBan
     * @example
     * client.on('serverMemberBan', (member) => {
     *  console.log(member.nickname);
     * });
     */
    this.ws.on('memberBanned', (member) => {
      this.emit('serverMemberBan', member)
    })

    /**
     * Emitted when the bot receives a member unban
     * @event Client#memberUnban
     * @param {MemberBan} memberBan
     * @example
     * client.on('serverMemberUnban', (member) => {
     *    console.log(member.nickname);
     * });
     */
    this.ws.on('memberUnbanned', (member) => {
      this.emit('serverMemberUnban', member)
    })

    /**
     * Emitted when the bot receives a member role update
     * @event Client#memberRoleUpdate
     * @param {Member} member
     * @example
     * client.on('serverMemberUpdate', (member) => {
     *   console.log(member.nickname);
     * });
     */
    this.ws.on('memberRolesUpdated', (member) => {
      this.emit('serverMemberUpdate', member)
    })

    /**
     * Emitted when the bot receives a webhook create
     * @event Client#webhookCreate
     * @param {Webhook} webhook
     * @example
     * client.on('serverWebhookCreate', (webhook) => {
     *  console.log(webhook.name);
     * });
     */
    this.ws.on('webhookCreated', (webhook) => {
      this.emit('serverWebhookCreate', webhook)
    })

    /**
     * Emitted when the bot receives a webhook update
     * @event Client#webhookUpdate
     * @param {Webhook} webhook
     * @example
     * client.on('serverWebhookUpdate', (webhook) => {
     *    console.log(webhook.name);
     * });
     */
    this.ws.on('webhookUpdated', (webhook) => {
      this.emit('serverWebhookUpdate', webhook)
    })

    /**
     * Emitted when the bot receives a reaction add
     * @event Client#reactionAdd
     * @param {Reaction} reaction
     * @example
     * client.on('messageReactionCreated', (reaction) => {
     *   console.log(reaction.emoteId);
     * });
     */
    this.ws.on('messageReactionCreated', (reaction) => {
      this.emit('messageReactionCreated', reaction)
    })

    /**
     * Emitted when the bot receives a reaction remove
     * @event Client#reactionRemove
     * @param {Reaction} reaction
     * @example
     * client.on('messageReactionDeleted', (reaction) => {
     *  console.log(reaction.emoteId);
     * });
     */
    this.ws.on('ChannelMessageReactionDeleted', (reaction) => {
      this.emit('ChannelMessageReactionDeleted', reaction)
    })

    /**
     * Emitted when the bot receives a closed event
     * @event Client#closed
     * @example
     * client.on('closed', () => {
     *  console.log('Bot is closed!');
     * });
     */
    this.ws.on('closed', () => {
      this.emit('disconnect')
    })

    /**
     * Emitted when the bot receives a error event
     * @event Client#error
     * @param {Error} error
     * @example
     * client.on('error', (error) => {
     *  console.log(error);
     * });
     */
    this.ws.on('error', (error) => {
      this.emit('error', error)
    })

    /**
     * Delete the client
     * @event Client#destroy
     * @example
     * client.destroy();
     */
    this.destroy = async () => {
      this.emit('destroy')
      await this.ws.close()
    }
  }
}

module.exports.Client = Client
