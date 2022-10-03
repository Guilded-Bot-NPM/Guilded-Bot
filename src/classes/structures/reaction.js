
class Reaction {
  /**
   * Reaction Object
   * @param {Object} data
   * @param {String} data.serverId The ID of the server of the reaction
   * @param {Object} data.reaction The reaction object
   * @param {String} data.reaction.channelId The ID of the channel of the reaction
   * @param {String} data.reaction.messageId The ID of the message of the reaction
   * @param {String} data.reaction.createdBy The ID of the user who created the reaction
   * @param {Object} data.reaction.emote The emote object
   * @param {String} data.reaction.emote.id The ID of the emote
   * @param {String} data.reaction.emote.name The name of the emote
   * @param {String} data.reaction.emote.url The URL of the emote
   */
  constructor(data) {  
    /**
     * The ID of the server of the reaction
     * @type {String}
     * @readonly
     */
    this.serverId = data.serverId;

    /**
     * The ID of the channel of the reaction
     * @type {String}
     * @readonly
     */
    this.channelId = data.reaction.channelId

    /**
     * The ID of the message of the reaction
     * @type {String}
     * @readonly
     */
    this.messageId = data.reaction.messageId;

    /**
     * The ID of the user who created the reaction
     * @type {String}
     * @readonly
     */
    this.createdBy = data.reaction.createdBy;

    /**
     * The emote ID of the reaction
     * @type {String}
     * @readonly
     */
    this.emoteId = data.reaction.emote.id;

    /**
     * The emote name of the reaction
     * @type {String}
     * @readonly
     */
    this.emoteName = data.reaction.emote.name;

    /**
     * The partial url of the emote
     * @type {String}
     * @readonly
     */
    this.emotePartialUrl = data.reaction.emote.url;

    /**
     * The full url of the emote
     * @type {String}
     * @readonly
     */
    this.emoteUrl = "https://img.guildedcdn.com" + data.reaction.emote.url;

    /**
     * The raw data of the reaction
     * @type {Object}
     * @readonly
     */
    this.raw = data.reaction;
  }
}

module.exports = Reaction;