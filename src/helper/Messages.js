const { endpoints } = require("./endpoints");
const fetch = require("node-fetch");

module.exports = new (class {
  async sendMessage(Object) {
    let message = Object.content;
    let channelId = Object.channelId;
    let authToken = Object.authToken;
    let isPrivate = Object.isPrivate ? true : false;
    let isSilent = Object.isSilent ? true : false;
    let replyMessageIds = Object.replyMessageIds
      ? Object.replyMessageIds
      : null;
    let embeds = Object.embeds ? Object.embeds : null;

    return await fetch(`${endpoints.CHANNELS_MESSAGES(channelId)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        isPrivate: isPrivate ? true : false,
        isSilent: isSilent ? true : false,
        replyMessageIds: replyMessageIds ? replyMessageIds : null,
        embeds: embeds ? embeds : null,
      }),
    }).then(async (res) => {
      const data = await res.json();
      //Make a new message object
      const messageData = data.message;
      const Messages = require("../classes/structures/Message");
      const Message = new Messages.Message(authToken, messageData);
      return Message;
    });
  }

  async editMessage(Object) {
    let message = Object.content;
    let channelId = Object.channelId;
    let authToken = Object.authToken;
    let isPrivate = Object.isPrivate ? true : false;
    let isSilent = Object.isSilent ? true : false;
    let replyMessageIds = Object.replyMessageIds
      ? Object.replyMessageIds
      : null;
    let embeds = Object.embeds ? Object.embeds : null;
    let messageId = Object.id;

    return await fetch(`${endpoints.EDIT_MESSSAGE(channelId, messageId)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        isPrivate: isPrivate ? true : false,
        isSilent: isSilent ? true : false,
        replyMessageIds: replyMessageIds ? replyMessageIds : null,
        embeds: embeds ? embeds : null,
      }),
    }).then(async (res) => {
      const messageData = (await res.json()).message;
      const Messages = require("../classes/Message.js");
      const Message = new Messages.Message(authToken, messageData);
      return Message;
    });
  }

  async deleteMessage(Object) {
    let channelId = Object.channelId;
    let authToken = Object.authToken;
    let messageId = Object.id;

    let timeout = Object.timeout || 0;

    //Wait for timeout
    await new Promise((resolve) => setTimeout(resolve, timeout));

    return await fetch(`${endpoints.DELETE_MESSAGE(channelId, messageId)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 204) {
        return "Message deleted";
      }

      const data = await res.json();
      return data;
    });
  }

  async reactMessage(Object) {
    let channelId = Object.channelId;
    let authToken = Object.authToken;
    let messageId = Object.id;
    let emojiId = Object.emojiId;

    return await fetch(`${endpoints.REACT_MESSAGE(channelId, messageId, emojiId)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 204) {
        return "Message reacted";
      }

      const data = await res.json();

      if(data.code) {
        return data.message;
      }

      return data;
    });
  }
})();
