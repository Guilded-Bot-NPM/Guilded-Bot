const User = require("../user/user.js");

class MemberUpdated {
    /**
     * MemberUpdate constructor
     * @param {String} serverId The server id of the member update
     * @param {Object} userInfo The user info
     * @param {String} userInfo.id The user id of the user who was updated
     * @param {String | undefined} userInfo.nickname The username of the user who was updated
     * @returns {MemberUpdate<String, String, String | undefined, User>} The server id of the member update, the user id of the user who was updated, the username of the user who was updated, the user who was updated
     * @private
     */
    constructor(userUpdateData, Client) {

        /**
         * Client instance
         * @type {Client}
         * @readonly
         */
        this.client = Client;

        /**
         * The server id of the member update
         * @type {String}
         * @readonly
         * @private
         */
        this.serverId = userUpdateData.serverId;
        
        /**
         * The user ID of the user who was updated
         * @type {String}
         * @readonly
         * @private
         */
        this.userId = userUpdateData.userInfo.id;

        /**
         * The username of the user who was updated
         * @type {String | undefined}
         * @readonly
         * @private
         */
        this.username = userUpdateData.userInfo?.nickname ?? undefined;

        /**
         * The user object of the user who was updated
         * @type {User}
         * @readonly
         * @private
         */
        this.user = new User(userUpdateData.userInfo, Client);

    }
}

module.exports = MemberUpdated;