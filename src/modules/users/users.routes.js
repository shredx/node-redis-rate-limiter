const userRoutes = require('express').Router();
const { createNewUserController, createSubscriptionKeyController } = require('./users.controller');

userRoutes.post('/users/', createNewUserController);
userRoutes.post('/users/subscriptions', createSubscriptionKeyController);

module.exports = userRoutes;
