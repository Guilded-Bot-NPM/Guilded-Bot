class UserSummary {
    /**
     * UserSummary constructor
     * @param {Object} userData The user data
     * @param {String} userData.id The user id
     * @param {String | undefined} userData.type The user type
     * @param {String} userData.name The username of the user
     * @return {UserSummary<String, String | undefined, String, Object>} The user id, the user type, the username of the user
     */
    constructor(userData) {
        this.id = userData.id;
        this.name = userData.name;
        this.userType = userData.type ?? null;
        this.raw = userData;
    }
}

module.exports.UserSummary = UserSummary;