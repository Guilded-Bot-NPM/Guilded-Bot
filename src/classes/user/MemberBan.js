const { UserSummary } = require('./UserSummary');

class MemberBan {
    constructor(banData) {
        if (banData.serverMemberBan.user) {
            this.user = new UserSummary(banData.serverMemberBan.user);
        } else {
            this.user = null;
        }
        if (banData.serverMemberBan.reason) {
            this.reason = banData.serverMemberBan.reason;
        } else {
            this.reason = null;
        }
        if (banData.serverMemberBan.createdAt) {
            this.bannedAt = banData.serverMemberBan.createdAt;
        } else {
            this.bannedAt = null;
        }
        if (banData.serverMemberBan.createdBy) {
            this.bannedBy = banData.serverMemberBan.createdBy;
        }
    }
}

module.exports.MemberBan = MemberBan;