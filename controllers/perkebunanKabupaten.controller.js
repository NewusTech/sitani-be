const {
    PerkebunanMasterKategoriKomoditas,
    PerkebunanMasterKomoditas,
    PerkebunanKecamatanList,
    PerkebunanKecamatan,
    Kecamatan,
    sequelize
} = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const getOne = async (year) => {
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
                        model: PerkebunanMasterKomoditas,
                        as: 'komoditas'
                    },
                ],
            }
        ],
        where: {
            tahun: year
        },
    });
};

const dataMap = (data) => {
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

module.exports = {
    getAll: async (req, res) => {
        try {
            const currentYear = new Date().getFullYear();
            const yearBefore = currentYear - 1;

            let current = await getOne(currentYear);
            let before = await getOne(yearBefore);

            current = dataMap(current);
            before = dataMap(before);

            res.status(200).json(response(200, 'Get perkebunan successfully', { yearBefore, currentYear, before, current }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}