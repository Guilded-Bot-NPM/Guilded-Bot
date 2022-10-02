const { User } = require("./user");

class Member {
  /**
   * Member constructor
   * @param {Object} memberData The member data
   * @param {User} memberData.user The user
   * @param {Array<number>} memberData.roleIds The role ids
   * @param {String | undefined} memberData.nickname The nickname of the user
   * @param {Date} memberData.joinedAt The date the user joined the server
   * @param {boolean | undefined} memberData.isOwner Whether the user is the owner of the server
   * @returns {Member<User, Array<number>, String | undefined, Date, boolean>} The user, the role ids, the nickname of the user, the date the user joined the server, whether the user is the owner of the server
   */
  constructor(memberData) {
    this.userId = memberData.userId;
    this.serverId = memberData.serverId ?? null;
    this.user = new User(memberData.user);
    this.roles = memberData.roleIds ?? [];
    this.nickname = memberData.nickname ?? null;
    this.joinedAt = new Date(memberData.joinedAt);
    this.isOwner = memberData.isOwner ?? false;
    this.raw = memberData;
  }
}

module.exports.Member = Member;
