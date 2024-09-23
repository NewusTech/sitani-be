const {
    KorluhMasterSayurBuah,
    KorluhMasterPalawija,
    KorluhSayurBuahList,
    KorluhPalawijaList,
    KorluhSayurBuah,
    KorluhPalawija,
    KorluhPadi,
    Kecamatan,
    sequelize
} = require('../models');
const SAYURBUAH = require('./validasiKorluhSayurBuah.controller');
const PALAWIJA = require('./validasiKorluhPalawija.controller');
const PADI = require('./validasiKorluhPadi.controller');
const { response, fixedNumber } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
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
                bulan.setMonth(bulan.getMonth() + 1);

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

    palawija: async (req, res) => {
        try {
            let { kecamatan, bulan } = req.query;

            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            kecamatan = isNaN(parseInt(kecamatan)) ? 0 : parseInt(kecamatan);
            bulan = isNaN(new Date(bulan)) ? monthAgo : new Date(bulan);

            const kec = await Kecamatan.findByPk(kecamatan);

            let current = await KorluhPalawija.findAll({
                include: [
                    {
                        model: KorluhPalawijaList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterPalawija,
                                as: 'master'
                            }
                        ]
                    }
                ],
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

                current = PALAWIJA.dataMap(current, bulan, kec);

                bulan.setMonth(bulan.getMonth() - 1);

                before = await PALAWIJA.getSum(bulan, kecamatan);

                current = PALAWIJA.combineData(current, before);

                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Laporan Luas Tanaman Palawija");

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                bulan.setMonth(bulan.getMonth() + 1);

                for (let i = 1; i <= 51; i++) {
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

                worksheet.getCell('F3').value = `LAPORAN LUAS TANAMAN PALAWIJA`;

                worksheet.getCell('F3').font = {
                    bold: true,
                };
                ['3'].forEach(i => {
                    worksheet.mergeCells(`F${i}:AT${i}`);
                    worksheet.getCell(`F${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
                })

                worksheet.getCell('AU3').value = `SP-PALAWIJA`;

                worksheet.getCell('AU3').font = {
                    bold: true,
                };
                worksheet.mergeCells(`AU3:AY3`);
                worksheet.getCell(`AU3`).alignment = { vertical: 'middle', horizontal: 'center' };

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

                worksheet.getCell('AT6').value = `Bulan : ${bulans[bulan.getMonth()]}`;
                worksheet.getCell('AT7').value = `Tahun : ${bulan.getFullYear()}`;

                ['AX6', 'AX7', 'AY6', 'AY7'].forEach(cell => {
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

                worksheet.getCell('G8').value = `LAHAN SAWAH (Isian dalam hektar bilangan desimal satu angka di belakang koma)`;

                worksheet.getCell('G9').value = `Tanaman Akhir Bulan Yang Lalu`;
                worksheet.getCell('J9').value = `Panen *)`;
                worksheet.getCell('M9').value = `Panen Muda **)`;
                worksheet.getCell('P9').value = `Panen Untuk Hijauan Pakan Ternak ***)`;
                worksheet.getCell('S9').value = `Tanam`;
                worksheet.getCell('V9').value = `Puso/rusak`;
                worksheet.getCell('Y9').value = `Tanaman Akhir Bulan Laporan ((3)-(4)-(5)-(6)+(7)-(8))`;

                worksheet.mergeCells(`G8:AA8`);

                worksheet.mergeCells(`G9:I9`);
                worksheet.mergeCells(`J9:L9`);
                worksheet.mergeCells(`M9:O9`);
                worksheet.mergeCells(`P9:R9`);
                worksheet.mergeCells(`S9:U9`);
                worksheet.mergeCells(`V9:X9`);
                worksheet.mergeCells(`Y9:AA9`);

                worksheet.getCell('AB8').value = `LAHAN BUKAN SAWAH (Isian dalam hektar bilangan desimal satu angka di belakang koma)`;

                worksheet.getCell('AB9').value = `Tanaman Akhir Bulan Yang Lalu`;
                worksheet.getCell('AE9').value = `Panen *)`;
                worksheet.getCell('AH9').value = `Panen Muda **)`;
                worksheet.getCell('AK9').value = `Panen Untuk Hijauan Pakan Ternak ***)`;
                worksheet.getCell('AN9').value = `Tanam`;
                worksheet.getCell('AQ9').value = `Puso/rusak`;
                worksheet.getCell('AT9').value = `Tanaman Akhir Bulan Laporan ((3)-(4)-(5)-(6)+(7)-(8))`;

                worksheet.mergeCells(`AB8:AV8`);

                worksheet.mergeCells(`AB9:AD9`);
                worksheet.mergeCells(`AE9:AG9`);
                worksheet.mergeCells(`AH9:AJ9`);
                worksheet.mergeCells(`AK9:AM9`);
                worksheet.mergeCells(`AN9:AP9`);
                worksheet.mergeCells(`AQ9:AS9`);
                worksheet.mergeCells(`AT9:AV9`);

                worksheet.getCell('AW8').value = `Produksi di Lahan Sawah dan Lahan Bukan Sawah (Ton)`;

                worksheet.mergeCells(`AW8:AY9`);

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
                worksheet.getCell('AK10').value = `(13)`;
                worksheet.getCell('AN10').value = `(14)`;
                worksheet.getCell('AQ10').value = `(15)`;
                worksheet.getCell('AT10').value = `(16)`;

                worksheet.getCell('AW10').value = `(17)`;

                [11, 17, 20, 21, 24, 25, 26, 27, 28, 29, 30].forEach((item, index) => {
                    worksheet.getCell(`A${item}`).value = `${index + 1}.`;
                })

                temp = 11;
                for (let x of [
                    'JUMLAH JAGUNG',
                    'a. Hibrida',
                    '1). Bantuan Pemerintah',
                    '2). Non Bantuan Pemerintah',
                    'b. Komposit',
                    'c. Lokal',
                    'KEDELAI',
                    'a. Bantuan Pemerintah',
                    'b. Non Bantuan Pemerintah',
                    'KACANG TANAH',
                    'JUMLAH UBI KAYU/SINGKONG',
                    'a. Bantuan Pemerintah',
                    'b. Non Bantuan Pemerintah',
                    'UBI JALAR/KETELA RAMBAT',
                    'KACANG HIJAU',
                    'SORGUM/CANTEL',
                    'GANDUM',
                    'TALAS',
                    'GANYONG',
                    'UMBI LAINNYA',
                ]) {
                    worksheet.getCell(`B${temp}`).value = `${x}`;
                    temp++;
                }

                temp = 11;
                columns = ['G', 'J', 'M', 'P', 'S', 'V', 'Y', 'AB', 'AE', 'AH', 'AK', 'AN', 'AQ', 'AT', 'AW'];
                [17, 18, 1, 2, 3, 4, 19, 5, 6, 7, 20, 8, 9, 10, 11, 12, 13, 14, 15, 16].forEach(i => {
                    if (current[i]) {
                        const newCurrent = fixedNumber(current[i], 1);
                        [
                            "bulanLaluLahanSawah",
                            "lahanSawahPanen",
                            "lahanSawahPanenMuda",
                            "lahanSawahPanenHijauanPakanTernak",
                            "lahanSawahTanam",
                            "lahanSawahPuso",
                            "akhirLahanSawah",

                            "bulanLaluLahanBukanSawah",
                            "lahanBukanSawahPanen",
                            "lahanBukanSawahPanenMuda",
                            "lahanBukanSawahPanenHijauanPakanTernak",
                            "lahanBukanSawahTanam",
                            "lahanBukanSawahPuso",
                            "akhirLahanBukanSawah",

                            "produksi",
                        ].forEach((j, idx) => {
                            worksheet.getCell(`${columns[idx]}${temp}`).value = newCurrent[j] ? `${newCurrent[j]}` : '';
                        });
                    }
                    temp++;
                });

                worksheet.getCell(`A${temp}`).value = `Keterangan :`;
                worksheet.getCell(`AK${temp}`).value = `${kec?.nama || ''}, __ ${bulans[bulan.getMonth()]} ${bulan.getFullYear()}`;
                temp++;
                worksheet.getCell(`A${temp}`).value = `Bantuan pemerintah pada satu musim tanam/panen tahun berjalan`;
                worksheet.getCell(`AK${temp}`).value = `Petugas Pengumpulan Data :`;
                temp++;
                worksheet.getCell(`A${temp}`).value = `*)`;
                worksheet.getCell(`B${temp}`).value = `Panen untuk jagung adalah yang menghasilkan pipilan kering; untuk kedelai menghasilkan biji kering.`;
                worksheet.getCell(`AK${temp}`).value = `1. Nama Lengkap  :`;
                temp++;
                worksheet.getCell(`B${temp}`).value = `Khusus untuk kacang hijau adalah luas panen yang telah dibongkar habis.`;
                worksheet.getCell(`AK${temp}`).value = `2. Jabatan       :`;
                temp++;
                worksheet.getCell(`A${temp}`).value = `**)`;
                worksheet.getCell(`B${temp}`).value = `Panen muda untuk jagung adalah yang tidak menghasilkan pipilan kering; kedelai tidak menghasilkan biji kering.`;
                worksheet.getCell(`AK${temp}`).value = `3. NIP           :`;
                temp++;
                worksheet.getCell(`A${temp}`).value = `***)`;
                worksheet.getCell(`B${temp}`).value = `Seluruh bagian tanaman jagung (daun, batang dan buah) dipanen/digunakan untuk pakan ternak`;
                worksheet.getCell(`AK${temp}`).value = `4. No. Telp/HP   :`;
                temp += 2;
                worksheet.getCell(`AK${temp}`).value = `5. Tanda Tangan  :`;

                for (let i = 8; i <= 30; i++) {
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
                    for (let j = 'A'.charCodeAt(0); j <= 'W'.charCodeAt(0); j++) {
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
                        worksheet.mergeCells(`AK${i}:AM${i}`);
                        worksheet.mergeCells(`AN${i}:AP${i}`);
                        worksheet.mergeCells(`AQ${i}:AS${i}`);
                        worksheet.mergeCells(`AT${i}:AV${i}`);

                        worksheet.mergeCells(`AW${i}:AY${i}`);
                    }
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "laporan-luas-tanaman-palawija.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data korluh palawija not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    sayurBuah: async (req, res) => {
        try {
            let { kecamatan, bulan } = req.query;

            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            kecamatan = isNaN(parseInt(kecamatan)) ? 0 : parseInt(kecamatan);
            bulan = isNaN(new Date(bulan)) ? monthAgo : new Date(bulan);

            const kec = await Kecamatan.findByPk(kecamatan);

            let current = await KorluhSayurBuah.findAll({
                include: [
                    {
                        model: KorluhSayurBuahList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterSayurBuah,
                                as: 'master'
                            }
                        ]
                    }
                ],
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

                current = SAYURBUAH.dataMap(current, bulan, kec);

                bulan.setMonth(bulan.getMonth() - 1);

                before = await SAYURBUAH.getSum(bulan, kecamatan);

                current = SAYURBUAH.combineData(current, before);

                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Laporan Luas Tanaman Sayur Dan Buah");

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                bulan.setMonth(bulan.getMonth() + 1);

                for (let i = 1; i <= 41; i++) {
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

                worksheet.getCell('F3').value = `LAPORAN TANAMAN SAYURAN DAN BUAH-BUAHAN SEMUSIM`;
                worksheet.getCell('F4').value = `(Isian dalam bilangan desimal dengan 2 angka di belakang koma)`;

                worksheet.getCell('F3').font = {
                    bold: true,
                };
                [3, 4].forEach(i => {
                    worksheet.mergeCells(`F${i}:AJ${i}`);
                    worksheet.getCell(`F${i}`).alignment = { vertical: 'middle', horizontal: 'center' };
                })

                worksheet.getCell('AK3').value = `SPH-SBS`;

                worksheet.getCell('AK3').font = {
                    bold: true,
                };
                worksheet.mergeCells(`AK3:AO3`);
                worksheet.getCell(`AK3`).alignment = { vertical: 'middle', horizontal: 'center' };

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

                worksheet.getCell('AJ6').value = `Bulan : ${bulans[bulan.getMonth()]}`;
                worksheet.getCell('AJ7').value = `Tahun : ${bulan.getFullYear()}`;

                ['AN6', 'AN7', 'AO6', 'AO7'].forEach(cell => {
                    worksheet.getCell(cell).border = {
                        bottom: { style: 'thin', color: { argb: '00000000' } },
                        right: { style: 'thin', color: { argb: '00000000' } },
                        left: { style: 'thin', color: { argb: '00000000' } },
                        top: { style: 'thin', color: { argb: '00000000' } },
                    };
                })

                worksheet.getCell('A8').value = `No`;
                worksheet.getCell('B8').value = `Nama Tanaman`;

                worksheet.mergeCells(`A8:A9`);
                worksheet.mergeCells(`B8:F9`);

                worksheet.getCell('G8').value = `Hasil Produksi yang dicatat`;

                worksheet.mergeCells(`G8:I9`);

                worksheet.getCell('J8').value = `Luas Tanaman Akhir Bulan yang Lalu (Hektar)`;

                worksheet.mergeCells(`J8:L9`);

                worksheet.getCell('M8').value = `Luas Panen (Hektar)`;

                worksheet.getCell('M9').value = `Habis / Dibongkar`;
                worksheet.getCell('P9').value = `Belum Habis`;

                worksheet.mergeCells(`M8:R8`);

                worksheet.mergeCells(`M9:O9`);
                worksheet.mergeCells(`P9:R9`);

                worksheet.getCell('S8').value = `Luas Rusak / Tidak Berhasil / Puso (Hektar)`;

                worksheet.mergeCells(`S8:U9`);

                worksheet.getCell('V8').value = `Luas Penanaman Baru / Tambah Tanam (Hektar)`;

                worksheet.mergeCells(`V8:X9`);

                worksheet.getCell('Y8').value = `Luas Tanaman Akhir Bulan Laporan (Hektar) (4)-(5)-(7)+(8)`;

                worksheet.mergeCells(`Y8:AA9`);

                worksheet.getCell('AB8').value = `Produksi (Kuintal)`;

                worksheet.getCell('AB9').value = `Dipanen Habis / Dibongkar`;
                worksheet.getCell('AE9').value = `Belum Habis`;

                worksheet.mergeCells(`AB8:AG8`);

                worksheet.mergeCells(`AB9:AD9`);
                worksheet.mergeCells(`AE9:AG9`);

                worksheet.getCell('AH8').value = `Rata rata Harga Jual di petani per Kilogram (Rupiah)`;

                worksheet.mergeCells(`AH8:AJ9`);

                worksheet.getCell('AK8').value = `Keterangan`;

                worksheet.mergeCells(`AK8:AO9`);

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
                worksheet.getCell('AK10').value = `(13)`;

                temp = 11;
                [
                    "Bawang Daun",
                    "Bawang Merah",
                    "Bawang Putih",
                    "Kembang Kol",
                    "Kentang",
                    "Kubis",
                    "Petsai/Sawi",
                    "Wortel",
                    "Bayam",
                    "Buncis",
                    "Cabai Besar/TW/Teropong",
                    "Cabai Keriting",
                    "Cabai Rawit",
                    "Jamur Tiram*)",
                    "Jamur Merang*)",
                    "Jamur Lainnya*)",
                    "Kacang Panjang",
                    "Kangkung",
                    "Mentimun",
                    "Labu Siam",
                    "Paprika",
                    "Terung",
                    "Tomat",
                    "Melon",
                    "Semangka",
                    "Stroberi",
                ].forEach((x, idx) => {
                    worksheet.getCell(`A${temp}`).value = `${idx + 1}`;
                    worksheet.getCell(`B${temp}`).value = `${x}`;
                    temp++;
                })

                temp = 11;
                columns = ['G', 'J', 'M', 'P', 'S', 'V', 'Y', 'AB', 'AE', 'AH', 'AK'];
                for (let i = 1; i <= 26; i++) {
                    if (current[i]) {
                        const newCurrent = fixedNumber(current[i]);
                        [
                            "hasilProduksi",
                            "bulanLalu",
                            "luasPanenHabis",
                            "luasPanenBelumHabis",
                            "luasRusak",
                            "luasPenanamanBaru",
                            "akhir",
                            "produksiHabis",
                            "produksiBelumHabis",
                            "rerataHarga",
                            "keterangan",
                        ].forEach((j, idx) => {
                            worksheet.getCell(`${columns[idx]}${temp}`).value = newCurrent[j] ? `${newCurrent[j]}` : '';
                        });
                    }
                    temp++;
                }

                worksheet.getCell(`A${temp}`).value = `Catatan`;
                worksheet.getCell(`C${temp}`).value = `: *) Data luasan jamur diisi dengan satuan m2 (bilangan bulat), produksi dalam satuan kuintal (bilangan desimal dengan 2 angka di belakang koma)`;
                worksheet.getCell(`AH${temp}`).value = `Petugas Pengumpul Data`;

                worksheet.mergeCells(`AH${temp}:AO${temp}`);
                worksheet.getCell(`AH${temp}`).alignment = { vertical: 'middle', horizontal: 'center' };
                temp++;

                worksheet.getCell(`A${temp}`).value = `Tanggal`;
                worksheet.getCell(`J${temp}`).value = `${bulans[bulan.getMonth()]} ${bulan.getFullYear()}`;
                temp++;

                worksheet.getCell(`AH${temp}`).value = `(....................)`;

                worksheet.mergeCells(`AH${temp}:AO${temp}`);
                worksheet.getCell(`AH${temp}`).alignment = { vertical: 'middle', horizontal: 'center' };
                temp++;

                worksheet.getCell(`AH${temp}`).value = `Jabatan : ....................`;

                worksheet.mergeCells(`AH${temp}:AO${temp}`);
                worksheet.getCell(`AH${temp}`).alignment = { vertical: 'middle', horizontal: 'center' };

                for (let i = 8; i <= 36; i++) {
                    for (let j = 'A'.charCodeAt(0); j <= 'Z'.charCodeAt(0); j++) {
                        let cell = `${String.fromCharCode(j)}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                        if ((j < 'B'.charCodeAt(0) || j > 'I'.charCodeAt(0)) || i <= 10) {
                            worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                    for (let j = 'A'.charCodeAt(0); j <= 'O'.charCodeAt(0); j++) {
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
                        worksheet.mergeCells(`AK${i}:AO${i}`);
                    }
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "laporan-luas-tanaman-sayur-buah.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data korluh sayur dan buah not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}