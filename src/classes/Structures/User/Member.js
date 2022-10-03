const User = require("./user");

class Member {
  /**
   * Member constructor
   * @param {Object} memberData The member data
   * @param {User} memberData.user The user
   * @param {Array<number>} memberData.roleIds The role ids
   * @param {String | undefined} memberData.nickname The nickname of the user
   * @param {Date} memberData.joinedAt The date the user joined the server
   * @param {boolean | undefined} memberData.isOwner Whether the user is the owner of the server
   * @param {Client} client The client instance
   * @returns {Member<User, Array<number>, String | undefined, Date, boolean>} The user, the role ids, the nickname of the user, the date the user joined the server, whether the user is the owner of the server
   */
  constructor(memberData, client) {
    /**
     * The user ID
     * @type {string}
     * @readonly
     */
    this.userId = memberData.userId;

    /**
     * The Client instance
     * @type {Client}
     * @readonly
     */
    this.client = client;

    /**
     * The server ID
     * @type {string}
     * @readonly
     */
    this.serverId = memberData.serverId ?? null;

    /**
     * The user
     * @type {User}
     * @readonly
     */
    this.user = new User(memberData.user, client);

    /**
     * The role IDs
     * @type {Array<number>}
     * @readonly
     */
    this.roles = memberData.roleIds ?? [];

    /**
     * The nickname of the user
     * @type {string}
     * @readonly
     */
    this.nickname = memberData.nickname ?? null;

    /**
     * The date the user joined the server
     * @type {Date}
     * @readonly
     */
    this.joinedAt = new Date(memberData.joinedAt);

    /**
     * Whether the user is the owner of the server
     * @type {boolean}
     * @readonly
     */
    this.isOwner = Boolean(memberData.isOwner);

    /**
     * The raw member data
     * @type {Object}
     * @readonly
     */
    this.raw = memberData;
  }
}

module.exports = Member;
