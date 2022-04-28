class User {
    constructor(userData) {

        if (userData.id) {
            this.id = userData.id;
        }

        if (userData.serverId) {
            this.serverId = userData.serverId;
        }
        if (userData.type) {
            this.userType = userData.type;
        }
        if (userData.name) {
            this.name = userData.name;
        }
        if (userData.createdAt) {
            this.createdAt = userData.createdAt;
        }

        if (userData.avatar) {
            this.avatar = userData.avatar;
        }

        if (userData.banner) {
            this.banner = userData.banner;
        }

        //Create function to get user's profile picture
        if (this.serverId) {
            const guser = require("../../helper/Members.js");

            this.avatarURL = async () => {
                return (await guser.getUser(this.id, this.serverId, userData.token)).avatar;
            }

            this.bannerURL = async () => {
                return (await guser.getUser(this.id, this.serverId, userData.token)).banner;
            }
        }
    }
}

module.exports.User = User;