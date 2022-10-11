const newUser = require("../helper/members.js");

/**
 * Save the user in cache
 * @param {User} User The user object
 * @ignore
 * @private
 */
module.exports.saveUser = (User) => {
  // Check if in cache exists the user, and if the cache have name and avatar
  if (
    global.cache.users.has(User.id) &&
    global.cache.users.get(User.id).username
  ) {
    // Get the old data
    const oldData = global.cache.users.get(User.id);

    // Check if the old data is not the same as the new data
    for (const key in User) {
      // If the old data is not the same as the new data, is not null, not undefined and NaN (Not a number) then update the cache
      if (
        oldData[key] !== User[key] &&
        Boolean(User[key]) &&
        !isNaN(User[key])
      ) {
        oldData[key] = User[key];
      }
    }

    global.cache.users.set(User.id, oldData);

    // Set all data to this
    for (const key in oldData) {
      if (key === "createdTimestamp") continue;

      // If exists in this
      if (User[key] !== undefined && User[key] !== null) {
        User[key] = oldData[key];
      }

      // Check the createdTimestamp, if exist createdAt, and is a date, create the createdTimestamp
      if (key === "createdAt" && User.createdAt instanceof Date) {
        User.createdTimestamp = User.createdAt.getTime();
      }
    }
  } else {
    if (!User.bot) {
      (async () => {
        const user = await newUser.getUser(User);
        if (user) global.cache.users.set(User.id, user);
      })();
    } else {
      global.cache.users.set(User.id, User);
    }
  }
};

/**
 * Return the user from cache
 * @param {User} User The user object
 * @return {User}
 * @ignore
 * @private
 */
module.exports.getUser = (User) => {
  return global.cache.users.get(User.id) || User;
};

/**
 * Check if the user is in cache
 * @param {User} User The user object
 * @return {boolean}
 * @ignore
 * @private
 */
module.exports.hasUser = (User) => {
  return global.cache.users.has(User.id);
};
