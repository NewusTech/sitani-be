const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Desa, User } = require('../models');
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            let { kecamatan } = req.query;

            kecamatan = !isNaN(parseInt(kecamatan)) ? parseInt(kecamatan) : null;

            let where = {};

            if (kecamatan) {
                where.kecamatanId = parseInt(kecamatan);
            }

            if (req?.root?.userId) {
                const user = await User.findByPk(req.root.userId, {
                    include: [
                        {
                            model: Desa,
                            as: 'desas'
                        }
                    ]
                });

                if (user?.desas?.length) {
                    where.id = user.desas[0].id;
                }
            }

            const desa = await Desa.findAll({
                order: [['nama', 'ASC']],
                where,
            });

            res.status(200).json(response(200, 'Get desa successfully', desa));
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
                            model: Desa,
                            as: 'desas'
                        }
                    ]
                });

                if (user?.desas?.length) {
                    if (id !== user.desas[0].id) {
                        id = 0;
                    }
                }
            }

            const desa = await Desa.findByPk(id);

            if (!desa) {
                res.status(404).json(response(404, 'Desa not found'));
                return;
            }

            res.status(200).json(response(200, 'Get desa successfully', desa));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}