const { PspPenerimaUppo, PspBantuan, Kecamatan, Desa, sequelize } = require('../models');
const { response, dateGenerate, getFirstLastDate } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let { uppoLimit, bantuanLimit, type } = req.query;

            bantuanLimit = isNaN(parseInt(bantuanLimit)) ? 10 : parseInt(bantuanLimit);
            uppoLimit = isNaN(parseInt(uppoLimit)) ? 10 : parseInt(uppoLimit);

            type = ['year', 'month', 'week', 'today'].includes(type ?? '') ? type : 'year';

            let start = dateGenerate(new Date());
            let end = dateGenerate(new Date());

            let bantuanWhere = {};
            let uppoWhere = {};

            if (type === 'year') {
                start.setFullYear(start.getFullYear(), 1, 1);
                end.setFullYear(end.getFullYear() + 1, 1, 0);
                end.setHours(30, 59, 59, 999);
            } else if (type === 'month') {
                const { first, last } = getFirstLastDate(start);
                start = first;
                end = last;
            } else if (type === 'week') {
                start.setDate(start.getDate() - 7);
                end.setHours(30, 59, 59, 999);
            } else if (type === 'today') {
                start.setHours(0, 0, 0);
                end.setHours(30, 59, 59, 999);
            }

            bantuanWhere.periode = { [Op.between]: [start, end] };
            uppoWhere.tahun = start.getFullYear();

            const bantuanSubsidiCount = await PspBantuan.count({
                where: {
                    ...bantuanWhere,
                    jenisBantuan: { [Op.like]: 'subsidi' }
                }
            });
            const bantuanNonSubsidiCount = await PspBantuan.count({
                where: {
                    ...bantuanWhere,
                    jenisBantuan: { [Op.like]: 'non-subsidi' }
                }
            });
            const uppoCount = await PspPenerimaUppo.count({ where: uppoWhere });

            const pspPenerimaUppo = await PspPenerimaUppo.findAll({
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
                limit: uppoLimit,
                where: uppoWhere,
            });
            const pspBantuanSubsidi = await PspBantuan.findAll({
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
                where: {
                    ...bantuanWhere,
                    jenisBantuan: { [Op.like]: 'subsidi' }
                },
                limit: bantuanLimit,
            });
            const pspBantuanNonSubsidi = await PspBantuan.findAll({
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
                where: {
                    ...bantuanWhere,
                    jenisBantuan: { [Op.like]: 'non-subsidi' }
                },
                limit: bantuanLimit,
            });

            res.status(200).json(response(200, 'Get PSP dashboard data successfully', {
                bantuanNonSubsidiCount,
                bantuanSubsidiCount,
                uppoCount,
                pspBantuanNonSubsidi,
                pspBantuanSubsidi,
                pspPenerimaUppo,
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