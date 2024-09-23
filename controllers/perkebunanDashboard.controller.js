const {
    PerkebunanMasterKategoriKomoditas,
    PerkebunanMasterKomoditas,
    PerkebunanKecamatanList,
    PerkebunanKecamatan,
    sequelize
} = require('../models');
const { response, dateGenerate, getFirstLastDate } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let { kecamatan, year } = req.query;

            kecamatan = isNaN(parseInt(kecamatan)) ? null : parseInt(kecamatan);
            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let where = {
                tahun: year,
            }
            if (kecamatan) {
                where.kecamatanId = kecamatan;
            }

            let jumlahProduksi = 0, jumlahProduktivitas = 0, list = { kategoriIds: [] };

            let perkebunanKecamatan = await PerkebunanKecamatan.findAll({
                include: [
                    {
                        model: PerkebunanKecamatanList,
                        as: 'list',
                        include: [
                            {
                                model: PerkebunanMasterKategoriKomoditas,
                                as: 'kategoriKomoditas'
                            },
                            {
                                model: PerkebunanMasterKomoditas,
                                as: 'komoditas'
                            },
                        ],
                    }
                ],
                where,
            });

            perkebunanKecamatan.forEach(item => {
                item.list.forEach(i => {
                    const kategoriId = i.masterKategoriKomoditasId;
                    const komoditasId = i.masterKomoditasId;

                    if (!list.kategoriIds.includes(kategoriId)) {
                        list.kategoriIds.push(kategoriId);
                    }
                    list[kategoriId] = list[kategoriId] || { kategori: i.kategoriKomoditas, masterIds: [] };

                    if (!list[kategoriId].masterIds.includes(komoditasId)) {
                        list[kategoriId].masterIds.push(komoditasId);
                    }

                    list[kategoriId][komoditasId] = list[kategoriId][komoditasId] || { komoditas: i.komoditas, produksi: 0, produktivitas: 0 };

                    if (i.produksi) {
                        jumlahProduksi += i.produksi;
                        list[kategoriId][komoditasId].produksi += i.produksi;
                    }
                    if (i.produktivitas) {
                        jumlahProduktivitas += i.produktivitas;
                        list[kategoriId][komoditasId].produktivitas += i.produktivitas;
                    }
                });
            });

            res.status(200).json(response(200, 'Get perkebunan dashboard data successfully', {
                jumlahProduktivitas,
                jumlahProduksi,
                list,
            }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}