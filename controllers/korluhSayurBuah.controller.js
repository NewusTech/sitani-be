const { KorluhMasterHasilSayurBuah, KorluhMasterSayurBuah, KorluhSayurBuahList, KorluhSayurBuah, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    luas_panen_habis: {
        type: "number",
        optional: true,
        convert: true,
    },
    luas_panen_belum_habis: {
        type: "number",
        optional: true,
        convert: true,
    },
    luas_rusak: {
        type: "number",
        optional: true,
        convert: true,
    },
    luas_penanaman_baru: {
        type: "number",
        optional: true,
        convert: true,
    },
    produksi_habis: {
        type: "number",
        optional: true,
        convert: true,
    },
    produksi_belum_habis: {
        type: "number",
        optional: true,
        convert: true,
    },
    rerata_harga_jual: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    keterangan: {
        type: "string",
        optional: true,
        max: 255,
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
                nama_sayur_buah_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                hasil_sayur_buah_id: {
                    type: "number",
                    positive: true,
                    integer: true,
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
                nama_sayur_buah_id,
                hasil_sayur_buah_id,
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                rerata_harga_jual,
                keterangan,
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const desa = await Desa.findByPk(desa_id);

            const hasilSayurBuah = await KorluhMasterHasilSayurBuah.findByPk(hasil_sayur_buah_id);
            const namaSayurBuah = await KorluhMasterSayurBuah.findByPk(nama_sayur_buah_id);

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
            if (!hasilSayurBuah) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Hasil sayur dan buah doesn't exists",
                        field: 'hasil_sayur_buah_id',
                    },
                ]));
                return;
            }
            if (!namaSayurBuah) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Nama sayur dan buah doesn't exists",
                        field: 'nama_sayur_buah_id',
                    },
                ]));
                return;
            }

            const sayurBuah = await KorluhSayurBuah.findOrCreate({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    desaId: desa_id,
                },
                defaults: {
                    kecamatanId: kecamatan_id,
                    desaId: desa_id,
                    tanggal,
                },
            })

            const korluhSayurBuahListExists = await KorluhSayurBuahList.findOne({
                where: {
                    sayurBuahId: sayurBuah[0].id,
                    namaTanaman: namaSayurBuah.nama,
                }
            });

            if (korluhSayurBuahListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh sayur dan buah, please use another nama sayur dan buah",
                        field: 'nama_sayur_buah_id',
                    },
                ]));
                return;
            }

            await KorluhSayurBuahList.create({
                sayurBuahId: sayurBuah[0].id,
                namaTanaman: namaSayurBuah.nama,
                hasilProduksi: hasilSayurBuah.nama,
                luasPanenHabis: luas_panen_habis,
                luasPanenBelumHabis: luas_panen_belum_habis,
                luasRusak: luas_rusak,
                luasPenanamanBaru: luas_penanaman_baru,
                produksiHabis: produksi_habis,
                produksiBelumHabis: produksi_belum_habis,
                rerataHargaJual: rerata_harga_jual,
                keterangan,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Korluh sayur dan buah created'));
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