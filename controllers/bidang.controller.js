const { Bidang, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { generatePagination } = require('../pagination/pagination');
const { Op } = require('sequelize');
const kepegawaian = require('../models/kepegawaian');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let {withPagination, search, limit, page} = req.query
            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
			page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit
			const order = [['created_at', 'DESC']];

            let where = {}
            if (search) {
                where = {
                    nama: {
                        [Op.like]: `%${search}%`
                    }
                }
            }

            let pagination = null
            let bidang = []
            let count = 0

            if (withPagination === 'false') {
                bidang = await Bidang.findAll({
                    order, where
                })
            } else {
                bidang = await Bidang.findAll({
                    offset: offset,
                    limit: limit,
                    order,
                    where
                })

                count = await Bidang.count({ where })
                pagination = generatePagination(count, page, limit, '/api/bidang/get')
            }
           
            res.status(200).json(response(200, 'Get successfully', { data: bidang, pagination}));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, `${err.message}`));
        }
    },
    create: async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const schema = {
                nama: {
                    type: "string"
                }
            };

            const { nama } = req.body;

            const validate = v.validate({ nama }, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let data = await Bidang.create({ nama });
            await transaction.commit();

            res.status(200).json(response(200, 'success created!', data));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            res.status(500).json(response(500, `${err.message}`));
        }
    },
    getOneById: async (req, res) => {
        try {
            const { id } = req.params;

            const bidang = await Bidang.findOne({
                where: { id },
            });

            if (!bidang) {
                res.status(404).json(response(404, 'data not found', bidang));
                return;
            }

            res.status(200).json(response(200, 'get data success', bidang));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, `${err.message}`));
        }
    },

    update: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;

            let bidang = await Bidang.findOne({
                where: { id }
            });

            let schema = {
                nama: {
                    type: "string"
                }
            };

            let { nama } = req.body;

            let validate = v.validate({ nama }, schema);

            if (!bidang) {
                await transaction.rollback();
                return res.status(404).json(response(404, 'Data not found'));
            }

            if (validate.length > 0) {
                await transaction.rollback();
                return res.status(400).json(response(400, 'Bad Request', validate));
            }

            await Bidang.update({ 
                nama : nama ?? bidang.nama
            }, {
                where: { id }
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update data successfully'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            res.status(500).json(response(500, `${err.message}`));
        }
    },

    delete: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;

            const bidang = await Bidang.findOne({
                where: { id },
            });

            if (!bidang) {
                res.status(404).json(response(404, 'data not found'));
                return;
            }

            await bidang.destroy();

            await transaction.commit();
            
            res.status(200).json(response(200, 'Delete successfully'));
        } catch (err) {
            console.log(err);
            
            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);
            
            await transaction.rollback();

            res.status(500).json(response(500, `${err.message}`));
        }
    },
}