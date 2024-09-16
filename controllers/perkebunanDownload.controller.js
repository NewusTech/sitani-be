const { PerkebunanMasterKategoriKomoditas, PerkebunanKecamatanList, PerkebunanKecamatan, KepangMasterKomoditas, Kecamatan, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');
const exceljs = require('exceljs');

const v = new Validator();

const getOne = async (year, kecamatan = undefined) => {
    let where = {
        tahun: year,
    };
    if (kecamatan) {
        where.kecamatanId = kecamatan;
    }
    return await PerkebunanKecamatan.findAll({
        include: [
            {
                model: Kecamatan,
                as: 'kecamatan',
            },
            {
                model: PerkebunanKecamatanList,
                as: 'list',
                include: [
                    {
                        model: PerkebunanMasterKategoriKomoditas,
                        as: 'kategoriKomoditas'
                    },
                    {
                        model: KepangMasterKomoditas,
                        as: 'komoditas'
                    },
                ],
            }
        ],
        where,
    });
};

const dataMapKabupaten = (data) => {
    let temp = [];
    let list = [];
    for (let item of data) {
        for (let i of item.list) {
            let masterKategoriKomoditasId = i.masterKategoriKomoditasId;

            if (!temp.includes(masterKategoriKomoditasId)) {
                temp.push(masterKategoriKomoditasId);
            }

            let pos = temp.indexOf(masterKategoriKomoditasId);

            if (!list[pos]) {
                list[pos] = {};
            }

            list[pos]['kategori'] = i?.kategoriKomoditas?.nama || 'error';
            list[pos]['sumJumlah'] = list[pos]['sumJumlah'] ? list[pos]['sumJumlah'] + i.jumlah : i.jumlah || 0;
            list[pos]['sumTbm'] = list[pos]['sumTbm'] ? list[pos]['sumTbm'] + i.tbm : i.tbm || 0;
            list[pos]['sumTm'] = list[pos]['sumTm'] ? list[pos]['sumTm'] + i.tm : i.tm || 0;
            list[pos]['sumTr'] = list[pos]['sumTr'] ? list[pos]['sumTr'] + i.tr : i.tr || 0;
            list[pos]['sumJmlPetaniPekebun'] = list[pos]['sumJmlPetaniPekebun'] ? list[pos]['sumJmlPetaniPekebun'] + i.jmlPetaniPekebun : i.jmlPetaniPekebun || 0;
            list[pos]['sumProduktivitas'] = list[pos]['sumProduktivitas'] ? list[pos]['sumProduktivitas'] + i.produktivitas : i.produktivitas || 0;
            list[pos]['sumProduksi'] = list[pos]['sumProduksi'] ? list[pos]['sumProduksi'] + i.produksi : i.produksi || 0;

            let objTemp = {
                id: i.id,
                komoditas: i?.komoditas?.nama || 'error',
                tbm: i.tbm,
                tm: i.tm,
                tr: i.tr,
                jumlah: i.jumlah,
                produksi: i.produksi,
                produktivitas: i.produktivitas,
                jmlPetaniPekebun: i.jmlPetaniPekebun,
                bentukHasil: i.bentukHasil,
                keterangan: i.keterangan,
            };

            if (list[pos]['list']) {
                list[pos]['list'].push(objTemp);
            } else {
                list[pos]['list'] = [objTemp];
            }
        }
    }
    return list;
}

const dataMapKecamatan = (item) => {
    let temp = [];
    let list = [];
    for (let i of item.list) {
        let masterKategoriKomoditasId = i.masterKategoriKomoditasId;

        if (!temp.includes(masterKategoriKomoditasId)) {
            temp.push(masterKategoriKomoditasId);
        }

        let pos = temp.indexOf(masterKategoriKomoditasId);

        if (!list[pos]) {
            list[pos] = {};
        }

        list[pos]['kategori'] = i?.kategoriKomoditas?.nama || 'error';
        list[pos]['sumJumlah'] = list[pos]['sumJumlah'] ? list[pos]['sumJumlah'] + i.jumlah : i.jumlah || 0;
        list[pos]['sumTbm'] = list[pos]['sumTbm'] ? list[pos]['sumTbm'] + i.tbm : i.tbm || 0;
        list[pos]['sumTm'] = list[pos]['sumTm'] ? list[pos]['sumTm'] + i.tm : i.tm || 0;
        list[pos]['sumTr'] = list[pos]['sumTr'] ? list[pos]['sumTr'] + i.tr : i.tr || 0;
        list[pos]['sumJmlPetaniPekebun'] = list[pos]['sumJmlPetaniPekebun'] ? list[pos]['sumJmlPetaniPekebun'] + i.jmlPetaniPekebun : i.jmlPetaniPekebun || 0;
        list[pos]['sumProduktivitas'] = list[pos]['sumProduktivitas'] ? list[pos]['sumProduktivitas'] + i.produktivitas : i.produktivitas || 0;
        list[pos]['sumProduksi'] = list[pos]['sumProduksi'] ? list[pos]['sumProduksi'] + i.produksi : i.produksi || 0;

        let objTemp = {
            id: i.id,
            komoditas: i?.komoditas?.nama || 'error',
            tbm: i.tbm,
            tm: i.tm,
            tr: i.tr,
            jumlah: i.jumlah,
            produksi: i.produksi,
            produktivitas: i.produktivitas,
            jmlPetaniPekebun: i.jmlPetaniPekebun,
            bentukHasil: i.bentukHasil,
            keterangan: i.keterangan,
        };

        if (list[pos]['list']) {
            list[pos]['list'].push(objTemp);
        } else {
            list[pos]['list'] = [objTemp];
        }
    }
    return {
        tahun: item.tahun,
        kecamatan: item?.kecamatan?.nama || 'error',
        list,
    }
}

module.exports = {
    kabupaten: async (req, res) => {
        try {
            const currentYear = new Date().getFullYear();
            const yearBefore = currentYear - 1;

            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet(`Lamtim ${currentYear} Kabupaten`);

            let current = await getOne(currentYear);
            let before = await getOne(yearBefore);

            current = dataMapKabupaten(current);
            before = dataMapKabupaten(before);

            worksheet.columns = [
                {},
                { width: 5 },
                { width: 25 },
                { width: 15 },
                { width: 15 },
                { width: 15 },
                { width: 15 },
                { width: 20 },
                { width: 20 },
                { width: 20 },
                { width: 15 },
                { width: 15 },
                { width: 15 },
                { width: 15 },
                { width: 20 },
                { width: 20 },
                { width: 20 },
            ];

            worksheet.getCell('B2').value = `DATA ANGKA SEMENTARA TANAMAN PERKEBUNAN TAHUN ${currentYear} LAMPUNG TIMUR`;

            worksheet.getCell('B4').value = `ATAP ${yearBefore}`;
            worksheet.getCell('K4').value = `ASEM ${currentYear}`;

            worksheet.getRow(5).values = [null, 'NO', 'KOMODITI'];
            ['D5', 'K5'].forEach(cell => {
                worksheet.getCell(cell).value = `KOMPOSISI LUAS AREAL`;
            });
            ['G5', 'N5'].forEach(cell => {
                worksheet.getCell(cell).value = `JUMLAH`;
            });
            ['H5', 'O5'].forEach(cell => {
                worksheet.getCell(cell).value = `PRODUKSI (TON)`;
            });
            ['I5', 'P5'].forEach(cell => {
                worksheet.getCell(cell).value = `PRODUKTIVITAS Kg/Ha`;
            });
            ['J5', 'Q5'].forEach(cell => {
                worksheet.getCell(cell).value = `Jml. Petani Pekebun (KK)`;
            });
            ['D6', 'K6'].forEach(cell => {
                worksheet.getCell(cell).value = `TBM`;
            });
            ['E6', 'L6'].forEach(cell => {
                worksheet.getCell(cell).value = `TM`;
            });
            ['F6', 'M6'].forEach(cell => {
                worksheet.getCell(cell).value = `TR`;
            });

            let sumIndex = [];
            let row = 6;
            current.forEach((item, index) => {
                row++;
                worksheet.getCell(`B${row}`).value = `${index + 1}`;
                worksheet.getCell(`C${row}`).value = item.kategori;
                row++;
                let befTemp = null;
                for (let bef of before) {
                    if (item.kategori.toLowerCase() === bef.kategori.toLowerCase()) {
                        befTemp = bef;
                        break;
                    }
                }
                item.list.forEach((itemList, indexList) => {
                    worksheet.getCell(`B${row}`).value = `${indexList + 1}`;
                    worksheet.getCell(`C${row}`).value = itemList.komoditas;

                    if (befTemp?.list?.length) {
                        for (let befList of befTemp.list) {
                            if (itemList.komoditas.toLowerCase() === befList.komoditas.toLowerCase()) {
                                worksheet.getCell(`D${row}`).value = befList?.tbm || null;
                                worksheet.getCell(`E${row}`).value = befList?.tm || null;
                                worksheet.getCell(`F${row}`).value = befList?.tr || null;

                                worksheet.getCell(`G${row}`).value = befList?.jumlah || null;
                                worksheet.getCell(`H${row}`).value = befList?.produksi || null;
                                worksheet.getCell(`I${row}`).value = befList?.produktivitas || null;
                                worksheet.getCell(`J${row}`).value = befList?.jmlPetaniPekebun || null;
                                break;
                            }
                        }
                    }

                    worksheet.getCell(`K${row}`).value = itemList?.tbm || null;
                    worksheet.getCell(`L${row}`).value = itemList?.tm || null;
                    worksheet.getCell(`M${row}`).value = itemList?.tr || null;

                    worksheet.getCell(`N${row}`).value = itemList?.jumlah || null;
                    worksheet.getCell(`O${row}`).value = itemList?.produksi || null;
                    worksheet.getCell(`P${row}`).value = itemList?.produktivitas || null;
                    worksheet.getCell(`Q${row}`).value = itemList?.jmlPetaniPekebun || null;
                    row++;
                });
                sumIndex.push(row);
                worksheet.getCell(`C${row}`).value = `JUMLAH ${index + 1}`;

                worksheet.getCell(`D${row}`).value = befTemp?.sumTbm || null;
                worksheet.getCell(`E${row}`).value = befTemp?.sumTm || null;
                worksheet.getCell(`F${row}`).value = befTemp?.sumTr || null;

                worksheet.getCell(`G${row}`).value = befTemp?.sumJumlah || null;
                worksheet.getCell(`H${row}`).value = befTemp?.sumProduksi || null;
                worksheet.getCell(`I${row}`).value = befTemp?.sumProduktivitas || null;
                worksheet.getCell(`J${row}`).value = befTemp?.sumJmlPetaniPekebun || null;

                worksheet.getCell(`K${row}`).value = item?.sumTbm || null;
                worksheet.getCell(`L${row}`).value = item?.sumTm || null;
                worksheet.getCell(`M${row}`).value = item?.sumTr || null;

                worksheet.getCell(`N${row}`).value = item?.sumJumlah || null;
                worksheet.getCell(`O${row}`).value = item?.sumProduksi || null;
                worksheet.getCell(`P${row}`).value = item?.sumProduktivitas || null;
                worksheet.getCell(`Q${row}`).value = item?.sumJmlPetaniPekebun || null;
                row++;
            });
            if (sumIndex.length) {
                let strTemp = '';
                sumIndex.forEach((item, index) => {
                    if (index !== sumIndex.length - 1) {
                        strTemp += `${index + 1} + `;
                    } else {
                        strTemp += `${index + 1}`;
                    }
                });
                worksheet.getCell(`C${row}`).value = `JUMLAH ${strTemp}`;

                // worksheet.getCell(`D${row}`).formula = ;
                // worksheet.getCell(`E${row}`).value = befTemp?.sumTm || null;
                // worksheet.getCell(`F${row}`).value = befTemp?.sumTr || null;

                // worksheet.getCell(`G${row}`).value = befTemp?.sumJumlah || null;
                // worksheet.getCell(`H${row}`).value = befTemp?.sumProduksi || null;
                // worksheet.getCell(`I${row}`).value = befTemp?.sumProduktivitas || null;
                // worksheet.getCell(`J${row}`).value = befTemp?.sumJmlPetaniPekebun || null;

                // worksheet.getCell(`K${row}`).value = item?.sumTbm || null;
                // worksheet.getCell(`L${row}`).value = item?.sumTm || null;
                // worksheet.getCell(`M${row}`).value = item?.sumTr || null;

                // worksheet.getCell(`N${row}`).value = item?.sumJumlah || null;
                // worksheet.getCell(`O${row}`).value = item?.sumProduksi || null;
                // worksheet.getCell(`P${row}`).value = item?.sumProduktivitas || null;
                // worksheet.getCell(`Q${row}`).value = item?.sumJmlPetaniPekebun || null;
                row++;
            }

            worksheet.mergeCells('B2:Q2');
            worksheet.mergeCells('B4:J4');
            worksheet.mergeCells('K4:Q4');
            worksheet.mergeCells('B5:B6');
            worksheet.mergeCells('C5:C6');
            worksheet.mergeCells('D5:F5');
            worksheet.mergeCells('G5:G6');
            worksheet.mergeCells('H5:H6');
            worksheet.mergeCells('I5:I6');
            worksheet.mergeCells('J5:J6');
            worksheet.mergeCells('K5:M5');
            worksheet.mergeCells('N5:N6');
            worksheet.mergeCells('O5:O6');
            worksheet.mergeCells('P5:P6');
            worksheet.mergeCells('Q5:Q6');

            for (let i = 7; i < row; i++) {
                ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'].forEach(j => {
                    let cell = `${j}${i}`;
                    worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
                });
            }
            for (let i = 7; i < row; i++) {
                ['B'].forEach(j => {
                    let cell = `${j}${i}`;
                    worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                });
            }
            ['B2'].forEach(cell => {
                worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getCell(cell).font = {
                    bold: true,
                };
            });

            for (let i = 4; i <= 6; i++) {
                ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'].forEach(j => {
                    let cell = `${j}${i}`;
                    worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                });
            }

            for (let i = 4; i < row; i++) {
                ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'].forEach(j => {
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
            res.setHeader("Content-Disposition", "attachment; filename=" + "perkebunan-kabupaten.xlsx");

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
            let { kecamatan, year } = req.query;

            year = !isNaN(parseInt(year)) ? parseInt(year) : new Date().getFullYear();
            kecamatan = !isNaN(parseInt(kecamatan)) ? parseInt(kecamatan) : null;

            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet(`Lamtim ${year} Kecamatan`);

            let current = await getOne(year, kecamatan);

            current = current.map(dataMapKecamatan);

            worksheet.columns = [
                { width: 5 },
                { width: 25 },
                { width: 15 },
                { width: 15 },
                { width: 15 },
                { width: 15 },
                { width: 20 },
                { width: 20 },
                { width: 20 },
                { width: 20 },
                { width: 40 },
            ];

            let row = 3;
            current.forEach((data, indexData) => {
                worksheet.getCell(`A${row}`).value = `LUAS AREAL DAN PRODUKSI PERKEBUNAN RAKYAT (PR) KABUPATEN LAMPUNG TIMUR`;
                row++;
                worksheet.getCell(`A${row}`).value = `KECAMATAN ${data.kecamatan.toUpperCase()} TAHUN : ${data.tahun}`;
                row += 2;

                worksheet.getRow(row).values = ['NO', 'KOMODITI'];
                worksheet.getCell(`C${row}`).value = `KOMPOSISI LUAS AREAL`;
                worksheet.getCell(`F${row}`).value = `JUMLAH`;
                worksheet.getCell(`G${row}`).value = `PRODUKSI (TON)`;
                worksheet.getCell(`H${row}`).value = `PRODUKTIVITAS Kg/Ha`;
                worksheet.getCell(`I${row}`).value = `Jml. Petani Pekebun (KK)`;
                worksheet.getCell(`J${row}`).value = `BENTUK HASIL`;
                worksheet.getCell(`K${row}`).value = `KETERANGAN`;
                worksheet.mergeCells(`A${row}:A${row + 1}`);
                worksheet.mergeCells(`B${row}:B${row + 1}`);
                worksheet.mergeCells(`C${row}:E${row}`);
                worksheet.mergeCells(`F${row}:F${row + 1}`);
                worksheet.mergeCells(`G${row}:G${row + 1}`);
                worksheet.mergeCells(`H${row}:H${row + 1}`);
                worksheet.mergeCells(`I${row}:I${row + 1}`);
                worksheet.mergeCells(`J${row}:J${row + 1}`);
                worksheet.mergeCells(`K${row}:K${row + 1}`);
                row++;
                worksheet.getCell(`C${row}`).value = `TBM`;
                worksheet.getCell(`D${row}`).value = `TM`;
                worksheet.getCell(`E${row}`).value = `TR`;
                row++;
                let startTable = row;

                let sumIndex = [];
                data.list.forEach((item, index) => {
                    row++;
                    worksheet.getCell(`A${row}`).value = `${index + 1}`;
                    worksheet.getCell(`B${row}`).value = item.kategori;
                    row++;
                    item.list.forEach((itemList, indexList) => {
                        worksheet.getCell(`A${row}`).value = `${indexList + 1}`;
                        worksheet.getCell(`B${row}`).value = itemList.komoditas;

                        worksheet.getCell(`C${row}`).value = itemList?.tbm || null;
                        worksheet.getCell(`D${row}`).value = itemList?.tm || null;
                        worksheet.getCell(`E${row}`).value = itemList?.tr || null;

                        worksheet.getCell(`F${row}`).value = itemList?.jumlah || null;
                        worksheet.getCell(`G${row}`).value = itemList?.produksi || null;
                        worksheet.getCell(`H${row}`).value = itemList?.produktivitas || null;
                        worksheet.getCell(`I${row}`).value = itemList?.jmlPetaniPekebun || null;

                        worksheet.getCell(`J${row}`).value = itemList?.bentukHasil;
                        worksheet.getCell(`K${row}`).value = itemList?.keterangan;
                        row++;
                    });
                    sumIndex.push(row);
                    worksheet.getCell(`B${row}`).value = `JUMLAH ${index + 1}`;

                    worksheet.getCell(`C${row}`).value = item?.sumTbm || null;
                    worksheet.getCell(`D${row}`).value = item?.sumTm || null;
                    worksheet.getCell(`E${row}`).value = item?.sumTr || null;

                    worksheet.getCell(`F${row}`).value = item?.sumJumlah || null;
                    worksheet.getCell(`G${row}`).value = item?.sumProduksi || null;
                    worksheet.getCell(`H${row}`).value = item?.sumProduktivitas || null;
                    worksheet.getCell(`I${row}`).value = item?.sumJmlPetaniPekebun || null;
                    row++;
                });
                // if (sumIndex.length) {
                //     let strTemp = '';
                //     sumIndex.forEach((item, index) => {
                //         if (index !== sumIndex.length - 1) {
                //             strTemp += `${index + 1} + `;
                //         } else {
                //             strTemp += `${index + 1}`;
                //         }
                //     });
                //     worksheet.getCell(`C${row}`).value = `JUMLAH ${strTemp}`;

                //     // worksheet.getCell(`D${row}`).formula = ;
                //     // worksheet.getCell(`E${row}`).value = befTemp?.sumTm || null;
                //     // worksheet.getCell(`F${row}`).value = befTemp?.sumTr || null;

                //     // worksheet.getCell(`G${row}`).value = befTemp?.sumJumlah || null;
                //     // worksheet.getCell(`H${row}`).value = befTemp?.sumProduksi || null;
                //     // worksheet.getCell(`I${row}`).value = befTemp?.sumProduktivitas || null;
                //     // worksheet.getCell(`J${row}`).value = befTemp?.sumJmlPetaniPekebun || null;

                //     // worksheet.getCell(`K${row}`).value = item?.sumTbm || null;
                //     // worksheet.getCell(`L${row}`).value = item?.sumTm || null;
                //     // worksheet.getCell(`M${row}`).value = item?.sumTr || null;

                //     // worksheet.getCell(`N${row}`).value = item?.sumJumlah || null;
                //     // worksheet.getCell(`O${row}`).value = item?.sumProduksi || null;
                //     // worksheet.getCell(`P${row}`).value = item?.sumProduktivitas || null;
                //     // worksheet.getCell(`Q${row}`).value = item?.sumJmlPetaniPekebun || null;
                //     row++;
                // }


                for (let i = startTable; i < row; i++) {
                    ['C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'right' };
                    });
                }
                for (let i = startTable; i < row; i++) {
                    ['A'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                }
                for (let i = startTable - 5; i < startTable - 3; i++) {
                    ['A'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).font = {
                            bold: true,
                        };
                    });
                }
                for (let i = startTable - 2; i <= startTable; i++) {
                    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].forEach(j => {
                        let cell = `${j}${i}`;
                        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                }

                for (let i = startTable - 2; i < row; i++) {
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

                row += 2;
            });

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=" + "perkebunan-kecamatan.xlsx");

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