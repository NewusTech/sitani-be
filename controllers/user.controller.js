const { RolePermissions, UserKecamatan, UserRoles, Kecamatan, Role, User, sequelize } = require('../models');
const { customMessages, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const passwordHash = require('password-hash');
const { Op } = require('sequelize');

const v = new Validator({
    messages: customMessages
});

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                email: {
                    type: "email",
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
                    positive: true,
                    integer: true,
                },
                pangkat: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
                role_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                kecamatan_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const { kecamatan_id, password, pangkat, role_id, email, name, nip } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const role = await Role.findByPk(role_id);

            if (!role) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: 'Role tidak dapat ditemukan',
                        field: 'role_id',
                    },
                ]));
                return;
            }

            const korluhCek = await RolePermissions.count({
                where: {
                    roleId: role.id,
                    permissionId: {
                        [Op.or]: {
                            [Op.gte]: 35,
                            [Op.lte]: 54,
                        }
                    }
                }
            });

            if (!kecamatan && korluhCek) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: 'Kecamatan tidak dapat ditemukan',
                        field: 'kecamatan_id',
                    },
                ]));
                return;
            }

            const user = await User.create({
                password: passwordHash.generate(password),
                nip: String(nip),
                pangkat,
                email,
                name,
            });

            await UserRoles.create({
                roleId: role.id,
                userId: user.id,
            });

            if (korluhCek) {
                await UserKecamatan.create({
                    kecamatanId: kecamatan.id,
                    userId: user.id,
                });
            }

            await transaction.commit();

            res.status(201).json(response(201, 'Pengguna berhasil ditambahkan'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Tidak dapat menambahkan pengguna, email atau nip sudah digunakan',
                        field: 'email',
                    },
                    {
                        type: 'duplicate',
                        message: 'Tidak dapat menambahkan pengguna, email atau nip sudah digunakan',
                        field: 'nip',
                    },
                ]));
            } else {
                // res.status(500).json(response(500, 'Internal server error'));
                res.status(500).json(response(500, err.message));
            }
        }
    },

    getAll: async (req, res) => {
        try {
            const users = await User.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatans',
                    },
                    {
                        model: Role,
                        as: 'roles',
                    }
                ],
                attributes: { exclude: ['password'] },
            });

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar pengguna', users));
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

            const user = await User.findOne({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatans',
                    },
                    {
                        model: Role,
                        as: 'roles',
                    }
                ],
                attributes: { exclude: ['password'] },
                where: { id },
            });

            if (!user) {
                res.status(404).json(response(404, 'Pengguna tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan pengguna', user));
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
            const { id } = req.params;

            const user = await User.findOne({
                where: { id },
            });

            const schema = {
                email: {
                    type: "email",
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
                role_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                kecamatan_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
            };

            const validate = v.validate(req.body, schema);

            if (!user) {
                res.status(404).json(response(404, 'Pengguna tidak dapat ditemukan'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let { kecamatan_id, password, pangkat, role_id, email, name, nip } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const role = await Role.findByPk(role_id);

            if (!role) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: 'Role tidak dapat ditemukan',
                        field: 'role_id',
                    },
                ]));
                return;
            }

            const korluhCek = await RolePermissions.count({
                where: {
                    roleId: role.id,
                    permissionId: {
                        [Op.or]: {
                            [Op.gte]: 35,
                            [Op.lte]: 54,
                        }
                    }
                }
            });

            if (!kecamatan && korluhCek) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: 'Kecamatan tidak dapat ditemukan',
                        field: 'kecamatan_id',
                    },
                ]));
                return;
            }

            password = password ? passwordHash.generate(password) : user.password;
            pangkat = pangkat ?? user.pangkat;
            email = email ?? user.email;
            name = name ?? user.name;
            nip = nip ? String(nip) : user.nip;

            await user.update({ password, pangkat, email, name, nip });

            await UserRoles.destroy({
                where: {
                    userId: user.id
                }
            });
            await UserKecamatan.destroy({
                where: {
                    userId: user.id
                }
            });

            await UserRoles.create({
                roleId: role.id,
                userId: user.id,
            });

            if (korluhCek) {
                await UserKecamatan.create({
                    kecamatanId: kecamatan.id,
                    userId: user.id,
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui pengguna'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: 'Tidak dapat menambahkan pengguna, email atau nip sudah digunakan',
                        field: 'email',
                    },
                    {
                        type: 'duplicate',
                        message: 'Tidak dapat menambahkan pengguna, email atau nip sudah digunakan',
                        field: 'nip',
                    },
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
            const { id } = req.params;

            const user = await User.findOne({
                where: { id },
            });

            if (!user) {
                res.status(404).json(response(404, 'Pengguna tidak dapat ditemukan'));
                return;
            }

            await UserRoles.destroy({
                where: {
                    userId: user.id
                }
            });

            await UserKecamatan.destroy({
                where: {
                    userId: user.id
                }
            });

            await user.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus pengguna'));
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