const { endpoints } = require("./endpoints");
const axios = require("axios");
const Message = require("../classes/structures/message");

/**
 * Send a message to a selected channel
 * @param {Object} content The content of the message
 * @param {String} content.content The content of the message
 * @param {String} content.channelId The channel id of the message
 * @param {Boolean} content.isPrivate If the message is private
 * @param {Boolean} content.isSilent If the message is silent
 * @param {Array} content.replyMessageIds The message ids to reply to
 * @param {Array} content.embeds The embeds to send
 * @param {Client} content.client The client object
 * @returns {Message} The message object
 * @private
 * @ignore
 */
module.exports.sendMessage = async (MessageObject) => {
  let message = MessageObject.content;
  let channelId = MessageObject.channelId;
  let isPrivate = MessageObject.isPrivate ? true : false;
  let isSilent = MessageObject.isSilent ? true : false;
  let replyMessageIds = MessageObject.replyMessageIds
    ? MessageObject.replyMessageIds
    : null;
  let embeds = MessageObject.embeds ? MessageObject.embeds : null;

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
        Authorization: `Bearer ${MessageObject.client.token}`,
        "Content-Type": "application/json",
        "User-Agent": `Guilded-Bot/${MessageObject.client.version} (${MessageObject.client.platform}) Node.js (${process.version})`,
      },
    })
    .then((res) => {
      //Make a new message object
      return new Message(res.data.message, MessageObject.client);
    })
    .catch((err) => err);
};

/**
 * Edit a message in a selected channel
 * @param {Object} content The content of the message
 * @param {String} content.content The content of the message
 * @param {String} content.channelId The channel id of the message
 * @param {Boolean} content.isPrivate If the message is private
 * @param {Boolean} content.isSilent If the message is silent
 * @param {Array} content.replyMessageIds The message ids to reply to
 * @param {Array} content.embeds The embeds to send
 * @param {Client} content.client The client object
 * @return {Message} The message object
 * @private
 * @ignore
 */
module.exports.editMessage = async (MessageObject) => {
  let message = MessageObject.content;
  let channelId = MessageObject.channelId;
  let isPrivate = MessageObject.isPrivate ? true : false;
  let isSilent = MessageObject.isSilent ? true : false;
  let replyMessageIds = MessageObject.replyMessageIds
    ? MessageObject.replyMessageIds
    : null;
  let embeds = MessageObject.embeds ? MessageObject.embeds : null;
  let messageId = MessageObject.id;

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
        Authorization: `Bearer ${MessageObject.client.token}`,
        "Content-Type": "application/json",
        "User-Agent": `Guilded-Bot/${MessageObject.client.version} (${MessageObject.client.platform}) Node.js (${process.version})`,
      },
    })
    .then((res) => {
      //Make a new message object
      return new Message(res.data.message, MessageObject.client);
    })
    .catch((err) => err);
};

/**
 * Delete a message in a selected channel
 * @param {Object} content The content of the message
 * @param {String} content.channelId The channel id of the message
 * @param {String} content.id The message id
 * @param {Number} content.timeout The timeout of the message
 * @param {Client} content.client The client object
 * @return {Message} The message object
 * @private
 * @ignore
 */
module.exports.deleteMessage = async (MessageObject) => {
  let channelId = MessageObject.channelId;
  let messageId = MessageObject.id;
  let timeout = MessageObject.timeout || 0;

  //Wait for timeout
  await new Promise((resolve) => setTimeout(resolve, timeout));

  return await axios
    .delete(`${endpoints.MESSSAGE(channelId, messageId)}`, {
      headers: {
        Authorization: `Bearer ${MessageObject.client.token}`,
        "Content-Type": "application/json",
        "User-Agent": `Guilded-Bot/${MessageObject.client.version} (${MessageObject.client.platform}) Node.js (${process.version})`,
      },
    })
    .then((res) => {
      //Make a new message object
      if (res.status === 204) {
        return "Message deleted";
      }

      return new Message(res.data.message, MessageObject.client);
    })
    .catch((err) => err);
};

/**
 * Reacy to a message in a selected channel
 * @param {Object} content The content of the message
 * @param {String} content.channelId The channel id of the message
 * @param {String} content.id The message id
 * @param {String} content.emojiId The emoji id
 * @param {Client} content.client The client object
 * @returns {Reaction} The reaction object
 * @private
 * @ignore
 */
module.exports.reactMessage = async (MessageObject) => {
  let channelId = MessageObject.channelId;
  let messageId = MessageObject.id;
  let emojiId = MessageObject.emojiId;

  return await axios
    .put(
      `${endpoints.REACT_MESSAGE(channelId, messageId, emojiId)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${MessageObject.client.token}`,
          "Content-Type": "application/json",
          "User-Agent": `Guilded-Bot/${MessageObject.client.version} (${MessageObject.client.platform}) Node.js (${process.version})`,
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
};
