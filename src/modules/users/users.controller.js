const {
  validateCreateUserRequest,
  validateCreateSubscriptionKeyRequest,
} = require('./users.request.validators');
const { createNewUser, createSubscriptonKey } = require('./users.services');
const { sendResponse, handleCustomError } = require('../../utils');
const ResponseMessages = require('../../constants/responseMessages');

async function createNewUserController(req, res) {
  try {
    const validationErr = validateCreateUserRequest(req);
    if (validationErr) {
      return sendResponse(res, 422, {}, validationErr[0].msg);
    }

    const { email, name } = req.body;

    const data = await createNewUser({
      email,
      name,
    });
    return sendResponse(res, 201, { ...data }, ResponseMessages.genericSuccess);
  } catch (err) {
    return handleCustomError(res, err);
  }
}

async function createSubscriptionKeyController(req, res) {
  try {
    const validationErr = validateCreateSubscriptionKeyRequest(req);
    if (validationErr) {
      return sendResponse(res, 422, {}, validationErr[0].msg);
    }

    const { email } = req.body;

    const data = await createSubscriptonKey({
      email,
    });
    return sendResponse(res, 200, { ...data }, ResponseMessages.genericSuccess);
  } catch (err) {
    return handleCustomError(res, err);
  }
}

module.exports = {
  createNewUserController,
  createSubscriptionKeyController,
};
