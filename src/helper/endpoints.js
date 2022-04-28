const baseUrl = "https://www.guilded.gg/api/v1";

module.exports.endpoints = {
    BASE: baseUrl,
    CHANNELS_MESSAGES: (channelId) => `${baseUrl}/channels/${channelId}/messages`,
    EDIT_MESSSAGE: (channelId, messageId) => `${baseUrl}/channels/${channelId}/messages/${messageId}`,
    DELETE_MESSAGE: (channelId, messageId) => `${baseUrl}/channels/${channelId}/messages/${messageId}`,
    REACT_MESSAGE: (channelId, messageId, emoteId) => `${baseUrl}/channels/${channelId}/content/${messageId}/emotes/${emoteId}`,
    SERVER_MEMBERS: (serverId, memberId) => `${baseUrl}/servers/${serverId}/members/${memberId}`,
}