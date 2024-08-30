const baseConfig = require('../config/base.config');
const jwt = require('jsonwebtoken');

module.exports = {
	jwtGenerate: (payload, expiresIn) => {
		return jwt.sign(payload, baseConfig.auth_secret, { expiresIn });
	},
}
