const { endpoints } = require('./EndPoints')
const axios = require('axios')

module.exports = {
  /**
   * Send a message to a selected channel
   * @param {*} Object
   * @param {Object} content The content of the message
   * @param {String} content.content The content of the message
   * @param {String} content.channelId The channel id of the message
   * @param {String} content.authToken The auth token of the bot
   * @param {Boolean} content.isPrivate If the message is private
   * @param {Boolean} content.isSilent If the message is silent
   * @param {Array} content.replyMessageIds The message ids to reply to
   * @param {Array} content.embeds The embeds to send
   * @returns {Message} The message object
   * @private
   * @ignore
   */
  async sendMessage (Object) {
    const message = Object.content
    const channelId = Object.channelId
    const authToken = Object.authToken
    const isPrivate = !!Object.isPrivate
    const isSilent = !!Object.isSilent
    const replyMessageIds = Object.replyMessageIds
      ? Object.replyMessageIds
      : null
    const embeds = Object.embeds ? Object.embeds : null

    const final_Json = {
      content: message,
      isPrivate: !!isPrivate,
      isSilent: !!isSilent
    }

    if (replyMessageIds) final_Json.replyMessageIds = replyMessageIds
    if (embeds) final_Json.embeds = embeds

    return await axios
      .post(`${endpoints.CHANNELS_MESSAGES(channelId)}`, final_Json, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        // Make a new message object
        const messageData = res.data.message
        const Messages = require('../classes/Structures/Message')
        const Message = new Messages.Message(authToken, messageData)
        return Message
      })
      .catch((err) => err)
  },

  /**
   * Edit a message in a selected channel
   * @param {Object} content The content of the message
   * @param {String} content.content The content of the message
   * @param {String} content.channelId The channel id of the message
   * @param {String} content.authToken The auth token of the bot
   * @param {Boolean} content.isPrivate If the message is private
   * @param {Boolean} content.isSilent If the message is silent
   * @param {Array} content.replyMessageIds The message ids to reply to
   * @param {Array} content.embeds The embeds to send
   * @return {Message} The message object
   * @private
   * @ignore
   */
  async editMessage (Object) {
    const message = Object.content
    const channelId = Object.channelId
    const authToken = Object.authToken
    const isPrivate = !!Object.isPrivate
    const isSilent = !!Object.isSilent
    const replyMessageIds = Object.replyMessageIds
      ? Object.replyMessageIds
      : null
    const embeds = Object.embeds ? Object.embeds : null
    const messageId = Object.id

    const final_Json = {
      content: message,
      isPrivate: !!isPrivate,
      isSilent: !!isSilent
    }

    if (replyMessageIds) {
      final_Json.replyMessageIds = replyMessageIds
    }

    if (embeds) {
      final_Json.embeds = embeds
    }

    return await axios
      .put(`${endpoints.MESSSAGE(channelId, messageId)}`, final_Json, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        // Make a new message object
        const messageData = res.data.message
        const Messages = require('../classes/Structures/Message')
        const Message = new Messages.Message(authToken, messageData)
        return Message
      })
      .catch((err) => err)
  },

  /**
   * Delete a message in a selected channel
   * @param {Object} content The content of the message
   * @param {String} content.channelId The channel id of the message
   * @param {String} content.authToken The auth token of the bot
   * @param {String} content.id The message id
   * @param {Number} content.timeout The timeout of the message
   * @return {Message} The message object
   * @private
   * @ignore
   */
  async deleteMessage (Object) {
    const channelId = Object.channelId
    const authToken = Object.authToken
    const messageId = Object.id

    const timeout = Object.timeout || 0

    // Wait for timeout
    await new Promise((resolve) => setTimeout(resolve, timeout))

    return await axios
      .delete(`${endpoints.MESSSAGE(channelId, messageId)}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        // Make a new message object
        if (res.status === 204) {
          return 'Message deleted'
        }

        return res.data
      })
      .catch((err) => err)
  },

  /**
   * Reacy to a message in a selected channel
   * @param {Object} content The content of the message
   * @param {String} content.channelId The channel id of the message
   * @param {String} content.authToken The auth token of the bot
   * @param {String} content.id The message id
   * @param {String} content.emojiId The emoji id
   * @returns {Reaction} The reaction object
   * @private
   * @ignore
   */
  async reactMessage (Object) {
    const channelId = Object.channelId
    const authToken = Object.authToken
    const messageId = Object.id
    const emojiId = Object.emojiId

    return await axios
      .put(
        `${endpoints.REACT_MESSAGE(channelId, messageId, emojiId)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      .then((res) => {
        if (res.status === 204) {
          return 'Message reacted'
        }

        const data = res.data

        if (data.code) {
          return data.message
        }

        return data
      })
      .catch((err) => err)
  }
}
