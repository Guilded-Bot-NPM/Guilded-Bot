const baseUrl = "https://www.guilded.gg/api/v1";

module.exports.endpoints = {
  /**
   * Get the base url of the api
   */
  BASE: baseUrl,
  /**
   * Get the url for the channel messages
   */
  CHANNELS_MESSAGES: (channelId) => `${baseUrl}/channels/${channelId}/messages`,
  /**
   * Get the url for edit or delete channel message
   */
   MESSSAGE: (channelId, messageId) => `${baseUrl}/channels/${channelId}/messages/${messageId}`,
  /**
  /**
   * Get the url for the reactions of a message
   */
  REACT_MESSAGE: (channelId, messageId, emoteId) => `${baseUrl}/channels/${channelId}/content/${messageId}/emotes/${emoteId}`,
  /**
   * Get the url for the server members
   */
  SERVER_MEMBERS: (serverId, memberId) => `${baseUrl}/servers/${serverId}/members/${memberId}`,
};
