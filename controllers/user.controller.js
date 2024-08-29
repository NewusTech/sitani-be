const { User, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const passwordHash = require('password-hash');
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                email: {
                    type: "string",
                    pattern: /^\S+@\S+\.\S+$/,
                    max: 100,
                    min: 1,
                },
                password: {
                    type: "string",
                    max: 100,
                    min: 6,
                },
                name: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
                nip: {
                    type: "number",
                    max: 99999999999,
                    optional: true,
                    positive: true,
                    integer: true,
                },
                pangkat: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
            };

            const validate = v.validate({ password, pangkat, email, name, nip }, schema);

            const { password, pangkat, email, name, nip } = req.body;

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            await User.create({
                password: passwordHash.generate(password),
                pangkat,
                email,
                name,
                nip,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'User created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Cannot created user, please use another email',
                        field: 'email',
                    }
                ]));
            } else {
                res.status(500).json(response(500, 'Internal server error', err));
            }
        }
    },

    getAll: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
            });

            res.status(200).json(response(200, 'Get users successfully', users));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, 'Internal server error', err));
        }
    },

    getOneById: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await User.findOne({
                where: { id },
                attributes: { exclude: ['password'] },
            });

            if (!user) {
                res.status(404).json(response(404, 'User not found'));
                return;
            }

            res.status(200).json(response(200, 'Get user successfully', user));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, 'Internal server error', err));
        }
    },

    update: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;

            const user = await User.findOne({
                where: { id },
            });

            const schema = {
                email: {
                    type: "string",
                    pattern: /^\S+@\S+\.\S+$/,
                    optional: true,
                    max: 100,
                    min: 1,
                },
                password: {
                    type: "string",
                    optional: true,
                    max: 100,
                    min: 6,
                },
                name: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
                nip: {
                    type: "number",
                    max: 99999999999,
                    optional: true,
                    positive: true,
                    integer: true,
                },
                pangkat: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
            };

            let { password, pangkat, email, name, nip } = req.body;

            const validate = v.validate({ password, pangkat, email, name, nip }, schema);

            if (!user) {
                res.status(404).json(response(404, 'User not found'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            password = password ? passwordHash.generate(password) : user.password;
            pangkat = pangkat ?? user.pangkat;
            email = email ?? user.email;
            name = name ?? user.name;
            nip = nip ?? user.nip;

            await user.update({ password, pangkat, email, name, nip });

            await transaction.commit();

            res.status(200).json(response(200, 'Update user successfully'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Cannot updated user, please use another email',
                        field: 'email',
                    }
                ]));
            } else {
                res.status(500).json(response(500, 'Internal server error', err));
            }
        }
    }
}