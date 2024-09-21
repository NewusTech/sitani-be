const {
    KepangPedagangEceranList,
    KepangProdusenEceranList,
    KepangMasterKomoditas,
    KepangPedagangEceran,
    KepangProdusenEceran,
    KepangCvProdusenList,
    KepangCvProdusen,
    KepangCvProduksi,
    sequelize
} = require('../models');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');
const exceljs = require('exceljs');

const v = new Validator();

module.exports = {
    perbandinganHarga: async (req, res) => {
        try {
            let { year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            const kepangPerbandinganHarga = await KepangPedagangEceran.findAll({
                include: [
                    {
                        model: KepangPedagangEceranList,
                        as: 'list',
                        include: [
                            {
                                model: KepangMasterKomoditas,
                                as: 'komoditas',
                            }
                        ]
                    }
                ],
                where: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), year)
                ],
                order: [['tanggal', 'ASC']]
            });

            if (kepangPerbandinganHarga.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet("Perbandingan komoditas harga pangan tingkat pedagang eceran");

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

                worksheet.getCell('A2').value = `Perbandingan Komoditas Harga Pangan Tingkat Pedagang Eceran Tahun ${year}`;

                worksheet.getCell('A4').value = `Periode Waktu`;

                worksheet.getColumn('A').width = 15;

                let columns = [];
                let row = 5;
                kepangPerbandinganHarga.forEach((item, index) => {
                    worksheet.getCell(`A${row}`).value = bulans[new Date(item.tanggal).getMonth()];
                    let col = "B".charCodeAt(0);
                    item.list.forEach((itemList, indexList) => {
                        let id = itemList.komoditas.id;
                        if (!columns.includes(id)) {
                            columns.push(id);
                            worksheet.getColumn(String.fromCharCode(col + columns.indexOf(id))).width = 20;
                            worksheet.getCell(`${String.fromCharCode(col + columns.indexOf(id))}4`).value = itemList.komoditas.nama;
                        };
                        let idx = columns.indexOf(id);
                        for (let i = indexList; i < item.list.length; i++) {
                            if (item.list[i].komoditas.id === columns[idx]) {
                                let sum = 0;
                                for (let sumIdx of ['minggu1', 'minggu2', 'minggu3', 'minggu4', 'minggu5']) {
                                    if (item.list[i][sumIdx]) {
                                        sum += item.list[i][sumIdx];
                                    }
                                }
                                worksheet.getCell(`${String.fromCharCode(col + columns.indexOf(id))}${row}`).value = sum;
                                break;
                            }
                        }
                    });
                    row++;
                });

                worksheet.mergeCells(`A2:${String.fromCharCode('A'.charCodeAt(0) + columns.length)}2`);

                for (let i = 4; i < row; i++) {
                    for (let j = 'A'.charCodeAt(0); j <= 'A'.charCodeAt(0) + columns.length; j++) {
                        let cell = `${String.fromCharCode(j)}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                    }
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "kepang-perbandingan-harga.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data perbandingan harga not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    pedagangEceran: async (req, res) => {
        try {
            let { year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            const kepangPerbandinganHarga = await KepangPedagangEceran.findAll({
                include: [
                    {
                        model: KepangPedagangEceranList,
                        as: 'list',
                        include: [
                            {
                                model: KepangMasterKomoditas,
                                as: 'komoditas',
                            }
                        ]
                    }
                ],
                where: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), year)
                ],
                order: [['tanggal', 'ASC']]
            });

            if (kepangPerbandinganHarga.length) {
                const workbook = new exceljs.Workbook();

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                kepangPerbandinganHarga.forEach((item, index) => {
                    const bulan = bulans[new Date(item.tanggal).getMonth()];
                    const worksheet = workbook.addWorksheet(`Rata2 ${bulan} ${year}`);

                    worksheet.columns = [
                        { width: 5 },
                        { width: 50 },
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                        { width: 10 },
                    ];

                    worksheet.getCell('A1').value = `KUESIONER DATA HARIAN PANEL PEDAGANG ECERAN`;

                    worksheet.getCell('A4').value = `Kab`;
                    worksheet.getCell('B4').value = `Lampung Timur`;
                    worksheet.getCell('C4').value = `Bulan`;
                    worksheet.getCell('D4').value = `: ${bulan} ${year}`;
                    worksheet.getCell('A5').value = `Prov`;
                    worksheet.getCell('B5').value = `Lampung`;

                    worksheet.getCell('A7').value = `1. Tingkat Pedagang Eceran (PANEL PDE)`;

                    worksheet.getRow(8).values = ['No', 'Komoditas', 'MG I', 'MG II', 'MG III', 'MG IV', 'MG V', 'Rata2 Per Bulan'];
                    worksheet.getRow(9).values = [null, , 'A', 'A', 'A', 'A', 'A', 'Harga'];

                    let row = 10;
                    item.list.forEach((itemList, indexList) => {
                        worksheet.getRow(row).values = [indexList + 1, itemList?.komoditas?.nama || 'error', itemList.minggu1, itemList.minggu2, itemList.minggu3, itemList.minggu4, itemList.minggu5, { formula: `AVERAGE(C${row}:G${row})` }];
                        row++;
                    });

                    worksheet.mergeCells('A1:H1');
                    worksheet.mergeCells('A8:A9');
                    worksheet.mergeCells('B8:B9');

                    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
                    ['A1', 'A4', 'A5', 'C4', 'D4', 'A7'].forEach(cell => {
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    });
                    for (let i = 8; i < row; i++) {
                        for (let j = 'A'.charCodeAt(0); j <= 'A'.charCodeAt(0) + 7; j++) {
                            let cell = `${String.fromCharCode(j)}${i}`;
                            worksheet.getCell(cell).border = {
                                bottom: { style: 'thin', color: { argb: '00000000' } },
                                right: { style: 'thin', color: { argb: '00000000' } },
                                left: { style: 'thin', color: { argb: '00000000' } },
                                top: { style: 'thin', color: { argb: '00000000' } },
                            };
                            if (i < 10) {
                                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                                worksheet.getCell(cell).font = {
                                    bold: true,
                                };
                            }
                        }
                    }
                });

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "kepang-pedagang-eceran.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data pedagang eceran not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    produsenEceran: async (req, res) => {
        try {
            let { equalDate, startDate, endDate } = req.query;

            let where = {
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), new Date().getMonth() + 1),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), new Date().getFullYear())
                ]
            };

            if (equalDate) {
                equalDate = new Date(equalDate);
                equalDate = dateGenerate(equalDate);
                if (equalDate instanceof Date && !isNaN(equalDate)) {
                    where = {
                        tanggal: { [Op.eq]: equalDate }
                    };
                }
            } else {
                if (startDate) {
                    startDate = new Date(startDate);
                    startDate = dateGenerate(startDate);
                    if (startDate instanceof Date && !isNaN(startDate)) {
                        where = {
                            tanggal: { [Op.gte]: startDate }
                        };
                    }
                }
                if (endDate) {
                    endDate = new Date(endDate);
                    endDate = dateGenerate(endDate);
                    if (endDate instanceof Date && !isNaN(endDate)) {
                        where = {
                            tanggal: { ...where.tanggal, [Op.lte]: endDate }
                        };
                    }
                }
            }

            const kepangProdusenEceran = await KepangProdusenEceran.findAll({
                include: [
                    {
                        model: KepangProdusenEceranList,
                        as: 'list',
                        include: [
                            {
                                model: KepangMasterKomoditas,
                                as: 'komoditas'
                            }
                        ]
                    }
                ],
                order: [['tanggal', 'ASC']],
                where,
            });

            if (kepangProdusenEceran.length) {
                const workbook = new exceljs.Workbook();

                kepangProdusenEceran.forEach((item, index) => {
                    const tanggal = new Date(item.tanggal);
                    const worksheet = workbook.addWorksheet(`${tanggal.toDateString()}`);

                    worksheet.columns = [
                        { width: 5 },
                        { width: 50 },
                        { width: 10 },
                        { width: 15 },
                        { width: 20 },
                    ];

                    worksheet.getCell('A1').value = `DAFTAR HARGA PRODUSEN DAN ECERAN`;
                    worksheet.getCell('A2').value = `PERIODE (${tanggal.toLocaleDateString()})`;

                    worksheet.getRow(4).values = ['NO.', 'KOMODITAS', 'SATUAN', 'HARGA KOMODITAS', 'KETERANGAN'];

                    let row = 5;
                    item.list.forEach((itemList, indexList) => {
                        worksheet.getRow(row).values = [indexList + 1, itemList?.komoditas?.nama || 'error', itemList.satuan, itemList.harga, itemList.keterangan];
                        row++;
                    });

                    worksheet.mergeCells('A1:E1');
                    worksheet.mergeCells('A2:E2');

                    ['A1', 'A2'].forEach(cell => {
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    });
                    for (let i = 4; i < row; i++) {
                        for (let j = 'A'.charCodeAt(0); j <= 'A'.charCodeAt(0) + 4; j++) {
                            let cell = `${String.fromCharCode(j)}${i}`;
                            worksheet.getCell(cell).border = {
                                bottom: { style: 'thin', color: { argb: '00000000' } },
                                right: { style: 'thin', color: { argb: '00000000' } },
                                left: { style: 'thin', color: { argb: '00000000' } },
                                top: { style: 'thin', color: { argb: '00000000' } },
                            };
                            if (i === 4) {
                                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                            }
                        }
                    }
                    for (let i = 5; i < row; i++) {
                        ['A', 'C', 'D'].forEach(j => {
                            let cell = `${j}${i}`;
                            if (j !== 'D') {
                                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                            } else {
                                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
                            }
                        })
                    }
                });

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "kepang-produsen-eceran.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data produsen eceran not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    cvProduksi: async (req, res) => {
        try {
            let { year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            const kepangCvProduksi = await KepangCvProduksi.findAll({
                where: {
                    bulan: sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year)
                },
                order: [['bulan', 'ASC']]
            });

            if (kepangCvProduksi.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet(`CV TK Produksi TAHUN ${year}`);

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
                ];

                worksheet.getCell('A1').value = `Coefisien Variansi (CV) Tk. Produksi`;

                worksheet.getRow(3).values = ['No', 'Bulan', '% Panen', 'GKP Tk. Petani', 'GKP Tk. Penggilingan', 'GKG Tk. Penggilingan', 'JPK', 'Cabai Merah Keriting', 'Beras Medium', 'Beras Premium', 'Stok GKG', 'Stok Beras'];

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

                let row = 4;
                kepangCvProduksi.forEach((item, index) => {
                    worksheet.getRow(row).values = [index + 1, bulans[new Date(item.bulan).getMonth()], item.panen, item.gkpTkPetani, item.gkpTkPenggilingan, item.gkgTkPenggilingan, item.jpk, item.cabaiMerahKeriting, item.berasMedium, item.berasPremium, item.stokGkg, item.stokBeras];
                    row++;
                });

                worksheet.getCell(`A${row}`).value = `Rata-rata`;
                for (let j = 'C'.charCodeAt(0); j <= 'A'.charCodeAt(0) + 11; j++) {
                    let cell = `${String.fromCharCode(j)}${row}`;
                    worksheet.getCell(cell).value = { formula: `AVERAGE(${String.fromCharCode(j)}4:${String.fromCharCode(j)}${row - 1})` };
                }
                worksheet.mergeCells(`A${row}:B${row}`);
                row++;
                worksheet.getCell(`A${row}`).value = `Maksimum`;
                for (let j = 'C'.charCodeAt(0); j <= 'A'.charCodeAt(0) + 11; j++) {
                    let cell = `${String.fromCharCode(j)}${row}`;
                    worksheet.getCell(cell).value = { formula: `MAX(${String.fromCharCode(j)}4:${String.fromCharCode(j)}${row - 2})` };
                }
                worksheet.mergeCells(`A${row}:B${row}`);
                row++;
                worksheet.getCell(`A${row}`).value = `Minimum`;
                for (let j = 'C'.charCodeAt(0); j <= 'A'.charCodeAt(0) + 11; j++) {
                    let cell = `${String.fromCharCode(j)}${row}`;
                    worksheet.getCell(cell).value = { formula: `MIN(${String.fromCharCode(j)}4:${String.fromCharCode(j)}${row - 3})` };
                }
                worksheet.mergeCells(`A${row}:B${row}`);

                for (let i = 3; i <= row; i++) {
                    for (let j = 'A'.charCodeAt(0); j <= 'A'.charCodeAt(0) + 11; j++) {
                        let cell = `${String.fromCharCode(j)}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                        if (j !== 'B'.charCodeAt(0)) {
                            worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "kepang-cv-tk-produksi.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data cv tk produksi not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    cvProdusen: async (req, res) => {
        try {
            let { year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            const kepangCvProdusen = await KepangCvProdusen.findAll({
                include: [
                    {
                        model: KepangCvProdusenList,
                        as: 'list',
                        include: [
                            {
                                model: KepangMasterKomoditas,
                                as: 'komoditas'
                            }
                        ]
                    }
                ],
                where: {
                    bulan: sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year)
                },
                order: [['bulan', 'ASC']]
            });

            if (kepangCvProdusen.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet(`CV Tk Produsen TAHUN ${year}`);

                const bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

                worksheet.getCell('A1').value = `Coefisien Variansi (CV) Tk. Produsen`;

                worksheet.getColumn('A').width = 5;
                worksheet.getColumn('B').width = 20;

                worksheet.getCell('A3').value = `No.`;
                worksheet.getCell('B3').value = `Bulan`;

                let columns = [];
                let row = 4;
                kepangCvProdusen.forEach((item, index) => {
                    worksheet.getCell(`A${row}`).value = index + 1;
                    worksheet.getCell(`B${row}`).value = bulans[new Date(item.bulan).getMonth()];
                    let col = "C".charCodeAt(0);
                    item.list.forEach((itemList, indexList) => {
                        let id = itemList.komoditas.id;
                        if (!columns.includes(id)) {
                            columns.push(id);
                            worksheet.getColumn(String.fromCharCode(col + columns.indexOf(id))).width = 20;
                            worksheet.getCell(`${String.fromCharCode(col + columns.indexOf(id))}3`).value = itemList.komoditas.nama;
                        };
                        let idx = columns.indexOf(id);
                        for (let i = indexList; i < item.list.length; i++) {
                            if (item.list[i].komoditas.id === columns[idx]) {
                                worksheet.getCell(`${String.fromCharCode(col + columns.indexOf(id))}${row}`).value = item.list[i].nilai;
                                break;
                            }
                        }
                    });
                    row++;
                });

                worksheet.getCell(`A${row}`).value = `Rata-rata`;
                for (let j = 'C'.charCodeAt(0); j <= 'B'.charCodeAt(0) + columns.length; j++) {
                    let cell = `${String.fromCharCode(j)}${row}`;
                    worksheet.getCell(cell).value = { formula: `AVERAGE(${String.fromCharCode(j)}4:${String.fromCharCode(j)}${row - 1})` };
                }
                worksheet.mergeCells(`A${row}:B${row}`);
                row++;
                worksheet.getCell(`A${row}`).value = `Maksimum`;
                for (let j = 'C'.charCodeAt(0); j <= 'B'.charCodeAt(0) + columns.length; j++) {
                    let cell = `${String.fromCharCode(j)}${row}`;
                    worksheet.getCell(cell).value = { formula: `MAX(${String.fromCharCode(j)}4:${String.fromCharCode(j)}${row - 2})` };
                }
                worksheet.mergeCells(`A${row}:B${row}`);
                row++;
                worksheet.getCell(`A${row}`).value = `Minimum`;
                for (let j = 'C'.charCodeAt(0); j <= 'B'.charCodeAt(0) + columns.length; j++) {
                    let cell = `${String.fromCharCode(j)}${row}`;
                    worksheet.getCell(cell).value = { formula: `MIN(${String.fromCharCode(j)}4:${String.fromCharCode(j)}${row - 3})` };
                }
                worksheet.mergeCells(`A${row}:B${row}`);

                for (let i = 3; i <= row; i++) {
                    for (let j = 'A'.charCodeAt(0); j <= 'B'.charCodeAt(0) + columns.length; j++) {
                        let cell = `${String.fromCharCode(j)}${i}`;
                        worksheet.getCell(cell).border = {
                            bottom: { style: 'thin', color: { argb: '00000000' } },
                            right: { style: 'thin', color: { argb: '00000000' } },
                            left: { style: 'thin', color: { argb: '00000000' } },
                            top: { style: 'thin', color: { argb: '00000000' } },
                        };
                        if (j === 'A'.charCodeAt(0) && i > row - 3) {
                            worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    }
                }

                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=" + "kepang-cv-tk-produsen.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Data cv tk produsen not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}