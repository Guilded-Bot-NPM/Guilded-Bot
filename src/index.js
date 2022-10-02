'use strict';

module.exports.Client = require('./Classes/Client/Client.js').Client;
module.exports.Message = require('./Classes/Structures/Message.js').Message;
module.exports.MessageEmbed = require('./Classes/Structures/MessageEmbed.js').MessageEmbed;
module.exports.Version = require('../package.json').version;
module.exports.ClientWebSocket = require('./Classes/Client/WebSocket.js').ClientWebSocket;