const {
  endpoints
} = require("./endpoints");
const NewUser = require("../classes/structures/user/user.js");
const Member = require("../classes/structures/member/member.js");
const {
  GET
} = require("../utils/HTTP.js");

/**
 * Get the avatar URL of a user
 * @param {User} User The user object
 * @returns {User} The user object
 * @ignore
 */
exports.updateAvatarUser = async (User) => {

  const userData = await GET(`${endpoints.SERVER_MEMBERS(User.raw.serverId, User.id)}`, User.client);

  const newUser = new NewUser(userData.member.user, User.client);

  // Check properties of new user and old user
  for (const property in newUser) {
    if (newUser[property] !== User[property] && Boolean(User[property])) {
      User[property] = newUser[property];
    }
  }

  User.client.utils.saveUser(this)

  return User;
};

/**
 * Get the banner URL of a user
 * @param {User} User The user object
 * @returns {User} The user object
 * @ignore
 */
exports.updateBannerUser = async (User) => {
  const userData = await GET(`${endpoints.SERVER_MEMBERS(User.raw.serverId, User.id)}`, User.client);

  const newUser = new NewUser(userData.member.user, User.client);

  // Check properties of new user and old user
  for (const property in newUser) {
    if (newUser[property] !== User[property] && Boolean(User[property])) {
      User[property] = newUser[property];
    }
  }

  User.banner = userData.member.user.banner;

  return User;
};

/**
 * Get a member from the API
 * @param {User} User The user object
 * @returns {Member} The member object
 * @ignore
 */
exports.getMember = async (User) => {
  const userData = await GET(`${endpoints.SERVER_MEMBERS(User.serverId, User.id)}`, User.client);

  const newUser = new Member(userData.member.user, User.client);

  // Check properties of new user and old user
  for (const property in newUser) {
    if (newUser[property] !== User[property] && Boolean(User[property])) {
      User[property] = newUser[property];
    }
  }

  return User;
};

/**
 * Get a user from the API
 * @param {User} User The user object
 * @returns {User} The user object
 * @ignore
 */
exports.getUser = async (User) => {

  const userData = await GET(`${endpoints.SERVER_MEMBERS(User.raw.serverId, User.id)}`, User.client);

  if(userData.status>=400) return User;

  userData.member.user.raw = {
    ...userData.member.user.raw,
    serverId: User.raw.serverId
  }

  const newUser = new NewUser(userData.member.user, User.client);

  return newUser;
};