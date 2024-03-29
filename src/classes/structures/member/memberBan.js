const UserSummary = require('../user/userSummary.js');

class MemberBan {
    /**
     * MemberBan constructor
     * @param {String} serverId The server id of the member ban
     * @param {Object} banData The ban data
     * @param {Object} banData.serverMemberBan The server member ban data
     * @param {UserSummary} banData.serverMemberBan.user The user who was banned
     * @param {String | undefined} banData.serverMemberBan.reason The reason for the ban
     * @param {String} banData.serverMemberBan.bannedAt The date the user was banned
     * @param {String} banData.serverMemberBan.bannedBy The user who banned the user
     * @returns {MemberBan<UserSummary, String | undefined, String, String>} The user who was banned, the reason for the ban, the date the user was banned, the user who banned the user
     */
    constructor(banData, client) {
        /**
         * The server id of the member ban
         * @type {String}
         * @readonly
         * @private
         */
        this.serverId = banData.serverId;

        /**
         * The client
         * @type {Client}
         * @readonly
         * @private
         */
        this.client = client;

        /**
         * The UserSummary of the user who was banned
         * @type {UserSummary} 
         * @readonly
         * @private
         */
        this.user = new UserSummary(banData.serverMemberBan.user);

        /**
         * The date the user was banned
         * @type {String}
         * @readonly
         * @private
         */
        this.bannedAt = new Date(banData.serverMemberBan.bannedAt);

        /**
         * The user id of the user who banned the user
         * @type {String}
         * @readonly
         */
        this.bannedBy = banData.serverMemberBan.createdBy;

        /**
         * The reason for the ban
         * @type {String | null}
         */
        this.reason = banData.serverMemberBan.reason ?? null;
    }
}

module.exports = MemberBan;
