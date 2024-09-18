const { ValidasiKorluhPadi, KorluhPadi, Kecamatan, sequelize } = require('../models');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const dataMap = (data, date = undefined, kecamatan = undefined, validasi = undefined) => {
    let sum = {};

    data.forEach(item => {
        for (let index of [
            "hibrida_bantuan_pemerintah_lahan_sawah_panen",
            "hibrida_bantuan_pemerintah_lahan_sawah_tanam",
            "hibrida_bantuan_pemerintah_lahan_sawah_puso",
            "hibrida_non_bantuan_pemerintah_lahan_sawah_panen",
            "hibrida_non_bantuan_pemerintah_lahan_sawah_tanam",
            "hibrida_non_bantuan_pemerintah_lahan_sawah_puso",
            "unggul_bantuan_pemerintah_lahan_sawah_panen",
            "unggul_bantuan_pemerintah_lahan_sawah_tanam",
            "unggul_bantuan_pemerintah_lahan_sawah_puso",
            "unggul_bantuan_pemerintah_lahan_bukan_sawah_panen",
            "unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam",
            "unggul_bantuan_pemerintah_lahan_bukan_sawah_puso",
            "unggul_non_bantuan_pemerintah_lahan_sawah_panen",
            "unggul_non_bantuan_pemerintah_lahan_sawah_tanam",
            "unggul_non_bantuan_pemerintah_lahan_sawah_puso",
            "unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen",
            "unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam",
            "unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso",
            "lokal_lahan_sawah_panen",
            "lokal_lahan_sawah_tanam",
            "lokal_lahan_sawah_puso",
            "lokal_lahan_bukan_sawah_panen",
            "lokal_lahan_bukan_sawah_tanam",
            "lokal_lahan_bukan_sawah_puso",
            "sawah_irigasi_lahan_sawah_panen",
            "sawah_irigasi_lahan_sawah_tanam",
            "sawah_irigasi_lahan_sawah_puso",
            "sawah_tadah_hujan_lahan_sawah_panen",
            "sawah_tadah_hujan_lahan_sawah_tanam",
            "sawah_tadah_hujan_lahan_sawah_puso",
            "sawah_rawa_pasang_surut_lahan_sawah_panen",
            "sawah_rawa_pasang_surut_lahan_sawah_tanam",
            "sawah_rawa_pasang_surut_lahan_sawah_puso",
            "sawah_rawa_lebak_lahan_sawah_panen",
            "sawah_rawa_lebak_lahan_sawah_tanam",
            "sawah_rawa_lebak_lahan_sawah_puso",
        ]) {
            sum[index] = sum[index] !== undefined ? sum[index] : null;
            if (item[index]) {
                sum[index] = sum[index] ? sum[index] + item[index] : item[index];
            }
        }
    });

    if (date !== undefined) {
        return {
            bulan: date.getMonth() + 1,
            tahun: date.getFullYear(),
            kecamatan,
            validasi,
            ...sum,
        }
    }
    return sum;
}

const combineData = (current, before) => {
    if (before === 0) {
        return {
            bulan_lalu_hibrida_bantuan_pemerintah_lahan_sawah: 0,
            bulan_lalu_hibrida_non_bantuan_pemerintah_lahan_sawah: 0,
            bulan_lalu_unggul_bantuan_pemerintah_lahan_sawah: 0,
            bulan_lalu_unggul_bantuan_pemerintah_lahan_bukan_sawah: 0,
            bulan_lalu_unggul_non_bantuan_pemerintah_lahan_sawah: 0,
            bulan_lalu_unggul_non_bantuan_pemerintah_lahan_bukan_sawah: 0,
            bulan_lalu_lokal_lahan_sawah: 0,
            bulan_lalu_lokal_lahan_bukan_sawah: 0,
            bulan_lalu_sawah_irigasi_lahan_sawah: 0,
            bulan_lalu_sawah_tadah_hujan_lahan_sawah: 0,
            bulan_lalu_sawah_rawa_pasang_surut_lahan_sawah: 0,
            bulan_lalu_sawah_rawa_lebak_lahan_sawah: 0,

            akhir_hibrida_bantuan_pemerintah_lahan_sawah: current.hibrida_bantuan_pemerintah_lahan_sawah_tanam - current.hibrida_bantuan_pemerintah_lahan_sawah_panen - current.hibrida_bantuan_pemerintah_lahan_sawah_puso,
            akhir_hibrida_non_bantuan_pemerintah_lahan_sawah: current.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam - current.hibrida_non_bantuan_pemerintah_lahan_sawah_panen - current.hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
            akhir_unggul_bantuan_pemerintah_lahan_sawah: current.unggul_bantuan_pemerintah_lahan_sawah_tanam - current.unggul_bantuan_pemerintah_lahan_sawah_panen - current.unggul_bantuan_pemerintah_lahan_sawah_puso,
            akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah: current.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam - current.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen - current.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
            akhir_unggul_non_bantuan_pemerintah_lahan_sawah: current.unggul_non_bantuan_pemerintah_lahan_sawah_tanam - current.unggul_non_bantuan_pemerintah_lahan_sawah_panen - current.unggul_non_bantuan_pemerintah_lahan_sawah_puso,
            akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah: current.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam - current.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen - current.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
            akhir_lokal_lahan_sawah: current.lokal_lahan_sawah_tanam - current.lokal_lahan_sawah_panen - current.lokal_lahan_sawah_puso,
            akhir_lokal_lahan_bukan_sawah: current.lokal_lahan_bukan_sawah_tanam - current.lokal_lahan_bukan_sawah_panen - current.lokal_lahan_bukan_sawah_puso,
            akhir_sawah_irigasi_lahan_sawah: current.sawah_irigasi_lahan_sawah_tanam - current.sawah_irigasi_lahan_sawah_panen - current.sawah_irigasi_lahan_sawah_puso,
            akhir_sawah_tadah_hujan_lahan_sawah: current.sawah_tadah_hujan_lahan_sawah_tanam - current.sawah_tadah_hujan_lahan_sawah_panen - current.sawah_tadah_hujan_lahan_sawah_puso,
            akhir_sawah_rawa_pasang_surut_lahan_sawah: current.sawah_rawa_pasang_surut_lahan_sawah_tanam - current.sawah_rawa_pasang_surut_lahan_sawah_panen - current.sawah_rawa_pasang_surut_lahan_sawah_puso,
            akhir_sawah_rawa_lebak_lahan_sawah: current.sawah_rawa_lebak_lahan_sawah_tanam - current.sawah_rawa_lebak_lahan_sawah_panen - current.sawah_rawa_lebak_lahan_sawah_puso,
            ...current,
        };
    }
    return {
        bulan_lalu_hibrida_bantuan_pemerintah_lahan_sawah: before.akhir_hibrida_bantuan_pemerintah_lahan_sawah,
        bulan_lalu_hibrida_non_bantuan_pemerintah_lahan_sawah: before.akhir_hibrida_non_bantuan_pemerintah_lahan_sawah,
        bulan_lalu_unggul_bantuan_pemerintah_lahan_sawah: before.akhir_unggul_bantuan_pemerintah_lahan_sawah,
        bulan_lalu_unggul_bantuan_pemerintah_lahan_bukan_sawah: before.akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah,
        bulan_lalu_unggul_non_bantuan_pemerintah_lahan_sawah: before.akhir_unggul_non_bantuan_pemerintah_lahan_sawah,
        bulan_lalu_unggul_non_bantuan_pemerintah_lahan_bukan_sawah: before.akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah,
        bulan_lalu_lokal_lahan_sawah: before.akhir_lokal_lahan_sawah,
        bulan_lalu_lokal_lahan_bukan_sawah: before.akhir_lokal_lahan_bukan_sawah,
        bulan_lalu_sawah_irigasi_lahan_sawah: before.akhir_sawah_irigasi_lahan_sawah,
        bulan_lalu_sawah_tadah_hujan_lahan_sawah: before.akhir_sawah_tadah_hujan_lahan_sawah,
        bulan_lalu_sawah_rawa_pasang_surut_lahan_sawah: before.akhir_sawah_rawa_pasang_surut_lahan_sawah,
        bulan_lalu_sawah_rawa_lebak_lahan_sawah: before.akhir_sawah_rawa_lebak_lahan_sawah,

        akhir_hibrida_bantuan_pemerintah_lahan_sawah: before.akhir_hibrida_bantuan_pemerintah_lahan_sawah + current.hibrida_bantuan_pemerintah_lahan_sawah_tanam - current.hibrida_bantuan_pemerintah_lahan_sawah_panen - current.hibrida_bantuan_pemerintah_lahan_sawah_puso,
        akhir_hibrida_non_bantuan_pemerintah_lahan_sawah: before.akhir_hibrida_non_bantuan_pemerintah_lahan_sawah + current.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam - current.hibrida_non_bantuan_pemerintah_lahan_sawah_panen - current.hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
        akhir_unggul_bantuan_pemerintah_lahan_sawah: before.akhir_unggul_bantuan_pemerintah_lahan_sawah + current.unggul_bantuan_pemerintah_lahan_sawah_tanam - current.unggul_bantuan_pemerintah_lahan_sawah_panen - current.unggul_bantuan_pemerintah_lahan_sawah_puso,
        akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah: before.akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah + current.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam - current.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen - current.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
        akhir_unggul_non_bantuan_pemerintah_lahan_sawah: before.akhir_unggul_non_bantuan_pemerintah_lahan_sawah + current.unggul_non_bantuan_pemerintah_lahan_sawah_tanam - current.unggul_non_bantuan_pemerintah_lahan_sawah_panen - current.unggul_non_bantuan_pemerintah_lahan_sawah_puso,
        akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah: before.akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah + current.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam - current.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen - current.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
        akhir_lokal_lahan_sawah: before.akhir_lokal_lahan_sawah + current.lokal_lahan_sawah_tanam - current.lokal_lahan_sawah_panen - current.lokal_lahan_sawah_puso,
        akhir_lokal_lahan_bukan_sawah: before.akhir_lokal_lahan_bukan_sawah + current.lokal_lahan_bukan_sawah_tanam - current.lokal_lahan_bukan_sawah_panen - current.lokal_lahan_bukan_sawah_puso,
        akhir_sawah_irigasi_lahan_sawah: before.akhir_sawah_irigasi_lahan_sawah + current.sawah_irigasi_lahan_sawah_tanam - current.sawah_irigasi_lahan_sawah_panen - current.sawah_irigasi_lahan_sawah_puso,
        akhir_sawah_tadah_hujan_lahan_sawah: before.akhir_sawah_tadah_hujan_lahan_sawah + current.sawah_tadah_hujan_lahan_sawah_tanam - current.sawah_tadah_hujan_lahan_sawah_panen - current.sawah_tadah_hujan_lahan_sawah_puso,
        akhir_sawah_rawa_pasang_surut_lahan_sawah: before.akhir_sawah_rawa_pasang_surut_lahan_sawah + current.sawah_rawa_pasang_surut_lahan_sawah_tanam - current.sawah_rawa_pasang_surut_lahan_sawah_panen - current.sawah_rawa_pasang_surut_lahan_sawah_puso,
        akhir_sawah_rawa_lebak_lahan_sawah: before.akhir_sawah_rawa_lebak_lahan_sawah + current.sawah_rawa_lebak_lahan_sawah_tanam - current.sawah_rawa_lebak_lahan_sawah_panen - current.sawah_rawa_lebak_lahan_sawah_puso,
        ...current,
    };
}

const getSum = async (bulan, kecamatan = undefined) => {
    let where = {};

    if (kecamatan !== undefined) {
        where.kecamatanId = kecamatan;
    }

    let data = await KorluhPadi.findAll({
        where: {
            ...where,
            [Op.and]: [
                sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
            ]
        }
    });

    if (data.length > 0) {
        bulan.setMonth(bulan.getMonth() - 1);

        before = await getSum(bulan, kecamatan);
        data = dataMap(data);

        return combineData(data, before);
    }

    return 0;
}

module.exports = {
    kecVal: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                kecamatan_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                bulan: {
                    type: "date",
                    convert: true,
                },
                status: {
                    type: "enum",
                    values: ["terima", "tolak"]
                },
                keterangan: {
                    type: "string",
                    optional: true,
                }
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                kecamatan_id,
                bulan,
                status,
                keterangan,
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);

            if (!kecamatan) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Kecamatan doesn't exists",
                        field: 'kecamatan_id',
                    },
                ]));
                return;
            }

            bulan = dateGenerate(bulan);
            currentDate = new Date();

            const korluhPadiCount = await KorluhPadi.count({
                where: {
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            const validasiKorluhPadi = await ValidasiKorluhPadi.findOrCreate({
                where: {
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
                defaults: {
                    kecamatanId: kecamatan.id,
                    bulan,
                }
            });

            if (
                (bulan.getMonth() >= currentDate.getMonth() && bulan.getFullYear() === currentDate.getFullYear())
                ||
                bulan.getFullYear() > currentDate.getFullYear()
                ||
                validasiKorluhPadi[0]?.statusTkKabupaten === 'terima'
                ||
                korluhPadiCount === 0
            ) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: "Action failed with the following bulan",
                        field: 'bulan',
                    },
                ]));
                return;
            }

            keterangan = keterangan || validasiKorluhPadi[0].keterangan;

            await validasiKorluhPadi[0].update({
                statusTkKecamatan: status,
                keterangan,
            });

            // VALIDATOR CREATE

            await transaction.commit();

            res.status(200).json(response(200, 'Status validation updated'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    kabVal: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                bulan: {
                    type: "date",
                    convert: true,
                },
                status: {
                    type: "enum",
                    values: ["terima", "tolak"]
                },
                keterangan: {
                    type: "string",
                    optional: true,
                }
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                bulan,
                status,
                keterangan,
            } = req.body;

            bulan = dateGenerate(bulan);
            currentDate = new Date();

            const korluhPadi = await KorluhPadi.findAll({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            const validasiKorluhPadiCount = await ValidasiKorluhPadi.count({
                where: {
                    statusTkKecamatan: 'terima',
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            if (
                (bulan.getMonth() >= currentDate.getMonth() && bulan.getFullYear() === currentDate.getFullYear())
                ||
                bulan.getFullYear() > currentDate.getFullYear()
                ||
                count(korluhPadi) === 0
            ) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: "Action failed with the following bulan",
                        field: 'bulan',
                    },
                ]));
                return;
            }

            let kecamatanIds = [];
            korluhPadi.forEach(item => {
                if (!kecamatanIds.includes(item.kecamatanId)) {
                    kecamatanIds.push(item.kecamatanId);
                }
            });

            if (validasiKorluhPadiCount < count(kecamatanIds)) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: `Action failed because ${count(kecamatanIds) - validasiKorluhPadiCount} kecamatan had not validated`,
                        field: 'bulan',
                    },
                ]));
                return;
            }

            keterangan = keterangan || '';

            await ValidasiKorluhPadi.update({
                statusTkKabupaten: status,
                keterangan,
            }, {
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                }
            });

            // VALIDATOR CREATE

            await transaction.commit();

            res.status(200).json(response(200, 'Status validation updated'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    kecData: async (req, res) => {
        try {
            let { kecamatan, bulan } = req.query;

            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            kecamatan = isNaN(parseInt(kecamatan)) ? 0 : parseInt(kecamatan);
            bulan = isNaN(new Date(bulan)) ? monthAgo : new Date(bulan);


            const validasiKorluhPadi = await ValidasiKorluhPadi.findOne({
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            validasi = validasiKorluhPadi?.statusTkKecamatan || 'belum';

            let current = await KorluhPadi.findAll({
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            current = dataMap(current, bulan, kecamatan, validasi);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan, kecamatan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Get korluh padi successfully', current));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    kabData: async (req, res) => {
        try {
            let { bulan } = req.query;

            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            bulan = isNaN(new Date(bulan)) ? monthAgo : new Date(bulan);


            const validasiKorluhPadi = await ValidasiKorluhPadi.findOne({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            validasi = validasiKorluhPadi?.statusTkKabupaten || 'belum';

            let current = await KorluhPadi.findAll({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            current = dataMap(current, bulan, undefined, validasi);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Get korluh padi successfully', current));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}