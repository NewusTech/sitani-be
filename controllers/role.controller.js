const { Permission, Role, sequelize } = require('../models');
const { customMessages, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");

const v = new Validator({
    messages: customMessages
});

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

            res.status(201).json(response(201, 'Role berhasil ditambahkan'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Tidak dapat menambahkan role, nama role sudah digunakan',
                        field: 'role_name',
                    }
                ]));
            } else {
                // res.status(500).json(response(500, 'Internal server error'));
                res.status(500).json(response(500, err.message));
            }
        }
    },

    getAll: async (req, res) => {
        try {
            const roles = await Role.findAll();

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar role', roles));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    getOneById: async (req, res) => {
        try {
            const { id } = req.params;

            const role = await Role.findOne({
                include: [
                    {
                        model: Permission,
                        as: 'permissions'
                    }
                ],
                where: { id },
            });

            if (!role) {
                res.status(404).json(response(404, 'Role tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan role', role));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    update: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            let { id } = req.params;

            id = !isNaN(parseInt(id)) ? parseInt(id) : 0;

            if (id <= 9) {
                res.status(404).json(response(404, 'Role tidak dapat diperbaharui'));
                return;
            }

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
                res.status(404).json(response(404, 'Role tidak dapat ditemukan'));
                return;
            }

            let { role_name, description } = req.body;

            description = description ?? role.description;
            role_name = role_name ?? role.roleName;

            await role.update({ roleName: role_name, description });

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui role'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Tidak dapat memperbaharui role, nama role sudah digunakan',
                        field: 'role_name',
                    }
                ]));
            } else {
                // res.status(500).json(response(500, 'Internal server error'));
                res.status(500).json(response(500, err.message));
            }
        }
    },

    delete: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            let { id } = req.params;

            id = !isNaN(parseInt(id)) ? parseInt(id) : 0;

            if (id <= 9) {
                res.status(404).json(response(404, 'Role tidak dapat dihapus'));
                return;
            }

            const role = await Role.findOne({
                where: { id },
            });

            if (!role) {
                res.status(404).json(response(404, 'Role tidak dapat ditemukan'));
                return;
            }

            await role.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus role'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}