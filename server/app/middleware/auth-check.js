const jwt = require('jsonwebtoken');
var { User } = require('../models');
const config = require('./../../config/auth.json');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }

    // get the last part from a authorization header string like "bearer token-value"
    const token = req.headers.authorization.split(' ')[1];

    // decode the token using a secret key-phrase
    return jwt.verify(token, config.jwtSecret, (err, decoded) => {
        // the 401 code is for unauthorized status
        if (err) { return res.status(401).end(); }

        const userId = decoded.sub;

        // check if a user exists
        User.findOne({ where: { 'UserId': userId } }).then(function (user) {
            if (!user) {
                return res.status(401).end();
            }
            return next();
        }).catch(function (err) {
            if (err)
                return res.status(401).end();
        });
    });
};