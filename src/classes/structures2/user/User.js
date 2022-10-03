const member = require("../../../helper/Members.js");

class User {
  /**
   * User constructor
   * @param {Object} userData The user data
   * @param {String} userData.id The user id
   * @param {String | undefined} userData.botId The bot id
   * @param {Object | undefined} userData.serverId The server id
   * @param {String | undefined} userData.type The user type
   * @param {String} userData.name The username of the user
   * @param {String} userData.createdAt The date the user was created
   * @param {URL | undefined} userData.banner The banner of the user
   * @param {URL | undefined} userData.avatar The avatar of the user
   * @param {Client} client The client instance
   * @return {User<String, String | undefined, Object | undefined, String, String, URL | undefined, URL | undefined>} The user id, the bot id, the server, the user type, the username of the user, the date the user was created, the banner of the user, the avatar of the user
   */
  constructor(userData, client) {
    /**
     * The user avatar
     * @type {string}
     * @readonly
     */
    this.avatar =
      userData.avatar ??
      "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_" +
        Math.floor(Math.random() * 4 + 1) +
        ".png";

    /**
     * The user banner
     * @type {string}
     * @readonly
     */
    this.bannerURL = userData.banner ?? null;

    /**
     * The user is a bot
     * @type {boolean}
     * @readonly
     */
    this.bot = userData.botId
      ? true
      : String(userData.type).toLowerCase() === "bot"
      ? true
      : false;

    /**
     * The client instance
     * @type {Client}
     * @readonly
     */
    this.client = client;

    /**
     * The user created at
     * @type {Date}
     * @readonly
     */
    this.createdAt = new Date(userData.createdAt);

    /**
     * The user created at timestamp
     * @type {number}
     */
    this.createdTimestamp = this.createdAt.getTime();

    /**
     * The user default avatar
     * @type {string}
     */
    this.defaultAvatarURL =
      "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_" +
      Math.floor(Math.random() * 4 + 1) +
      ".png";

    /**
     * The user id
     * @type {string}
     * @readonly
     */
    this.id = userData.id;

    /**
     * The user name
     * @type {string}
     * @readonly
     */
    this.username = userData.name;

    /**
     * If the user is a bot, this show the id of user that created the bot
     * @type {string}
     * @readonly
     */
    this.createdBy = userData.createdBy;

    /**
     * The all data withot processing
     * @type {Object}
     */
    this.raw = userData;


    if (global.cache.users.has(this.id)) {
      const oldData = global.cache.users.get(this.id);
      for (const key in this.raw) {
        if (
          this.raw[key] &&
          !oldData.raw[key] &&
          this.raw[key] !== NaN &&
          this.raw[key] !== null &&
          this.raw[key] !== undefined
        ) {
          oldData.raw[key] = this.raw[key];
        }
      }
    } else {
      global.cache.users.set(this.id, this);
    }

    if (userData.serverId) {
      /**
       * Function will return the user's profile picture
       * @return {string}
       */
      this.getAvatarURL = async () => {
        const user = await member.updateAvatarUser(this);
        return user.avatar;
      };

      /**
       * Function will return the user's banner
       * @return {string | null}
       */
      this.getBannerURL = async () => {
        const user = await member.updateBannerUser(this);
        return user.banner;
      };
    }
  }
}

module.exports = User;
