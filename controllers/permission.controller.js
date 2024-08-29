const { Permission, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                permission_name: {
                    type: "string",
                    max: 50,
                    min: 1,
                },
                description: {
                    type: "string",
                    optional: true,
                }
            };

            const { permission_name, description } = req.body;

            const validate = v.validate({ permission_name, description }, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            await Permission.create({
                permissionName: permission_name,
                description,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Permission created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Cannot created permission, please use another permission name',
                        field: 'permission_name',
                    }
                ]));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    getAll: async (req, res) => {
        try {
            const permissions = await Permission.findAll();

            res.status(200).json(response(200, 'Get permissions successfully', permissions));
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

            const permission = await Permission.findOne({
                where: { id },
            });

            if (!permission) {
                res.status(404).json(response(404, 'Permission not found'));
                return;
            }

            res.status(200).json(response(200, 'Get permission successfully', permission));
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

            const permission = await Permission.findOne({
                where: { id },
            });

            const schema = {
                permission_name: {
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

            let { permission_name, description } = req.body;

            const validate = v.validate({ permission_name, description }, schema);

            if (!permission) {
                res.status(404).json(response(404, 'Permission not found'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            permission_name = permission_name ?? permission.permissionName;
            description = description ?? permission.description;

            await permission.update({ permissionName: permission_name, description });

            await transaction.commit();

            res.status(200).json(response(200, 'Update permission successfully'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Cannot updated permission, please use another permission name',
                        field: 'permission_name',
                    }
                ]));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },
}