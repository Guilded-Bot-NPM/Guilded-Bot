class MemberRemove {
    /**
     * MemberRemove constructor
     * @param {String} serverId The server id of the member remove
     * @param {String} userId The user id of the user who was removed
     * @param {boolean=} isKick Whether the user was kicked or not
     * @param {boolean=} isBan Whether the user was banned or not
     * @returns {MemberRemove<String, String, boolean, boolean>} The server id of the member remove, the user id of the user who was removed, whether the user was kicked or not, whether the user was banned or not
     */
    constructor(userRemoveData, Client) {

        /**
         * Client instance
         * @type {Client}
         * @readonly
         */
        this.client = Client;

        /**
         * The server id of the member ban
         * @type {String}
         * @readonly
         * @private
         */
        this.serverId = userRemoveData.serverId;
        
        /**
         * The user ID of the user who was removed
         * @type {String}
         * @readonly
         * @private
         */
        this.userId = userRemoveData.userId;

        /**
         * The user who was removed are kicked?
         * @type {boolean}
         * @readonly
         * @private
         */
        this.isKick = userRemoveData.isKick ?? false;

        /**
         * The user who was removed are banned?
         * @type {boolean}
         * @readonly
         */
        this.isBan = userRemoveData.isBan ?? false;

    }
}

module.exports = MemberRemove;