const msgs = require("../../helper/Messages");
const guser = require("../../helper/Members");
const { User } = require("../user/User");

class Message {
  constructor(token, messageData, client) {
    this.client = client;
    if (messageData.id) {
      this.id = messageData.id;
    } else {
      this.id = null;
    }
    if (messageData.type) {
      this.type = messageData.type;
    } else {
      this.type = "default";
    }
    if (messageData.serverId) {
      this.serverId = messageData.serverId;
      this.server = {
        id: messageData.serverId,
      };
    } else {
      this.serverId = null;
      this.server = null;
    }
    if (messageData.channelId) {
      this.channelId = messageData.channelId;
      this.channel = {
        id: messageData.channelId,
        send: (object) => {
          let newmessage = {};
          if (typeof object === "string") {
            newmessage = {
              content: object,
              channelId: messageData.channelId,
              authToken: token,
              isPrivate: false,
              isSilent: false,
            };
          } else {
            newmessage = {
              content: object.content,
              channelId: messageData.channelId,
              authToken: token,
              isPrivate: object.isPrivate ? true : false,
              isSilent: object.isSilent ? true : false,
              replyMessageIds: object.replyMessageIds ? object.replyMessageIds : null,
              embeds: object.embeds ? object.embeds : null,
            };
          }
          return msgs.sendMessage(newmessage);
        },
      };
    } else {
      this.channelId = null;
      this.channel = null;
    }
    if (messageData.content) {

      this.content = messageData.content;

      this.attachments = [];

      //Check if message have attachments, the attachments are stored in the content with the format: ![](https://s3-us-west-2.amazonaws.com/www.guilded.gg/ContentMedia/42237368ad7882d89108acccf777c2ac-Full.webp?w=100&h=100) and maybe has more of 1 attachment

      if (this.content.includes("![")) {
        const attachments = this.content.match(/!\[(.*?)\]\((.*?)\)/g);
        if (attachments) {
          for (let i = 0; i < attachments.length; i++) {
            const attachment = attachments[i];
            const attachmentUrl = attachment.match(/\((.*?)\)/)[1];
            this.attachments[i] = attachmentUrl;
          }
        }
      } else {
        this.attachments = null;
      }
      if (this.attachments) {
        for (let i = 0; i < this.attachments.length; i++) {
          this.attachments[i] = this.attachments[i]
            .replace("![](", "")
            .slice(0, -1);
        }
      }

      //Convert the message to a better format
      //Example of message: "Hello\n\nGoodbye" or "Hello\n" + "\n" + "Goodbye\n" + "![](https://s3-us-west-2.amazonaws.com/www.guilded.gg/ContentMedia/42237368ad7882d89108acccf777c2ac-Full.webp?w=100&h=100)"
      //To: "Hello \n \n Goodbye" or "Hello \n \n Goodbye \n ![](https://s3-us-west-2.amazonaws.com/www.guilded.gg/ContentMedia/42237368ad7882d89108acccf777c2ac-Full.webp?w=100&h=100)"

      this.content = this.content.replace(/\n/g, " \n ").replace(/\n  \n/g, "\n \n");
    } else {
      this.content = null;
    }
    if (messageData.replyMessageIds) {
      this.hasReplies = true;
      this.replyMessageIds = messageData.replyMessageIds;
    } else {
      this.hasReplies = false;
      this.replyMessageIds = null;
    }
    if (messageData.isPrivate) {
      this.private = true;
    } else {
      this.private = false;
    }
    if (messageData.createdAt) {
      this.createdAt = messageData.createdAt;
    } else {
      this.createdAt = null;
    }
    if (messageData.createdBy) {
      //Create a user object
      const user = {}
      user.id = messageData.createdBy;
      user.serverId = messageData.serverId;
      user.token = token;
      this.author = new User(user);
    } else {
      this.author = null;
    }
    if (messageData.createdByWebhookId) {
      this.isWebhook = true;
      this.webhookId = messageData.createdByWebhookId;
    } else {
      this.isWebhook = false;
      this.webhookId = null;
    }
    if (messageData.updatedAt) {
      this.isEdited = true;
      this.editedAt = messageData.updatedAt;
    } else {
      this.isEdited = false;
      this.editedAt = null;
    }
    if (messageData.deletedAt) {
      this.deleted = true;
      this.deletedAt = messageData.deletedAt;
    } else {
      this.deleted = false;
      this.deletedAt = null;
    }

    this.raw = messageData;

    //Make function reply
    this.reply = (object) => {
      let newmessage = {};
      if (typeof object === "string") {
        newmessage = {
          content: object,
          channelId: messageData.channelId,
          authToken: token,
          isPrivate: false,
          isSilent: false,
          replyMessageIds: [this.id],
        };
      } else {
        newmessage = {
          content: object.content,
          channelId: messageData.channelId,
          authToken: token,
          isPrivate: object.isPrivate ? true : false,
          isSilent: object.isSilent ? true : false,
          replyMessageIds: [this.id],
          embeds: object.embeds ? object.embeds : null,
        };
      }
      return msgs.sendMessage(newmessage);
    };

    //Make function edit
    this.edit = (object) => {
        let newmessage = {};
        if (typeof object === "string") {
            newmessage = {
            id: this.id,
            content: object,
            channelId: messageData.channelId,
            authToken: token,
            isPrivate: false,
            isSilent: false,
            };
        } else {
            newmessage = {
        id: this.id,
            content: object.content,
            channelId: messageData.channelId,
            authToken: token,
            isPrivate: object.isPrivate ? true : false,
            isSilent: object.isSilent ? true : false,
            replyMessageIds: object.replyMessageIds ? object.replyMessageIds : null,
            embeds: object.embeds ? object.embeds : null,
            };
        }
        return msgs.editMessage(newmessage);
        };

        //Make function delete
        this.delete = (object = {}) => {

            let timeout = object.timeout || null;
            let newmessage = {
            id: this.id,
            channelId: messageData.channelId,
            authToken: token,
            };
            return msgs.deleteMessage(newmessage, timeout);
            };

          // Make function react
          this.react = (emoji) => {
            if (!emoji) {
              emoji = 90001164
            }

            if (typeof emoji !== "number") {
              return "Emoji must be a number";
            }


            let newmessage = {
              id: this.id,
              channelId: messageData.channelId,
              authToken: token,
              emojiId: emoji ? emoji : 90001164,
            };

            return msgs.reactMessage(newmessage);
          };

      //Make function to get user
      this.getUser = async (userId) => {
        if (!userId) {
          return await guser.getUser(messageData.createdBy, this.serverId, token);
        } else {
          return await guser.getUser(userId, this.serverId, token);
        }
      }
  }
}

module.exports.Message = Message;
