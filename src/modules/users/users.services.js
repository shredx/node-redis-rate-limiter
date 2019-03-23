const uuid4 = require('uuid/v4');
const { Redis } = require('../../db');
// const { logger } = require('../../utils');

const UserNotFoundError = new Error('User not found in REDIS');
UserNotFoundError.code = 404;

const NotMoreKeysError = new Error('Cannot get more than 3 keys');
NotMoreKeysError.code = 403;

const InvalidUserTypeError = new Error('tried to save invalid user type to redis');
InvalidUserTypeError.code = 400;

const DuplicateUserError = new Error('User with email already exists in DB');
DuplicateUserError.code = 409;

async function getUserFromRedis(email) {
  return new Promise((resolve, reject) => {
    Redis.get(JSON.stringify(email), (err, reply) => {
      if (err) {
        return reject(err);
      }
      return resolve(JSON.parse(reply));
    });
  });
}

async function saveUserToRedis(user) {
  if (!user.email) {
    throw InvalidUserTypeError;
  }

  return new Promise((resolve, reject) => {
    Redis.set(JSON.stringify(user.email), JSON.stringify(user), (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });
}

async function createNewUser({ name, email }) {
  const user = {
    name,
    email,
    id: uuid4().substr(0, 6),
  };

  // check if user exists in redis
  const userFromDB = await getUserFromRedis(email);

  if (!userFromDB) {
    await saveUserToRedis(user);
  } else if (userFromDB.email === email) {
    throw DuplicateUserError;
  }
  return user;
}

async function createSubscriptonKey({ email }) {
  // if user is not in redis, throw error
  // if user is in redis, check the number of keys he is having
  // if user already has 3 keys, throw error
  // let user = null;

  // eslint-disable-next-line no-console
  console.log('user id from request', email);
  const user = await getUserFromRedis(email);

  if (!user) {
    throw UserNotFoundError;
  }

  if (!user.subscriptonKey) {
    user.subscriptonKey = [{ key: uuid4(), usage: 10 }];
  } else if (user.subscriptonKey.length < 3) {
    user.subscriptonKey.push({ key: uuid4(), usage: 5 });
  } else if (user.subscriptonKey.length === 3) {
    throw NotMoreKeysError;
  }

  // save the user
  await saveUserToRedis(user);

  return user;
}

module.exports = {
  createNewUser,
  createSubscriptonKey,
};
