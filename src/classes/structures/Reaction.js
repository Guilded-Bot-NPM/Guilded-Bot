
class Reaction {
  constructor(data) {  
    this.serverId = data.serverId;
    this.channelId = data.reaction.channelId
    this.messageId = data.reaction.messageId;
    this.createdBy = data.reaction.createdBy;
    this.emoteId = data.reaction.emote.id;
    this.emoteName = data.reaction.emote.name;
    this.emotePartialUrl = data.reaction.emote.url;
    this.emoteUrl = "https://img.guildedcdn.com" + data.reaction.emote.url;
    this.raw = data.reaction;
  }
}

module.exports.Reaction = Reaction;