const User = require("../user/user.js");

module.exports = class RolesUpdated {
    /**
     * RolesUpdated constructor
     * @param {String} serverId The server id of the member update
     * @param {Array<Object>} memberRoleIds
     * @param {String} memberRoleIds.userId The user id of the user who was updated
     * @param {Array<Number>} memberRoleIds.roleIds The IDs of the roles that the member currently has after this operation (must have unique items true)
     * @returns {RolesUpdated<String, Object<Array>>} The server id of the member update, the user id of the user who was updated, the IDs of the roles that the member currently has after this operation (must have unique items true)
     * @private
     */
    constructor(rolesUpdateData, Client) {

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
        this.serverId = rolesUpdateData.serverId;

        const newMembers = [];
        for (const member of rolesUpdateData.memberRoleIds) {
            const user = new User({
                id: member.userId,
            }, Client);
            newMembers.push({
                user,
                roleIds: member.roleIds,
            });
        }

        /**
         * The members who were updated
         * @type {Array<Object>}
         * @readonly
         * @private
         */
        this.members = newMembers;

    }
}