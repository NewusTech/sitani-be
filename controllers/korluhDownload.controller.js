const { KorluhPadi, Kecamatan, Desa, sequelize } = require('../models');
const PADI = require('./validasiKorluhPadi.controller');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');
const exceljs = require('exceljs');

const v = new Validator();

module.exports = {
    padi: async (req, res) => {
        try {
            let { kecamatan, bulan } = req.query;

            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            kecamatan = isNaN(parseInt(kecamatan)) ? 0 : parseInt(kecamatan);
            bulan = isNaN(new Date(bulan)) ? monthAgo : new Date(bulan);

            const kec = await Kecamatan.findByPk(kecamatan);

            let current = await KorluhPadi.findAll({
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            if (current.length) {
                let temp = [];

                current = PADI.dataMap(current, bulan, kec);

                bulan.setMonth(bulan.getMonth() - 1);

                before = await PADI.getSum(bulan, kecamatan);

                current = PADI.combineData(current, before);

                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Laporan Luas Tanaman Padi");

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

                for (let i = 1; i <= 36; i++) {
                    temp.push({ width: 5 });
                }
                worksheet.columns = temp;

                worksheet.getCell('A1').value = `BADAN PUSAT STATISTIK`;
                worksheet.getCell('A2').value = `DAN`;
                worksheet.getCell('A3').value = `KEMENTRIAN PERTANIAN`;

                ['1', '2', '3'].forEach(i => {
                    worksheet.mergeCells(`A${i}:E${i}`);
                    worksheet.getCell(`A${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
                })

                worksheet.getCell('F3').value = `LAPORAN LUAS TANAMAN PADI`;
                worksheet.getCell('F4').value = `(Isian dalam hektar bilangan bulat)`;

                worksheet.getCell('F3').font = {
                    bold: true,
                };
                ['3', '4'].forEach(i => {
                    worksheet.mergeCells(`F${i}:AE${i}`);
                    worksheet.getCell(`F${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
                })

                worksheet.getCell('AF3').value = `SP-PADI`;

                worksheet.getCell('AF3').font = {
                    bold: true,
                };
                worksheet.mergeCells(`AF3:AJ3`);
                worksheet.getCell(`AF3`).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('A5').value = `PROVINSI`;
                worksheet.getCell('A6').value = `KAB/KOTA`;
                worksheet.getCell('A7').value = `KECAMATAN`;

                worksheet.getCell('D5').value = `LAMPUNG`;
                worksheet.getCell('D6').value = `LAMPUNG TIMUR`;
                worksheet.getCell('D7').value = `${kec?.nama || ''}`;

                ['I7', 'J5', 'J6', 'J7', 'K5', 'K6', 'K7'].forEach(cell => {
                    worksheet.getCell(cell).border = {
                        bottom: { style: 'thin', color: { argb: '00000000' } },
                        right: { style: 'thin', color: { argb: '00000000' } },
                        left: { style: 'thin', color: { argb: '00000000' } },
                        top: { style: 'thin', color: { argb: '00000000' } },
                    };
                })

                worksheet.getCell('AE6').value = `Bulan : ${bulans[bulan.getMonth()]}`;
                worksheet.getCell('AE7').value = `Tahun : ${bulan.getFullYear()}`;

                ['AI6', 'AI7', 'AJ6', 'AJ7'].forEach(cell => {
                    worksheet.getCell(cell).border = {
                        bottom: { style: 'thin', color: { argb: '00000000' } },
                        right: { style: 'thin', color: { argb: '00000000' } },
                        left: { style: 'thin', color: { argb: '00000000' } },
                        top: { style: 'thin', color: { argb: '00000000' } },
                    };
                })

                worksheet.getCell('A8').value = `No`;
                worksheet.getCell('B8').value = `Uraian`;

                worksheet.mergeCells(`A8:A9`);
                worksheet.mergeCells(`B8:F9`);

                worksheet.getCell('G8').value = `LAHAN SAWAH`;

                worksheet.getCell('G9').value = `Tanaman Akhir Bulan Yang Lalu`;
                worksheet.getCell('J9').value = `Panen`;
                worksheet.getCell('M9').value = `Tanam`;
                worksheet.getCell('P9').value = `Puso`;
                worksheet.getCell('S9').value = `Tanaman Akhir Bulan Laporan ((3)-(4)+(5)-(6))`;

                worksheet.mergeCells(`G8:U8`);

                worksheet.mergeCells(`G9:I9`);
                worksheet.mergeCells(`J9:L9`);
                worksheet.mergeCells(`M9:O9`);
                worksheet.mergeCells(`P9:R9`);
                worksheet.mergeCells(`S9:U9`);

                worksheet.getCell('V8').value = `LAHAN BUKAN SAWAH`;

                worksheet.getCell('V9').value = `Tanaman Akhir Bulan Yang Lalu`;
                worksheet.getCell('Y9').value = `Panen`;
                worksheet.getCell('AB9').value = `Tanam`;
                worksheet.getCell('AE9').value = `Puso`;
                worksheet.getCell('AH9').value = `Tanaman Akhir Bulan Laporan ((3)-(4)+(5)-(6))`;

                worksheet.mergeCells(`V8:AJ8`);

                worksheet.mergeCells(`V9:X9`);
                worksheet.mergeCells(`Y9:AA9`);
                worksheet.mergeCells(`AB9:AD9`);
                worksheet.mergeCells(`AE9:AG9`);
                worksheet.mergeCells(`AH9:AJ9`);

                worksheet.getCell('A10').value = `(1)`;
                worksheet.getCell('B10').value = `(2)`;

                worksheet.getCell('G10').value = `(3)`;
                worksheet.getCell('J10').value = `(4)`;
                worksheet.getCell('M10').value = `(5)`;
                worksheet.getCell('P10').value = `(6)`;
                worksheet.getCell('S10').value = `(7)`;

                worksheet.getCell('V10').value = `(8)`;
                worksheet.getCell('Y10').value = `(9)`;
                worksheet.getCell('AB10').value = `(10)`;
                worksheet.getCell('AE10').value = `(11)`;
                worksheet.getCell('AH10').value = `(12)`;

                worksheet.getCell('A12').value = `1.`;
                worksheet.getCell('A20').value = `2.`;

                temp = 11;
                for (let x of [
                    'JUMLAH PADI',
                    'Jenis Padi',
                    'a. Hibrida',
                    '1). Bantuan Pemerintah',
                    '2). Non Bantuan Pemerintah',
                    'b. Unggul (Non Hibrida)',
                    '1). Bantuan Pemerintah',
                    '2). Non Bantuan Pemerintah',
                    'c. Lokal',
                    'Jenis Pengairan',
                    'a. Sawah Irigasi',
                    'b. Sawah Tadah Hujan',
                    'c. Sawah Rawa Pasang Surut',
                    'd. Sawah Rawa Lebak',
                ]) {
                    worksheet.getCell(`B${temp}`).value = `${x}`;
                    temp++;
                }

                temp = ['G', 'J', 'M', 'P', 'S', 'V', 'Y', 'AB', 'AE', 'AH'];
                [
                    "bulan_lalu_jumlah_padi_lahan_sawah",
                    "jumlah_padi_lahan_sawah_panen",
                    "jumlah_padi_lahan_sawah_tanam",
                    "jumlah_padi_lahan_sawah_puso",
                    "akhir_jumlah_padi_lahan_sawah",
                    "bulan_lalu_jumlah_padi_lahan_bukan_sawah",
                    "jumlah_padi_lahan_bukan_sawah_panen",
                    "jumlah_padi_lahan_bukan_sawah_tanam",
                    "jumlah_padi_lahan_bukan_sawah_puso",
                    "akhir_jumlah_padi_lahan_bukan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}11`).value = `${current[x] || ''}`;
                });


                [
                    "bulan_lalu_hibrida_lahan_sawah",
                    "hibrida_lahan_sawah_panen",
                    "hibrida_lahan_sawah_tanam",
                    "hibrida_lahan_sawah_puso",
                    "akhir_hibrida_lahan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}13`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_hibrida_bantuan_pemerintah_lahan_sawah",
                    "hibrida_bantuan_pemerintah_lahan_sawah_panen",
                    "hibrida_bantuan_pemerintah_lahan_sawah_tanam",
                    "hibrida_bantuan_pemerintah_lahan_sawah_puso",
                    "akhir_hibrida_bantuan_pemerintah_lahan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}14`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_hibrida_non_bantuan_pemerintah_lahan_sawah",
                    "hibrida_non_bantuan_pemerintah_lahan_sawah_panen",
                    "hibrida_non_bantuan_pemerintah_lahan_sawah_tanam",
                    "hibrida_non_bantuan_pemerintah_lahan_sawah_puso",
                    "akhir_hibrida_non_bantuan_pemerintah_lahan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}15`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_unggul_lahan_sawah",
                    "unggul_lahan_sawah_panen",
                    "unggul_lahan_sawah_tanam",
                    "unggul_lahan_sawah_puso",
                    "akhir_unggul_lahan_sawah",
                    "bulan_lalu_unggul_lahan_bukan_sawah",
                    "unggul_lahan_bukan_sawah_panen",
                    "unggul_lahan_bukan_sawah_tanam",
                    "unggul_lahan_bukan_sawah_puso",
                    "akhir_unggul_lahan_bukan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}16`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_unggul_bantuan_pemerintah_lahan_sawah",
                    "unggul_bantuan_pemerintah_lahan_sawah_panen",
                    "unggul_bantuan_pemerintah_lahan_sawah_tanam",
                    "unggul_bantuan_pemerintah_lahan_sawah_puso",
                    "akhir_unggul_bantuan_pemerintah_lahan_sawah",
                    "bulan_lalu_unggul_bantuan_pemerintah_lahan_bukan_sawah",
                    "unggul_bantuan_pemerintah_lahan_bukan_sawah_panen",
                    "unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam",
                    "unggul_bantuan_pemerintah_lahan_bukan_sawah_puso",
                    "akhir_unggul_bantuan_pemerintah_lahan_bukan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}17`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_unggul_non_bantuan_pemerintah_lahan_sawah",
                    "unggul_non_bantuan_pemerintah_lahan_sawah_panen",
                    "unggul_non_bantuan_pemerintah_lahan_sawah_tanam",
                    "unggul_non_bantuan_pemerintah_lahan_sawah_puso",
                    "akhir_unggul_non_bantuan_pemerintah_lahan_sawah",
                    "bulan_lalu_unggul_non_bantuan_pemerintah_lahan_bukan_sawah",
                    "unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen",
                    "unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam",
                    "unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso",
                    "akhir_unggul_non_bantuan_pemerintah_lahan_bukan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}18`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_lokal_lahan_sawah",
                    "lokal_lahan_sawah_panen",
                    "lokal_lahan_sawah_tanam",
                    "lokal_lahan_sawah_puso",
                    "akhir_lokal_lahan_sawah",
                    "bulan_lalu_lokal_lahan_bukan_sawah",
                    "lokal_lahan_bukan_sawah_panen",
                    "lokal_lahan_bukan_sawah_tanam",
                    "lokal_lahan_bukan_sawah_puso",
                    "akhir_lokal_lahan_bukan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}19`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_sawah_irigasi_lahan_sawah",
                    "sawah_irigasi_lahan_sawah_panen",
                    "sawah_irigasi_lahan_sawah_tanam",
                    "sawah_irigasi_lahan_sawah_puso",
                    "akhir_sawah_irigasi_lahan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}21`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_sawah_tadah_hujan_lahan_sawah",
                    "sawah_tadah_hujan_lahan_sawah_panen",
                    "sawah_tadah_hujan_lahan_sawah_tanam",
                    "sawah_tadah_hujan_lahan_sawah_puso",
                    "akhir_sawah_tadah_hujan_lahan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}22`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_sawah_rawa_pasang_surut_lahan_sawah",
                    "sawah_rawa_pasang_surut_lahan_sawah_panen",
                    "sawah_rawa_pasang_surut_lahan_sawah_tanam",
                    "sawah_rawa_pasang_surut_lahan_sawah_puso",
                    "akhir_sawah_rawa_pasang_surut_lahan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}23`).value = `${current[x] || ''}`;
                });

                [
                    "bulan_lalu_sawah_rawa_lebak_lahan_sawah",
                    "sawah_rawa_lebak_lahan_sawah_panen",
                    "sawah_rawa_lebak_lahan_sawah_tanam",
                    "sawah_rawa_lebak_lahan_sawah_puso",
                    "akhir_sawah_rawa_lebak_lahan_sawah",
                ].forEach((x, idx) => {
                    worksheet.getCell(`${temp[idx]}24`).value = `${current[x] || ''}`;
                });

                worksheet.getCell('Y26').value = `KCD/Mantri Tani`;

                worksheet.getCell('Y27').value = `1. Nama Lengkap`;
                worksheet.getCell('Y28').value = `2. NIP`;
                worksheet.getCell('Y29').value = `3. No. Telp/HP`;
                worksheet.getCell('Y31').value = `4. Tanda Tangan`;

                for (let i = 8; i <= 24; i++) {
                    for (let j = 'A'.charCodeAt(0); j <= 'Z'.charCodeAt(0); j++) {
                        let cell = `${String.fromCharCode(j)}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                        if ((j < 'B'.charCodeAt(0) || j > 'F'.charCodeAt(0)) || i <= 10) {
                            worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                    for (let j = 'A'.charCodeAt(0); j <= 'J'.charCodeAt(0); j++) {
                        let cell = `A${String.fromCharCode(j)}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                    if (i >= 10) {
                        worksheet.mergeCells(`B${i}:F${i}`);

                        worksheet.mergeCells(`G${i}:I${i}`);
                        worksheet.mergeCells(`J${i}:L${i}`);
                        worksheet.mergeCells(`M${i}:O${i}`);
                        worksheet.mergeCells(`P${i}:R${i}`);
                        worksheet.mergeCells(`S${i}:U${i}`);

                        worksheet.mergeCells(`V${i}:X${i}`);
                        worksheet.mergeCells(`Y${i}:AA${i}`);
                        worksheet.mergeCells(`AB${i}:AD${i}`);
                        worksheet.mergeCells(`AE${i}:AG${i}`);
                        worksheet.mergeCells(`AH${i}:AJ${i}`);
                    }
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "laporan-luas-tanaman-padi.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data korluh padi not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}