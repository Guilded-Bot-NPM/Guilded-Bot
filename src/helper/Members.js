const { endpoints } = require('./EndPoints')
const axios = require('axios')
module.exports = new (class {
  /**
   * Get a user from the API
   * @param {string} userId
   * @param {string} serverId
   * @param {string} token
   * @returns {User} The user object
   */
  async getUser (userId, serverId, token) {
    const { User } = require('../classes/user/User')
    const userData = await axios.get(
      `${endpoints.SERVER_MEMBERS(serverId, userId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => res.data).catch((err) => err)

    if (userData.code) {
      return null
    }

    if (!userData.avatar) userData.avatar = 'https://support.guilded.gg/hc/article_attachments/4421394253207/profile_4.png'

    return new User({
      server: { id: serverId },
      ...userData.member.user,
      token
    })
  }

  /**
   * Get a member from the API
   * @param {String} userId
   * @param {String} serverId
   * @param {String} token
   * @returns {Member} The member object
   */
  async getMember (userId, serverId, token) {
    const { Member } = require('../classes/user/Member')
    const memberData = await axios.get(
      `${endpoints.SERVER_MEMBERS(serverId, userId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => res.data).catch((err) => err)

    if (memberData.code) return null

    return new Member(memberData.member)
  }
})()
