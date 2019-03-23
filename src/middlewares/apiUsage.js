const { Redis } = require('../db');
const { CHANNELS } = require('../constants/PubSub');
const { sendResponse } = require('../utils');

async function publishAPIUsage(req, res, next) {
  const subscriptionKey = req.query.skey;

  if (!subscriptionKey) {
    return sendResponse(res, 401, { tokenExpired: 0 }, 'Subscription key is required');
  }
  Redis.publish(CHANNELS.API_USAGE, `${subscriptionKey}`);
  return next();
}

module.exports = publishAPIUsage;
