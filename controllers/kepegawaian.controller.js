const { Kepegawaian, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { generatePagination } = require('../pagination/pagination');
const { Op } = require('sequelize');

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
            let kepegawaian = []
            let count = 0

            if (withPagination === 'false') {
                kepegawaian = await Kepegawaian.findAll({
                    order, where
                })
            } else {
                kepegawaian = await Kepegawaian.findAll({
                    offset: offset,
                    limit: limit,
                    order,
                    where
                })

                count = await Kepegawaian.count({ where })
                pagination = generatePagination(count, page, limit, '/api/kepegawaian/get')
            }
           
            res.status(200).json(response(200, 'Get successfully', { data: kepegawaian, pagination}));
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
                },
                nip: {
                    type: "number",
                    optional: false
                },
                tempat_lahir: {
                    type: "string",
                    optional: true
                },
                tgl_lahir: {
                    type: "string",
                    optional: true
                },
                pangkat: {
                    type: "string",
                    optional: true
                },
                golongan: {
                    type: "string",
                    optional: true
                },
                tmt_pangkat: {
                    type: "string",
                    optional: true
                },
                jabatan: {
                    type: "string",
                    optional: true
                },
                tmt_jabatan: {
                    type: "string",
                    optional: true
                },
                nama_diklat: {
                    type: "string",
                    optional: true
                },
                tgl_diklat: {
                    type: "string",
                    optional: true
                },
                total_jam: {
                    type: "number",
                    optional: true
                },
                nama_pendidikan: {
                    type: "string",
                    optional: true
                },
                tahun_lulus: {
                    type: "number",
                    optional: true
                },
                jenjang_pendidikan: {
                    type: "string",
                    optional: true
                },
                usia: {
                    type: "string",
                    optional: true
                },
                masa_kerja: {
                    type: "string",
                    optional: true
                },
                keterangan: {
                    type: "string",
                    optional: true
                },
            };

            const { 
                nama,
                nip,
                tempat_lahir,
                tgl_lahir,
                pangkat,
                golongan,
                tmt_pangkat,
                jabatan,
                tmt_jabatan,
                nama_diklat,
                tgl_diklat,
                total_jam,
                nama_pendidikan,
                tahun_lulus,
                jenjang_pendidikan,
                usia,
                masa_kerja,
                keterangan 
            } = req.body;

            const validate = v.validate({ 
                nama,
                nip,
                tempat_lahir,
                tgl_lahir,
                pangkat,
                golongan,
                tmt_pangkat,
                jabatan,
                tmt_jabatan,
                nama_diklat,
                tgl_diklat,
                total_jam,
                nama_pendidikan,
                tahun_lulus,
                jenjang_pendidikan,
                usia,
                masa_kerja,
                keterangan 
            }, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let data = await Kepegawaian.create({
                nama,
                nip,
                tempatLahir : tempat_lahir,
                tglLahir : tgl_lahir,
                pangkat,
                golongan,
                tmtPangkat : tmt_pangkat,
                jabatan,
                tmtJabatan : tmt_jabatan,
                namaDiklat : nama_diklat,
                tglDiklat : tgl_diklat,
                totalJam : total_jam,
                namaPendidikan : nama_pendidikan,
                tahunLulus : tahun_lulus,
                jenjangPendidikan : jenjang_pendidikan,
                usia,
                masaKerja : masa_kerja,
                keterangan
            });
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

            const pegawai = await Kepegawaian.findOne({
                where: { id },
            });

            if (!pegawai) {
                res.status(404).json(response(404, 'data not found', pegawai));
                return;
            }

            res.status(200).json(response(200, 'get data success', pegawai));
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

            let pegawai = await Kepegawaian.findOne({
                where: { id }
            });

            console.log('pegawaiXX', pegawai)
            let schema = {
                nama: {
                    type: "string"
                },
                nip: {
                    type: "number",
                    optional: true
                },
                tempat_lahir: {
                    type: "string",
                    optional: true
                },
                tgl_lahir: {
                    type: "string",
                    optional: true
                },
                pangkat: {
                    type: "string",
                    optional: true
                },
                golongan: {
                    type: "string",
                    optional: true
                },
                tmt_pangkat: {
                    type: "string",
                    optional: true
                },
                jabatan: {
                    type: "string",
                    optional: true
                },
                tmt_jabatan: {
                    type: "string",
                    optional: true
                },
                nama_diklat: {
                    type: "string",
                    optional: true
                },
                tgl_diklat: {
                    type: "string",
                    optional: true
                },
                total_jam: {
                    type: "number",
                    optional: true
                },
                nama_pendidikan: {
                    type: "string",
                    optional: true
                },
                tahun_lulus: {
                    type: "number",
                    optional: true
                },
                jenjang_pendidikan: {
                    type: "string",
                    optional: true
                },
                usia: {
                    type: "string",
                    optional: true
                },
                masa_kerja: {
                    type: "string",
                    optional: true
                },
                keterangan: {
                    type: "string",
                    optional: true
                },
            };

            let { 
                nama,
                nip,
                tempat_lahir,
                tgl_lahir,
                pangkat,
                golongan,
                tmt_pangkat,
                jabatan,
                tmt_jabatan,
                nama_diklat,
                tgl_diklat,
                total_jam,
                nama_pendidikan,
                tahun_lulus,
                jenjang_pendidikan,
                usia,
                masa_kerja,
                keterangan 
            } = req.body;

            let validate = v.validate({ 
                nama,
                nip,
                tempat_lahir,
                tgl_lahir,
                pangkat,
                golongan,
                tmt_pangkat,
                jabatan,
                tmt_jabatan,
                nama_diklat,
                tgl_diklat,
                total_jam,
                nama_pendidikan,
                tahun_lulus,
                jenjang_pendidikan,
                usia,
                masa_kerja,
                keterangan 
            }, schema);

            if (!pegawai) {
                await transaction.rollback();
                return res.status(404).json(response(404, 'Data not found'));
            }

            if (validate.length > 0) {
                await transaction.rollback();
                return res.status(400).json(response(400, 'Bad Request', validate));
            }

            await Kepegawaian.update({ 
                nama : nama ?? pegawai.nama,
                nip : nip ?? pegawai.nip,
                tempat_lahir : tempat_lahir ?? pegawai.tempatLahir,
                tgl_lahir : tgl_lahir ?? pegawai.tglLahir,
                pangkat : pangkat ?? pegawai.pangkat,
                golongan : golongan ?? pegawai.golongan,
                tmt_pangkat : tmt_pangkat ?? pegawai.tmtPangkat,
                jabatan : jabatan ?? pegawai.jabatan,
                tmt_jabatan : tmt_jabatan ?? pegawai.tmtJabatan,
                nama_diklat : nama_diklat ?? pegawai.namaDiklat,
                tgl_diklat : tgl_diklat ?? pegawai.tglDiklat,
                total_jam : total_jam ?? pegawai.totalJam,
                nama_pendidikan : nama_pendidikan ?? pegawai.namaPendidikan,
                tahun_lulus : tahun_lulus ?? pegawai.tahunLulus,
                jenjang_pendidikan : jenjang_pendidikan ?? pegawai.jenjangPendidikan,
                usia : usia ?? pegawai.usia,
                masa_kerja : masa_kerja ?? pegawai.masaKerja,
                keterangan : keterangan ?? pegawai.keterangan
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

            const pegawai = await Kepegawaian.findOne({
                where: { id },
            });

            if (!pegawai) {
                res.status(404).json(response(404, 'data not found'));
                return;
            }

            await pegawai.destroy();

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