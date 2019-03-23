function validateCreateUserRequest(req) {
  req
    .checkBody('email', 'user email is required/invalid')
    .isEmail()
    .exists();
  req
    .checkBody('name', 'user name is required')
    .isString()
    .isLength({ min: 3 })
    .exists();

  return req.validationErrors();
}

function validateCreateSubscriptionKeyRequest(req) {
  req
    .checkBody('email', 'user email is required/invalid')
    .isEmail()
    .exists();
  return req.validationErrors();
}

module.exports = {
  validateCreateUserRequest,
  validateCreateSubscriptionKeyRequest,
};
