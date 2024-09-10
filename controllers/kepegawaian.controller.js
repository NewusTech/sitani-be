const { Kepegawaian, Bidang, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { generatePagination } = require('../pagination/pagination');
const { Op, or } = require('sequelize');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let {withPagination, search, limit, page, bidangId} = req.query
            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
			page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit
			const order = [['created_at', 'DESC']];

            let where = {}
            if (search) {
                where = {
                    ...where,
                    [Op.or] : [
                        {
                            nama: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            nip: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            jabatan: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            pangkat: {
                                [Op.like]: `%${search}%`
                            }
                        }
                    ]
                }
            }

            if (!isNaN(parseInt(bidangId))) {
                where.bidang_id = parseInt(bidangId)
            }

            let pagination = null
            let kepegawaian = []
            let count = 0

            if (withPagination === 'false') {
                kepegawaian = await Kepegawaian.findAll({
                    include : [
                        {
                            model: Bidang,
                            as : 'bidang'
                        }
                    ],
                    order, 
                    where
                })
            } else {
                kepegawaian = await Kepegawaian.findAll({
                    include: [{
                        model: Bidang,
                        as : 'bidang'
                    }],
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
                bidang_id: {
                    type: "number",
                    optional: false
                }
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
                keterangan,
                bidang_id 
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
                keterangan,
                bidang_id 
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
                keterangan,
                bidang_id
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
                include: [{
                    model: Bidang,
                    as : 'bidang'
                }],
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
                bidang_id: {
                    type: "number",
                    optional: true
                }
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
                keterangan,
                bidang_id 
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
                keterangan : keterangan ?? pegawai.keterangan,
                bidang_id : bidang_id ?? pegawai.bidang_id
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

    pensiunGet: async (req, res) => {
        try {
            // #batas pensiun
            // Pejabat Administrasi
            // Pejabat Fungsional Ahli Muda
            // Pejabat Fungsional Ahli Pertama
            // Pejabat Fungsional Keterampilan
            // sama dengan = 58

            // Pejabat Pimpinan Tinggi
            // Pejabat Fungsional Madya
            // sama dengan = 60

            // Pejabat Fungsional Ahli Utama
            // sama dengan = 65

            let {withPagination, limit, page} = req.query
            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit

            let pagination = null
            let count = 0
            let pegawaiAkanPensiun = []
            let pegawaiSudahPensiun = 0
            let totalPegawai = 0

            if (withPagination === 'false') {
                pegawaiAkanPensiun = await Kepegawaian.findAll({
                    include : [
                        {
                            model: Bidang,
                            as : 'bidang'
                        }
                    ],
                    offset: offset,
                    limit: limit,
                    where: sequelize.literal(`
                        (
                            (LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' AND usia >= 58)
                            OR (LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' AND usia >= 60)
                            OR (LOWER(jabatan) LIKE '%ahli utama%' AND usia >= 65)
                        )
                    `),
                    attributes: [
                        'nama',
                        'nip',
                        'jabatan',
                        'usia',
                        'pangkat',
                        'masa_kerja',
                        [sequelize.literal(`
                            CASE 
                                WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN 58
                                WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN 60
                                WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN 65
                            END
                        `), 'batas_usia_pensiun'],
                        
                        [sequelize.literal(`
                            CONCAT(
                                CASE 
                                    WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN (58 - usia)
                                    WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN (60 - usia)
                                    WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN (65 - usia)
                                END,
                                ' tahun ',
                                ROUND(
                                    (
                                        CASE 
                                            WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN (58 * 12) - (usia * 12)
                                            WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN (60 * 12) - (usia * 12)
                                            WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN (65 * 12) - (usia * 12)
                                        END
                                    ), 0) % 12,
                                ' bulan'
                            )
                        `), 'sisa_tahun_bulan_pensiun'],
                        [sequelize.literal(`
                            (
                                CASE 
                                    WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN (58 * 12) - (usia * 12)
                                    WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN (60 * 12) - (usia * 12)
                                    WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN (65 * 12) - (usia * 12)
                                END
                            )
                        `), 'total_bulan_sisa'],
                    ],
                    order: [
                        [sequelize.literal('total_bulan_sisa'), 'ASC']
                    ]
                });
    
                pegawaiSudahPensiun = await Kepegawaian.count({
                    where: sequelize.literal(`
                        (
                            (LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' AND usia >= 58)
                            OR (LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' AND usia >= 60)
                            OR (LOWER(jabatan) LIKE '%ahli utama%' AND usia >= 65)
                        )
                    `),
                });
    
                totalPegawai = await Kepegawaian.count();
            } else {
                pegawaiAkanPensiun = await Kepegawaian.findAll({
                    include : [
                        {
                            model: Bidang,
                            as : 'bidang'
                        }
                    ],
                    offset: offset,
                    limit: limit,
                    where: sequelize.literal(`
                        (
                            (LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' AND usia >= 58)
                            OR (LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' AND usia >= 60)
                            OR (LOWER(jabatan) LIKE '%ahli utama%' AND usia >= 65)
                        )
                    `),
                    attributes: [
                        'nama',
                        'nip',
                        'jabatan',
                        'usia',
                        'pangkat',
                        'masa_kerja',
                        [sequelize.literal(`
                            CASE 
                                WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN 58
                                WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN 60
                                WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN 65
                            END
                        `), 'batas_usia_pensiun'],
                        
                        [sequelize.literal(`
                            CONCAT(
                                CASE 
                                    WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN (58 - usia)
                                    WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN (60 - usia)
                                    WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN (65 - usia)
                                END,
                                ' tahun ',
                                ROUND(
                                    (
                                        CASE 
                                            WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN (58 * 12) - (usia * 12)
                                            WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN (60 * 12) - (usia * 12)
                                            WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN (65 * 12) - (usia * 12)
                                        END
                                    ), 0) % 12,
                                ' bulan'
                            )
                        `), 'sisa_tahun_bulan_pensiun'],
                        [sequelize.literal(`
                            (
                                CASE 
                                    WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN (58 * 12) - (usia * 12)
                                    WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN (60 * 12) - (usia * 12)
                                    WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN (65 * 12) - (usia * 12)
                                END
                            )
                        `), 'total_bulan_sisa'],
                    ],
                    order: [
                        [sequelize.literal('total_bulan_sisa'), 'ASC']
                    ]
                });
    
                pegawaiSudahPensiun = await Kepegawaian.count({
                    where: sequelize.literal(`
                        (
                            (LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' AND usia >= 58)
                            OR (LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' AND usia >= 60)
                            OR (LOWER(jabatan) LIKE '%ahli utama%' AND usia >= 65)
                        )
                    `),
                });
    
                totalPegawai = await Kepegawaian.count();      
                count = await Kepegawaian.count();      
                pagination = generatePagination(count, page, limit, '/api/kepegawaian/dashboard')
            }

            res.status(200).json(response(200, 'Get successfully', { totalPegawai, pegawaiSudahPensiun, pegawaiAkanPensiun, pagination }));

        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, `${err.message}`));
        }
    },

    dataPensiun: async (req, res) => {
        try{
            let {withPagination, limit, page, search, bidangId} = req.query
            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit

            let where = {}
            if (search) {
                where = {
                    ...where,
                    [Op.or] : [
                        {
                            nama: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            nip: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            jabatan: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            pangkat: {
                                [Op.like]: `%${search}%`
                            }
                        }
                    ]
                }
            }

            if (bidangId) {
                where = {
                    ...where,
                    bidang_id: {
                        [Op.eq]: bidangId
                    }
                }
            }

            where = {
                ...where,
                [Op.and] : [
                    sequelize.literal(`
                        (
                            (LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' AND usia >= 58)
                            OR (LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' AND usia >= 60)
                            OR (LOWER(jabatan) LIKE '%ahli utama%' AND usia >= 65)
                        )
                    `)
                ]
            }

            let pagination = null
            let count = 0
            let pegawaiSudahPensiun = []
            if (withPagination === 'false') {
                pegawaiSudahPensiun = await Kepegawaian.findAll({
                    include: [{
                        model: Bidang,
                        as : 'bidang'
                    }],
                    where,
                    attributes: [
                        'nama',
                        'nip',
                        'tempat_lahir',
                        'tgl_lahir',
                        'pangkat',
                        'golongan',
                        'tmt_pangkat',
                        'jabatan',
                        'tmt_jabatan',
                        'nama_diklat',
                        'tgl_diklat',
                        'total_jam',
                        'nama_pendidikan',
                        'tahun_lulus',
                        'usia',
                        'masa_kerja',
                        // Kolom tambahan untuk usia pensiun yang sudah tercapai
                        [sequelize.literal(`
                            CASE 
                                WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN 58
                                WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN 60
                                WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN 65
                            END
                        `), 'usia_pensiun_tercapai']
                    ],
                    order: [
                        ['usia', 'DESC']
                    ]
                })
            }else{
                pegawaiSudahPensiun = await Kepegawaian.findAll({
                    include: [{
                        model: Bidang,
                        as : 'bidang'
                    }],
                    where,
                    attributes: [
                        'nama',
                        'nip',
                        'tempat_lahir',
                        'tgl_lahir',
                        'pangkat',
                        'golongan',
                        'tmt_pangkat',
                        'jabatan',
                        'tmt_jabatan',
                        'nama_diklat',
                        'tgl_diklat',
                        'total_jam',
                        'nama_pendidikan',
                        'tahun_lulus',
                        'usia',
                        'masa_kerja',
                        // Kolom tambahan untuk usia pensiun yang sudah tercapai
                        [sequelize.literal(`
                            CASE 
                                WHEN LOWER(jabatan) LIKE '%ahli muda%' OR LOWER(jabatan) LIKE '%ahli pertama%' OR LOWER(jabatan) LIKE '%keterampilan%' THEN 58
                                WHEN LOWER(jabatan) LIKE '%pimpinan tinggi%' OR LOWER(jabatan) LIKE '%fungsional madya%' THEN 60
                                WHEN LOWER(jabatan) LIKE '%ahli utama%' THEN 65
                            END
                        `), 'usia_pensiun_tercapai']
                    ],

                    order: [
                        ['usia', 'DESC']
                    ]
                })
                count = await Kepegawaian.count();      
                pagination = generatePagination(count, page, limit, '/api/kepegawaian/data-pensiun')
            }

            res.status(200).json(response(200, 'Get successfully', { pegawaiSudahPensiun, pagination }));

        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, `${err.message}`));
        }
    }
}