const { PspPenerimaUppo, PspBantuan, PspPupuk, Kecamatan, Desa, sequelize } = require('../models');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');
const exceljs = require('exceljs');

const v = new Validator();

module.exports = {
    bantuan: async (req, res) => {
        try {
            let { kecamatan, startDate, endDate } = req.query;

            let where = {};
            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }
            if (startDate) {
                startDate = new Date(startDate);
                startDate = dateGenerate(startDate);
                if (startDate instanceof Date && !isNaN(startDate)) {
                    where.periode = { [Op.gte]: startDate };
                }
            }
            if (endDate) {
                endDate = new Date(endDate);
                endDate = dateGenerate(endDate);
                if (endDate instanceof Date && !isNaN(endDate)) {
                    where.periode = { ...where.periode, [Op.lte]: endDate };
                }
            }

            const pspBantuan = await PspBantuan.findAll({
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
                order: [['periode', 'DESC'], ['kecamatanId', 'ASC'], ['desaId', 'ASC']],
                where,
            });

            if (pspBantuan.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("PSP Bantuan");

                worksheet.columns = [
                    { width: 5 },
                    { width: 20 },
                    { width: 25 },
                    { width: 25 },
                    { width: 25 },
                    { width: 25 },
                ];

                if (pspBantuan.length > 1) {
                    worksheet.getCell('A2').value = `DATA BANTUAN KABUPATEN LAMPUNG TIMUR PERIODE ${new Date(pspBantuan[pspBantuan.length - 1].periode).toLocaleDateString()} - ${new Date(pspBantuan[0].periode).toLocaleDateString()}`;
                } else {
                    worksheet.getCell('A2').value = `DATA BANTUAN KABUPATEN LAMPUNG TIMUR PERIODE ${new Date(pspBantuan[0].periode).toLocaleDateString()}`;
                }
                worksheet.mergeCells('A2:F2');

                worksheet.getRow(4).values = ['NO', 'PERIODE', 'KECAMATAN', 'DESA', 'JENIS BANTUAN', 'KETERANGAN'];

                let row = 5;
                pspBantuan.forEach((item, index) => {
                    worksheet.getRow(row).values = [`${index + 1}`, item.periode, item?.kecamatan?.nama || 'error', item?.desa?.nama || 'error', item.jenisBantuan, item.keterangan];
                    row++;
                });

                for (let i = 2; i <= 2; i++) {
                    ['A'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    })
                }

                for (let i = 4; i < row; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        if (i === 4) {
                            worksheet.getCell(cell).font = {
                                bold: true,
                            };
                        }
                    })
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "psp-bantuan.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data bantuan not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    penerimaUppo: async (req, res) => {
        try {
            let { kecamatan, year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let where = {
                tahun: year
            };
            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }

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
                order: [['createdAt', 'DESC'], ['kecamatanId', 'ASC'], ['desaId', 'ASC']],
                where,
            });

            if (pspPenerimaUppo.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("PSP Penerima UPPO");

                worksheet.columns = [
                    { width: 5 },
                    { width: 20 },
                    { width: 25 },
                    { width: 25 },
                    { width: 25 },
                    { width: 25 },
                ];

                worksheet.getCell('A2').value = `DATA PENERIMA UPPO KABUPATEN LAMPUNG TIMUR TAHUN ${year}`;
                worksheet.mergeCells('A2:F2');

                worksheet.getRow(4).values = ['NO', 'KECAMATAN', 'DESA', 'NAMA POKTAN', 'NAMA KETUA', 'TITIK KOORDINAT'];

                let row = 5;
                pspPenerimaUppo.forEach((item, index) => {
                    worksheet.getRow(row).values = [`${index + 1}`, item?.kecamatan?.nama || 'error', item?.desa?.nama || 'error', item.namaPoktan, item.ketuaPoktan, item.titikKoordinat];
                    row++;
                });

                for (let i = 2; i <= 2; i++) {
                    ['A'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    })
                }

                for (let i = 4; i < row; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        if (i === 4) {
                            worksheet.getCell(cell).font = {
                                bold: true,
                            };
                        }
                    })
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "psp-penerima-uppo.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data penerima uppo not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    pupuk: async (req, res) => {
        try {
            let { year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            const pspPupuk = await PspPupuk.findAll({
                order: [['createdAt', 'DESC'], ['jenisPupuk', 'ASC']],
                where: {
                    tahun: year
                },
            });

            if (pspPupuk.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("PSP Pupuk");

                worksheet.columns = [
                    { width: 5 },
                    { width: 20 },
                    { width: 25 },
                    { width: 25 },
                    { width: 25 },
                ];

                worksheet.getCell('A2').value = `DATA PUPUK KABUPATEN LAMPUNG TIMUR TAHUN ${year}`;

                worksheet.mergeCells('A2:E2');

                worksheet.getRow(4).values = ['NO', 'JENIS PUPUK', 'KANDUNGAN PUPUK', 'HARGA', 'KETERANGAN'];

                let row = 5;
                pspPupuk.forEach((item, index) => {
                    worksheet.getRow(row).values = [`${index + 1}`, item.jenisPupuk, item.kandunganPupuk, item.hargaPupuk, item.keterangan];
                    row++;
                });

                for (let i = 2; i <= 2; i++) {
                    ['A'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    })
                }

                for (let i = 4; i < row; i++) {
                    ['A', 'B', 'C', 'D', 'E'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        if (i === 4) {
                            worksheet.getCell(cell).font = {
                                bold: true,
                            };
                        }
                    })
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "psp-pupuk.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data pupuk not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}