const { Kecamatan, User } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            let where = {};

            if (req?.root?.userId) {
                const user = await User.findByPk(req.root.userId, {
                    include: [
                        {
                            model: Kecamatan,
                            as: 'kecamatans'
                        }
                    ]
                });

                if (user?.kecamatans?.length) {
                    where.id = user.kecamatans[0].id;
                }
            }

            const kecamatan = await Kecamatan.findAll({
                order: [['nama', 'ASC']],
                where,
            });

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar kecamatan', kecamatan));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    getOne: async (req, res) => {
        try {
            let { id } = req.params;

            id = !isNaN(parseInt(id)) ? parseInt(id) : 0;

            if (req?.root?.userId) {
                const user = await User.findByPk(req.root.userId, {
                    include: [
                        {
                            model: Kecamatan,
                            as: 'kecamatans'
                        }
                    ]
                });

                if (user?.kecamatans?.length) {
                    if (id !== String(user.kecamatans[0].id)) {
                        id = 0;
                    }
                }
            }

            const kecamatan = await Kecamatan.findByPk(id);

            if (!kecamatan) {
                res.status(404).json(response(404, 'Kecamatan tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan kecamatan', kecamatan));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}