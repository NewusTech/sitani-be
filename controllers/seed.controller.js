const { Permission, Kecamatan, Article, Galeri, Desa, Role, User, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const passwordHash = require('password-hash');
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    user: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const users = [
                {
                    email: "test1@test.com",
                    password: passwordHash.generate('test111'),
                    name: "test 1",
                    nip: 123456789,
                    pangkat: "test 1",
                },
                {
                    email: "test2@test.com",
                    password: passwordHash.generate('test222'),
                    name: "test 2",
                    nip: 234567891,
                    pangkat: "test 2",
                },
                {
                    email: "test3@test.com",
                    password: passwordHash.generate('test333'),
                    name: "test 3",
                    nip: 345678912,
                    pangkat: "test 2",
                },
                {
                    email: "test4@test.com",
                    password: passwordHash.generate('test444'),
                    name: "test 4",
                    nip: 456789123,
                    pangkat: "test 2",
                },
                {
                    email: "test5@test.com",
                    password: passwordHash.generate('test555'),
                    name: "test 5",
                    nip: 567891234,
                    pangkat: "test 2",
                },
            ];

            await User.bulkCreate(users);

            await transaction.commit();

            res.status(201).json(response(201, 'User created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request'));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    permission: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const permissions = [
                {
                    permissionName: "ALL_CREATE",
                    description: "Can create all data",
                },
                {
                    permissionName: "ALL_READ",
                    description: "Can read all data",
                },
                {
                    permissionName: "ALL_UPDATE",
                    description: "Can update all data",
                },
                {
                    permissionName: "ALL_DELETE",
                    description: "Can delete all data",
                },
            ];

            await Permission.bulkCreate(permissions);

            await transaction.commit();

            res.status(201).json(response(201, 'Permission created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request'));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    role: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const roles = [
                {
                    roleName: "SUPER_ADMIN",
                    description: "Super admin have many permissions",
                },
                {
                    roleName: "ADMIN",
                    description: "Admin have some permissions",
                },
            ];

            await Role.bulkCreate(roles);

            await transaction.commit();

            res.status(201).json(response(201, 'Role created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request'));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    artikel: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const articles = [
                {
                    judul: 'Judul 1',
                    slug: 'judul-1',
                    keyword: 'test',
                    excerpt: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                    tag: 'test',
                    altImage: 'test image',
                    status: 0,
                    image: 'test.png',
                    konten: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt tempore eum repudiandae, ad fugit quod odit, eius natus officiis maxime fuga, earum doloribus dolorum quam et veniam quia quasi harum?',
                    createdBy: 1,
                },
                {
                    judul: 'Judul 2',
                    slug: 'judul-2',
                    keyword: 'test',
                    excerpt: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                    tag: 'test',
                    altImage: 'test image',
                    status: 1,
                    image: 'test.png',
                    konten: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt tempore eum repudiandae, ad fugit quod odit, eius natus officiis maxime fuga, earum doloribus dolorum quam et veniam quia quasi harum?',
                    createdBy: 2,
                },
            ];

            await Article.bulkCreate(articles);

            await transaction.commit();

            res.status(201).json(response(201, 'Article created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request'));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    galeri: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const galeri = [
                {
                    image: 'test1.png',
                    deskripsi: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                },
                {
                    image: 'test2.png',
                    deskripsi: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                },
                {
                    image: 'test3.png',
                    deskripsi: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                },
            ];

            await Galeri.bulkCreate(galeri);

            await transaction.commit();

            res.status(201).json(response(201, 'Galeri created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request'));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    kecamatan: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const kecamatan = [
                {
                    nama: "Kecamatan A",
                },
                {
                    nama: "Kecamatan B",
                },
                {
                    nama: "Kecamatan C",
                },
                {
                    nama: "Kecamatan D",
                },
                {
                    nama: "Kecamatan E",
                },
            ];

            await Kecamatan.bulkCreate(kecamatan);

            await transaction.commit();

            res.status(201).json(response(201, 'Kecamatan created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request'));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },

    desa: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const desa = [
                {
                    nama: "Desa A",
                    kecamatanId: 1,
                },
                {
                    nama: "Desa B",
                    kecamatanId: 2,
                },
                {
                    nama: "Desa C",
                    kecamatanId: 3,
                },
                {
                    nama: "Desa D",
                    kecamatanId: 4,
                },
                {
                    nama: "Desa E",
                    kecamatanId: 5,
                },
            ];

            await Desa.bulkCreate(desa);

            await transaction.commit();

            res.status(201).json(response(201, 'Desa created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json(response(400, 'Bad Request'));
            } else {
                res.status(500).json(response(500, 'Internal server error'));
            }
        }
    },
}