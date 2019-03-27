const client = require('../../../db/index');
async function getUserFromRedis(email) {
  return new Promise((resolve, reject) => {
    client.Redis.get(JSON.stringify(email), (err, reply) => {
      if (err) {
        return reject(err);
      }
      return resolve(JSON.parse(reply));
    });
  });
}

async function saveSubscriptionKeyToRedis(subscriptonKey) {
  if (!subscriptonKey.key || !subscriptonKey.email) {
    throw InvalidSubscriptionKeyError;
  }
  return new Promise((resolve, reject) => {
    client.Redis.set(`${subscriptonKey.key}`, JSON.stringify(subscriptonKey), (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(subscriptonKey);
    });
  });
}

async function saveUserToRedis(user) {
  if (!user.email) {
    throw InvalidUserTypeError;
  }
  return new Promise((resolve, reject) => {
    client.Redis.set(JSON.stringify(user.email), JSON.stringify(user), (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });
}

module.exports = {
  getUserFromRedis,
  saveSubscriptionKeyToRedis,
  saveUserToRedis
}