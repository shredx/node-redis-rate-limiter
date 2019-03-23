
const UserNotFoundError = new Error('User not found in REDIS');
UserNotFoundError.code = 404;

const NotMoreKeysError = new Error('Cannot get more than 3 keys');
NotMoreKeysError.code = 403;

const InvalidUserTypeError = new Error('tried to save invalid user type to redis');
InvalidUserTypeError.code = 400;

const InvalidSubscriptionKeyError = new Error('tried to save invalid subscription key to redis');
InvalidSubscriptionKeyError.code = 400;

const DuplicateUserError = new Error('User with email already exists in DB');
DuplicateUserError.code = 409;


module.exports = {
    UserNotFoundError,
    NotMoreKeysError,
    InvalidSubscriptionKeyError,
    InvalidUserTypeError,
    DuplicateUserError
}