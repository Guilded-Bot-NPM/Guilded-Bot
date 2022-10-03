const { endpoints } = require("./endpoints");
const axios = require("axios");
const { User: NewUser } = require("../classes/structures/user/user");
const { Member } = require("../classes/structures/user/member");

/**
 * Get the avatar URL of a user
 * @param {User} User The user object
 * @returns {User} The user object
 * @ignore
 */
exports.updateAvatarUser = async (User) => {
  const userData = await axios
    .get(`${endpoints.SERVER_MEMBERS(User.raw.serverId, User.id)}`, {
      headers: {
        Authorization: `Bearer ${User.client.token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data)
    .catch((err) => err);

  if (userData.code) return User;

  const newUser = new NewUser(userData.member.user, User.client);

  // Check properties of new user and old user
  for (const property in newUser) {
    if (newUser[property] !== User[property]) {
      User[property] = newUser[property];
    }
  }

  User.avatar = User.avatar ??
      "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_" +
      Math.floor(Math.random() * 4 + 1) +
      ".png";

  return User;
};

/**
 * Get the banner URL of a user
 * @param {User} User The user object
 * @returns {User} The user object
 * @ignore
 */
exports.updateBannerUser = async (User) => {
  const userData = await axios
    .get(`${endpoints.SERVER_MEMBERS(User.raw.serverId, User.id)}`, {
      headers: {
        Authorization: `Bearer ${User.client.token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data)
    .catch((err) => err);

  if (userData.code) return User;

  const newUser = new NewUser(userData.member.user, User.client);

  // Check properties of new user and old user
  for (const property in newUser) {
    if (newUser[property] !== User[property]) {
      User[property] = newUser[property];
    }
  }

  User.banner = userData.member.user.banner;

  return User;
};

/**
 * Get a member from the API
 * @param {String} userId
 * @param {String} serverId
 * @param {String} token
 * @returns {Member} The member object
 * @ignore
 */
exports.getMember = async (user, client) => {
  const memberData = await axios
    .get(`${endpoints.SERVER_MEMBERS(user.serverId, user.id)}`, {
      headers: {
        Authorization: `Bearer ${client.token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data)
    .catch((err) => err);

  if (memberData.code) return null;

  return new Member(memberData.member, client);
};

/**
 * Get a user from the API
 * @param {Object} user Provicial user object
 * @param {String} user.id The user ID
 * @param {String} user.serverId The server ID
 * @param {String} token The bot token
 * @returns {User} The user object
 * @ignore
 */
exports.getUser = async (user, client) => {
  const userData = await axios
    .get(`${endpoints.SERVER_MEMBERS(user.serverId, user.id)}`, {
      headers: {
        Authorization: `Bearer ${client.token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data)
    .catch((err) => err);

  if (userData.code) return null;

  return new NewUser(userData.member.user, client);
};