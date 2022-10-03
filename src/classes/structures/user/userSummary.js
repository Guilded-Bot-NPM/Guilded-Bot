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
        /**
         * The user id
         * @type {String}
         * @readonly
         */
        this.id = userData.id;

        /**
         * The username of the user
         * @type {String}
         * @readonly
         */
        this.name = userData.name;

        /**
         * The user type
         * @type {String | null}
         */
        this.userType = userData.type ?? null;

        /**
         * The raw data
         * @type {Object}
         * @readonly
         */
        this.raw = userData;
    }
}

module.exports = UserSummary;
