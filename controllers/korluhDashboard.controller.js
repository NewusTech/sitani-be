const {
    KorluhTanamanBiofarmakaList,
    KorluhTanamanBiofarmaka,
    KorluhTanamanHiasList,
    KorluhMasterPalawija,
    KorluhSayurBuahList,
    KorluhPalawijaList,
    KorluhTanamanHias,
    KorluhSayurBuah,
    KorluhPalawija,
    KorluhPadi,
    sequelize
} = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let { kecamatan, desa, year, month, limit } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);

            let where = {};

            if (!isNaN(parseInt(kecamatan))) {
                kecamatan = parseInt(kecamatan);

                where.kecamatanId = kecamatan;
            }
            if (!isNaN(parseInt(desa))) {
                desa = parseInt(desa);

                where.desaId = desa;
            }
            if (!isNaN(parseInt(year))) {
                year = parseInt(year);
                if (!isNaN(parseInt(month))) {
                    month = parseInt(month);

                    where = {
                        ...where,
                        [Op.and]: [
                            { tanggal: sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), year) },
                            { tanggal: sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), month) }
                        ]
                    };
                } else {
                    where.tanggal = sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), year);
                }
            }

            const korluhPadi = await KorluhPadi.findAll({
                where,
            });

            let korluhPalawija = await KorluhPalawijaList.findAll({
                include: [
                    {
                        model: KorluhPalawija,
                        as: 'korluhPalawija',
                        where,
                    },
                    {
                        model: KorluhMasterPalawija,
                        as: 'master',
                        include: [
                            {
                                model: KorluhMasterPalawija,
                                as: 'induk',
                                include: [
                                    {
                                        model: KorluhMasterPalawija,
                                        as: 'induk',
                                    }
                                ]
                            }
                        ]
                    }
                ],
                limit,
            });

            let korluhSayurBuah = await KorluhSayurBuahList.findAll({
                include: [
                    {
                        model: KorluhSayurBuah,
                        as: 'korluhSayurBuah',
                        where,
                    },
                ],
                limit,
            });

            let korluhTanamanHias = await KorluhTanamanHiasList.findAll({
                include: [
                    {
                        model: KorluhTanamanHias,
                        as: 'korluhTanamanHias',
                        where,
                    },
                ],
                limit,
            });

            let korluhTanamanBiofarmaka = await KorluhTanamanBiofarmakaList.findAll({
                include: [
                    {
                        model: KorluhTanamanBiofarmaka,
                        as: 'korluhTanamanBiofarmaka',
                        where,
                    },
                ],
                limit,
            });

            let padiPanenCount = padiTanamCount = padiPusoCount = 0;

            korluhPadi.map((item) => {
                padiPanenCount += item.hibrida_bantuan_pemerintah_lahan_sawah_panen;
                padiTanamCount += item.hibrida_bantuan_pemerintah_lahan_sawah_tanam;
                padiPusoCount += item.hibrida_bantuan_pemerintah_lahan_sawah_puso;

                padiPanenCount += item.hibrida_non_bantuan_pemerintah_lahan_sawah_panen;
                padiTanamCount += item.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam;
                padiPusoCount += item.hibrida_non_bantuan_pemerintah_lahan_sawah_puso;

                padiPanenCount += item.unggul_bantuan_pemerintah_lahan_sawah_panen;
                padiTanamCount += item.unggul_bantuan_pemerintah_lahan_sawah_tanam;
                padiPusoCount += item.unggul_bantuan_pemerintah_lahan_sawah_puso;

                padiPanenCount += item.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen;
                padiTanamCount += item.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam;
                padiPusoCount += item.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso;

                padiPanenCount += item.unggul_non_bantuan_pemerintah_lahan_sawah_panen;
                padiTanamCount += item.unggul_non_bantuan_pemerintah_lahan_sawah_tanam;
                padiPusoCount += item.unggul_non_bantuan_pemerintah_lahan_sawah_puso;

                padiPanenCount += item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen;
                padiTanamCount += item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam;
                padiPusoCount += item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso;

                padiPanenCount += item.lokal_lahan_sawah_panen;
                padiTanamCount += item.lokal_lahan_sawah_tanam;
                padiPusoCount += item.lokal_lahan_sawah_puso;

                padiPanenCount += item.lokal_lahan_bukan_sawah_panen;
                padiTanamCount += item.lokal_lahan_bukan_sawah_tanam;
                padiPusoCount += item.lokal_lahan_bukan_sawah_puso;

                padiPanenCount += item.sawah_irigasi_lahan_sawah_panen;
                padiTanamCount += item.sawah_irigasi_lahan_sawah_tanam;
                padiPusoCount += item.sawah_irigasi_lahan_sawah_puso;

                padiPanenCount += item.sawah_tadah_hujan_lahan_sawah_panen;
                padiTanamCount += item.sawah_tadah_hujan_lahan_sawah_tanam;
                padiPusoCount += item.sawah_tadah_hujan_lahan_sawah_puso;

                padiPanenCount += item.sawah_rawa_pasang_surut_lahan_sawah_panen;
                padiTanamCount += item.sawah_rawa_pasang_surut_lahan_sawah_tanam;
                padiPusoCount += item.sawah_rawa_pasang_surut_lahan_sawah_puso;

                padiPanenCount += item.sawah_rawa_lebak_lahan_sawah_panen;
                padiTanamCount += item.sawah_rawa_lebak_lahan_sawah_tanam;
                padiPusoCount += item.sawah_rawa_lebak_lahan_sawah_puso;
            });

            let master = [];
            let temp = [];
            korluhPalawija.map((item) => {
                let nama = item?.master?.induk?.induk?.nama ?? (item?.master?.induk?.nama ?? (item?.master?.nama ?? 'error'));
                if (master.includes(nama)) {
                    const index = master.indexOf(nama);
                    temp[index].panen += item.lahanSawahPanen + item.lahanBukanSawahPanen;
                    temp[index].tanam += item.lahanSawahTanam + item.lahanBukanSawahTanam;
                    temp[index].puso += item.lahanSawahPuso + item.lahanBukanSawahPuso;
                } else {
                    master.push(nama);
                    temp.push(
                        {
                            panen: item.lahanSawahPanen + item.lahanBukanSawahPanen,
                            tanam: item.lahanSawahTanam + item.lahanBukanSawahTanam,
                            puso: item.lahanSawahPuso + item.lahanBukanSawahPuso,
                            nama,
                        }
                    );
                }
            });

            korluhSayurBuah = korluhSayurBuah.map((item) => ({
                luas: item.luasPanenHabis + item.luasPanenBelumHabis + item.luasRusak + item.luasPenanamanBaru,
                hasilProduksi: item.hasilProduksi,
                namaTanaman: item.namaTanaman,
            }));

            korluhTanamanHias = korluhTanamanHias.map((item) => ({
                luas: item.luasPanenHabis + item.luasPanenBelumHabis + item.luasRusak + item.luasPenanamanBaru,
                namaTanaman: item.namaTanaman,
                harga: item.rerataHarga,
            }));

            korluhTanamanBiofarmaka = korluhTanamanBiofarmaka.map((item) => ({
                luas: item.luasPanenHabis + item.luasPanenBelumHabis + item.luasRusak + item.luasPenanamanBaru,
                namaTanaman: item.namaTanaman,
                harga: item.rerataHarga,
            }));

            res.status(200).json(response(200, 'Get PSP dashboard data successfully', {
                padiPanenCount,
                padiTanamCount,
                padiPusoCount,
                korluhTanamanBiofarmaka,
                korluhTanamanHias,
                korluhSayurBuah,
                korluhPalawija: temp,
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