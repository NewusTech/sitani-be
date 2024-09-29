const { PspAlsintanPascapanen, PspAlsintanPrapanen, Kecamatan, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const getSum = (arr) => {
    let sum = null;
    for (let temp of arr) {
        if (temp) {
            sum = sum ? Number(sum) + Number(temp) : Number(temp);
        }
    }
    return sum;
}

module.exports = {
    getKecamatan: async (req, res) => {
        try {
            let { kecamatan, year } = req.query;

            kecamatan = isNaN(parseInt(kecamatan)) ? null : parseInt(kecamatan);
            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            const kecamatanList = await Kecamatan.findAll();

            let data = [];
            for (let kec of kecamatanList) {
                if (kec.id === kecamatan || !kecamatan) {
                    const where = {
                        kecamatanId: kec.id,
                        tahun: year,
                    };

                    const pspAlsintanPascapanen = await PspAlsintanPascapanen.findOne({ where });
                    const pspAlsintanPrapanen = await PspAlsintanPrapanen.findOne({ where });

                    if (pspAlsintanPascapanen || pspAlsintanPrapanen) {
                        data.push({
                            kecamatanId: kec.id,
                            kecamatan: kec.nama,
                            // pascapanen
                            power_thresher: getSum([
                                pspAlsintanPascapanen?.power_thresher_apbn,
                                pspAlsintanPascapanen?.power_thresher_tp,
                                pspAlsintanPascapanen?.power_thresher_apbd,
                            ]),
                            corn_sheller: getSum([
                                pspAlsintanPascapanen?.corn_sheller_apbn,
                                pspAlsintanPascapanen?.corn_sheller_tp,
                                pspAlsintanPascapanen?.corn_sheller_apbd,
                            ]),
                            ptm_mobile: getSum([
                                pspAlsintanPascapanen?.ptm_mobile_apbn,
                                pspAlsintanPascapanen?.ptm_mobile_tp,
                                pspAlsintanPascapanen?.ptm_mobile_apbd,
                            ]),
                            cs_mobile: getSum([
                                pspAlsintanPascapanen?.cs_mobile_apbn,
                                pspAlsintanPascapanen?.cs_mobile_tp,
                                pspAlsintanPascapanen?.cs_mobile_apbd,
                            ]),
                            chb: getSum([
                                pspAlsintanPascapanen?.chb_apbn,
                                pspAlsintanPascapanen?.chb_tp,
                                pspAlsintanPascapanen?.chb_apbd,
                            ]),
                            chk: getSum([
                                pspAlsintanPascapanen?.chk_apbn,
                                pspAlsintanPascapanen?.chk_tp,
                                pspAlsintanPascapanen?.chk_apbd,
                            ]),
                            ptm: getSum([
                                pspAlsintanPascapanen?.ptm_apbn,
                                pspAlsintanPascapanen?.ptm_tp,
                                pspAlsintanPascapanen?.ptm_apbd,
                            ]),
                            // prapanen
                            hand_sprayer: getSum([
                                pspAlsintanPrapanen?.hand_sprayer_apbn,
                                pspAlsintanPrapanen?.hand_sprayer_tp,
                                pspAlsintanPrapanen?.hand_sprayer_apbd,
                            ]),
                            cornplanter: getSum([
                                pspAlsintanPrapanen?.cornplanter_apbn,
                                pspAlsintanPrapanen?.cornplanter_tp,
                                pspAlsintanPrapanen?.cornplanter_apbd,
                            ]),
                            cultivator: getSum([
                                pspAlsintanPrapanen?.cultivator_apbn,
                                pspAlsintanPrapanen?.cultivator_tp,
                                pspAlsintanPrapanen?.cultivator_apbd,
                            ]),
                            pompa_air: getSum([
                                pspAlsintanPrapanen?.pompa_air_apbn,
                                pspAlsintanPrapanen?.pompa_air_tp,
                                pspAlsintanPrapanen?.pompa_air_apbd,
                            ]),
                            tr_4: getSum([
                                pspAlsintanPrapanen?.tr_4_apbn,
                                pspAlsintanPrapanen?.tr_4_tp,
                                pspAlsintanPrapanen?.tr_4_apbd,
                            ]),
                            tr_2: getSum([
                                pspAlsintanPrapanen?.tr_2_apbn,
                                pspAlsintanPrapanen?.tr_2_tp,
                                pspAlsintanPrapanen?.tr_2_apbd,
                            ]),
                            rt: getSum([
                                pspAlsintanPrapanen?.rt_apbn,
                                pspAlsintanPrapanen?.rt_tp,
                                pspAlsintanPrapanen?.rt_apbd,
                            ]),
                        });
                    }
                }
            }

            res.status(200).json(response(200, 'Get PSP alsintan kecamatan successfully', {
                tahun: year,
                data,
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