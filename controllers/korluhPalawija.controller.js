const { KorluhPalawija, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    jagung_hibrida_bantuan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_sawah_panen_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_bukan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_bantuan_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_bukan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_hibrida_non_bantuan_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_sawah_panen_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_bukan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_bukan_sawah_panen_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_komposit_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_sawah_panen_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_bukan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_bukan_sawah_panen_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_lokal_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_bantuan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_bantuan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_bantuan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_bantuan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_bantuan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_bantuan_bukan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_bantuan_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_bantuan_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_non_bantuan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_non_bantuan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_non_bantuan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_non_bantuan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_non_bantuan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_non_bantuan_bukan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_non_bantuan_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_non_bantuan_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_bantuan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_bantuan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_bantuan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_bantuan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_bantuan_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_bantuan_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_non_bantuan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_non_bantuan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_non_bantuan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_non_bantuan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_non_bantuan_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_non_bantuan_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_hijau_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_hijau_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_hijau_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_hijau_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_hijau_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_hijau_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    sorgum_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    sorgum_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    sorgum_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    sorgum_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    sorgum_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    sorgum_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    gandum_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    gandum_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    gandum_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    gandum_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    gandum_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    gandum_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    talas_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    talas_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    talas_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    talas_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    talas_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    talas_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    ganyong_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ganyong_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    ganyong_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    ganyong_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ganyong_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    ganyong_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    lainnya_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    lainnya_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    lainnya_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    lainnya_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    lainnya_bukan_sawah_panen_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    lainnya_bukan_sawah_panen_puso: {
        type: "number",
        optional: true,
        convert: true,
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
                    convert: true,
                },
                desa_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
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
                jagung_hibrida_bantuan_sawah_panen,
                jagung_hibrida_bantuan_sawah_panen_muda,
                jagung_hibrida_bantuan_sawah_panen_pakan_ternak,
                jagung_hibrida_bantuan_sawah_panen_tanam,
                jagung_hibrida_bantuan_sawah_panen_puso,
                jagung_hibrida_bantuan_bukan_sawah_panen,
                jagung_hibrida_bantuan_bukan_sawah_panen_muda,
                jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak,
                jagung_hibrida_bantuan_bukan_sawah_panen_tanam,
                jagung_hibrida_bantuan_bukan_sawah_panen_puso,
                jagung_hibrida_non_bantuan_sawah_panen,
                jagung_hibrida_non_bantuan_sawah_panen_muda,
                jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak,
                jagung_hibrida_non_bantuan_sawah_panen_tanam,
                jagung_hibrida_non_bantuan_sawah_panen_puso,
                jagung_hibrida_non_bantuan_bukan_sawah_panen,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_muda,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_puso,
                jagung_komposit_sawah_panen,
                jagung_komposit_sawah_panen_muda,
                jagung_komposit_sawah_panen_pakan_ternak,
                jagung_komposit_sawah_panen_tanam,
                jagung_komposit_sawah_panen_puso,
                jagung_komposit_bukan_sawah_panen,
                jagung_komposit_bukan_sawah_panen_muda,
                jagung_komposit_bukan_sawah_panen_pakan_ternak,
                jagung_komposit_bukan_sawah_panen_tanam,
                jagung_komposit_bukan_sawah_panen_puso,
                jagung_lokal_sawah_panen,
                jagung_lokal_sawah_panen_muda,
                jagung_lokal_sawah_panen_pakan_ternak,
                jagung_lokal_sawah_panen_tanam,
                jagung_lokal_sawah_panen_puso,
                jagung_lokal_bukan_sawah_panen,
                jagung_lokal_bukan_sawah_panen_muda,
                jagung_lokal_bukan_sawah_panen_pakan_ternak,
                jagung_lokal_bukan_sawah_panen_tanam,
                jagung_lokal_bukan_sawah_panen_puso,
                kedelai_bantuan_sawah_panen,
                kedelai_bantuan_sawah_panen_muda,
                kedelai_bantuan_sawah_panen_tanam,
                kedelai_bantuan_sawah_panen_puso,
                kedelai_bantuan_bukan_sawah_panen,
                kedelai_bantuan_bukan_sawah_panen_muda,
                kedelai_bantuan_bukan_sawah_panen_tanam,
                kedelai_bantuan_bukan_sawah_panen_puso,
                kedelai_non_bantuan_sawah_panen,
                kedelai_non_bantuan_sawah_panen_muda,
                kedelai_non_bantuan_sawah_panen_tanam,
                kedelai_non_bantuan_sawah_panen_puso,
                kedelai_non_bantuan_bukan_sawah_panen,
                kedelai_non_bantuan_bukan_sawah_panen_muda,
                kedelai_non_bantuan_bukan_sawah_panen_tanam,
                kedelai_non_bantuan_bukan_sawah_panen_puso,
                kacang_tanah_sawah_panen,
                kacang_tanah_sawah_panen_tanam,
                kacang_tanah_sawah_panen_puso,
                kacang_tanah_bukan_sawah_panen,
                kacang_tanah_bukan_sawah_panen_tanam,
                kacang_tanah_bukan_sawah_panen_puso,
                ubi_kayu_bantuan_sawah_panen,
                ubi_kayu_bantuan_sawah_panen_tanam,
                ubi_kayu_bantuan_sawah_panen_puso,
                ubi_kayu_bantuan_bukan_sawah_panen,
                ubi_kayu_bantuan_bukan_sawah_panen_tanam,
                ubi_kayu_bantuan_bukan_sawah_panen_puso,
                ubi_kayu_non_bantuan_sawah_panen,
                ubi_kayu_non_bantuan_sawah_panen_tanam,
                ubi_kayu_non_bantuan_sawah_panen_puso,
                ubi_kayu_non_bantuan_bukan_sawah_panen,
                ubi_kayu_non_bantuan_bukan_sawah_panen_tanam,
                ubi_kayu_non_bantuan_bukan_sawah_panen_puso,
                ubi_jalar_sawah_panen,
                ubi_jalar_sawah_panen_tanam,
                ubi_jalar_sawah_panen_puso,
                ubi_jalar_bukan_sawah_panen,
                ubi_jalar_bukan_sawah_panen_tanam,
                ubi_jalar_bukan_sawah_panen_puso,
                kacang_hijau_sawah_panen,
                kacang_hijau_sawah_panen_tanam,
                kacang_hijau_sawah_panen_puso,
                kacang_hijau_bukan_sawah_panen,
                kacang_hijau_bukan_sawah_panen_tanam,
                kacang_hijau_bukan_sawah_panen_puso,
                sorgum_sawah_panen,
                sorgum_sawah_panen_tanam,
                sorgum_sawah_panen_puso,
                sorgum_bukan_sawah_panen,
                sorgum_bukan_sawah_panen_tanam,
                sorgum_bukan_sawah_panen_puso,
                gandum_sawah_panen,
                gandum_sawah_panen_tanam,
                gandum_sawah_panen_puso,
                gandum_bukan_sawah_panen,
                gandum_bukan_sawah_panen_tanam,
                gandum_bukan_sawah_panen_puso,
                talas_sawah_panen,
                talas_sawah_panen_tanam,
                talas_sawah_panen_puso,
                talas_bukan_sawah_panen,
                talas_bukan_sawah_panen_tanam,
                talas_bukan_sawah_panen_puso,
                ganyong_sawah_panen,
                ganyong_sawah_panen_tanam,
                ganyong_sawah_panen_puso,
                ganyong_bukan_sawah_panen,
                ganyong_bukan_sawah_panen_tanam,
                ganyong_bukan_sawah_panen_puso,
                lainnya_sawah_panen,
                lainnya_sawah_panen_tanam,
                lainnya_sawah_panen_puso,
                lainnya_bukan_sawah_panen,
                lainnya_bukan_sawah_panen_tanam,
                lainnya_bukan_sawah_panen_puso,
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

            const korluhPalawijaExists = await KorluhPalawija.findOne({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    desaId: desa_id,
                }
            });

            if (korluhPalawijaExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh palawija, please use another tanggal",
                        field: 'tanggal',
                    },
                ]));
                return;
            }

            await KorluhPalawija.create({
                kecamatanId: kecamatan.id,
                desaId: desa.id,
                tanggal,
                jagung_hibrida_bantuan_sawah_panen,
                jagung_hibrida_bantuan_sawah_panen_muda,
                jagung_hibrida_bantuan_sawah_panen_pakan_ternak,
                jagung_hibrida_bantuan_sawah_panen_tanam,
                jagung_hibrida_bantuan_sawah_panen_puso,
                jagung_hibrida_bantuan_bukan_sawah_panen,
                jagung_hibrida_bantuan_bukan_sawah_panen_muda,
                jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak,
                jagung_hibrida_bantuan_bukan_sawah_panen_tanam,
                jagung_hibrida_bantuan_bukan_sawah_panen_puso,
                jagung_hibrida_non_bantuan_sawah_panen,
                jagung_hibrida_non_bantuan_sawah_panen_muda,
                jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak,
                jagung_hibrida_non_bantuan_sawah_panen_tanam,
                jagung_hibrida_non_bantuan_sawah_panen_puso,
                jagung_hibrida_non_bantuan_bukan_sawah_panen,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_muda,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_puso,
                jagung_komposit_sawah_panen,
                jagung_komposit_sawah_panen_muda,
                jagung_komposit_sawah_panen_pakan_ternak,
                jagung_komposit_sawah_panen_tanam,
                jagung_komposit_sawah_panen_puso,
                jagung_komposit_bukan_sawah_panen,
                jagung_komposit_bukan_sawah_panen_muda,
                jagung_komposit_bukan_sawah_panen_pakan_ternak,
                jagung_komposit_bukan_sawah_panen_tanam,
                jagung_komposit_bukan_sawah_panen_puso,
                jagung_lokal_sawah_panen,
                jagung_lokal_sawah_panen_muda,
                jagung_lokal_sawah_panen_pakan_ternak,
                jagung_lokal_sawah_panen_tanam,
                jagung_lokal_sawah_panen_puso,
                jagung_lokal_bukan_sawah_panen,
                jagung_lokal_bukan_sawah_panen_muda,
                jagung_lokal_bukan_sawah_panen_pakan_ternak,
                jagung_lokal_bukan_sawah_panen_tanam,
                jagung_lokal_bukan_sawah_panen_puso,
                kedelai_bantuan_sawah_panen,
                kedelai_bantuan_sawah_panen_muda,
                kedelai_bantuan_sawah_panen_tanam,
                kedelai_bantuan_sawah_panen_puso,
                kedelai_bantuan_bukan_sawah_panen,
                kedelai_bantuan_bukan_sawah_panen_muda,
                kedelai_bantuan_bukan_sawah_panen_tanam,
                kedelai_bantuan_bukan_sawah_panen_puso,
                kedelai_non_bantuan_sawah_panen,
                kedelai_non_bantuan_sawah_panen_muda,
                kedelai_non_bantuan_sawah_panen_tanam,
                kedelai_non_bantuan_sawah_panen_puso,
                kedelai_non_bantuan_bukan_sawah_panen,
                kedelai_non_bantuan_bukan_sawah_panen_muda,
                kedelai_non_bantuan_bukan_sawah_panen_tanam,
                kedelai_non_bantuan_bukan_sawah_panen_puso,
                kacang_tanah_sawah_panen,
                kacang_tanah_sawah_panen_tanam,
                kacang_tanah_sawah_panen_puso,
                kacang_tanah_bukan_sawah_panen,
                kacang_tanah_bukan_sawah_panen_tanam,
                kacang_tanah_bukan_sawah_panen_puso,
                ubi_kayu_bantuan_sawah_panen,
                ubi_kayu_bantuan_sawah_panen_tanam,
                ubi_kayu_bantuan_sawah_panen_puso,
                ubi_kayu_bantuan_bukan_sawah_panen,
                ubi_kayu_bantuan_bukan_sawah_panen_tanam,
                ubi_kayu_bantuan_bukan_sawah_panen_puso,
                ubi_kayu_non_bantuan_sawah_panen,
                ubi_kayu_non_bantuan_sawah_panen_tanam,
                ubi_kayu_non_bantuan_sawah_panen_puso,
                ubi_kayu_non_bantuan_bukan_sawah_panen,
                ubi_kayu_non_bantuan_bukan_sawah_panen_tanam,
                ubi_kayu_non_bantuan_bukan_sawah_panen_puso,
                ubi_jalar_sawah_panen,
                ubi_jalar_sawah_panen_tanam,
                ubi_jalar_sawah_panen_puso,
                ubi_jalar_bukan_sawah_panen,
                ubi_jalar_bukan_sawah_panen_tanam,
                ubi_jalar_bukan_sawah_panen_puso,
                kacang_hijau_sawah_panen,
                kacang_hijau_sawah_panen_tanam,
                kacang_hijau_sawah_panen_puso,
                kacang_hijau_bukan_sawah_panen,
                kacang_hijau_bukan_sawah_panen_tanam,
                kacang_hijau_bukan_sawah_panen_puso,
                sorgum_sawah_panen,
                sorgum_sawah_panen_tanam,
                sorgum_sawah_panen_puso,
                sorgum_bukan_sawah_panen,
                sorgum_bukan_sawah_panen_tanam,
                sorgum_bukan_sawah_panen_puso,
                gandum_sawah_panen,
                gandum_sawah_panen_tanam,
                gandum_sawah_panen_puso,
                gandum_bukan_sawah_panen,
                gandum_bukan_sawah_panen_tanam,
                gandum_bukan_sawah_panen_puso,
                talas_sawah_panen,
                talas_sawah_panen_tanam,
                talas_sawah_panen_puso,
                talas_bukan_sawah_panen,
                talas_bukan_sawah_panen_tanam,
                talas_bukan_sawah_panen_puso,
                ganyong_sawah_panen,
                ganyong_sawah_panen_tanam,
                ganyong_sawah_panen_puso,
                ganyong_bukan_sawah_panen,
                ganyong_bukan_sawah_panen_tanam,
                ganyong_bukan_sawah_panen_puso,
                lainnya_sawah_panen,
                lainnya_sawah_panen_tanam,
                lainnya_sawah_panen_puso,
                lainnya_bukan_sawah_panen,
                lainnya_bukan_sawah_panen_tanam,
                lainnya_bukan_sawah_panen_puso,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Korluh palawija created'));
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
            let { kecamatan, equalDate, startDate, endDate, limit, page, desa } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};

            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }
            if (!isNaN(parseInt(desa))) {
                where.desaId = parseInt(desa);
            }
            if (equalDate) {
                equalDate = new Date(equalDate);
                if (equalDate instanceof Date && !isNaN(equalDate)) {
                    where.tanggal = { [Op.eq]: equalDate };
                }
            } else {
                if (startDate) {
                    startDate = new Date(startDate);
                    if (startDate instanceof Date && !isNaN(startDate)) {
                        where.tanggal = { [Op.gte]: startDate };
                    }
                }
                if (endDate) {
                    endDate = new Date(endDate);
                    if (endDate instanceof Date && !isNaN(endDate)) {
                        where.tanggal = { ...where.tanggal, [Op.lte]: endDate };
                    }
                }
            }

            const korluhPalawija = await KorluhPalawija.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: Desa,
                        as: 'desa',
                    },
                ],
                offset,
                limit,
                where,
            });

            const count = await KorluhPalawija.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/korluh/palawija/get');

            res.status(200).json(response(200, 'Get korluh palawija successfully', { data: korluhPalawija, pagination }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    getOne: async (req, res) => {
        try {
            let { equalDate, desa } = req.query;

            let where = {};

            if (!isNaN(parseInt(desa))) {
                where.desaId = parseInt(desa);
            }
            if (equalDate) {
                equalDate = new Date(equalDate);
                if (equalDate instanceof Date && !isNaN(equalDate)) {
                    where.tanggal = { [Op.eq]: equalDate };
                }
            }

            if (!where?.desaId || !where?.tanggal) {
                res.status(404).json(response(404, 'Korluh palawija not found'));
                return;
            }

            const korluhPalawija = await KorluhPalawija.findOne({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: Desa,
                        as: 'desa',
                    },
                ],
                where,
            });

            if (!korluhPalawija) {
                res.status(404).json(response(404, 'Korluh palawija not found'));
                return;
            }

            res.status(200).json(response(200, 'Get korluh palawija successfully', korluhPalawija));
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

            const korluhPalawija = await KorluhPalawija.findOne({
                where: { id },
            });

            const schema = {
                kecamatan_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                desa_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                tanggal: {
                    type: "date",
                    optional: true,
                    convert: true,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            if (!korluhPalawija) {
                res.status(404).json(response(404, 'Korluh palawija not found'));
                return;
            }

            let {
                kecamatan_id,
                desa_id,
                tanggal,
                jagung_hibrida_bantuan_sawah_panen,
                jagung_hibrida_bantuan_sawah_panen_muda,
                jagung_hibrida_bantuan_sawah_panen_pakan_ternak,
                jagung_hibrida_bantuan_sawah_panen_tanam,
                jagung_hibrida_bantuan_sawah_panen_puso,
                jagung_hibrida_bantuan_bukan_sawah_panen,
                jagung_hibrida_bantuan_bukan_sawah_panen_muda,
                jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak,
                jagung_hibrida_bantuan_bukan_sawah_panen_tanam,
                jagung_hibrida_bantuan_bukan_sawah_panen_puso,
                jagung_hibrida_non_bantuan_sawah_panen,
                jagung_hibrida_non_bantuan_sawah_panen_muda,
                jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak,
                jagung_hibrida_non_bantuan_sawah_panen_tanam,
                jagung_hibrida_non_bantuan_sawah_panen_puso,
                jagung_hibrida_non_bantuan_bukan_sawah_panen,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_muda,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_puso,
                jagung_komposit_sawah_panen,
                jagung_komposit_sawah_panen_muda,
                jagung_komposit_sawah_panen_pakan_ternak,
                jagung_komposit_sawah_panen_tanam,
                jagung_komposit_sawah_panen_puso,
                jagung_komposit_bukan_sawah_panen,
                jagung_komposit_bukan_sawah_panen_muda,
                jagung_komposit_bukan_sawah_panen_pakan_ternak,
                jagung_komposit_bukan_sawah_panen_tanam,
                jagung_komposit_bukan_sawah_panen_puso,
                jagung_lokal_sawah_panen,
                jagung_lokal_sawah_panen_muda,
                jagung_lokal_sawah_panen_pakan_ternak,
                jagung_lokal_sawah_panen_tanam,
                jagung_lokal_sawah_panen_puso,
                jagung_lokal_bukan_sawah_panen,
                jagung_lokal_bukan_sawah_panen_muda,
                jagung_lokal_bukan_sawah_panen_pakan_ternak,
                jagung_lokal_bukan_sawah_panen_tanam,
                jagung_lokal_bukan_sawah_panen_puso,
                kedelai_bantuan_sawah_panen,
                kedelai_bantuan_sawah_panen_muda,
                kedelai_bantuan_sawah_panen_tanam,
                kedelai_bantuan_sawah_panen_puso,
                kedelai_bantuan_bukan_sawah_panen,
                kedelai_bantuan_bukan_sawah_panen_muda,
                kedelai_bantuan_bukan_sawah_panen_tanam,
                kedelai_bantuan_bukan_sawah_panen_puso,
                kedelai_non_bantuan_sawah_panen,
                kedelai_non_bantuan_sawah_panen_muda,
                kedelai_non_bantuan_sawah_panen_tanam,
                kedelai_non_bantuan_sawah_panen_puso,
                kedelai_non_bantuan_bukan_sawah_panen,
                kedelai_non_bantuan_bukan_sawah_panen_muda,
                kedelai_non_bantuan_bukan_sawah_panen_tanam,
                kedelai_non_bantuan_bukan_sawah_panen_puso,
                kacang_tanah_sawah_panen,
                kacang_tanah_sawah_panen_tanam,
                kacang_tanah_sawah_panen_puso,
                kacang_tanah_bukan_sawah_panen,
                kacang_tanah_bukan_sawah_panen_tanam,
                kacang_tanah_bukan_sawah_panen_puso,
                ubi_kayu_bantuan_sawah_panen,
                ubi_kayu_bantuan_sawah_panen_tanam,
                ubi_kayu_bantuan_sawah_panen_puso,
                ubi_kayu_bantuan_bukan_sawah_panen,
                ubi_kayu_bantuan_bukan_sawah_panen_tanam,
                ubi_kayu_bantuan_bukan_sawah_panen_puso,
                ubi_kayu_non_bantuan_sawah_panen,
                ubi_kayu_non_bantuan_sawah_panen_tanam,
                ubi_kayu_non_bantuan_sawah_panen_puso,
                ubi_kayu_non_bantuan_bukan_sawah_panen,
                ubi_kayu_non_bantuan_bukan_sawah_panen_tanam,
                ubi_kayu_non_bantuan_bukan_sawah_panen_puso,
                ubi_jalar_sawah_panen,
                ubi_jalar_sawah_panen_tanam,
                ubi_jalar_sawah_panen_puso,
                ubi_jalar_bukan_sawah_panen,
                ubi_jalar_bukan_sawah_panen_tanam,
                ubi_jalar_bukan_sawah_panen_puso,
                kacang_hijau_sawah_panen,
                kacang_hijau_sawah_panen_tanam,
                kacang_hijau_sawah_panen_puso,
                kacang_hijau_bukan_sawah_panen,
                kacang_hijau_bukan_sawah_panen_tanam,
                kacang_hijau_bukan_sawah_panen_puso,
                sorgum_sawah_panen,
                sorgum_sawah_panen_tanam,
                sorgum_sawah_panen_puso,
                sorgum_bukan_sawah_panen,
                sorgum_bukan_sawah_panen_tanam,
                sorgum_bukan_sawah_panen_puso,
                gandum_sawah_panen,
                gandum_sawah_panen_tanam,
                gandum_sawah_panen_puso,
                gandum_bukan_sawah_panen,
                gandum_bukan_sawah_panen_tanam,
                gandum_bukan_sawah_panen_puso,
                talas_sawah_panen,
                talas_sawah_panen_tanam,
                talas_sawah_panen_puso,
                talas_bukan_sawah_panen,
                talas_bukan_sawah_panen_tanam,
                talas_bukan_sawah_panen_puso,
                ganyong_sawah_panen,
                ganyong_sawah_panen_tanam,
                ganyong_sawah_panen_puso,
                ganyong_bukan_sawah_panen,
                ganyong_bukan_sawah_panen_tanam,
                ganyong_bukan_sawah_panen_puso,
                lainnya_sawah_panen,
                lainnya_sawah_panen_tanam,
                lainnya_sawah_panen_puso,
                lainnya_bukan_sawah_panen,
                lainnya_bukan_sawah_panen_tanam,
                lainnya_bukan_sawah_panen_puso,
            } = req.body;

            if (kecamatan_id) {
                const kecamatan = await Kecamatan.findByPk(kecamatan_id);

                kecamatan_id = kecamatan?.id ?? korluhPalawija.kecamatanId;
            } else {
                kecamatan_id = korluhPalawija.kecamatanId;
            }
            if (desa_id) {
                const desa = await Desa.findByPk(desa_id);

                desa_id = desa?.id ?? korluhPalawija.desaId;
            } else {
                desa_id = korluhPalawija.desaId;
            }
            if (tanggal) {
                const tanggalExists = await KorluhPalawija.findOne({
                    where: { tanggal: { [Op.eq]: tanggal }, desaId: desa_id }
                });
                if (tanggalExists !== null && tanggalExists?.id !== korluhPalawija.id) {
                    res.status(400).json(response(400, 'Bad Request', [
                        {
                            type: 'duplicate',
                            message: "Cannot updated korluh palawija, please use another tanggal",
                            field: 'tanggal',
                        },
                    ]));
                    return;
                }
            }

            jagung_hibrida_bantuan_sawah_panen = jagung_hibrida_bantuan_sawah_panen ?? korluhPalawija.jagung_hibrida_bantuan_sawah_panen;
            jagung_hibrida_bantuan_sawah_panen_muda = jagung_hibrida_bantuan_sawah_panen_muda ?? korluhPalawija.jagung_hibrida_bantuan_sawah_panen_muda;
            jagung_hibrida_bantuan_sawah_panen_pakan_ternak = jagung_hibrida_bantuan_sawah_panen_pakan_ternak ?? korluhPalawija.jagung_hibrida_bantuan_sawah_panen_pakan_ternak;
            jagung_hibrida_bantuan_sawah_panen_tanam = jagung_hibrida_bantuan_sawah_panen_tanam ?? korluhPalawija.jagung_hibrida_bantuan_sawah_panen_tanam;
            jagung_hibrida_bantuan_sawah_panen_puso = jagung_hibrida_bantuan_sawah_panen_puso ?? korluhPalawija.jagung_hibrida_bantuan_sawah_panen_puso;
            jagung_hibrida_bantuan_bukan_sawah_panen = jagung_hibrida_bantuan_bukan_sawah_panen ?? korluhPalawija.jagung_hibrida_bantuan_bukan_sawah_panen;
            jagung_hibrida_bantuan_bukan_sawah_panen_muda = jagung_hibrida_bantuan_bukan_sawah_panen_muda ?? korluhPalawija.jagung_hibrida_bantuan_bukan_sawah_panen_muda;
            jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak = jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak ?? korluhPalawija.jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak;
            jagung_hibrida_bantuan_bukan_sawah_panen_tanam = jagung_hibrida_bantuan_bukan_sawah_panen_tanam ?? korluhPalawija.jagung_hibrida_bantuan_bukan_sawah_panen_tanam;
            jagung_hibrida_bantuan_bukan_sawah_panen_puso = jagung_hibrida_bantuan_bukan_sawah_panen_puso ?? korluhPalawija.jagung_hibrida_bantuan_bukan_sawah_panen_puso;
            jagung_hibrida_non_bantuan_sawah_panen = jagung_hibrida_non_bantuan_sawah_panen ?? korluhPalawija.jagung_hibrida_non_bantuan_sawah_panen;
            jagung_hibrida_non_bantuan_sawah_panen_muda = jagung_hibrida_non_bantuan_sawah_panen_muda ?? korluhPalawija.jagung_hibrida_non_bantuan_sawah_panen_muda;
            jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak = jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak ?? korluhPalawija.jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak;
            jagung_hibrida_non_bantuan_sawah_panen_tanam = jagung_hibrida_non_bantuan_sawah_panen_tanam ?? korluhPalawija.jagung_hibrida_non_bantuan_sawah_panen_tanam;
            jagung_hibrida_non_bantuan_sawah_panen_puso = jagung_hibrida_non_bantuan_sawah_panen_puso ?? korluhPalawija.jagung_hibrida_non_bantuan_sawah_panen_puso;
            jagung_hibrida_non_bantuan_bukan_sawah_panen = jagung_hibrida_non_bantuan_bukan_sawah_panen ?? korluhPalawija.jagung_hibrida_non_bantuan_bukan_sawah_panen;
            jagung_hibrida_non_bantuan_bukan_sawah_panen_muda = jagung_hibrida_non_bantuan_bukan_sawah_panen_muda ?? korluhPalawija.jagung_hibrida_non_bantuan_bukan_sawah_panen_muda;
            jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak = jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak ?? korluhPalawija.jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak;
            jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam = jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam ?? korluhPalawija.jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam;
            jagung_hibrida_non_bantuan_bukan_sawah_panen_puso = jagung_hibrida_non_bantuan_bukan_sawah_panen_puso ?? korluhPalawija.jagung_hibrida_non_bantuan_bukan_sawah_panen_puso;
            jagung_komposit_sawah_panen = jagung_komposit_sawah_panen ?? korluhPalawija.jagung_komposit_sawah_panen;
            jagung_komposit_sawah_panen_muda = jagung_komposit_sawah_panen_muda ?? korluhPalawija.jagung_komposit_sawah_panen_muda;
            jagung_komposit_sawah_panen_pakan_ternak = jagung_komposit_sawah_panen_pakan_ternak ?? korluhPalawija.jagung_komposit_sawah_panen_pakan_ternak;
            jagung_komposit_sawah_panen_tanam = jagung_komposit_sawah_panen_tanam ?? korluhPalawija.jagung_komposit_sawah_panen_tanam;
            jagung_komposit_sawah_panen_puso = jagung_komposit_sawah_panen_puso ?? korluhPalawija.jagung_komposit_sawah_panen_puso;
            jagung_komposit_bukan_sawah_panen = jagung_komposit_bukan_sawah_panen ?? korluhPalawija.jagung_komposit_bukan_sawah_panen;
            jagung_komposit_bukan_sawah_panen_muda = jagung_komposit_bukan_sawah_panen_muda ?? korluhPalawija.jagung_komposit_bukan_sawah_panen_muda;
            jagung_komposit_bukan_sawah_panen_pakan_ternak = jagung_komposit_bukan_sawah_panen_pakan_ternak ?? korluhPalawija.jagung_komposit_bukan_sawah_panen_pakan_ternak;
            jagung_komposit_bukan_sawah_panen_tanam = jagung_komposit_bukan_sawah_panen_tanam ?? korluhPalawija.jagung_komposit_bukan_sawah_panen_tanam;
            jagung_komposit_bukan_sawah_panen_puso = jagung_komposit_bukan_sawah_panen_puso ?? korluhPalawija.jagung_komposit_bukan_sawah_panen_puso;
            jagung_lokal_sawah_panen = jagung_lokal_sawah_panen ?? korluhPalawija.jagung_lokal_sawah_panen;
            jagung_lokal_sawah_panen_muda = jagung_lokal_sawah_panen_muda ?? korluhPalawija.jagung_lokal_sawah_panen_muda;
            jagung_lokal_sawah_panen_pakan_ternak = jagung_lokal_sawah_panen_pakan_ternak ?? korluhPalawija.jagung_lokal_sawah_panen_pakan_ternak;
            jagung_lokal_sawah_panen_tanam = jagung_lokal_sawah_panen_tanam ?? korluhPalawija.jagung_lokal_sawah_panen_tanam;
            jagung_lokal_sawah_panen_puso = jagung_lokal_sawah_panen_puso ?? korluhPalawija.jagung_lokal_sawah_panen_puso;
            jagung_lokal_bukan_sawah_panen = jagung_lokal_bukan_sawah_panen ?? korluhPalawija.jagung_lokal_bukan_sawah_panen;
            jagung_lokal_bukan_sawah_panen_muda = jagung_lokal_bukan_sawah_panen_muda ?? korluhPalawija.jagung_lokal_bukan_sawah_panen_muda;
            jagung_lokal_bukan_sawah_panen_pakan_ternak = jagung_lokal_bukan_sawah_panen_pakan_ternak ?? korluhPalawija.jagung_lokal_bukan_sawah_panen_pakan_ternak;
            jagung_lokal_bukan_sawah_panen_tanam = jagung_lokal_bukan_sawah_panen_tanam ?? korluhPalawija.jagung_lokal_bukan_sawah_panen_tanam;
            jagung_lokal_bukan_sawah_panen_puso = jagung_lokal_bukan_sawah_panen_puso ?? korluhPalawija.jagung_lokal_bukan_sawah_panen_puso;
            kedelai_bantuan_sawah_panen = kedelai_bantuan_sawah_panen ?? korluhPalawija.kedelai_bantuan_sawah_panen;
            kedelai_bantuan_sawah_panen_muda = kedelai_bantuan_sawah_panen_muda ?? korluhPalawija.kedelai_bantuan_sawah_panen_muda;
            kedelai_bantuan_sawah_panen_tanam = kedelai_bantuan_sawah_panen_tanam ?? korluhPalawija.kedelai_bantuan_sawah_panen_tanam;
            kedelai_bantuan_sawah_panen_puso = kedelai_bantuan_sawah_panen_puso ?? korluhPalawija.kedelai_bantuan_sawah_panen_puso;
            kedelai_bantuan_bukan_sawah_panen = kedelai_bantuan_bukan_sawah_panen ?? korluhPalawija.kedelai_bantuan_bukan_sawah_panen;
            kedelai_bantuan_bukan_sawah_panen_muda = kedelai_bantuan_bukan_sawah_panen_muda ?? korluhPalawija.kedelai_bantuan_bukan_sawah_panen_muda;
            kedelai_bantuan_bukan_sawah_panen_tanam = kedelai_bantuan_bukan_sawah_panen_tanam ?? korluhPalawija.kedelai_bantuan_bukan_sawah_panen_tanam;
            kedelai_bantuan_bukan_sawah_panen_puso = kedelai_bantuan_bukan_sawah_panen_puso ?? korluhPalawija.kedelai_bantuan_bukan_sawah_panen_puso;
            kedelai_non_bantuan_sawah_panen = kedelai_non_bantuan_sawah_panen ?? korluhPalawija.kedelai_non_bantuan_sawah_panen;
            kedelai_non_bantuan_sawah_panen_muda = kedelai_non_bantuan_sawah_panen_muda ?? korluhPalawija.kedelai_non_bantuan_sawah_panen_muda;
            kedelai_non_bantuan_sawah_panen_tanam = kedelai_non_bantuan_sawah_panen_tanam ?? korluhPalawija.kedelai_non_bantuan_sawah_panen_tanam;
            kedelai_non_bantuan_sawah_panen_puso = kedelai_non_bantuan_sawah_panen_puso ?? korluhPalawija.kedelai_non_bantuan_sawah_panen_puso;
            kedelai_non_bantuan_bukan_sawah_panen = kedelai_non_bantuan_bukan_sawah_panen ?? korluhPalawija.kedelai_non_bantuan_bukan_sawah_panen;
            kedelai_non_bantuan_bukan_sawah_panen_muda = kedelai_non_bantuan_bukan_sawah_panen_muda ?? korluhPalawija.kedelai_non_bantuan_bukan_sawah_panen_muda;
            kedelai_non_bantuan_bukan_sawah_panen_tanam = kedelai_non_bantuan_bukan_sawah_panen_tanam ?? korluhPalawija.kedelai_non_bantuan_bukan_sawah_panen_tanam;
            kedelai_non_bantuan_bukan_sawah_panen_puso = kedelai_non_bantuan_bukan_sawah_panen_puso ?? korluhPalawija.kedelai_non_bantuan_bukan_sawah_panen_puso;
            kacang_tanah_sawah_panen = kacang_tanah_sawah_panen ?? korluhPalawija.kacang_tanah_sawah_panen;
            kacang_tanah_sawah_panen_tanam = kacang_tanah_sawah_panen_tanam ?? korluhPalawija.kacang_tanah_sawah_panen_tanam;
            kacang_tanah_sawah_panen_puso = kacang_tanah_sawah_panen_puso ?? korluhPalawija.kacang_tanah_sawah_panen_puso;
            kacang_tanah_bukan_sawah_panen = kacang_tanah_bukan_sawah_panen ?? korluhPalawija.kacang_tanah_bukan_sawah_panen;
            kacang_tanah_bukan_sawah_panen_tanam = kacang_tanah_bukan_sawah_panen_tanam ?? korluhPalawija.kacang_tanah_bukan_sawah_panen_tanam;
            kacang_tanah_bukan_sawah_panen_puso = kacang_tanah_bukan_sawah_panen_puso ?? korluhPalawija.kacang_tanah_bukan_sawah_panen_puso;
            ubi_kayu_bantuan_sawah_panen = ubi_kayu_bantuan_sawah_panen ?? korluhPalawija.ubi_kayu_bantuan_sawah_panen;
            ubi_kayu_bantuan_sawah_panen_tanam = ubi_kayu_bantuan_sawah_panen_tanam ?? korluhPalawija.ubi_kayu_bantuan_sawah_panen_tanam;
            ubi_kayu_bantuan_sawah_panen_puso = ubi_kayu_bantuan_sawah_panen_puso ?? korluhPalawija.ubi_kayu_bantuan_sawah_panen_puso;
            ubi_kayu_bantuan_bukan_sawah_panen = ubi_kayu_bantuan_bukan_sawah_panen ?? korluhPalawija.ubi_kayu_bantuan_bukan_sawah_panen;
            ubi_kayu_bantuan_bukan_sawah_panen_tanam = ubi_kayu_bantuan_bukan_sawah_panen_tanam ?? korluhPalawija.ubi_kayu_bantuan_bukan_sawah_panen_tanam;
            ubi_kayu_bantuan_bukan_sawah_panen_puso = ubi_kayu_bantuan_bukan_sawah_panen_puso ?? korluhPalawija.ubi_kayu_bantuan_bukan_sawah_panen_puso;
            ubi_kayu_non_bantuan_sawah_panen = ubi_kayu_non_bantuan_sawah_panen ?? korluhPalawija.ubi_kayu_non_bantuan_sawah_panen;
            ubi_kayu_non_bantuan_sawah_panen_tanam = ubi_kayu_non_bantuan_sawah_panen_tanam ?? korluhPalawija.ubi_kayu_non_bantuan_sawah_panen_tanam;
            ubi_kayu_non_bantuan_sawah_panen_puso = ubi_kayu_non_bantuan_sawah_panen_puso ?? korluhPalawija.ubi_kayu_non_bantuan_sawah_panen_puso;
            ubi_kayu_non_bantuan_bukan_sawah_panen = ubi_kayu_non_bantuan_bukan_sawah_panen ?? korluhPalawija.ubi_kayu_non_bantuan_bukan_sawah_panen;
            ubi_kayu_non_bantuan_bukan_sawah_panen_tanam = ubi_kayu_non_bantuan_bukan_sawah_panen_tanam ?? korluhPalawija.ubi_kayu_non_bantuan_bukan_sawah_panen_tanam;
            ubi_kayu_non_bantuan_bukan_sawah_panen_puso = ubi_kayu_non_bantuan_bukan_sawah_panen_puso ?? korluhPalawija.ubi_kayu_non_bantuan_bukan_sawah_panen_puso;
            ubi_jalar_sawah_panen = ubi_jalar_sawah_panen ?? korluhPalawija.ubi_jalar_sawah_panen;
            ubi_jalar_sawah_panen_tanam = ubi_jalar_sawah_panen_tanam ?? korluhPalawija.ubi_jalar_sawah_panen_tanam;
            ubi_jalar_sawah_panen_puso = ubi_jalar_sawah_panen_puso ?? korluhPalawija.ubi_jalar_sawah_panen_puso;
            ubi_jalar_bukan_sawah_panen = ubi_jalar_bukan_sawah_panen ?? korluhPalawija.ubi_jalar_bukan_sawah_panen;
            ubi_jalar_bukan_sawah_panen_tanam = ubi_jalar_bukan_sawah_panen_tanam ?? korluhPalawija.ubi_jalar_bukan_sawah_panen_tanam;
            ubi_jalar_bukan_sawah_panen_puso = ubi_jalar_bukan_sawah_panen_puso ?? korluhPalawija.ubi_jalar_bukan_sawah_panen_puso;
            kacang_hijau_sawah_panen = kacang_hijau_sawah_panen ?? korluhPalawija.kacang_hijau_sawah_panen;
            kacang_hijau_sawah_panen_tanam = kacang_hijau_sawah_panen_tanam ?? korluhPalawija.kacang_hijau_sawah_panen_tanam;
            kacang_hijau_sawah_panen_puso = kacang_hijau_sawah_panen_puso ?? korluhPalawija.kacang_hijau_sawah_panen_puso;
            kacang_hijau_bukan_sawah_panen = kacang_hijau_bukan_sawah_panen ?? korluhPalawija.kacang_hijau_bukan_sawah_panen;
            kacang_hijau_bukan_sawah_panen_tanam = kacang_hijau_bukan_sawah_panen_tanam ?? korluhPalawija.kacang_hijau_bukan_sawah_panen_tanam;
            kacang_hijau_bukan_sawah_panen_puso = kacang_hijau_bukan_sawah_panen_puso ?? korluhPalawija.kacang_hijau_bukan_sawah_panen_puso;
            sorgum_sawah_panen = sorgum_sawah_panen ?? korluhPalawija.sorgum_sawah_panen;
            sorgum_sawah_panen_tanam = sorgum_sawah_panen_tanam ?? korluhPalawija.sorgum_sawah_panen_tanam;
            sorgum_sawah_panen_puso = sorgum_sawah_panen_puso ?? korluhPalawija.sorgum_sawah_panen_puso;
            sorgum_bukan_sawah_panen = sorgum_bukan_sawah_panen ?? korluhPalawija.sorgum_bukan_sawah_panen;
            sorgum_bukan_sawah_panen_tanam = sorgum_bukan_sawah_panen_tanam ?? korluhPalawija.sorgum_bukan_sawah_panen_tanam;
            sorgum_bukan_sawah_panen_puso = sorgum_bukan_sawah_panen_puso ?? korluhPalawija.sorgum_bukan_sawah_panen_puso;
            gandum_sawah_panen = gandum_sawah_panen ?? korluhPalawija.gandum_sawah_panen;
            gandum_sawah_panen_tanam = gandum_sawah_panen_tanam ?? korluhPalawija.gandum_sawah_panen_tanam;
            gandum_sawah_panen_puso = gandum_sawah_panen_puso ?? korluhPalawija.gandum_sawah_panen_puso;
            gandum_bukan_sawah_panen = gandum_bukan_sawah_panen ?? korluhPalawija.gandum_bukan_sawah_panen;
            gandum_bukan_sawah_panen_tanam = gandum_bukan_sawah_panen_tanam ?? korluhPalawija.gandum_bukan_sawah_panen_tanam;
            gandum_bukan_sawah_panen_puso = gandum_bukan_sawah_panen_puso ?? korluhPalawija.gandum_bukan_sawah_panen_puso;
            talas_sawah_panen = talas_sawah_panen ?? korluhPalawija.talas_sawah_panen;
            talas_sawah_panen_tanam = talas_sawah_panen_tanam ?? korluhPalawija.talas_sawah_panen_tanam;
            talas_sawah_panen_puso = talas_sawah_panen_puso ?? korluhPalawija.talas_sawah_panen_puso;
            talas_bukan_sawah_panen = talas_bukan_sawah_panen ?? korluhPalawija.talas_bukan_sawah_panen;
            talas_bukan_sawah_panen_tanam = talas_bukan_sawah_panen_tanam ?? korluhPalawija.talas_bukan_sawah_panen_tanam;
            talas_bukan_sawah_panen_puso = talas_bukan_sawah_panen_puso ?? korluhPalawija.talas_bukan_sawah_panen_puso;
            ganyong_sawah_panen = ganyong_sawah_panen ?? korluhPalawija.ganyong_sawah_panen;
            ganyong_sawah_panen_tanam = ganyong_sawah_panen_tanam ?? korluhPalawija.ganyong_sawah_panen_tanam;
            ganyong_sawah_panen_puso = ganyong_sawah_panen_puso ?? korluhPalawija.ganyong_sawah_panen_puso;
            ganyong_bukan_sawah_panen = ganyong_bukan_sawah_panen ?? korluhPalawija.ganyong_bukan_sawah_panen;
            ganyong_bukan_sawah_panen_tanam = ganyong_bukan_sawah_panen_tanam ?? korluhPalawija.ganyong_bukan_sawah_panen_tanam;
            ganyong_bukan_sawah_panen_puso = ganyong_bukan_sawah_panen_puso ?? korluhPalawija.ganyong_bukan_sawah_panen_puso;
            lainnya_sawah_panen = lainnya_sawah_panen ?? korluhPalawija.lainnya_sawah_panen;
            lainnya_sawah_panen_tanam = lainnya_sawah_panen_tanam ?? korluhPalawija.lainnya_sawah_panen_tanam;
            lainnya_sawah_panen_puso = lainnya_sawah_panen_puso ?? korluhPalawija.lainnya_sawah_panen_puso;
            lainnya_bukan_sawah_panen = lainnya_bukan_sawah_panen ?? korluhPalawija.lainnya_bukan_sawah_panen;
            lainnya_bukan_sawah_panen_tanam = lainnya_bukan_sawah_panen_tanam ?? korluhPalawija.lainnya_bukan_sawah_panen_tanam;
            lainnya_bukan_sawah_panen_puso = lainnya_bukan_sawah_panen_puso ?? korluhPalawija.lainnya_bukan_sawah_panen_puso;

            await korluhPalawija.update({
                tanggal: tanggal ?? korluhPalawija.tanggal,
                kecamatanId: kecamatan_id,
                desaId: desa_id,
                jagung_hibrida_bantuan_sawah_panen,
                jagung_hibrida_bantuan_sawah_panen_muda,
                jagung_hibrida_bantuan_sawah_panen_pakan_ternak,
                jagung_hibrida_bantuan_sawah_panen_tanam,
                jagung_hibrida_bantuan_sawah_panen_puso,
                jagung_hibrida_bantuan_bukan_sawah_panen,
                jagung_hibrida_bantuan_bukan_sawah_panen_muda,
                jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak,
                jagung_hibrida_bantuan_bukan_sawah_panen_tanam,
                jagung_hibrida_bantuan_bukan_sawah_panen_puso,
                jagung_hibrida_non_bantuan_sawah_panen,
                jagung_hibrida_non_bantuan_sawah_panen_muda,
                jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak,
                jagung_hibrida_non_bantuan_sawah_panen_tanam,
                jagung_hibrida_non_bantuan_sawah_panen_puso,
                jagung_hibrida_non_bantuan_bukan_sawah_panen,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_muda,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam,
                jagung_hibrida_non_bantuan_bukan_sawah_panen_puso,
                jagung_komposit_sawah_panen,
                jagung_komposit_sawah_panen_muda,
                jagung_komposit_sawah_panen_pakan_ternak,
                jagung_komposit_sawah_panen_tanam,
                jagung_komposit_sawah_panen_puso,
                jagung_komposit_bukan_sawah_panen,
                jagung_komposit_bukan_sawah_panen_muda,
                jagung_komposit_bukan_sawah_panen_pakan_ternak,
                jagung_komposit_bukan_sawah_panen_tanam,
                jagung_komposit_bukan_sawah_panen_puso,
                jagung_lokal_sawah_panen,
                jagung_lokal_sawah_panen_muda,
                jagung_lokal_sawah_panen_pakan_ternak,
                jagung_lokal_sawah_panen_tanam,
                jagung_lokal_sawah_panen_puso,
                jagung_lokal_bukan_sawah_panen,
                jagung_lokal_bukan_sawah_panen_muda,
                jagung_lokal_bukan_sawah_panen_pakan_ternak,
                jagung_lokal_bukan_sawah_panen_tanam,
                jagung_lokal_bukan_sawah_panen_puso,
                kedelai_bantuan_sawah_panen,
                kedelai_bantuan_sawah_panen_muda,
                kedelai_bantuan_sawah_panen_tanam,
                kedelai_bantuan_sawah_panen_puso,
                kedelai_bantuan_bukan_sawah_panen,
                kedelai_bantuan_bukan_sawah_panen_muda,
                kedelai_bantuan_bukan_sawah_panen_tanam,
                kedelai_bantuan_bukan_sawah_panen_puso,
                kedelai_non_bantuan_sawah_panen,
                kedelai_non_bantuan_sawah_panen_muda,
                kedelai_non_bantuan_sawah_panen_tanam,
                kedelai_non_bantuan_sawah_panen_puso,
                kedelai_non_bantuan_bukan_sawah_panen,
                kedelai_non_bantuan_bukan_sawah_panen_muda,
                kedelai_non_bantuan_bukan_sawah_panen_tanam,
                kedelai_non_bantuan_bukan_sawah_panen_puso,
                kacang_tanah_sawah_panen,
                kacang_tanah_sawah_panen_tanam,
                kacang_tanah_sawah_panen_puso,
                kacang_tanah_bukan_sawah_panen,
                kacang_tanah_bukan_sawah_panen_tanam,
                kacang_tanah_bukan_sawah_panen_puso,
                ubi_kayu_bantuan_sawah_panen,
                ubi_kayu_bantuan_sawah_panen_tanam,
                ubi_kayu_bantuan_sawah_panen_puso,
                ubi_kayu_bantuan_bukan_sawah_panen,
                ubi_kayu_bantuan_bukan_sawah_panen_tanam,
                ubi_kayu_bantuan_bukan_sawah_panen_puso,
                ubi_kayu_non_bantuan_sawah_panen,
                ubi_kayu_non_bantuan_sawah_panen_tanam,
                ubi_kayu_non_bantuan_sawah_panen_puso,
                ubi_kayu_non_bantuan_bukan_sawah_panen,
                ubi_kayu_non_bantuan_bukan_sawah_panen_tanam,
                ubi_kayu_non_bantuan_bukan_sawah_panen_puso,
                ubi_jalar_sawah_panen,
                ubi_jalar_sawah_panen_tanam,
                ubi_jalar_sawah_panen_puso,
                ubi_jalar_bukan_sawah_panen,
                ubi_jalar_bukan_sawah_panen_tanam,
                ubi_jalar_bukan_sawah_panen_puso,
                kacang_hijau_sawah_panen,
                kacang_hijau_sawah_panen_tanam,
                kacang_hijau_sawah_panen_puso,
                kacang_hijau_bukan_sawah_panen,
                kacang_hijau_bukan_sawah_panen_tanam,
                kacang_hijau_bukan_sawah_panen_puso,
                sorgum_sawah_panen,
                sorgum_sawah_panen_tanam,
                sorgum_sawah_panen_puso,
                sorgum_bukan_sawah_panen,
                sorgum_bukan_sawah_panen_tanam,
                sorgum_bukan_sawah_panen_puso,
                gandum_sawah_panen,
                gandum_sawah_panen_tanam,
                gandum_sawah_panen_puso,
                gandum_bukan_sawah_panen,
                gandum_bukan_sawah_panen_tanam,
                gandum_bukan_sawah_panen_puso,
                talas_sawah_panen,
                talas_sawah_panen_tanam,
                talas_sawah_panen_puso,
                talas_bukan_sawah_panen,
                talas_bukan_sawah_panen_tanam,
                talas_bukan_sawah_panen_puso,
                ganyong_sawah_panen,
                ganyong_sawah_panen_tanam,
                ganyong_sawah_panen_puso,
                ganyong_bukan_sawah_panen,
                ganyong_bukan_sawah_panen_tanam,
                ganyong_bukan_sawah_panen_puso,
                lainnya_sawah_panen,
                lainnya_sawah_panen_tanam,
                lainnya_sawah_panen_puso,
                lainnya_bukan_sawah_panen,
                lainnya_bukan_sawah_panen_tanam,
                lainnya_bukan_sawah_panen_puso,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update korluh palawija successfully'));
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