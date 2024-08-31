const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Article, User } = require('../models');
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
	getAllWithPagination: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = 6;

			const offset = (page - 1) * limit;

			const [articles, count] = await Promise.all([
				Article.findAll({
					include: [
						{
							model: User,
							attributes: { exclude: ['password'] },
							as: 'User',
						},
					],
					limit: limit,
					offset: offset,
					order: [['created_at', 'ASC']],
				}),
				Article.count()
			]);

			const pagination = generatePagination(count, page, limit, '/api/article/get');

			res.status(200).json(response(200, 'Get articles successfully', { data: articles, pagination }));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			res.status(500).json(response(500, 'Internal server error'));
		}
	},
}