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

            const validate = v.validate(req.body, schema);
            
            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }
            
            const { role_name, description } = req.body;

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

    getOneById: async (req, res) => {
        try {
            const { id } = req.params;

            const role = await Role.findOne({
                where: { id },
            });

            if (!role) {
                res.status(404).json(response(404, 'Role not found'));
                return;
            }

            res.status(200).json(response(200, 'Get role successfully', role));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, 'Internal server error'));
        }
    },

    update: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;

            const role = await Role.findOne({
                where: { id },
            });

            const schema = {
                role_name: {
                    type: "string",
                    optional: true,
                    max: 50,
                    min: 1,
                },
                description: {
                    type: "string",
                    optional: true,
                }
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }
            
            if (!role) {
                res.status(404).json(response(404, 'Role not found'));
                return;
            }
            
            let { role_name, description } = req.body;

            description = description ?? role.description;
            role_name = role_name ?? role.roleName;

            await role.update({ roleName: role_name, description });

            await transaction.commit();

            res.status(200).json(response(200, 'Update role successfully'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Cannot updated role, please use another role name',
                        field: 'role_name',
                    }
                ]));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    delete: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;

            const role = await Role.findOne({
                where: { id },
            });

            if (!role) {
                res.status(404).json(response(404, 'Role not found'));
                return;
            }

            await role.destroy();

            await transaction.commit();
            
            res.status(200).json(response(200, 'Delete role successfully'));
        } catch (err) {
            console.log(err);
            
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            
            await transaction.rollback();

            res.status(500).json(response(500, 'Internal server error'));
        }
    },
}