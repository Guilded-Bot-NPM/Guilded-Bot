const { UserSummary } = require('./UserSummary');

class MemberBan {
    /**
     * MemberBan constructor
     * @param {Object} banData The ban data
     * @param {Object} banData.serverMemberBan The server member ban data
     * @param {Object} banData.serverMemberBan.user The user who was banned
     * @param {String | undefined} banData.serverMemberBan.reason The reason for the ban
     * @param {String} banData.serverMemberBan.bannedAt The date the user was banned
     * @param {String} banData.serverMemberBan.bannedBy The user who banned the user
     * @returns {MemberBan<UserSummary, String | undefined, String, String>} The user who was banned, the reason for the ban, the date the user was banned, the user who banned the user
     */
    constructor(banData) {
        this.user = new UserSummary(banData.serverMemberBan.user);
        this.bannedAt = banData.serverMemberBan.createdAt;
        this.bannedBy = banData.serverMemberBan.createdBy;
        this.reason = banData.serverMemberBan.reason ?? null;
    }
}

module.exports.MemberBan = MemberBan;