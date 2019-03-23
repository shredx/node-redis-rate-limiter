const uuid4 = require('uuid/v4');
const { Redis } = require('../../db');
const { logger } = require('../../utils');

const UserNotFoundError = new Error('User not found in REDIS');
UserNotFoundError.code = 404;

const NotMoreKeysError = new Error('Cannot get more than 3 keys');
NotMoreKeysError.code = 403;

async function getUserFromRedis(userId) {
  return new Promise((resolve, reject) => {
    Redis.get(JSON.stringify(userId), (err, reply) => {
      if (err) {
        return reject(err);
      }
      return resolve(reply);
    });
  });
}

async function saveUserToRedis(user) {
  return new Promise((resolve, reject) => {
    Redis.set(JSON.stringify(user.id), JSON.stringify(user), (err) => {
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
    id: uuid4(),
  };

  logger.info(user);

  Redis.set(JSON.stringify(user.id), JSON.stringify(user), (err, reply) => {
    if (err) {
      logger.error('Failed to create user in REDIS', err);
      throw err;
    }
    logger.info('User saved in redis', reply);
  });
  return user;
}

async function createSubscriptonKey({ userId }) {
  // if user is not in redis, throw error
  // if user is in redis, check the number of keys he is having
  // if user already has 3 keys, throw error
  // let user = null;

  console.log('user id from request', userId);
  let user = await getUserFromRedis(userId);

  user = JSON.parse(user);

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
