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

            const { password, pangkat, email, name, nip } = req.body;

            const validate = v.validate({ password, pangkat, email, name, nip }, schema);

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
}