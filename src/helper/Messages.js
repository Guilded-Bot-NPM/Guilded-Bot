const { endpoints } = require("./endpoints");
const axios = require("axios");
const Messages = require("../classes/structures/message");
const { Client } = require("../classes/client/client");

module.exports = {
  /**
   * Send a message to a selected channel
   * @param {*} Object
   * @param {Object} content The content of the message
   * @param {String} content.content The content of the message
   * @param {String} content.channelId The channel id of the message
   * @param {Boolean} content.isPrivate If the message is private
   * @param {Boolean} content.isSilent If the message is silent
   * @param {Array} content.replyMessageIds The message ids to reply to
   * @param {Array} content.embeds The embeds to send
   * @param {Client} client The client that emitted the event
   * @returns {Message} The message object
   * @private
   * @ignore
   */
  async sendMessage(Object, Client) {
    let message = Object.content;
    let channelId = Object.channelId;
    let isPrivate = Object.isPrivate ? true : false;
    let isSilent = Object.isSilent ? true : false;
    let replyMessageIds = Object.replyMessageIds
      ? Object.replyMessageIds
      : null;
    let embeds = Object.embeds ? Object.embeds : null;

    let final_Json = {
      content: message,
      isPrivate: isPrivate ? true : false,
      isSilent: isSilent ? true : false,
    };

    if (replyMessageIds) final_Json.replyMessageIds = replyMessageIds;
    if (embeds) final_Json.embeds = embeds;

    return await axios
      .post(`${endpoints.CHANNELS_MESSAGES(channelId)}`, final_Json, {
        headers: {
          Authorization: `Bearer ${Client.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        //Make a new message object
        const messageData = res.data.message;
        const Message = new Messages.Message(messageData, Client);
        return Message;
      })
      .catch((err) => err);
  },

  /**
   * Edit a message in a selected channel
   * @param {Object} content The content of the message
   * @param {String} content.content The content of the message
   * @param {String} content.channelId The channel id of the message
   * @param {Boolean} content.isPrivate If the message is private
   * @param {Boolean} content.isSilent If the message is silent
   * @param {Array} content.replyMessageIds The message ids to reply to
   * @param {Array} content.embeds The embeds to send
   * @param {Client} Client The client object
   * @return {Message} The message object
   * @private
   * @ignore
   */
  async editMessage(Object, Client) {
    let message = Object.content;
    let channelId = Object.channelId;
    let isPrivate = Object.isPrivate ? true : false;
    let isSilent = Object.isSilent ? true : false;
    let replyMessageIds = Object.replyMessageIds
      ? Object.replyMessageIds
      : null;
    let embeds = Object.embeds ? Object.embeds : null;
    let messageId = Object.id;

    let final_Json = {
      content: message,
      isPrivate: isPrivate ? true : false,
      isSilent: isSilent ? true : false,
    };

    if (replyMessageIds) {
      final_Json.replyMessageIds = replyMessageIds;
    }

    if (embeds) {
      final_Json.embeds = embeds;
    }

    return await axios
      .put(`${endpoints.MESSSAGE(channelId, messageId)}`, final_Json, {
        headers: {
          Authorization: `Bearer ${Client.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        //Make a new message object
        const messageData = res.data.message;
        const Message = new Messages.Message(messageData, Client);
        return Message;
      })
      .catch((err) => err);
  },

  /**
   * Delete a message in a selected channel
   * @param {Object} content The content of the message
   * @param {String} content.channelId The channel id of the message
   * @param {String} content.id The message id
   * @param {Number} content.timeout The timeout of the message
   * @param {Client} Client The client object
   * @return {Message} The message object
   * @private
   * @ignore
   */
  async deleteMessage(Object, Client) {
    let channelId = Object.channelId;
    let messageId = Object.id;
    let timeout = Object.timeout || 0;

    //Wait for timeout
    await new Promise((resolve) => setTimeout(resolve, timeout));

    return await axios
      .delete(`${endpoints.MESSSAGE(channelId, messageId)}`, {
        headers: {
          Authorization: `Bearer ${Client.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        //Make a new message object
        if (res.status === 204) {
          return "Message deleted";
        }
        const messageData = res.data.message;
        const Message = new Messages.Message(messageData, Client);
        return Message;
      })
      .catch((err) => err);
  },

  /**
   * Reacy to a message in a selected channel
   * @param {Object} content The content of the message
   * @param {String} content.channelId The channel id of the message
   * @param {String} content.id The message id
   * @param {String} content.emojiId The emoji id
   * @param {Client} Client The client object
   * @returns {Reaction} The reaction object
   * @private
   * @ignore
   */
  async reactMessage(Object, Client) {
    let channelId = Object.channelId;
    let messageId = Object.id;
    let emojiId = Object.emojiId;

    return await axios
      .put(
        `${endpoints.REACT_MESSAGE(channelId, messageId, emojiId)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Client.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 204) {
          return "Message reacted";
        }

        const data = res.data;

        if (data.code) {
          return data.message;
        }

        return data;
      })
      .catch((err) => err);
  },
};
