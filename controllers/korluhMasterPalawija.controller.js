const { KorluhMasterPalawija } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            const korluhMasterPalawija = await KorluhMasterPalawija.findAll({
                attributes: { exclude: ['korluhMasterPalawijaId'] },
                where: { korluhMasterPalawijaId: null },
                include: [
                    {
                        attributes: { exclude: ['korluhMasterPalawijaId'] },
                        model: KorluhMasterPalawija,
                        as: 'anak',
                        include: [
                            {
                                attributes: { exclude: ['korluhMasterPalawijaId'] },
                                model: KorluhMasterPalawija,
                                as: 'anak',
                            }
                        ]
                    }
                ]
            });

            res.status(200).json(response(200, 'Get korluh master palawija successfully', korluhMasterPalawija));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}