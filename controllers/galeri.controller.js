const { DeleteObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { generatePagination } = require('../pagination/pagination');
const { customMessages, response } = require('../helpers');
const { Galeri, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator({
	messages: customMessages
});

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
				deskripsi: {
					type: "string",
					max: 255,
					min: 1,
				},
				image: {
					type: "string",
					min: 1,
				},
			};

			const { deskripsi } = req.body;

			let mimetypeTemp, bufferTemp, uniqueFilenameTemp;
			let galeriObj = { deskripsi };

			const files = req.files;
			const key = 'image';

			if (files[key] && files[key][0]) {
				const file = files[key][0];
				const { mimetype, buffer, originalname } = file;

				const now = new Date();
				const timestamp = now.toISOString().replace(/[-:.]/g, '');
				const uniqueFilename = `${originalname.split('.')[0]}_${timestamp}`;

				galeriObj[key] = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.PATH_AWS}/galeri/${uniqueFilename}`;

				uniqueFilenameTemp = uniqueFilename;
				mimetypeTemp = mimetype;
				bufferTemp = buffer;
			}

			const validate = v.validate(galeriObj, schema);

			if (validate.length > 0) {
				res.status(400).json(response(400, 'Bad Request', validate));
				return;
			}

			await Galeri.create(galeriObj);

			if (uniqueFilenameTemp && bufferTemp && mimetypeTemp) {
				const uploadParams = {
					Bucket: process.env.AWS_S3_BUCKET,
					Key: `${process.env.PATH_AWS}/galeri/${uniqueFilenameTemp}`,
					Body: Buffer.from(bufferTemp),
					ACL: 'public-read',
					ContentType: mimetypeTemp
				};
				const command = new PutObjectCommand(uploadParams);
				await s3Client.send(command);
			}

			await transaction.commit();

			res.status(201).json(response(201, 'Berhasil menambahkan galeri'));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			await transaction.rollback();

			// res.status(500).json(response(500, 'Internal server error'));
			res.status(500).json(response(500, err.message));
		}
	},

	getAll: async (req, res) => {
		try {
			let { withPagination, search, limit, page } = req.query;

			limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
			page = isNaN(parseInt(page)) ? 1 : parseInt(page);

			let offset = (page - 1) * limit;

			const order = [['createdAt', 'DESC']];

			let where = {};
			if (search) {
				where = {
					deskripsi: { [Op.like]: `%${search}%` },
				};
			}

			let pagination = null;
			let galeri = [];
			let count = 0;

			if (withPagination === 'false') {
				offset = undefined;
				limit = undefined;
			} else {
				count = await Galeri.count({ where });
				pagination = generatePagination(count, page, limit, '/api/galeri/get');
			}

			galeri = await Galeri.findAll({
				offset: offset,
				limit: limit,
				order,
				where,
			});

			res.status(200).json(response(200, 'Berhasil mendapatkan daftar galeri', { data: galeri, pagination }));
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

			const galeri = await Galeri.findOne({
				where: { id },
			});

			if (!galeri) {
				res.status(404).json(response(404, 'Galeri tidak dapat ditemukan'));
				return;
			}

			res.status(200).json(response(200, 'Berhasil mendapatkan galeri', galeri));
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

			const galeri = await Galeri.findOne({
				where: { id },
			});

			const schema = {
				deskripsi: {
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
			};

			const { deskripsi } = req.body;

			let uniqueFilenameTemp, mimetypeTemp, bufferTemp;
			let galeriObj = { deskripsi };

			const files = req.files;
			const key = 'image';

			if (files) {
				if (files[key] && files[key][0]) {
					const file = files[key][0];
					const { mimetype, buffer, originalname } = file;

					const now = new Date();
					const timestamp = now.toISOString().replace(/[-:.]/g, '');
					const uniqueFilename = `${originalname.split('.')[0]}_${timestamp}`;

					galeriObj[key] = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.PATH_AWS}/galeri/${uniqueFilename}`;

					uniqueFilenameTemp = uniqueFilename;
					mimetypeTemp = mimetype;
					bufferTemp = buffer;
				}
			}

			const validate = v.validate(galeriObj, schema);

			if (validate.length > 0) {
				res.status(400).json(response(400, 'Bad Request', validate));
				return;
			}

			if (!galeri) {
				res.status(404).json(response(404, 'Galeri tidak dapat ditemukan'));
				return;
			}

			let oldImage = galeri?.image;

			await galeri.update(galeriObj);

			if (uniqueFilenameTemp && bufferTemp && mimetypeTemp) {
				const uploadParams = {
					Bucket: process.env.AWS_S3_BUCKET,
					Key: `${process.env.PATH_AWS}/galeri/${uniqueFilenameTemp}`,
					Body: Buffer.from(bufferTemp),
					ACL: 'public-read',
					ContentType: mimetypeTemp
				};
				const putCommand = new PutObjectCommand(uploadParams);

				await s3Client.send(putCommand);

				const length = 8 + process.env.AWS_S3_BUCKET.length + 4 + process.env.AWS_REGION.length + 15 + process.env.PATH_AWS.length + 8;

				if (oldImage?.length > length) {
					const oldImageName = oldImage.substring(length, oldImage.length);
					const deleteCommand = new DeleteObjectCommand({
						Bucket: process.env.AWS_S3_BUCKET,
						Key: `${process.env.PATH_AWS}/galeri/${oldImageName}`,
					});

					await s3Client.send(deleteCommand);
				}
			}

			await transaction.commit();

			res.status(200).json(response(200, 'Berhasil memperbaharui galeri'));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			await transaction.rollback();

			// res.status(500).json(response(500, 'Internal server error'));
			res.status(500).json(response(500, err.message));
		}
	},

	delete: async (req, res) => {
		const transaction = await sequelize.transaction();

		try {
			const { id } = req.params;

			const galeri = await Galeri.findOne({
				where: { id },
			});

			if (!galeri) {
				res.status(404).json(response(404, 'Galeri tidak dapat ditemukan'));
				return;
			}

			const oldImage = galeri.image;

			await galeri.destroy();

			const length = 8 + process.env.AWS_S3_BUCKET.length + 4 + process.env.AWS_REGION.length + 15 + process.env.PATH_AWS.length + 8;

			if (oldImage?.length > length) {
				const oldImageName = oldImage.substring(length, oldImage.length);
				const deleteCommand = new DeleteObjectCommand({
					Bucket: process.env.AWS_S3_BUCKET,
					Key: `${process.env.PATH_AWS}/galeri/${oldImageName}`,
				});

				await s3Client.send(deleteCommand);
			}

			await transaction.commit();

			res.status(200).json(response(200, 'Berhasil menghapus galeri'));
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