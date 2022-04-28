const path = require('path');

const { Client } = require(path.join(__dirname, "classes", "client", "Client.js"));
const { MessageEmbed } = require(path.join(__dirname, "classes", "structures", "Embeds.js"));

const Version = () => {
    const package = require('../package.json');
    return package.version;
}

module.exports = {
    Client,
    Version,
    MessageEmbed,
}