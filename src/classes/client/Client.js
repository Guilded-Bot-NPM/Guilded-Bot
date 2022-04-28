const { EventEmitter } = require('events');
const { ClientWebSocket } = require('./WebSocket');

class Client extends EventEmitter {
    /**
     * 
     * @param {String} token Your guilded bot's Auth Token
     */
    constructor(token = String) {
        super();

        this.token = token;
        this.ws = null;
    }

    login() {


        this.ws = new ClientWebSocket(this);
        this.ws.connect();
        
        this.ws.on('open', (client) => {
            this.emit('ready', client);
        });

        this.ws.on('messageCreated', (message) => {
            this.emit('serverMessageCreate', message);
        });

        this.ws.on('messageUpdated', (message) => {
            this.emit('serverMessageUpdate', message);
        });

        this.ws.on('messageDeleted', (message) => {
            this.emit('serverMessageDelete', message);
        });

        this.ws.on('memberAdded', (member) => {
            this.emit('serverMemberJoin', member);
        });

        this.ws.on('memberRemoved', (member) => {
            this.emit('serverMemberLeft', member);
        });

        this.ws.on('memberBanned', (member) => {
            this.emit('serverMemberBan', member);
        });

        this.ws.on('memberUnbanned', (member) => {
            this.emit('serverMemberUnban', member);
        });

        this.ws.on('memberRolesUpdated', (member) => {
            this.emit('serverMemberUpdate', member);
        });

        this.ws.on('webhookCreated', (webhook) => {
            this.emit('serverWebhookCreate', webhook);
        });

        this.ws.on('webhookUpdated', (webhook) => {
            this.emit('serverWebhookUpdate', webhook);
        });

        this.ws.on('closed', () => {
            this.emit('disconnect');
        });

        this.ws.on('error', (error) => {
            this.emit('error', error);
        });
    }
}

module.exports.Client = Client;    