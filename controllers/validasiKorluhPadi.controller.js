const { ValidasiKorluhPadi, KorluhPadi, Kecamatan, User, sequelize } = require('../models');
const { customMessages, dateGenerate, fixedNumber, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator({
    messages: customMessages
});

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

            "hibrida_lahan_sawah_panen",
            "hibrida_lahan_sawah_tanam",
            "hibrida_lahan_sawah_puso",
            "unggul_lahan_sawah_panen",
            "unggul_lahan_sawah_tanam",
            "unggul_lahan_sawah_puso",
            "unggul_lahan_bukan_sawah_panen",
            "unggul_lahan_bukan_sawah_tanam",
            "unggul_lahan_bukan_sawah_puso",
            "jumlah_padi_lahan_sawah_panen",
            "jumlah_padi_lahan_sawah_tanam",
            "jumlah_padi_lahan_sawah_puso",
            "jumlah_padi_lahan_bukan_sawah_panen",
            "jumlah_padi_lahan_bukan_sawah_tanam",
            "jumlah_padi_lahan_bukan_sawah_puso",
        ]) {
            sum[index] = sum[index] !== undefined ? sum[index] : null;
            if (item[index]) {
                sum[index] = sum[index] ? Number(sum[index]) + Number(item[index]) : Number(item[index]);
            }
        }
    });

    sum = fixedNumber(sum);

    if (date !== undefined) {
        return {
            bulan: date.getMonth() + 1,
            tahun: date.getFullYear(),
            kecamatanId: kecamatan?.id,
            kecamatan: kecamatan?.nama,
            status: validasi?.status || 'belum',
            keterangan: validasi?.keterangan,
            ...sum,
        }
    }
    return sum;
}

const combineData = (current, before) => {
    let sum = {};
    if (before === 0) {
        sum = {
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

            bulan_lalu_hibrida_lahan_sawah: 0,
            bulan_lalu_unggul_lahan_sawah: 0,
            bulan_lalu_unggul_lahan_bukan_sawah: 0,
            bulan_lalu_jumlah_padi_lahan_sawah: 0,
            bulan_lalu_jumlah_padi_lahan_bukan_sawah: 0,

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

            akhir_hibrida_lahan_sawah: current.hibrida_lahan_sawah_tanam - current.hibrida_lahan_sawah_panen - current.hibrida_lahan_sawah_puso,
            akhir_unggul_lahan_sawah: current.unggul_lahan_sawah_tanam - current.unggul_lahan_sawah_panen - current.unggul_lahan_sawah_puso,
            akhir_unggul_lahan_bukan_sawah: current.unggul_lahan_bukan_sawah_tanam - current.unggul_lahan_bukan_sawah_panen - current.unggul_lahan_bukan_sawah_puso,
            akhir_jumlah_padi_lahan_sawah: current.jumlah_padi_lahan_sawah_tanam - current.jumlah_padi_lahan_sawah_panen - current.jumlah_padi_lahan_sawah_puso,
            akhir_jumlah_padi_lahan_bukan_sawah: current.jumlah_padi_lahan_bukan_sawah_tanam - current.jumlah_padi_lahan_bukan_sawah_panen - current.jumlah_padi_lahan_bukan_sawah_puso,
        };
    } else {
        sum = {
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

            bulan_lalu_hibrida_lahan_sawah: before.akhir_hibrida_lahan_sawah,
            bulan_lalu_unggul_lahan_sawah: before.akhir_unggul_lahan_sawah,
            bulan_lalu_unggul_lahan_bukan_sawah: before.akhir_unggul_lahan_bukan_sawah,
            bulan_lalu_jumlah_padi_lahan_sawah: before.akhir_jumlah_padi_lahan_sawah,
            bulan_lalu_jumlah_padi_lahan_bukan_sawah: before.akhir_jumlah_padi_lahan_bukan_sawah,

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

            akhir_hibrida_lahan_sawah: before.akhir_hibrida_lahan_sawah + current.hibrida_lahan_sawah_tanam - current.hibrida_lahan_sawah_panen - current.hibrida_lahan_sawah_puso,
            akhir_unggul_lahan_sawah: before.akhir_unggul_lahan_sawah + current.unggul_lahan_sawah_tanam - current.unggul_lahan_sawah_panen - current.unggul_lahan_sawah_puso,
            akhir_unggul_lahan_bukan_sawah: before.akhir_unggul_lahan_bukan_sawah + current.unggul_lahan_bukan_sawah_tanam - current.unggul_lahan_bukan_sawah_panen - current.unggul_lahan_bukan_sawah_puso,
            akhir_jumlah_padi_lahan_sawah: before.akhir_jumlah_padi_lahan_sawah + current.jumlah_padi_lahan_sawah_tanam - current.jumlah_padi_lahan_sawah_panen - current.jumlah_padi_lahan_sawah_puso,
            akhir_jumlah_padi_lahan_bukan_sawah: before.akhir_jumlah_padi_lahan_bukan_sawah + current.jumlah_padi_lahan_bukan_sawah_tanam - current.jumlah_padi_lahan_bukan_sawah_panen - current.jumlah_padi_lahan_bukan_sawah_puso,
        }
    }

    sum = fixedNumber(sum);

    return {
        ...sum,
        ...current,
    }
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
    dataMap, combineData, getSum,

    validate: async (req, res) => {
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
                        message: "Kecamatan tidak dapat ditemukan",
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

            if (
                (bulan.getMonth() >= currentDate.getMonth() && bulan.getFullYear() === currentDate.getFullYear())
                ||
                bulan.getFullYear() > currentDate.getFullYear()
            ) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: "Tidak dapat melakukan validasi diatas atau sama dengan bulan berjalan",
                        field: 'bulan',
                    },
                ]));
                return;
            }

            if (korluhPadiCount === 0) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: "Tidak dapat melakukan validasi saat data kosong",
                        field: 'bulan',
                    },
                ]));
                return;
            }

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

            keterangan = keterangan || null;

            await validasiKorluhPadi[0].update({
                keterangan,
                status,
            });

            // VALIDATOR CREATE

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui status'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    reqValidation: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;

            const validasiKorluhPadi = await ValidasiKorluhPadi.findByPk(id);

            const schema = {
                status: {
                    type: "enum",
                    values: ["tunggu", "tolak"]
                },
            };

            const validate = v.validate(req.body, schema);

            if (!validasiKorluhPadi) {
                res.status(404).json(response(404, 'Validasi korluh padi tidak dapat ditemukan'));
                return;
            }

            if (validasiKorluhPadi.status === 'terima') {
                res.status(403).json(response(403, 'Korluh padi sudah divalidasi'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let { status } = req.body;

            await validasiKorluhPadi.update({
                status,
            })

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui status'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    data: async (req, res) => {
        try {
            let { kecamatan, bulan } = req.query;

            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            kecamatan = isNaN(parseInt(kecamatan)) ? 0 : parseInt(kecamatan);
            bulan = isNaN(new Date(bulan)) ? monthAgo : new Date(bulan);

            const kec = await Kecamatan.findByPk(kecamatan);

            const validasiKorluhPadi = await ValidasiKorluhPadi.findOne({
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            let current = await KorluhPadi.findAll({
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            current = dataMap(current, bulan, kec, validasiKorluhPadi);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan, kecamatan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar korluh padi', current));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}