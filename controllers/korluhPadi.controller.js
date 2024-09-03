const { KorluhPadi, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    hibrida_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    hibrida_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    hibrida_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    hibrida_non_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    hibrida_non_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    unggul_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    unggul_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    unggul_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
    },
    unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
    },

    unggul_non_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    unggul_non_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    unggul_non_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
    },
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
    },

    lokal_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    lokal_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    lokal_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    lokal_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
    },
    lokal_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    lokal_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
    },

    sawah_irigasi_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    sawah_irigasi_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    sawah_irigasi_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    sawah_tadah_hujan_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    sawah_tadah_hujan_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    sawah_tadah_hujan_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    sawah_rawa_pasang_surut_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    sawah_rawa_pasang_surut_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    sawah_rawa_pasang_surut_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    sawah_rawa_lebak_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    sawah_rawa_lebak_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    sawah_rawa_lebak_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },
}

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                kecamatan_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                },
                desa_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                },
                tanggal: {
                    type: "date",
                    convert: true,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const {
                kecamatan_id,
                desa_id,
                tanggal,
                hibrida_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_bantuan_pemerintah_lahan_sawah_puso,
                hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
                lokal_lahan_sawah_panen,
                lokal_lahan_sawah_tanam,
                lokal_lahan_sawah_puso,
                lokal_lahan_bukan_sawah_panen,
                lokal_lahan_bukan_sawah_tanam,
                lokal_lahan_bukan_sawah_puso,
                sawah_irigasi_lahan_sawah_panen,
                sawah_irigasi_lahan_sawah_tanam,
                sawah_irigasi_lahan_sawah_puso,
                sawah_tadah_hujan_lahan_sawah_panen,
                sawah_tadah_hujan_lahan_sawah_tanam,
                sawah_tadah_hujan_lahan_sawah_puso,
                sawah_rawa_pasang_surut_lahan_sawah_panen,
                sawah_rawa_pasang_surut_lahan_sawah_tanam,
                sawah_rawa_pasang_surut_lahan_sawah_puso,
                sawah_rawa_lebak_lahan_sawah_panen,
                sawah_rawa_lebak_lahan_sawah_tanam,
                sawah_rawa_lebak_lahan_sawah_puso,
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const desa = await Desa.findByPk(desa_id);

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
            if (!desa) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Desa doesn't exists",
                        field: 'desa_id',
                    },
                ]));
                return;
            }

            const korluhPadiExists = await KorluhPadi.findOne({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    kecamatanId: kecamatan_id,
                    desaId: desa_id,
                }
            });

            if (korluhPadiExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh padi, please use another tanggal",
                        field: 'tanggal',
                    },
                ]));
                return;
            }

            await KorluhPadi.create({
                kecamatanId: kecamatan.id,
                desaId: desa.id,
                tanggal,
                hibridaBantuanPemerintahLahanSawahPanen: hibrida_bantuan_pemerintah_lahan_sawah_panen,
                hibridaBantuanPemerintahLahanSawahTanam: hibrida_bantuan_pemerintah_lahan_sawah_tanam,
                hibridaBantuanPemerintahLahanSawahPuso: hibrida_bantuan_pemerintah_lahan_sawah_puso,
                hibridaNonBantuanPemerintahLahanSawahPanen: hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
                hibridaNonBantuanPemerintahLahanSawahTanam: hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
                hibridaNonBantuanPemerintahLahanSawahPuso: hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
                unggulBantuanPemerintahLahanSawahPanen: unggul_bantuan_pemerintah_lahan_sawah_panen,
                unggulBantuanPemerintahLahanSawahTanam: unggul_bantuan_pemerintah_lahan_sawah_tanam,
                unggulBantuanPemerintahLahanSawahPuso: unggul_bantuan_pemerintah_lahan_sawah_puso,
                unggulBantuanPemerintahLahanBukanSawahPanen: unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggulBantuanPemerintahLahanBukanSawahTanam: unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggulBantuanPemerintahLahanBukanSawahPuso: unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
                unggulNonBantuanPemerintahLahanSawahPanen: unggul_non_bantuan_pemerintah_lahan_sawah_panen,
                unggulNonBantuanPemerintahLahanSawahTanam: unggul_non_bantuan_pemerintah_lahan_sawah_tanam,
                unggulNonBantuanPemerintahLahanSawahPuso: unggul_non_bantuan_pemerintah_lahan_sawah_puso,
                unggulNonBantuanPemerintahLahanBukanSawahPanen: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggulNonBantuanPemerintahLahanBukanSawahTanam: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggulNonBantuanPemerintahLahanBukanSawahPuso: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
                lokalLahanSawahPanen: lokal_lahan_sawah_panen,
                lokalLahanSawahTanam: lokal_lahan_sawah_tanam,
                lokalLahanSawahPuso: lokal_lahan_sawah_puso,
                lokalLahanBukanSawahPanen: lokal_lahan_bukan_sawah_panen,
                lokalLahanBukanSawahTanam: lokal_lahan_bukan_sawah_tanam,
                lokalLahanBukanSawahPuso: lokal_lahan_bukan_sawah_puso,
                sawahIrigasiLahanSawahPanen: sawah_irigasi_lahan_sawah_panen,
                sawahIrigasiLahanSawahTanam: sawah_irigasi_lahan_sawah_tanam,
                sawahIrigasiLahanSawahPuso: sawah_irigasi_lahan_sawah_puso,
                sawahTadahHujanLahanSawahPanen: sawah_tadah_hujan_lahan_sawah_panen,
                sawahTadahHujanLahanSawahTanam: sawah_tadah_hujan_lahan_sawah_tanam,
                sawahTadahHujanLahanSawahPuso: sawah_tadah_hujan_lahan_sawah_puso,
                sawahRawaPasangSurutLahanSawahPanen: sawah_rawa_pasang_surut_lahan_sawah_panen,
                sawahRawaPasangSurutLahanSawahTanam: sawah_rawa_pasang_surut_lahan_sawah_tanam,
                sawahRawaPasangSurutLahanSawahPuso: sawah_rawa_pasang_surut_lahan_sawah_puso,
                sawahRawaLebakLahanSawahPanen: sawah_rawa_lebak_lahan_sawah_panen,
                sawahRawaLebakLahanSawahTanam: sawah_rawa_lebak_lahan_sawah_tanam,
                sawahRawaLebakLahanSawahPuso: sawah_rawa_lebak_lahan_sawah_puso,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Korluh padi created'));
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