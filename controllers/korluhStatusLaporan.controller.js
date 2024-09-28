const {
    ValidasiKorluhSayurBuah,
    ValidasiKorluhPalawija,
    ValidasiKorluhPadi,
    KorluhSayurBuah,
    KorluhPalawija,
    KorluhPadi,
    Kecamatan,
    User,
    sequelize
} = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    statusPadi: async (req, res) => {
        try {
            let { kecamatan, bulan, tahun, status } = req.query;

            if (req?.root?.userId) {
                const user = await User.findByPk(req.root.userId, {
                    include: [
                        {
                            model: Kecamatan,
                            as: 'kecamatans'
                        },
                    ]
                });

                if (user?.kecamatans?.length) {
                    kecamatan = user.kecamatans[0].id;
                }
            }

            kecamatan = !isNaN(parseInt(kecamatan)) ? parseInt(kecamatan) : null;
            bulan = !isNaN(parseInt(bulan)) ? parseInt(bulan) : null;
            tahun = !isNaN(parseInt(tahun)) ? parseInt(tahun) : null;

            let where = {};

            if (kecamatan) {
                where.id = kecamatan;
            }

            const kecamatanList = await Kecamatan.findAll({
                where,
            });

            let data = {
                ids: [],
            };

            for (let kec of kecamatanList) {
                const years = await KorluhPadi.findAll({
                    attributes: [
                        [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('tanggal'))), 'tahun'],
                    ],
                    order: [['tahun', 'DESC']],
                    raw: true,
                    where: {
                        kecamatanId: kec.id
                    },
                });

                for (let itemYear of years) {
                    if (itemYear.tahun === tahun || !tahun) {
                        for (let m = 1; m <= 12; m++) {
                            if (m === bulan || !bulan) {
                                const korluhPadi = await KorluhPadi.findOne({
                                    include: [
                                        {
                                            model: Kecamatan,
                                            as: 'kecamatan',
                                        },
                                    ],
                                    where: {
                                        kecamatanId: kec.id,
                                        [Op.and]: [
                                            sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), itemYear.tahun),
                                            sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), m),
                                        ]
                                    },
                                });

                                if (korluhPadi) {
                                    const validasiKorluhPadi = await ValidasiKorluhPadi.findOne({
                                        where: {
                                            kecamatanId: kec.id,
                                            [Op.and]: [
                                                sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), itemYear.tahun),
                                                sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), m),
                                            ]
                                        },
                                    });

                                    const obj = {
                                        kecamatan: kec.nama,
                                        tahun: itemYear.tahun,
                                        bulan: m,
                                        status: validasiKorluhPadi?.status || 'belum',
                                        keterangan: validasiKorluhPadi?.keterangan || null,
                                        id: validasiKorluhPadi?.id || null,
                                    }

                                    if (status === obj.status || !status) {
                                        if (!data.ids.includes(kec.id)) {
                                            data.ids.push(kec.id);
                                        }

                                        data[kec.id] = data[kec.id] || [];
                                        data[kec.id].push(obj);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            res.status(200).json(response(200, 'Get status laporan korluh padi successfully', data));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    statusPalawija: async (req, res) => {
        try {
            let { kecamatan, bulan, tahun, status } = req.query;

            if (req?.root?.userId) {
                const user = await User.findByPk(req.root.userId, {
                    include: [
                        {
                            model: Kecamatan,
                            as: 'kecamatans'
                        },
                    ]
                });

                if (user?.kecamatans?.length) {
                    kecamatan = user.kecamatans[0].id;
                }
            }

            kecamatan = !isNaN(parseInt(kecamatan)) ? parseInt(kecamatan) : null;
            bulan = !isNaN(parseInt(bulan)) ? parseInt(bulan) : null;
            tahun = !isNaN(parseInt(tahun)) ? parseInt(tahun) : null;

            let where = {};

            if (kecamatan) {
                where.id = kecamatan;
            }

            const kecamatanList = await Kecamatan.findAll({
                where,
            });

            let data = {
                ids: [],
            };

            for (let kec of kecamatanList) {
                const years = await KorluhPalawija.findAll({
                    attributes: [
                        [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('tanggal'))), 'tahun'],
                    ],
                    order: [['tahun', 'DESC']],
                    raw: true,
                    where: {
                        kecamatanId: kec.id
                    },
                });

                for (let itemYear of years) {
                    if (itemYear.tahun === tahun || !tahun) {
                        for (let m = 1; m <= 12; m++) {
                            if (m === bulan || !bulan) {
                                const korluhPalawija = await KorluhPalawija.findOne({
                                    include: [
                                        {
                                            model: Kecamatan,
                                            as: 'kecamatan',
                                        },
                                    ],
                                    where: {
                                        kecamatanId: kec.id,
                                        [Op.and]: [
                                            sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), itemYear.tahun),
                                            sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), m),
                                        ]
                                    },
                                });

                                if (korluhPalawija) {
                                    const validasiKorluhPalawija = await ValidasiKorluhPalawija.findOne({
                                        where: {
                                            kecamatanId: kec.id,
                                            [Op.and]: [
                                                sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), itemYear.tahun),
                                                sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), m),
                                            ]
                                        },
                                    });

                                    const obj = {
                                        kecamatan: kec.nama,
                                        tahun: itemYear.tahun,
                                        bulan: m,
                                        status: validasiKorluhPalawija?.status || 'belum',
                                        keterangan: validasiKorluhPalawija?.keterangan || null,
                                        id: validasiKorluhPalawija?.id || null,
                                    }

                                    if (status === obj.status || !status) {
                                        if (!data.ids.includes(kec.id)) {
                                            data.ids.push(kec.id);
                                        }

                                        data[kec.id] = data[kec.id] || [];
                                        data[kec.id].push(obj);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            res.status(200).json(response(200, 'Get status laporan korluh palawija successfully', data));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    statusSayurBuah: async (req, res) => {
        try {
            let { kecamatan, bulan, tahun, status } = req.query;

            if (req?.root?.userId) {
                const user = await User.findByPk(req.root.userId, {
                    include: [
                        {
                            model: Kecamatan,
                            as: 'kecamatans'
                        },
                    ]
                });

                if (user?.kecamatans?.length) {
                    kecamatan = user.kecamatans[0].id;
                }
            }

            kecamatan = !isNaN(parseInt(kecamatan)) ? parseInt(kecamatan) : null;
            bulan = !isNaN(parseInt(bulan)) ? parseInt(bulan) : null;
            tahun = !isNaN(parseInt(tahun)) ? parseInt(tahun) : null;

            let where = {};

            if (kecamatan) {
                where.id = kecamatan;
            }

            const kecamatanList = await Kecamatan.findAll({
                where,
            });

            let data = {
                ids: [],
            };

            for (let kec of kecamatanList) {
                const years = await KorluhSayurBuah.findAll({
                    attributes: [
                        [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('tanggal'))), 'tahun'],
                    ],
                    order: [['tahun', 'DESC']],
                    raw: true,
                    where: {
                        kecamatanId: kec.id
                    },
                });

                for (let itemYear of years) {
                    if (itemYear.tahun === tahun || !tahun) {
                        for (let m = 1; m <= 12; m++) {
                            if (m === bulan || !bulan) {
                                const korluhSayurBuah = await KorluhSayurBuah.findOne({
                                    include: [
                                        {
                                            model: Kecamatan,
                                            as: 'kecamatan',
                                        },
                                    ],
                                    where: {
                                        kecamatanId: kec.id,
                                        [Op.and]: [
                                            sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), itemYear.tahun),
                                            sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), m),
                                        ]
                                    },
                                });

                                if (korluhSayurBuah) {
                                    const validasiKorluhSayurBuah = await ValidasiKorluhSayurBuah.findOne({
                                        where: {
                                            kecamatanId: kec.id,
                                            [Op.and]: [
                                                sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), itemYear.tahun),
                                                sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), m),
                                            ]
                                        },
                                    });

                                    const obj = {
                                        kecamatan: kec.nama,
                                        tahun: itemYear.tahun,
                                        bulan: m,
                                        status: validasiKorluhSayurBuah?.status || 'belum',
                                        keterangan: validasiKorluhSayurBuah?.keterangan || null,
                                        id: validasiKorluhSayurBuah?.id || null,
                                    }

                                    if (status === obj.status || !status) {
                                        if (!data.ids.includes(kec.id)) {
                                            data.ids.push(kec.id);
                                        }

                                        data[kec.id] = data[kec.id] || [];
                                        data[kec.id].push(obj);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            res.status(200).json(response(200, 'Get status laporan korluh sayur buah successfully', data));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}