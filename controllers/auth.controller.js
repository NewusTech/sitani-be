const { jwtGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const passwordHash = require('password-hash');
const { User } = require('../models');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
	login: async (req, res) => {
		try {
			const schema = {
				password: {
					type: "string",
					max: 100,
					min: 6,
				},
				email_or_nip: [
					{
						type: "string",
						pattern: /^\S+@\S+\.\S+$/,
						max: 100,
						min: 1,
					},
					{
						type: "number",
						max: 99999999999,
						optional: true,
						positive: true,
						integer: true,
					},
				],
			};

			const { password, email_or_nip } = req.body;

			const validate = v.validate({ password, email_or_nip }, schema);

			if (validate.length > 0) {
				res.status(400).json(response(400, 'Bad Request', validate));
				return;
			}

			let user = await User.findOne({
				where: {
					[Op.or]: [
						{ email: email_or_nip },
						{ nip: email_or_nip }
					]
				},
			});

			if (user === null || !passwordHash.verify(password, user?.password)) {
				res.status(400).json(response(400, 'Bad Requests', [
					{
						type: 'wrong',
						message: 'Email or nip or password is wrong',
						field: 'email_or_nip',
					},
					{
						type: 'wrong',
						message: 'Email or nip or password is wrong',
						field: 'password',
					}
				]));
				return;
			}

			let accessToken = jwtGenerate({ sub: user.id }, 60 * 60 * 24);

			res.status(200).json(response(200, 'Login success', { access_token: accessToken }));

		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			res.status(500).json(response(500, 'Internal server error'));
		}
	},
}