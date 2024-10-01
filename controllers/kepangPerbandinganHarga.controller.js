const { KepangPedagangEceranList, KepangMasterKomoditas, KepangPedagangEceran, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            let { year, search } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let where = {};
            if (search) {
                where.nama = {
                    [Op.like]: `%${search}%`
                };
            }

            const kepangPerbandinganHarga = await KepangPedagangEceran.findAll({
                where: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), year)
                ],
                include: [
                    {
                        model: KepangPedagangEceranList,
                        as: 'list',
                        include: [
                            {
                                model: KepangMasterKomoditas,
                                as: 'komoditas',
                                where
                            }
                        ]
                    }
                ]
            });

            let data = kepangPerbandinganHarga.map(item => {
                let list = item.list.map(itemlist => {
                    let count = 0;
                    let sum = 0;

                    for (let minggu of [itemlist.minggu1, itemlist.minggu2, itemlist.minggu3, itemlist.minggu4, itemlist.minggu5]) {
                        if (minggu !== null) {
                            sum += minggu;
                            count++;
                        }
                    }

                    return {
                        idList: itemlist.id,
                        idKomoditas: itemlist.komoditas.id,
                        nama: itemlist.komoditas.nama,
                        rerata: sum / count,
                        sum,
                        count,
                    }
                })

                let waktu = new Date(item.tanggal);
                return {
                    id: item.id,
                    tanggal: item.tanggal,
                    bulan: waktu.getMonth() + 1,
                    tahun: waktu.getFullYear(),
                    list
                };
            })

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar kepang perbandingan harga', { data, kepangPerbandinganHarga }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}