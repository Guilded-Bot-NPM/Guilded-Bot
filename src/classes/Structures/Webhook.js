class Webhook {
  /**
   * Weebhook constructor
   * @param {Object} webhookData The webhook data
   * @param {String} webhookData.id The webhook id
   * @param {String} webhookData.name The webhook name
   * @param {String} webhookData.channelId The channel id of the webhook
   * @param {String} webhookData.serverId The server id of the webhook
   * @param {String} webhookData.createdBy The user id of the user who created the webhook
   * @param {String} webhookData.createdAt The date the webhook was created
   * @param {String} webhookData.deletedAt The date the webhook was deleted
   * @param {String} webhookData.token The webhook token
   */
  constructor(webhookData) {
    this.id = webhookData.webhook.id;
    this.name = webhookData.webhook.name;
    this.channelId = webhookData.webhook.channelId;
    this.channel = webhookData.webhook.channelId
      ? {
          id: webhookData.webhook.channelId,
        }
      : null;
    this.serverId = webhookData.webhook.serverId;
    this.server = webhookData.webhook.serverId
      ? {
          id: webhookData.webhook.serverId,
        }
      : null;
    this.createdAt = webhookData.webhook.createdAt;
    this.author = webhookData.webhook.createdBy
      ? {
          id: webhookData.webhook.createdBy,
        }
      : null;

    this.deletedAt = webhookData.webhook.deletedAt;
    this.token = webhookData.webhook.token;
  }
}

module.exports.Webhook = Webhook;
