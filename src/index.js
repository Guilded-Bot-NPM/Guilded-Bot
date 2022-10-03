'use strict';

module.exports.Client = require('./classes/client/client.js').Client;
module.exports.Message = require('./classes/structures/message.js').Message;
module.exports.MessageEmbed = require('./classes/structures/messageEmbed.js').MessageEmbed;
module.exports.Version = require('../package.json').version;
module.exports.ClientWebSocket = require('./classes/client/websocket.js').ClientWebSocket;

