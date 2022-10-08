const axios = require("axios");

/**
 * HTTP GET request
 * @param {String} url The URL to send the request to
 * @param {Client} client The client object
 * @returns {Promise<Object>} The response data
 * @private
 * @ignore
 */
module.exports.GET = async (url, client) => {
    return await axios.get(url, {
        headers: {
            Authorization: `Bearer ${client.token}`,
            "Content-Type": "application/json",
            "User-Agent": `Guilded-Bot/${client.version} (${client.platform}) Node.js (${process.version})`,
        }
    }).then((res) => res.data).catch((err) => {
        return {
            status: err.response.status,
            data: err.response.data
        }
    });
}