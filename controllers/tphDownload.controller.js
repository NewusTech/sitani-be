const {
    TphRealisasiPalawija1List,
    TphRealisasiPalawija2List,
    TphLahanBukanSawahList,
    TphRealisasiPalawija1,
    TphRealisasiPalawija2,
    TphRealisasiPadiList,
    TphLahanBukanSawah,
    TphLahanSawahList,
    TphRealisasiPadi,
    TphLahanSawah,
    Kecamatan,
    sequelize
} = require('../models');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');
const exceljs = require('exceljs');

const v = new Validator();

module.exports = {
    lahanSawah: async (req, res) => {
        try {
            let { kecamatan, year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let where = {};
            if (year) {
                where.tahun = year;
            }
            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                where = {
                    ...where,
                    '$list.kecamatan.id$': parseInt(kecamatan)
                };
            }

            const tphLahanSawah = await TphLahanSawah.findOne({
                include: [
                    {
                        model: TphLahanSawahList,
                        as: 'list',
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                                attributes: { exclude: ['createdAt', 'updatedAt'] },
                            }
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ],
                attributes: ['tahun'],
                where,
                order: [['tahun', 'DESC']],
            });

            if (tphLahanSawah?.list?.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Lahan Sawah");

                worksheet.columns = [
                    { width: 5 },
                    { width: 20 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 20 },
                    { width: 20 },
                ];

                worksheet.getCell('A1').value = `4.2.1 DATA LUAS LAHAN SAWAH MENURUT PENGGUNAANNYA`;

                worksheet.getCell('A2').value = `No`;
                worksheet.getCell('B2').value = `Kecamatan`;
                worksheet.getCell('C2').value = `Luas Lahan Sawah (Ha)`;
                worksheet.getCell('C3').value = `Irigasi Teknis`;
                worksheet.getCell('D3').value = `Irigasi 1/2 Teknis`;
                worksheet.getCell('E3').value = `Irigasi Sederhana`;
                worksheet.getCell('F3').value = `Irigasi Desa / Non PU`;
                worksheet.getCell('G3').value = `Tadah Hujan`;
                worksheet.getCell('H3').value = `Pasang Surut`;
                worksheet.getCell('I3').value = `Lebak`;
                worksheet.getCell('J3').value = `Lainnya`;
                worksheet.getCell('K3').value = `Jumlah`;
                worksheet.getCell('L2').value = `KET`;

                let row = 4;
                tphLahanSawah.list.forEach((item, index) => {
                    worksheet.getRow(row).values = [`${index + 1}`, item?.kecamatan?.nama || 'error', item.irigasiTeknis, item.irigasiSetengahTeknis, item.irigasiSederhana, item.irigasiDesa, item.tadahHujan, item.pasangSurut, item.lebak, item.lainnya, item.jumlah, item.keterangan];
                    row++;
                });

                worksheet.getCell(`A${row}`).value = `Jumlah`;

                worksheet.getCell(`C${row}`).value = { formula: `SUM(C4:C${row - 1})` };
                worksheet.getCell(`D${row}`).value = { formula: `SUM(D4:D${row - 1})` };
                worksheet.getCell(`E${row}`).value = { formula: `SUM(E4:E${row - 1})` };
                worksheet.getCell(`F${row}`).value = { formula: `SUM(F4:F${row - 1})` };
                worksheet.getCell(`G${row}`).value = { formula: `SUM(G4:G${row - 1})` };
                worksheet.getCell(`H${row}`).value = { formula: `SUM(H4:H${row - 1})` };
                worksheet.getCell(`I${row}`).value = { formula: `SUM(I4:I${row - 1})` };
                worksheet.getCell(`J${row}`).value = { formula: `SUM(J4:J${row - 1})` };
                worksheet.getCell(`K${row}`).value = { formula: `SUM(K4:K${row - 1})` };
                row++;

                worksheet.getCell(`A${row}`).value = `Dinas Tanaman Pangan, Hortikultura dan Perkebunan Kabupaten Lampung Timur / Laporan Tahun ${year}`;

                worksheet.mergeCells('A2:A3');
                worksheet.mergeCells('B2:B3');
                worksheet.mergeCells('C2:K2');
                worksheet.mergeCells('L2:L3');

                worksheet.mergeCells(`A${row - 1}:B${row - 1}`);
                worksheet.mergeCells(`A${row}:L${row}`);

                for (let i of [1, 2, 3, row - 1]) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    });
                }
                for (let i = 2; i < 4; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                }
                worksheet.getCell(`A${row - 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
                for (let i = 4; i < row - 1; i++) {
                    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
                    });
                }
                worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'right' };

                for (let i = 2; i < row; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                    })
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "tph-lahan-sawah.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data lahan sawah not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    lahanBukanSawah: async (req, res) => {
        try {
            let { kecamatan, year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let where = {};
            if (year) {
                where.tahun = year;
            }
            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                where = {
                    ...where,
                    '$list.kecamatan.id$': parseInt(kecamatan)
                };
            }

            const tphLahanBukanSawah = await TphLahanBukanSawah.findOne({
                include: [
                    {
                        model: TphLahanBukanSawahList,
                        as: 'list',
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                                attributes: { exclude: ['createdAt', 'updatedAt'] },
                            }
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ],
                attributes: ['tahun'],
                where,
                order: [['tahun', 'DESC']],
            });

            if (tphLahanBukanSawah?.list?.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Lahan Bukan Sawah");

                worksheet.columns = [
                    { width: 5 },
                    { width: 20 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 20 },
                ];

                worksheet.getCell('A1').value = `Lampiran`;
                worksheet.getCell('C1').value = `LUAS LAHAN BUKAN SAWAH MENURUT PENGGUNAANNYA ${year}`;

                worksheet.getCell('A2').value = `NO`;
                worksheet.getCell('B2').value = `KECAMATAN`;
                worksheet.getCell('C2').value = `LAHAN BUKAN SAWAH`;
                worksheet.getCell('C3').value = `Tegal / Kebun`;
                worksheet.getCell('D3').value = `Ladang / Huma`;
                worksheet.getCell('E3').value = `Perkebunan`;
                worksheet.getCell('F3').value = `Hutan Rakyat`;
                worksheet.getCell('G3').value = `Padang Pengembalaan Rumput`;
                worksheet.getCell('H3').value = `Hutan Negara`;
                worksheet.getCell('I3').value = `Smt. Tidak Diusahakan`;
                worksheet.getCell('J3').value = `Lainnya Tambak, Kolam Empang`;
                worksheet.getCell('K3').value = `Jumlah Lahan Bukan Sawah`;
                worksheet.getCell('L2').value = `Lahan Bukan Pertanian`;
                worksheet.getCell('L3').value = `Jalan, Pemukiman, Perkantoran, Sungai`;
                worksheet.getCell('M2').value = `TOTAL`;

                let row = 4;
                tphLahanBukanSawah.list.forEach((item, index) => {
                    worksheet.getRow(row).values = [`${index + 1}`, item?.kecamatan?.nama || 'error', item.tegal, item.ladang, item.perkebunan, item.hutanRakyat, item.padangPengembalaanRumput, item.hutanNegara, item.smtTidakDiusahakan, item.lainnya, item.jumlahLahanBukanSawah, item.lahanBukanPertanian, item.total];
                    row++;
                });

                worksheet.getCell(`A${row}`).value = `Jumlah`;

                worksheet.getCell(`C${row}`).value = { formula: `SUM(C4:C${row - 1})` };
                worksheet.getCell(`D${row}`).value = { formula: `SUM(D4:D${row - 1})` };
                worksheet.getCell(`E${row}`).value = { formula: `SUM(E4:E${row - 1})` };
                worksheet.getCell(`F${row}`).value = { formula: `SUM(F4:F${row - 1})` };
                worksheet.getCell(`G${row}`).value = { formula: `SUM(G4:G${row - 1})` };
                worksheet.getCell(`H${row}`).value = { formula: `SUM(H4:H${row - 1})` };
                worksheet.getCell(`I${row}`).value = { formula: `SUM(I4:I${row - 1})` };
                worksheet.getCell(`J${row}`).value = { formula: `SUM(J4:J${row - 1})` };
                worksheet.getCell(`K${row}`).value = { formula: `SUM(K4:K${row - 1})` };
                worksheet.getCell(`L${row}`).value = { formula: `SUM(L4:L${row - 1})` };
                worksheet.getCell(`M${row}`).value = { formula: `SUM(M4:M${row - 1})` };
                row++;

                worksheet.getCell(`A${row}`).value = `Dinas Tanaman Pangan, Hortikultura dan Perkebunan Kabupaten Lampung Timur ${year}`;

                worksheet.mergeCells('A2:A3');
                worksheet.mergeCells('B2:B3');
                worksheet.mergeCells('C2:K2');
                worksheet.mergeCells('M2:M3');

                worksheet.mergeCells(`A${row - 1}:B${row - 1}`);
                worksheet.mergeCells(`A${row}:M${row}`);

                for (let i of [1, 2, 3, row - 1]) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    });
                }
                for (let i = 2; i < 4; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                }
                worksheet.getCell(`A${row - 1}`).alignment = { vertical: 'middle', horizontal: 'center' };
                for (let i = 4; i < row - 1; i++) {
                    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
                    });
                }
                worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'right' };

                for (let i = 2; i < row; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                    })
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "tph-lahan-bukan-sawah.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data lahan bukan sawah not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    realisasiPadi: async (req, res) => {
        try {
            let { kecamatan, year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let listWhere = {};
            let where = {};
            where = {
                [Op.and]: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year),
                ]
            };
            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                listWhere = {
                    'kecamatanId': parseInt(kecamatan)
                };
            }

            let tphRealisasiPadi = await TphRealisasiPadi.findAll({
                include: [
                    {
                        model: TphRealisasiPadiList,
                        as: 'list',
                        where: listWhere,
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                                attributes: { exclude: ['createdAt', 'updatedAt'] },
                            }
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ],
                attributes: ['bulan'],
                where,
                order: [['bulan', 'DESC']],
            });

            let temp = {
                bulan: tphRealisasiPadi[0]?.bulan,
                list: [],
            };
            let kecIds = [];
            tphRealisasiPadi.forEach(item => {
                item.list.forEach(itemList => {
                    if (!kecIds.includes(itemList.kecamatanId)) {
                        kecIds.push(itemList.kecamatanId);
                    }
                    let index = kecIds.indexOf(itemList.kecamatanId);

                    temp.list[index] = temp.list[index] || {};

                    temp.list[index].kecamatan = temp.list[index]?.kecamatan || itemList.kecamatan;

                    temp.list[index].panenLahanSawah = temp.list[index]?.panenLahanSawah ? temp.list[index].panenLahanSawah + itemList.panenLahanSawah : itemList.panenLahanSawah;
                    temp.list[index].produktivitasLahanSawah = temp.list[index]?.produktivitasLahanSawah ? temp.list[index].produktivitasLahanSawah + itemList.produktivitasLahanSawah : itemList.produktivitasLahanSawah;
                    temp.list[index].produksiLahanSawah = temp.list[index]?.produksiLahanSawah ? temp.list[index].produksiLahanSawah + itemList.produksiLahanSawah : itemList.produksiLahanSawah;

                    temp.list[index].panenLahanKering = temp.list[index]?.panenLahanKering ? temp.list[index].panenLahanKering + itemList.panenLahanKering : itemList.panenLahanKering;
                    temp.list[index].produktivitasLahanKering = temp.list[index]?.produktivitasLahanKering ? temp.list[index].produktivitasLahanKering + itemList.produktivitasLahanKering : itemList.produktivitasLahanKering;
                    temp.list[index].produksiLahanKering = temp.list[index]?.produksiLahanKering ? temp.list[index].produksiLahanKering + itemList.produksiLahanKering : itemList.produksiLahanKering;

                    temp.list[index].panenTotal = temp.list[index]?.panenTotal ? temp.list[index].panenTotal + itemList.panenTotal : itemList.panenTotal;
                    temp.list[index].produktivitasTotal = temp.list[index]?.produktivitasTotal ? temp.list[index].produktivitasTotal + itemList.produktivitasTotal : itemList.produktivitasTotal;
                    temp.list[index].produksiTotal = temp.list[index]?.produksiTotal ? temp.list[index].produksiTotal + itemList.produksiTotal : itemList.produksiTotal;
                });
            });

            tphRealisasiPadi = temp;

            if (tphRealisasiPadi?.list?.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Padi");

                worksheet.columns = [
                    { width: 5 },
                    { width: 20 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                ];

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

                worksheet.getCell('B1').value = `Lampiran 8.`;
                worksheet.getCell('C1').value = `REALISASI LUAS PANEN, PRODUKTIVITAS DAN PRODUKSI PADI`;
                worksheet.getCell('C2').value = `KAB. LAMPUNG TIMUR TAHUN ${year}`;
                worksheet.getCell('C3').value = `(s.d ${bulans[new Date(tphRealisasiPadi.bulan).getMonth()]} ${year})`;

                worksheet.getCell('A5').value = `NO`;
                worksheet.getCell('B5').value = `KECAMATAN`;
                worksheet.getCell('C5').value = `LAHAN SAWAH`;
                worksheet.getCell('C6').value = `Panen (ha)`;
                worksheet.getCell('D6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('E6').value = `Produksi (ton)`;
                worksheet.getCell('F5').value = `LAHAN KERING`;
                worksheet.getCell('F6').value = `Panen (ha)`;
                worksheet.getCell('G6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('H6').value = `Produksi (ton)`;
                worksheet.getCell('I5').value = `TOTAL`;
                worksheet.getCell('I6').value = `Panen (ha)`;
                worksheet.getCell('J6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('K6').value = `Produksi (ton)`;

                let row = 7;
                tphRealisasiPadi.list.forEach((item, index) => {
                    worksheet.getRow(row).values = [`${index + 1}`, item?.kecamatan?.nama || 'error', item.panenLahanSawah, item.produktivitasLahanSawah, item.produksiLahanSawah, item.panenLahanKering, item.produktivitasLahanKering, item.produksiLahanKering, item.panenTotal, item.produktivitasTotal, item.produksiTotal];
                    row++;
                });

                worksheet.getCell(`A${row}`).value = `Jumlah`;

                worksheet.getCell(`C${row}`).value = { formula: `SUM(C7:C${row - 1})` };
                worksheet.getCell(`D${row}`).value = { formula: `SUM(D7:D${row - 1})` };
                worksheet.getCell(`E${row}`).value = { formula: `SUM(E7:E${row - 1})` };
                worksheet.getCell(`F${row}`).value = { formula: `SUM(F7:F${row - 1})` };
                worksheet.getCell(`G${row}`).value = { formula: `SUM(G7:G${row - 1})` };
                worksheet.getCell(`H${row}`).value = { formula: `SUM(H7:H${row - 1})` };
                worksheet.getCell(`I${row}`).value = { formula: `SUM(I7:I${row - 1})` };
                worksheet.getCell(`J${row}`).value = { formula: `SUM(J7:J${row - 1})` };
                worksheet.getCell(`K${row}`).value = { formula: `SUM(K7:K${row - 1})` };

                worksheet.mergeCells('A5:A6');
                worksheet.mergeCells('B5:B6');
                worksheet.mergeCells('C5:E5');
                worksheet.mergeCells('F5:H5');
                worksheet.mergeCells('I5:K5');

                worksheet.mergeCells(`A${row}:B${row}`);

                for (let i of [1, 2, 3, 5, 6, row]) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    });
                }
                for (let i = 5; i <= 6; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                }
                worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                for (let i = 7; i <= row; i++) {
                    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
                    });
                }
                worksheet.getCell(`B1`).alignment = { vertical: 'middle', horizontal: 'right' };

                for (let i = 5; i <= row; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                    })
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "tph-realisasi-padi.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data realisasi padi not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    realisasiPalawija1: async (req, res) => {
        try {
            let { kecamatan, year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let listWhere = {};
            let where = {};
            where = {
                [Op.and]: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year),
                ]
            };
            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                listWhere = {
                    'kecamatanId': parseInt(kecamatan)
                };
            }

            let tphRealisasiPalawija1 = await TphRealisasiPalawija1.findAll({
                include: [
                    {
                        model: TphRealisasiPalawija1List,
                        as: 'list',
                        where: listWhere,
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                                attributes: { exclude: ['createdAt', 'updatedAt'] },
                            }
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ],
                attributes: ['bulan'],
                where,
                order: [['bulan', 'DESC']],
            });

            let temp = {
                bulan: tphRealisasiPalawija1[0]?.bulan,
                list: [],
            };
            let kecIds = [];
            tphRealisasiPalawija1.forEach(item => {
                item.list.forEach(itemList => {
                    if (!kecIds.includes(itemList.kecamatanId)) {
                        kecIds.push(itemList.kecamatanId);
                    }
                    let index = kecIds.indexOf(itemList.kecamatanId);

                    temp.list[index] = temp.list[index] || {};

                    temp.list[index].kecamatan = temp.list[index]?.kecamatan || itemList.kecamatan;

                    temp.list[index].jagungPanen = temp.list[index]?.jagungPanen ? temp.list[index].jagungPanen + itemList.jagungPanen : itemList.jagungPanen;
                    temp.list[index].jagungProduktivitas = temp.list[index]?.jagungProduktivitas ? temp.list[index].jagungProduktivitas + itemList.jagungProduktivitas : itemList.jagungProduktivitas;
                    temp.list[index].jagungProduksi = temp.list[index]?.jagungProduksi ? temp.list[index].jagungProduksi + itemList.jagungProduksi : itemList.jagungProduksi;

                    temp.list[index].kedelaiPanen = temp.list[index]?.kedelaiPanen ? temp.list[index].kedelaiPanen + itemList.kedelaiPanen : itemList.kedelaiPanen;
                    temp.list[index].kedelaiProduktivitas = temp.list[index]?.kedelaiProduktivitas ? temp.list[index].kedelaiProduktivitas + itemList.kedelaiProduktivitas : itemList.kedelaiProduktivitas;
                    temp.list[index].kedelaiProduksi = temp.list[index]?.kedelaiProduksi ? temp.list[index].kedelaiProduksi + itemList.kedelaiProduksi : itemList.kedelaiProduksi;

                    temp.list[index].kacangTanahPanen = temp.list[index]?.kacangTanahPanen ? temp.list[index].kacangTanahPanen + itemList.kacangTanahPanen : itemList.kacangTanahPanen;
                    temp.list[index].kacangTanahProduktivitas = temp.list[index]?.kacangTanahProduktivitas ? temp.list[index].kacangTanahProduktivitas + itemList.kacangTanahProduktivitas : itemList.kacangTanahProduktivitas;
                    temp.list[index].kacangTanahProduksi = temp.list[index]?.kacangTanahProduksi ? temp.list[index].kacangTanahProduksi + itemList.kacangTanahProduksi : itemList.kacangTanahProduksi;
                });
            });

            tphRealisasiPalawija1 = temp;

            if (tphRealisasiPalawija1?.list?.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Palawija 1");

                worksheet.columns = [
                    { width: 5 },
                    { width: 20 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                ];

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

                worksheet.getCell('B1').value = `Lampiran 9.`;
                worksheet.getCell('C1').value = `LUAS PANEN, PRODUKTIVITAS DAN PRODUKSI JAGUNG, KEDELAI DAN KC. TANAH`;
                worksheet.getCell('C2').value = `KABUPATEN LAMPUNG TIMUR TAHUN ${year}`;
                worksheet.getCell('C3').value = `(s.d ${bulans[new Date(tphRealisasiPalawija1.bulan).getMonth()]} ${year})`;

                worksheet.getCell('A5').value = `NO`;
                worksheet.getCell('B5').value = `KECAMATAN`;
                worksheet.getCell('C5').value = `JAGUNG`;
                worksheet.getCell('C6').value = `Panen (ha)`;
                worksheet.getCell('D6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('E6').value = `Produksi (ton)`;
                worksheet.getCell('F5').value = `KEDELAI`;
                worksheet.getCell('F6').value = `Panen (ha)`;
                worksheet.getCell('G6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('H6').value = `Produksi (ton)`;
                worksheet.getCell('I5').value = `KACANG TANAH`;
                worksheet.getCell('I6').value = `Panen (ha)`;
                worksheet.getCell('J6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('K6').value = `Produksi (ton)`;

                let row = 7;
                tphRealisasiPalawija1.list.forEach((item, index) => {
                    worksheet.getRow(row).values = [`${index + 1}`, item?.kecamatan?.nama || 'error', item.jagungPanen, item.jagungProduktivitas, item.jagungProduksi, item.kedelaiPanen, item.kedelaiProduktivitas, item.kedelaiProduksi, item.kacangTanahPanen, item.kacangTanahProduktivitas, item.kacangTanahProduksi];
                    row++;
                });

                worksheet.getCell(`A${row}`).value = `Jumlah`;

                worksheet.getCell(`C${row}`).value = { formula: `SUM(C7:C${row - 1})` };
                worksheet.getCell(`D${row}`).value = { formula: `SUM(D7:D${row - 1})` };
                worksheet.getCell(`E${row}`).value = { formula: `SUM(E7:E${row - 1})` };
                worksheet.getCell(`F${row}`).value = { formula: `SUM(F7:F${row - 1})` };
                worksheet.getCell(`G${row}`).value = { formula: `SUM(G7:G${row - 1})` };
                worksheet.getCell(`H${row}`).value = { formula: `SUM(H7:H${row - 1})` };
                worksheet.getCell(`I${row}`).value = { formula: `SUM(I7:I${row - 1})` };
                worksheet.getCell(`J${row}`).value = { formula: `SUM(J7:J${row - 1})` };
                worksheet.getCell(`K${row}`).value = { formula: `SUM(K7:K${row - 1})` };

                worksheet.mergeCells('A5:A6');
                worksheet.mergeCells('B5:B6');
                worksheet.mergeCells('C5:E5');
                worksheet.mergeCells('F5:H5');
                worksheet.mergeCells('I5:K5');

                worksheet.mergeCells(`A${row}:B${row}`);

                for (let i of [1, 2, 3, 5, 6, row]) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    });
                }
                for (let i = 5; i <= 6; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                }
                worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                for (let i = 7; i <= row; i++) {
                    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
                    });
                }
                worksheet.getCell(`B1`).alignment = { vertical: 'middle', horizontal: 'right' };

                for (let i = 5; i <= row; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                    })
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "tph-realisasi-palawija-1.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data realisasi palawija 1 not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    realisasiPalawija2: async (req, res) => {
        try {
            let { kecamatan, year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let listWhere = {};
            let where = {};
            where = {
                [Op.and]: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year),
                ]
            };
            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                listWhere = {
                    'kecamatanId': parseInt(kecamatan)
                };
            }

            let tphRealisasiPalawija2 = await TphRealisasiPalawija2.findAll({
                include: [
                    {
                        model: TphRealisasiPalawija2List,
                        as: 'list',
                        where: listWhere,
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                                attributes: { exclude: ['createdAt', 'updatedAt'] },
                            }
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ],
                attributes: ['bulan'],
                where,
                order: [['bulan', 'DESC']],
            });

            let temp = {
                bulan: tphRealisasiPalawija2[0]?.bulan,
                list: [],
            };
            let kecIds = [];
            tphRealisasiPalawija2.forEach(item => {
                item.list.forEach(itemList => {
                    if (!kecIds.includes(itemList.kecamatanId)) {
                        kecIds.push(itemList.kecamatanId);
                    }
                    let index = kecIds.indexOf(itemList.kecamatanId);

                    temp.list[index] = temp.list[index] || {};

                    temp.list[index].kecamatan = temp.list[index]?.kecamatan || itemList.kecamatan;

                    temp.list[index].kacangHijauPanen = temp.list[index]?.kacangHijauPanen ? temp.list[index].kacangHijauPanen + itemList.kacangHijauPanen : itemList.kacangHijauPanen;
                    temp.list[index].kacangHijauProduktivitas = temp.list[index]?.kacangHijauProduktivitas ? temp.list[index].kacangHijauProduktivitas + itemList.kacangHijauProduktivitas : itemList.kacangHijauProduktivitas;
                    temp.list[index].kacangHijauProduksi = temp.list[index]?.kacangHijauProduksi ? temp.list[index].kacangHijauProduksi + itemList.kacangHijauProduksi : itemList.kacangHijauProduksi;

                    temp.list[index].ubiKayuPanen = temp.list[index]?.ubiKayuPanen ? temp.list[index].ubiKayuPanen + itemList.ubiKayuPanen : itemList.ubiKayuPanen;
                    temp.list[index].ubiKayuProduktivitas = temp.list[index]?.ubiKayuProduktivitas ? temp.list[index].ubiKayuProduktivitas + itemList.ubiKayuProduktivitas : itemList.ubiKayuProduktivitas;
                    temp.list[index].ubiKayuProduksi = temp.list[index]?.ubiKayuProduksi ? temp.list[index].ubiKayuProduksi + itemList.ubiKayuProduksi : itemList.ubiKayuProduksi;

                    temp.list[index].ubiJalarPanen = temp.list[index]?.ubiJalarPanen ? temp.list[index].ubiJalarPanen + itemList.ubiJalarPanen : itemList.ubiJalarPanen;
                    temp.list[index].ubiJalarProduktivitas = temp.list[index]?.ubiJalarProduktivitas ? temp.list[index].ubiJalarProduktivitas + itemList.ubiJalarProduktivitas : itemList.ubiJalarProduktivitas;
                    temp.list[index].ubiJalarProduksi = temp.list[index]?.ubiJalarProduksi ? temp.list[index].ubiJalarProduksi + itemList.ubiJalarProduksi : itemList.ubiJalarProduksi;
                });
            });

            tphRealisasiPalawija2 = temp;

            if (tphRealisasiPalawija2?.list?.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Palawija 2");

                worksheet.columns = [
                    { width: 5 },
                    { width: 20 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                ];

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

                worksheet.getCell('B1').value = `Lampiran 10.`;
                worksheet.getCell('C1').value = `LUAS PANEN, PRODUKTIVITAS DAN PRODUKSI KACANG HIJAU, UBI KAYU`;
                worksheet.getCell('C2').value = `DAN UBI JALAR KABUPATEN LAMPUNG TIMUR TAHUN ${year}`;
                worksheet.getCell('C3').value = `(s.d ${bulans[new Date(tphRealisasiPalawija2.bulan).getMonth()]} ${year})`;

                worksheet.getCell('A5').value = `NO`;
                worksheet.getCell('B5').value = `KECAMATAN`;
                worksheet.getCell('C5').value = `KACANG HIJAU`;
                worksheet.getCell('C6').value = `Panen (ha)`;
                worksheet.getCell('D6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('E6').value = `Produksi (ton)`;
                worksheet.getCell('F5').value = `UBI KAYU`;
                worksheet.getCell('F6').value = `Panen (ha)`;
                worksheet.getCell('G6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('H6').value = `Produksi (ton)`;
                worksheet.getCell('I5').value = `UBI JALAR`;
                worksheet.getCell('I6').value = `Panen (ha)`;
                worksheet.getCell('J6').value = `Produktivitas (ku/ha)`;
                worksheet.getCell('K6').value = `Produksi (ton)`;

                let row = 7;
                tphRealisasiPalawija2.list.forEach((item, index) => {
                    worksheet.getRow(row).values = [`${index + 1}`, item?.kecamatan?.nama || 'error', item.kacangHijauPanen, item.kacangHijauProduktivitas, item.kacangHijauProduksi, item.ubiKayuPanen, item.ubiKayuProduktivitas, item.ubiKayuProduksi, item.ubiJalarPanen, item.ubiJalarProduktivitas, item.ubiJalarProduksi];
                    row++;
                });

                worksheet.getCell(`A${row}`).value = `Jumlah`;

                worksheet.getCell(`C${row}`).value = { formula: `SUM(C7:C${row - 1})` };
                worksheet.getCell(`D${row}`).value = { formula: `SUM(D7:D${row - 1})` };
                worksheet.getCell(`E${row}`).value = { formula: `SUM(E7:E${row - 1})` };
                worksheet.getCell(`F${row}`).value = { formula: `SUM(F7:F${row - 1})` };
                worksheet.getCell(`G${row}`).value = { formula: `SUM(G7:G${row - 1})` };
                worksheet.getCell(`H${row}`).value = { formula: `SUM(H7:H${row - 1})` };
                worksheet.getCell(`I${row}`).value = { formula: `SUM(I7:I${row - 1})` };
                worksheet.getCell(`J${row}`).value = { formula: `SUM(J7:J${row - 1})` };
                worksheet.getCell(`K${row}`).value = { formula: `SUM(K7:K${row - 1})` };

                worksheet.mergeCells('A5:A6');
                worksheet.mergeCells('B5:B6');
                worksheet.mergeCells('C5:E5');
                worksheet.mergeCells('F5:H5');
                worksheet.mergeCells('I5:K5');

                worksheet.mergeCells(`A${row}:B${row}`);

                for (let i of [1, 2, 3, 5, 6, row]) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    });
                }
                for (let i = 5; i <= 6; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                }
                worksheet.getCell(`A${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                for (let i = 7; i <= row; i++) {
                    ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
                    });
                }
                worksheet.getCell(`B1`).alignment = { vertical: 'middle', horizontal: 'right' };

                for (let i = 5; i <= row; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                    })
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "tph-realisasi-palawija-2.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data realisasi palawija 2 not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}