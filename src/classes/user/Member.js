const { User } = require('./User');

class Member {
    constructor(memberData) {
        if (memberData.userId) {
            this.userId = memberData.userId;
        }
        if (memberData.serverId) {
            this.serverId = memberData.serverId;
        }
        if (memberData.member) {
            if (memberData.member.user) {
                this.user = new User(memberData.member.user);
            }
        } else {
            this.user = null;
        }
        if (memberData.memberRoleIds) {
            this.roles = memberData.memberRoleIds;
        } else {
            this.roles = null;
        }
        if (memberData.nickname) {
            this.nickname = memberData.nickname;
        } else {
            this.nickname = null;
        }
        if (memberData.joinedAt) {
            this.joinedAt = memberData.joinedAt;
        } else {
            this.joinedAt = null;
        }
        if (memberData.isKick) {
            this.kicked = true;
        } else if (memberData.isKick) {
            this.kicked = false;
        }
        if (memberData.isBan) {
            this.banned = true;
        } else {
            this.banned = false;
        }
        if (memberData.userInfo) {
            this.updatedInfo = {
                id: memberData.userInfo.id,
                nickname: memberData.userInfo.nickname,
            };
        } else {
            this.updatedInfo = null;
        }
    }
}

module.exports.Member = Member;