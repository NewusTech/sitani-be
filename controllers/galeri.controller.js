const { DeleteObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { generatePagination } = require('../pagination/pagination');
const { Galeri, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

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

			res.status(201).json(response(201, 'Galeri created'));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			await transaction.rollback();

			res.status(500).json(response(500, 'Internal server error'));
		}
	},

	getAll: async (req, res) => {
		try {
			let { withPagination, search, limit, page } = req.query;

			limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
			page = isNaN(parseInt(page)) ? 1 : parseInt(page);

			const offset = (page - 1) * limit;

			const order = [['created_at', 'ASC']];

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
				galeri = await Galeri.findAll({
					order,
					where,
				});
			} else {
				galeri = await Galeri.findAll({
					offset: offset,
					limit: limit,
					order,
					where,
				});
				count = await Galeri.count({ where });
				pagination = generatePagination(count, page, limit, '/api/galeri/get');
			}

			res.status(200).json(response(200, 'Get galeri successfully', { data: galeri, pagination }));
		} catch (err) {
			console.log(err);

			logger.error(`Error : ${err}`);
			logger.error(`Error message: ${err.message}`);

			res.status(500).json(response(500, 'Internal server error'));
		}
	},
}