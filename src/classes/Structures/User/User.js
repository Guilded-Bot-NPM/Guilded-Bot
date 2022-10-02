const guser = require('../../../helper/members.js')

class User {
  /**
   * User constructor
   * @param {Object} userData The user data
   * @param {String} userData.id The user id
   * @param {String | undefined} userData.botId The bot id
   * @param {Object | undefined} userData.server The server
   * @param {String} userData.server.id The server id
   * @param {String | undefined} userData.type The user type
   * @param {String} userData.name The username of the user
   * @param {String} userData.createdAt The date the user was created
   * @param {URL | undefined} userData.banner The banner of the user
   * @param {URL | undefined} userData.avatar The avatar of the user
   * @return {User<String, String | undefined, Object | undefined, String, String, URL | undefined, URL | undefined>} The user id, the bot id, the server, the user type, the username of the user, the date the user was created, the banner of the user, the avatar of the user
   */
  constructor (userData) {
    this.id = userData.id
    this.username = userData.name
    this.createdAt = userData.createdAt
    this.server = userData.server?.id ? { id: userData.server.id } : null

    if (userData.botId) {
      this.botId = userData.botId
    }

    if (userData.type) {
      this.userType = userData.type
    }

    if (userData.avatar) {
      this.avatarURL = userData.avatar
    }

    if (userData.banner) {
      this.bannerURL = userData.banner
    }

    // raw is all the data that is not used in the class, except for the token
    this.raw = {
      server: userData.server,
      id: userData.id,
      name: userData.name,
      createdAt: userData.createdAt
    }

    // Create function to get user's profile picture
    if (this.server) {
      /**
       * Function will return the user's profile picture
       * @return {string | null} The user's profile picture
       */
      this.getAvatarURL = async () => {
        return (
          (await guser.getUser(this.id, this.server.id, userData.token))
            .avatar ?? null
        )
      }

      /**
       * Function will return the user's banner
       * @return {url | null} The user's banner
       */
      this.getBannerURL = async () => {
        return (
          (await guser.getUser(this.id, this.server.id, userData.token))
            .banner ?? null
        )
      }
    }
  }
}

module.exports.User = User
