const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Galeri } = require('../models');

const v = new Validator();

module.exports = {
	getAllWithPagination: async (req, res) => {
		try {
			let { page } = req.query;
			const limit = 6;

			page = page || 1;

			const offset = (page - 1) * limit;

			const [galeri, count] = await Promise.all([
				Galeri.findAll({
					order: [['created_at', 'ASC']],
					offset: offset,
					limit: limit,
				}),
				Galeri.count()
			]);

			const pagination = generatePagination(count, page, limit, '/api/galeri/get');

			res.status(200).json(response(200, 'Get galeri successfully', { data: galeri, pagination }));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			res.status(500).json(response(500, 'Internal server error'));
		}
	},
}