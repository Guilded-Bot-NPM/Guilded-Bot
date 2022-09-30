const { endpoints } = require("./endpoints");
const axios = require("axios");
module.exports = new (class {
  async getUser(userId, serverId, token) {
    const { User } = require("../classes/user/User");
    const userData = await axios.get(
      `${endpoints.SERVER_MEMBERS(serverId, userId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then( (res) => res.data ).catch( (err) => err);


    if (userData.code) {
      return null;
    }

    return new User(userData.member.user);
  }

  async getMember(userId, serverId, token) {
    const { Member } = require("../classes/user/Member");
    const memberData = await axios.get(
      `${endpoints.SERVER_MEMBERS(serverId, userId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then( (res) => res.data ).catch( (err) => err);


    if (memberData.code) return null;

    return new Member(memberData.member);
  }
})();
