const { PenyuluhKecamatan, PenyuluhKabupaten, Kecamatan, Desa, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');
const exceljs = require('exceljs');

const v = new Validator();

module.exports = {
    kabupaten: async (req, res) => {
        try {
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet("Kabupaten");

            const penyuluhKabupaten = await PenyuluhKabupaten.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            worksheet.columns = [
                { width: 5 },
                { width: 40 },
                { width: 25 },
                { width: 25 },
                { width: 40 },
                { width: 25 },
            ];

            worksheet.mergeCells('A5:F5');

            worksheet.getCell('E1').value = 'Lampiran :';
            worksheet.getCell('E2').value = 'Nomor :';
            worksheet.getCell('E3').value = 'Tanggal :';
            worksheet.getCell('A5').value = `DAFTAR PENEMPATAN PENYULUH PERTANIAN KABUPATEN LAMPUNG TIMUR TAHUN ${new Date().getFullYear()}`;
            worksheet.getCell('A6').value = `KABUPATEN`;

            worksheet.getRow(7).values = ['NO', 'NAMA', 'NIP', 'PANGKAT/GOL', 'Wilayah Desa Binaan', 'KETERANGAN'];
            worksheet.getRow(8).values = ['1', '2', '3', '4', '5', '6'];

            penyuluhKabupaten.forEach((item, index) => {
                let temp = '';
                item.kecamatan.forEach((kec, i) => {
                    temp += kec.nama;
                    if (i !== item.kecamatan.length) {
                        temp += ', ';
                    }
                });
                worksheet.getRow(index + 9).values = [index + 1, item.nama, item.nip, `${item.pangkat}/${item.golongan}`, temp, item.keterangan];
            });


            ['E1', 'E2', 'E3'].forEach(cell => {
                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
            });
            ['A5'].forEach(cell => {
                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(cell).font = {
                    bold: true,
                };
            });

            for (let i = 7; i <= 8 + penyuluhKabupaten.length; i++) {
                ['A', 'B', 'C', 'D', 'E', 'F'].forEach(j => {
                    let cell = `${j}${i}`;
                    worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(cell).border = {
                        bottom: { style: 'thin', color: { argb: '00000000' } },
                        right: { style: 'thin', color: { argb: '00000000' } },
                        left: { style: 'thin', color: { argb: '00000000' } },
                        top: { style: 'thin', color: { argb: '00000000' } },
                    };
                    if (i === 7 || i === 8) {
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    }
                })
            }

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=" + "penyuluh-kabupaten.xlsx");

            workbook.xlsx.write(res).then(() => res.end());
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    kecamatan: async (req, res) => {
        try {
            let { kecamatan } = req.params;

            kecamatan = isNaN(parseInt(kecamatan)) ? 0 : parseInt(kecamatan);

            const kec = await Kecamatan.findByPk(kecamatan);

            if (!kec) {
                res.status(404).json(response(404, 'Kecamatan not found'));
                return;
            }

            const workbook = new exceljs.Workbook();

            const penyuluhKecamatan = await PenyuluhKecamatan.findAll({
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
                    kecamatanId: kecamatan
                },
            });

            const worksheet = workbook.addWorksheet("Kecamatan " + kec.nama);

            worksheet.columns = [
                { width: 5 },
                { width: 40 },
                { width: 25 },
                { width: 25 },
                { width: 40 },
                { width: 25 },
            ];

            worksheet.mergeCells('A5:F5');

            worksheet.getCell('E1').value = 'Lampiran :';
            worksheet.getCell('E2').value = 'Nomor :';
            worksheet.getCell('E3').value = 'Tanggal :';
            worksheet.getCell('A5').value = `DAFTAR PENEMPATAN PENYULUH PERTANIAN KABUPATEN LAMPUNG TIMUR TAHUN ${new Date().getFullYear()}`;
            worksheet.getCell('A6').value = `KECAMATAN : ${kec.nama}`;

            worksheet.getRow(7).values = ['NO', 'NAMA', 'NIP', 'PANGKAT/GOL', 'Wilayah Desa Binaan', 'KETERANGAN'];
            worksheet.getRow(8).values = ['1', '2', '3', '4', '5', '6'];

            penyuluhKecamatan.forEach((item, index) => {
                let temp = '';
                item.desa.forEach((kec, i) => {
                    temp += kec.nama;
                    if (i !== item.desa.length) {
                        temp += ', ';
                    }
                });
                worksheet.getRow(index + 9).values = [index + 1, item.nama, item.nip, `${item.pangkat}/${item.golongan}`, temp, item.keterangan];
            });


            ['E1', 'E2', 'E3'].forEach(cell => {
                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
            });
            ['A5'].forEach(cell => {
                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(cell).font = {
                    bold: true,
                };
            });

            for (let i = 7; i <= 8 + penyuluhKecamatan.length; i++) {
                ['A', 'B', 'C', 'D', 'E', 'F'].forEach(j => {
                    let cell = `${j}${i}`;
                    worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.getCell(cell).border = {
                        bottom: { style: 'thin', color: { argb: '00000000' } },
                        right: { style: 'thin', color: { argb: '00000000' } },
                        left: { style: 'thin', color: { argb: '00000000' } },
                        top: { style: 'thin', color: { argb: '00000000' } },
                    };
                    if (i === 7 || i === 8) {
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    }
                })
            }

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=" + "penyuluh-kecamatan.xlsx");

            workbook.xlsx.write(res).then(() => res.end());
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}