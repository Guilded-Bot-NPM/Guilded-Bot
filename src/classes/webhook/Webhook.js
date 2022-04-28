class Webhook {
    constructor(webhookData) {
        if (webhookData.webhook.id) {
            this.id = webhookData.webhook.id;
        } else {
            this.id = null;
        }
        if (webhookData.webhook.name) {
            this.name = webhookData.webhook.name;
        } else {
            this.name = null;
        }
        if (webhookData.webhook.channelId) {
            this.channelId = webhookData.webhook.channelId;
            this.channel = {
                id: webhookData.webhook.channelId,
            };
        } else {
            this.channelId = null;
            this.channel = null;
        }
        if (webhookData.serverId) {
            this.serverId = webhookData.webhook.serverId;
            this.server = {
                id: webhookData.webhook.serverId,
            };
        } else {
            this.serverId = null;
            this.server = null;
        }
        if (webhookData.webhook.createdAt) {
            this.createdAt = webhookData.webhook.createdAt;
        } else {
            this.createdAt = null;
        }
        if (webhookData.webhook.createdBy) {
            this.author = {
                id: webhookData.webhook.createdBy,
            };
        } else {
            this.author = null;
        }
        if (webhookData.webhook.deletedAt) {
            this.deletedAt = webhookData.webhook.deletedAt;
        } else {
            this.deletedAt = null;
        }
        if (webhookData.webhook.token) {
            this.token = webhookData.webhook.token;
        } else {
            this.token = null;
        };
    }
}

module.exports.Webhook = Webhook;