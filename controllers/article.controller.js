const { DeleteObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { generatePagination } = require('../pagination/pagination');
const { Article, User, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	useAccelerateEndpoint: true,
	credentials: {
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	},
});

module.exports = {
	create: async (req, res) => {
		const transaction = await sequelize.transaction();

		try {
			const schema = {
				judul: {
					type: "string",
					max: 255,
					min: 1,
				},
				image: {
					type: "string",
					min: 1,
				},
				konten: {
					type: "string",
					max: 65000,
					min: 1,
				},
			};

			const { judul, konten } = req.body;

			let mimetypeTemp, bufferTemp, uniqueFilenameTemp;
			let articleObj = { konten, judul };

			const files = req.files;
			const key = 'image';

			if (files[key] && files[key][0]) {
				const file = files[key][0];
				const { mimetype, buffer, originalname } = file;

				const now = new Date();
				const timestamp = now.toISOString().replace(/[-:.]/g, '');
				const uniqueFilename = `${originalname.split('.')[0]}_${timestamp}`;

				articleObj[key] = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.PATH_AWS}/acticles/${uniqueFilename}`;

				uniqueFilenameTemp = uniqueFilename;
				mimetypeTemp = mimetype;
				bufferTemp = buffer;
			}

			const validate = v.validate(articleObj, schema);

			if (validate.length > 0) {
				res.status(400).json(response(400, 'Bad Request', validate));
				return;
			}

			articleObj['excerpt'] = konten.length > 25 ? konten.substring(0, 25) : konten;
			articleObj['slug'] = judul.toLocaleLowerCase().replaceAll(' ', '-');
			articleObj['status'] = true;

			await Article.create(articleObj);

			if (uniqueFilenameTemp && bufferTemp && mimetypeTemp) {
				const uploadParams = {
					Bucket: process.env.AWS_S3_BUCKET,
					Key: `${process.env.PATH_AWS}/acticles/${uniqueFilenameTemp}`,
					Body: Buffer.from(bufferTemp),
					ACL: 'public-read',
					ContentType: mimetypeTemp
				};
				const command = new PutObjectCommand(uploadParams);
				await s3Client.send(command);
			}

			await transaction.commit();

			res.status(201).json(response(201, 'Article created'));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			await transaction.rollback();

			if (err.name === 'SequelizeUniqueConstraintError') {
				res.status(400).json(response(400, 'Bad Request', [
					{
						type: 'duplicate',
						message: 'Cannot created article, please use another title',
						field: 'judul',
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
			let { withPagination, search, limit, page } = req.query;

			limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
			page = isNaN(parseInt(page)) ? 1 : parseInt(page);

			const offset = (page - 1) * limit;

			const order = [['createdAt', 'ASC']];

			let where = {};
			if (search) {
				where = {
					[Op.or]: {
						judul: { [Op.like]: `%${search}%` },
						slug: { [Op.like]: `%${search}%` },
						keyword: { [Op.like]: `%${search}%` },
						tag: { [Op.like]: `%${search}%` },
						konten: { [Op.like]: `%${search}%` },
					}
				};
			}

			let pagination = null;
			let articles = [];
			let count = 0;

			if (withPagination === 'false') {
				articles = await Article.findAll({
					include: [
						{
							model: User,
							attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
							as: 'user',
						},
					],
					order,
					where,
				});
			} else {
				articles = await Article.findAll({
					include: [
						{
							model: User,
							attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
							as: 'user',
						},
					],
					offset: offset,
					limit: limit,
					order,
					where,
				});
				count = await Article.count({ where });
				pagination = generatePagination(count, page, limit, '/api/article/get');
			}

			res.status(200).json(response(200, 'Get articles successfully', { data: articles, pagination }));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			// res.status(500).json(response(500, 'Internal server error'));
			res.status(500).json(response(500, err.message));
		}
	},

	getOneBySlug: async (req, res) => {
		try {
			const { slug } = req.params;

			const article = await Article.findOne({
				where: { slug },
				include: [
					{
						model: User,
						attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
						as: 'user',
					},
				],
			});

			if (!article) {
				res.status(404).json(response(404, 'Article not found'));
				return;
			}

			res.status(200).json(response(200, 'Get article successfully', article));
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
			const { slug } = req.params;

			const article = await Article.findOne({
				where: { slug },
			});

			const schema = {
				judul: {
					type: "string",
					optional: true,
					max: 255,
					min: 1,
				},
				image: {
					type: "string",
					optional: true,
					min: 1,
				},
				konten: {
					type: "string",
					optional: true,
					max: 65000,
					min: 1,
				},
			};

			let { judul, konten } = req.body;

			let uniqueFilenameTemp, mimetypeTemp, bufferTemp;
			let articleObj = { konten, judul };

			const files = req.files;
			const key = 'image';

			if (files) {
				if (files[key] && files[key][0]) {
					const file = files[key][0];
					const { mimetype, buffer, originalname } = file;

					const now = new Date();
					const timestamp = now.toISOString().replace(/[-:.]/g, '');
					const uniqueFilename = `${originalname.split('.')[0]}_${timestamp}`;

					articleObj[key] = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.PATH_AWS}/acticles/${uniqueFilename}`;

					uniqueFilenameTemp = uniqueFilename;
					mimetypeTemp = mimetype;
					bufferTemp = buffer;
				}
			}

			const validate = v.validate(articleObj, schema);

			if (validate.length > 0) {
				res.status(400).json(response(400, 'Bad Request', validate));
				return;
			}

			if (!article) {
				res.status(404).json(response(404, 'Article not found'));
				return;
			}

			let oldImage = article?.image;

			if (konten) {
				articleObj['excerpt'] = konten?.length > 25 ? konten.substring(0, 25) : konten;
			}
			if (judul) {
				articleObj['slug'] = judul.toLocaleLowerCase().replaceAll(' ', '-');
			}

			await article.update(articleObj);

			if (uniqueFilenameTemp && bufferTemp && mimetypeTemp) {
				const uploadParams = {
					Bucket: process.env.AWS_S3_BUCKET,
					Key: `${process.env.PATH_AWS}/acticles/${uniqueFilenameTemp}`,
					Body: Buffer.from(bufferTemp),
					ACL: 'public-read',
					ContentType: mimetypeTemp
				};
				const putCommand = new PutObjectCommand(uploadParams);

				await s3Client.send(putCommand);

				const length = 8 + process.env.AWS_S3_BUCKET.length + 4 + process.env.AWS_REGION.length + 15 + process.env.PATH_AWS.length + 10;

				if (oldImage?.length > length) {
					const oldImageName = oldImage.substring(length, oldImage.length);
					const deleteCommand = new DeleteObjectCommand({
						Bucket: process.env.AWS_S3_BUCKET,
						Key: `${process.env.PATH_AWS}/acticles/${oldImageName}`,
					});

					await s3Client.send(deleteCommand);
				}
			}

			await transaction.commit();

			res.status(200).json(response(200, 'Update article successfully'));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			await transaction.rollback();

			if (err.name === 'SequelizeUniqueConstraintError') {
				res.status(400).json(response(400, 'Bad Request', [
					{
						type: 'duplicate',
						message: 'Cannot updated article, please use another title',
						field: 'judul',
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
			const { slug } = req.params;

			const article = await Article.findOne({
				where: { slug },
			});

			if (!article) {
				res.status(404).json(response(404, 'Article not found'));
				return;
			}

			const oldImage = article.image;

			await article.destroy();

			const length = 8 + process.env.AWS_S3_BUCKET.length + 4 + process.env.AWS_REGION.length + 15 + process.env.PATH_AWS.length + 10;

			if (oldImage?.length > length) {
				const oldImageName = oldImage.substring(length, oldImage.length);
				const deleteCommand = new DeleteObjectCommand({
					Bucket: process.env.AWS_S3_BUCKET,
					Key: `${process.env.PATH_AWS}/acticles/${oldImageName}`,
				});

				await s3Client.send(deleteCommand);
			}

			await transaction.commit();

			res.status(200).json(response(200, 'Delete article successfully'));
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