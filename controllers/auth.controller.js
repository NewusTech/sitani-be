const { Permission, Role, User } = require('../models');
const { jwtGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const passwordHash = require('password-hash');
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
				email_or_nip: {
					type: "string",
					max: 100,
					min: 1,
				},
			};

			const validate = v.validate(req.body, schema);

			if (validate.length > 0) {
				res.status(400).json(response(400, 'Bad Request', validate));
				return;
			}

			const { password, email_or_nip } = req.body;

			const user = await User.findOne({
				include: [
					{
						model: Role,
						as: 'roles',
						include: [
							{
								model: Permission,
								as: 'permissions'
							}
						]
					}
				],
				where: {
					[Op.or]: [
						{ email: email_or_nip },
						{ nip: email_or_nip }
					]
				},
			});

			let active = true;
			if (!user?.roles?.length) {
				active = false;
			} else if (!user?.roles[0]?.permissions?.length) {
				active = false;
			}

			if (!active) {
				res.status(400).json(response(400, 'Bad Requests', [
					{
						type: 'unauthorized',
						message: "Account doesn't complete",
						field: 'email_or_nip',
					},
				]));
				return;
			}

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

			let permissions = user.roles[0].permissions.map(permission => permission.permissionName);

			let accessToken = jwtGenerate({ sub: user.id, permissions }, 60 * 60 * 24);

			res.status(200).json(response(200, 'Login success', {
				access_token: accessToken,
				user: {
					role: user.roles[0].roleName,
					pangkat: user.pangkat,
					email: user.email,
					name: user.name,
					nip: user.nip,
				},
				permissions
			}));

		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			// res.status(500).json(response(500, 'Internal server error'));
			res.status(500).json(response(500, err.message));
		}
	},

	userPermissions: async (req, res) => {
		try {
			const user = await User.findOne({
				include: [
					{
						model: Role,
						as: 'roles',
						include: [
							{
								model: Permission,
								as: 'permissions'
							}
						]
					}
				],
				where: {
					id: req?.root?.userId
				},
			});

			let permissions = user?.roles[0]?.permissions?.map(permission => permission?.permissionName);

			res.status(200).json(response(200, 'Success get user permissions', permissions));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			// res.status(500).json(response(500, 'Internal server error'));
			res.status(500).json(response(500, err.message));
		}
	},
}