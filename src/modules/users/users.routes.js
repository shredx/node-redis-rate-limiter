const userRoutes = require('express').Router();
const {
  createNewUserController,
  createSubscriptionKeyController,
  rateLimitedAPIcontroller,
} = require('./users.controller');
const apiUsage = require('../../middlewares/apiUsage');

userRoutes.post('/users/', createNewUserController);
userRoutes.post('/users/subscriptions', createSubscriptionKeyController);
userRoutes.get('/users/info', apiUsage, rateLimitedAPIcontroller);

module.exports = userRoutes;
