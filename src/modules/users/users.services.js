const uuid4 = require('uuid/v4');
const { Redis } = require('../../db');
// const { logger } = require('../../utils');
const {
  UserNotFoundError, InvalidSubscriptionKeyError,
  InvalidUserTypeError, DuplicateUserError, 
  NotMoreKeysError
} = require('../../constants/errorResponse');

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

async function saveSubscriptionKeyToRedis(subscriptonKey) {
  if (!subscriptonKey.key || !subscriptonKey.email) {
    throw InvalidSubscriptionKeyError;
  }

  return new Promise((resolve, reject) => {
    Redis.set(`${subscriptonKey.key}`, JSON.stringify(subscriptonKey), (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(subscriptonKey);
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

  // create a key
  const subscriptonKey = { email: user.email, key: uuid4(), usage: 10 };

  if (!user.subscriptonKey) {
    user.subscriptonKey = [];
    await saveSubscriptionKeyToRedis(subscriptonKey);
  } else if (user.subscriptonKey.length < 3) {
    // change the usage to 5
    subscriptonKey.usage = 5;
    await saveSubscriptionKeyToRedis(subscriptonKey);
  } else if (user.subscriptonKey.length === 3) {
    throw NotMoreKeysError;
  }
  delete subscriptonKey.email;
  user.subscriptonKey.push(subscriptonKey);
  await saveUserToRedis(user);
  return user;
}

module.exports = {
  createNewUser,
  createSubscriptonKey,
};
