const { Role, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                role_name: {
                    type: "string",
                    max: 50,
                    min: 1,
                },
                description: {
                    type: "string",
                    optional: true,
                }
            };

            const { role_name, description } = req.body;

            const validate = v.validate({ role_name, description }, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            await Role.create({
                roleName: role_name,
                description,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Role created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Cannot created role, please use another role name',
                        field: 'role_name',
                    }
                ]));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    getAll: async (req, res) => {
        try {
            const roles = await Role.findAll();

            res.status(200).json(response(200, 'Get roles successfully', roles));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, 'Internal server error'));
        }
    },
}