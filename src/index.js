'use strict';

module.exports.Client = require('./classes/client/client.js');
module.exports.Message = require('./classes/structures/message.js');
module.exports.MessageEmbed = require('./classes/structures/messageEmbed.js');
module.exports.Version = require('../package.json').version;
module.exports.ClientWebSocket = require('./classes/client/websocket.js');

