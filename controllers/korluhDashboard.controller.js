const {
    KorluhMasterTanamanBiofarmaka,
    KorluhTanamanBiofarmakaList,
    KorluhMasterTanamanHias,
    KorluhTanamanBiofarmaka,
    KorluhMasterSayurBuah,
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
const { response, fixedNumber } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let { kecamatan, year, month, limit } = req.query;

            kecamatan = isNaN(parseInt(kecamatan)) ? null : parseInt(kecamatan);
            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);

            let where = {};

            if (kecamatan) {
                where.kecamatanId = kecamatan;
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
                    {
                        model: KorluhMasterSayurBuah,
                        as: 'master',
                    }
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
                    {
                        model: KorluhMasterTanamanHias,
                        as: 'master',
                    }
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
                    {
                        model: KorluhMasterTanamanBiofarmaka,
                        as: 'master',
                    }
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

            let countTemp = fixedNumber({ padiPanenCount, padiTanamCount, padiPusoCount });

            padiPanenCount = countTemp.padiPanenCount;
            padiTanamCount = countTemp.padiTanamCount;
            padiPusoCount = countTemp.padiPusoCount;

            let master = [];
            let temp = [];
            korluhPalawija.map((item) => {
                let nama = item.master.nama;
                let obj = fixedNumber({
                    panen: item.lahanSawahPanen + item.lahanBukanSawahPanen,
                    tanam: item.lahanSawahTanam + item.lahanBukanSawahTanam,
                    puso: item.lahanSawahPuso + item.lahanBukanSawahPuso,
                })
                if (master.includes(nama)) {
                    const index = master.indexOf(nama);

                    temp[index].panen = obj.panen;
                    temp[index].tanam = obj.tanam;
                    temp[index].puso = obj.puso;
                } else {
                    master.push(nama);
                    temp.push(
                        {
                            ...obj,
                            nama,
                        }
                    );
                }
            });

            korluhSayurBuah = korluhSayurBuah.map((item) => ({
                ...fixedNumber({ luas: item.luasPanenHabis + item.luasPanenBelumHabis + item.luasRusak + item.luasPenanamanBaru }),
                hasilProduksi: item.hasilProduksi,
                namaTanaman: item.master.nama,
            }));

            korluhTanamanHias = korluhTanamanHias.map((item) => ({
                ...fixedNumber({ luas: item.luasPanenHabis + item.luasPanenBelumHabis + item.luasRusak + item.luasPenanamanBaru }),
                namaTanaman: item.master.nama,
                harga: item.rerataHarga,
            }));

            korluhTanamanBiofarmaka = korluhTanamanBiofarmaka.map((item) => ({
                ...fixedNumber({ luas: item.luasPanenHabis + item.luasPanenBelumHabis + item.luasRusak + item.luasPenanamanBaru }),
                namaTanaman: item.master.nama,
                harga: item.rerataHarga,
            }));

            res.status(200).json(response(200, 'Berhasil mendapatkan data dashboard', {
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