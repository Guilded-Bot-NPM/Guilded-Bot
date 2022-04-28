const { endpoints } = require("./endpoints");
const fetch = require("node-fetch");
module.exports = new (class {
  async getUser(userId, serverId, token) {
    const { User } = require("../classes/user/User");
    const userData = await fetch(
      `${endpoints.SERVER_MEMBERS(serverId, userId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => await res.json());
    return new User(userData.member.user);
  }
})();
