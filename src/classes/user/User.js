class User {
    raw;
    /* User ID */
    id;
    /* User Type */
    serverId;
  constructor(userData) {
    this.id = userData.id;

    if (userData.botId) {
      this.botId = userData.botId;
    }

    if (userData.serverId) {
      this.serverId = userData.serverId;
    }
    if (userData.type) {
      this.userType = userData.type;
    }
    if (userData.name) {
      this.username = userData.name;
    }
    if (userData.createdAt) {
      this.createdAt = userData.createdAt;
    }

    if (userData.avatar) {
      this.avatarURL = userData.avatar;
    }

    if (userData.banner) {
      this.bannerURL = userData.banner;
    }

    if (userData.createdBy) {
      this.createdBy = userData.createdBy;
    }

    //Create function to get user's profile picture
    if (this.serverId) {
      const guser = require("../../helper/Members.js");

      /*
       *   This function will return the user's profile picture
       *   @return {string} - The user's profile picture
       */
      this.getAvatarURL = async () => {
        return (await guser.getUser(this.id, this.serverId, userData.token))
          .avatar;
      };

      /*
       *   This function will return the user's banner
       *   @return {string} - The user's banner
       *  @return {null} - If the user doesn't have a banner
       */
      this.getBannerURL = async () => {
        return (await guser.getUser(this.id, this.serverId, userData.token))
          .banner;
      };
    }
  }
}

module.exports.User = User;
