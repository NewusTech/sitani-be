const { response } = require('../helpers/response.formatter');
const baseConfig = require('../config/base.config');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

const checkPermissionAndLogout = (allowPermission) => async (req, res, next) => {
    let token;
    try {
        token = req.headers.authorization.split(' ')[1];
    } catch (err) {
        res.status(403).json(response(403, 'Unauthorized: invalid or missing token'));
        return;
    }

    if (!token) {
        res.status(403).json(response(403, 'Unauthorized: token not found'));
        return;
    }

    jwt.verify(token, baseConfig.auth_secret, async (err, decoded) => {
        if (err) {
            res.status(403).json(response(403, 'Unauthorized: token expired or invalid'));
            return;
        }

        const user = await User.findOne({ where: { id: decoded.sub } });

        if (!user) {
            res.status(403).json(response(403, 'Unauthorized: user cannot found'));
            return;
        }

        let cek = false;
        for (let permission of allowPermission) {
            const temp = decoded.permissions.includes(permission);
            if (temp) {
                cek = true;
                break;
            }
        }

        if (cek) {
            req.root = { userId: user.id };
            next();
        } else {
            res.status(403).json(response(403, 'Forbidden: insufficient access rights'));
        }
    });
};

const checkRoles = () => async (req, res, next) => {
    let token;
    try {
        token = req.headers.authorization.split(' ')[1];
    } catch (err) {
    }

    jwt.verify(token, baseConfig.auth_secret, async (err, decoded) => {
        data = decoded;
        next();
    });
};

module.exports = {
    checkPermissionAndLogout, checkRoles
};
