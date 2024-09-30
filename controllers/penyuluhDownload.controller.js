const { PenyuluhGabunganKelompokTani, PenyuluhKelompokTani, PenyuluhKecamatan, PenyuluhKabupaten, Kecamatan, Desa, sequelize } = require('../models');
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
            let { kecamatan } = req.query;

            let where = {};
            if (!isNaN(parseInt(kecamatan))) {
                where = {
                    id: parseInt(kecamatan)
                };
            }

            let kecamatans = await Kecamatan.findAll({ where });

            if (kecamatans.length) {
                const workbook = new exceljs.Workbook();

                let cek = false;
                for (let kec of kecamatans) {
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
                            kecamatanId: kec.id
                        }
                    });

                    if (penyuluhKecamatan.length) {
                        cek = true;
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
                    }
                }

                if (cek) {
                    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                    res.setHeader("Content-Disposition", "attachment; filename=" + "penyuluh-kecamatan.xlsx");

                    workbook.xlsx.write(res).then(() => res.end());
                    return;
                }
            }

            res.status(404).json(response(404, 'Kecamatan or penyuluh kecamatan not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    kelompokTani: async (req, res) => {
        try {
            let { year } = req.query;

            year = !isNaN(parseInt(year)) ? parseInt(year) : new Date().getFullYear();

            const penyuluhKelompokTani = await PenyuluhKelompokTani.findAll({
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
                    tahun: year,
                },
            });

            if (penyuluhKelompokTani.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet(`POKTAN ${year}`);

                worksheet.columns = [
                    { width: 5 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 10 },
                    { width: 5 },
                    { width: 5 },
                    { width: 5 },
                    { width: 5 },
                    { width: 5 },
                    { width: 5 },
                    { width: 10 },
                ];

                worksheet.getCell('A3').value = `DATA KELOMPOK TANI (POKTAN) KABUPATEN LAMPUNG TIMUR`;

                worksheet.mergeCells('A3:P3');
                worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell('A3').font = {
                    bold: true,
                };

                let columns = ['A', 'B', 'C', 'D', 'E', 'H', 'I', 'J', 'L', 'P'];
                let row = 6;
                [
                    'No',
                    'Nama UPTD BPP',
                    'Nama Desa',
                    'Nama Kelompok Tani',
                    'Pengurus Kelompok Tani',
                    'Alamat Sekretariat',
                    'Tahun Dibent',
                    'Jumlah Anggota',
                    'Kelas Kelompok',
                    'ID Poktan',
                ].forEach((i, idx) => {
                    worksheet.getCell(`${columns[idx]}${row}`).value = `${i}`;
                });

                columns = ['A', 'B', 'C', 'D', 'H', 'I', 'P'];
                columns.forEach(col => {
                    worksheet.getCell(`${col}${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.mergeCells(`${col}${row}:${col}${row + 1}`);
                });

                worksheet.mergeCells(`E${row}:G${row}`);
                worksheet.getCell(`E${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.mergeCells(`J${row}:K${row}`);
                worksheet.getCell(`J${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.mergeCells(`L${row}:O${row}`);
                worksheet.getCell(`L${row}`).alignment = { vertical: 'middle', horizontal: 'center' };

                row++;

                worksheet.getCell(`E${row}`).value = `Ketua`;
                worksheet.getCell(`E${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`F${row}`).value = `Sekretaris`;
                worksheet.getCell(`F${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`G${row}`).value = `Bendahara`;
                worksheet.getCell(`G${row}`).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell(`J${row}`).value = `L`;
                worksheet.getCell(`J${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`K${row}`).value = `P`;
                worksheet.getCell(`K${row}`).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell(`L${row}`).value = `P`;
                worksheet.getCell(`L${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`M${row}`).value = `L`;
                worksheet.getCell(`M${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`N${row}`).value = `M`;
                worksheet.getCell(`N${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`O${row}`).value = `U`;
                worksheet.getCell(`O${row}`).alignment = { vertical: 'middle', horizontal: 'center' };


                penyuluhKelompokTani.forEach((item, index) => {
                    row++;
                    worksheet.getRow(row).values = [index + 1, item?.kecamatan?.nama || '', item?.desa?.nama || '', item.nama, item.ketua, item.sekretaris, item.bendahara, item.alamat, item.dibent, item.l, item.p, item.kelas === 'p' ? 'V' : '-', item.kelas === 'l' ? 'V' : '-', item.kelas === 'm' ? 'V' : '-', item.kelas === 'u' ? 'V' : '-', item.idPoktan];
                });


                for (let i = 6; i <= row; i++) {
                    for (let j = 'A'.charCodeAt(0); j <= 'P'.charCodeAt(0); j++) {
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
                res.setHeader("Content-Disposition", "attachment; filename=" + "penyuluh-kelompok-tani.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Penyuluh kelompok tani not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    gabunganKelompokTani: async (req, res) => {
        try {
            let { year } = req.query;

            year = !isNaN(parseInt(year)) ? parseInt(year) : new Date().getFullYear();

            const penyuluhGabunganKelompokTani = await PenyuluhGabunganKelompokTani.findAll({
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
                    tahun: year,
                },
            });

            if (penyuluhGabunganKelompokTani.length) {
                const workbook = new exceljs.Workbook();
                const worksheet = workbook.addWorksheet(`POKTAN ${year}`);

                worksheet.columns = [
                    { width: 5 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 15 },
                    { width: 10 },
                    { width: 10 },
                    { width: 10 },
                    { width: 5 },
                    { width: 5 },
                    { width: 10 },
                ];

                worksheet.getCell('A3').value = `DATA GABUNGAN KELOMPOK TANI GAPOKTAN KABUPATEN LAMPUNG TIMUR`;

                worksheet.mergeCells('A3:P3');
                worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell('A3').font = {
                    bold: true,
                };

                let columns = ['A', 'B', 'C', 'D', 'E', 'H', 'I', 'J', 'K', 'L', 'N'];
                let row = 6;
                [
                    'No',
                    'Nama UPTD BPP',
                    'Nama Desa',
                    'Nama Gabungan Kelompok Tani',
                    'Pengurus Gabungan Kelompok Tani',
                    'Alamat Sekretariat',
                    'Luas Lahan (Ha)',
                    'Tahun Dibentuk',
                    'Jumlah Poktan',
                    'Jumlah Anggota',
                    'Total Anggota',
                ].forEach((i, idx) => {
                    worksheet.getCell(`${columns[idx]}${row}`).value = `${i}`;
                });

                columns = ['A', 'B', 'C', 'D', 'H', 'I', 'J', 'K', 'N'];
                columns.forEach(col => {
                    worksheet.getCell(`${col}${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                    worksheet.mergeCells(`${col}${row}:${col}${row + 1}`);
                });

                worksheet.mergeCells(`E${row}:G${row}`);
                worksheet.getCell(`E${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.mergeCells(`L${row}:M${row}`);
                worksheet.getCell(`L${row}`).alignment = { vertical: 'middle', horizontal: 'center' };

                row++;

                worksheet.getCell(`E${row}`).value = `Ketua`;
                worksheet.getCell(`E${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`F${row}`).value = `Sekretaris`;
                worksheet.getCell(`F${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`G${row}`).value = `Bendahara`;
                worksheet.getCell(`G${row}`).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell(`L${row}`).value = `L`;
                worksheet.getCell(`L${row}`).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(`M${row}`).value = `P`;
                worksheet.getCell(`M${row}`).alignment = { vertical: 'middle', horizontal: 'center' };

                penyuluhGabunganKelompokTani.forEach((item, index) => {
                    row++;
                    worksheet.getRow(row).values = [index + 1, item?.kecamatan?.nama || '', item?.desa?.nama || '', item.nama, item.ketua, item.sekretaris, item.bendahara, item.alamat, item.lahan, item.dibentuk, item.poktan, item.l, item.p, item.total];
                });


                for (let i = 6; i <= row; i++) {
                    for (let j = 'A'.charCodeAt(0); j <= 'N'.charCodeAt(0); j++) {
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
                res.setHeader("Content-Disposition", "attachment; filename=" + "penyuluh-gabungan-kelompok-tani.xlsx");

                workbook.xlsx.write(res).then(() => res.end());
                return;
            }

            res.status(404).json(response(404, 'Penyuluh gabungan kelompok tani not found'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}