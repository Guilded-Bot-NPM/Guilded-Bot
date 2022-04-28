const {EventEmitter} = require('events');
const {WebSocket} = require('ws');
const { Message } = require('../structures/Message');
const { Member } = require('../user/Member');
const { MemberBan } = require('../user/MemberBan');
const { Webhook } = require('../webhook/Webhook');

let bot_id = "";

class ClientWebSocket extends EventEmitter {
    constructor(client) {
        super();

        this.ws = null;
        this.client = client;
        this.connected = false;
    }

    connect() {

        const token = this.client.token;
        
        this.ws = new WebSocket(`wss://api.guilded.gg/v1/websocket`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        // Events

        this.ws.on('open', () => {
            this.connected = true;
        });

        this.ws.on('message', (data) => { 

            if(JSON.parse(data).op === 1) {
                this.client.user = JSON.parse(data).d.user
                //Time in unix epoch
                this.client.readyAt = (new Date()).getTime();
                //Make function to get uptime
                this.client.uptime = () => {
                    return (Math.round(((new Date()).getTime() - this.client.readyAt) / 1000));
                }
                bot_id = JSON.parse(data).d.user.id;
                this.emit('open', JSON.parse(data).d);
            }
            

            
            const { t: eventType, d: eventData } = JSON.parse(data);
            

            switch (eventType) {
                case 'ChatMessageCreated':
                    if(eventData.message.createdBy === bot_id) break;
                    this.emit('messageCreated', new Message(token, eventData.message, this.client));
                    break;
                case 'ChatMessageUpdated':
                    if(eventData.message.createdBy === bot_id) break;
                    this.emit('messageUpdated', new Message(token, eventData.message, this.client));
                    break;
                case 'ChatMessageDeleted':
                    if(eventData.message.createdBy === bot_id) break;
                    this.emit('messageDeleted', new Message(token, eventData.message, this.client));
                    break;
                case 'TeamMemberJoined':
                    this.emit('memberAdded', new Member(eventData));
                    break;
                case 'TeamMemberRemoved':
                    this.emit('memberRemoved', new Member(eventData));
                    break;
                case 'TeamMemberBanned':
                    this.emit('memberBanned', new MemberBan(eventData));
                    break;
                case 'TeamMemberUnbanned':
                    this.emit('memberUnbanned', new MemberBan(eventData));
                    break;
                case 'TeamMemberUpdated':
                    this.emit('memberUpdated', new Member(eventData));
                    break;
                case 'teamRolesUpdated':
                    this.emit('memberRolesUpdated', new Member(eventData));
                    break;
                case 'TeamWebhookCreated':
                    this.emit('webhookCreated', new Webhook(eventData));
                    break;
                case 'TeamWebhookUpdated':
                    this.emit('webhookUpdated', new Webhook(eventData));
                    break;
            };
        });

        this.ws.on('close', () => {
            this.connected = false;
            this.emit('closed');
        });

        this.ws.on('error', (error) => {
            this.emit('error', error);
        });
    }
};

module.exports.ClientWebSocket = ClientWebSocket;