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

const dataMap = (data, prefix = '') => {
    let list = {};
    for (let item of data) {
        for (let i of item.list) {
            list[prefix] = true;
            list[prefix + 'SumJumlah'] = list[prefix + 'SumJumlah'] ? list[prefix + 'SumJumlah'] + i.jumlah : i.jumlah || 0;
            list[prefix + 'SumTbm'] = list[prefix + 'SumTbm'] ? list[prefix + 'SumTbm'] + i.tbm : i.tbm || 0;
            list[prefix + 'SumTm'] = list[prefix + 'SumTm'] ? list[prefix + 'SumTm'] + i.tm : i.tm || 0;
            list[prefix + 'SumTr'] = list[prefix + 'SumTr'] ? list[prefix + 'SumTr'] + i.tr : i.tr || 0;
            list[prefix + 'SumJmlPetaniPekebun'] = list[prefix + 'SumJmlPetaniPekebun'] ? list[prefix + 'SumJmlPetaniPekebun'] + i.jmlPetaniPekebun : i.jmlPetaniPekebun || 0;
            list[prefix + 'SumProduktivitas'] = list[prefix + 'SumProduktivitas'] ? list[prefix + 'SumProduktivitas'] + i.produktivitas : i.produktivitas || 0;
            list[prefix + 'SumProduksi'] = list[prefix + 'SumProduksi'] ? list[prefix + 'SumProduksi'] + i.produksi : i.produksi || 0;

            let pos = i.masterKategoriKomoditasId;

            list['ids'] = list['ids'] || [];
            if (!list['ids'].includes(pos)) {
                list['ids'].push(pos)
            }

            list[pos] = list[pos] || {};

            list[pos]['kategori'] = i?.kategoriKomoditas?.nama || 'error';
            list[pos][prefix + 'SumJumlah'] = list[pos][prefix + 'SumJumlah'] ? list[pos][prefix + 'SumJumlah'] + i.jumlah : i.jumlah || 0;
            list[pos][prefix + 'SumTbm'] = list[pos][prefix + 'SumTbm'] ? list[pos][prefix + 'SumTbm'] + i.tbm : i.tbm || 0;
            list[pos][prefix + 'SumTm'] = list[pos][prefix + 'SumTm'] ? list[pos][prefix + 'SumTm'] + i.tm : i.tm || 0;
            list[pos][prefix + 'SumTr'] = list[pos][prefix + 'SumTr'] ? list[pos][prefix + 'SumTr'] + i.tr : i.tr || 0;
            list[pos][prefix + 'SumJmlPetaniPekebun'] = list[pos][prefix + 'SumJmlPetaniPekebun'] ? list[pos][prefix + 'SumJmlPetaniPekebun'] + i.jmlPetaniPekebun : i.jmlPetaniPekebun || 0;
            list[pos][prefix + 'SumProduktivitas'] = list[pos][prefix + 'SumProduktivitas'] ? list[pos][prefix + 'SumProduktivitas'] + i.produktivitas : i.produktivitas || 0;
            list[pos][prefix + 'SumProduksi'] = list[pos][prefix + 'SumProduksi'] ? list[pos][prefix + 'SumProduksi'] + i.produksi : i.produksi || 0;

            list[pos]['list'] = list[pos]['list'] || {};
            list[pos]['list'][i.komoditas.id] = list[pos]['list'][i.komoditas.id] || { komoditas: i?.komoditas?.nama || 'error' };

            list[pos]['list'][i.komoditas.id][prefix + 'Tbm'] = list[pos]['list'][i.komoditas.id][prefix + 'Tbm'] || 0;
            list[pos]['list'][i.komoditas.id][prefix + 'Tbm'] = i.tbm ? list[pos]['list'][i.komoditas.id][prefix + 'Tbm'] + i.tbm : list[pos]['list'][i.komoditas.id][prefix + 'Tbm'];

            list[pos]['list'][i.komoditas.id][prefix + 'Tm'] = list[pos]['list'][i.komoditas.id][prefix + 'Tm'] || 0;
            list[pos]['list'][i.komoditas.id][prefix + 'Tm'] = i.tm ? list[pos]['list'][i.komoditas.id][prefix + 'Tm'] + i.tm : list[pos]['list'][i.komoditas.id][prefix + 'Tm'];

            list[pos]['list'][i.komoditas.id][prefix + 'Tr'] = list[pos]['list'][i.komoditas.id][prefix + 'Tr'] || 0;
            list[pos]['list'][i.komoditas.id][prefix + 'Tr'] = i.tr ? list[pos]['list'][i.komoditas.id][prefix + 'Tr'] + i.tr : list[pos]['list'][i.komoditas.id][prefix + 'Tr'];

            list[pos]['list'][i.komoditas.id][prefix + 'Jumlah'] = list[pos]['list'][i.komoditas.id][prefix + 'Jumlah'] || 0;
            list[pos]['list'][i.komoditas.id][prefix + 'Jumlah'] = i.jumlah ? list[pos]['list'][i.komoditas.id][prefix + 'Jumlah'] + i.jumlah : list[pos]['list'][i.komoditas.id][prefix + 'Jumlah'];

            list[pos]['list'][i.komoditas.id][prefix + 'Produksi'] = list[pos]['list'][i.komoditas.id][prefix + 'Produksi'] || 0;
            list[pos]['list'][i.komoditas.id][prefix + 'Produksi'] = i.produksi ? list[pos]['list'][i.komoditas.id][prefix + 'Produksi'] + i.produksi : list[pos]['list'][i.komoditas.id][prefix + 'Produksi'];

            list[pos]['list'][i.komoditas.id][prefix + 'Produktivitas'] = list[pos]['list'][i.komoditas.id][prefix + 'Produktivitas'] || 0;
            list[pos]['list'][i.komoditas.id][prefix + 'Produktivitas'] = i.produktivitas ? list[pos]['list'][i.komoditas.id][prefix + 'Produktivitas'] + i.produktivitas : list[pos]['list'][i.komoditas.id][prefix + 'Produktivitas'];

            list[pos]['list'][i.komoditas.id][prefix + 'JmlPetaniPekebun'] = list[pos]['list'][i.komoditas.id][prefix + 'JmlPetaniPekebun'] || 0;
            list[pos]['list'][i.komoditas.id][prefix + 'JmlPetaniPekebun'] = i.jmlPetaniPekebun ? list[pos]['list'][i.komoditas.id][prefix + 'JmlPetaniPekebun'] + i.jmlPetaniPekebun : list[pos]['list'][i.komoditas.id][prefix + 'JmlPetaniPekebun'];

            list[pos]['list']['ids'] = list[pos]['list']['ids'] || [];
            if (!list[pos]['list']['ids'].includes(i.komoditas.id)) {
                list[pos]['list']['ids'].push(i.komoditas.id)
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

            const kategori = await PerkebunanMasterKategoriKomoditas.findAll();
            const komoditas = await PerkebunanMasterKomoditas.findAll();

            let current = await getOne(currentYear);
            let before = await getOne(yearBefore);
            let data = {}

            current = dataMap(current, 'asem');
            before = dataMap(before, 'atap');

            for (let temp of [
                'SumJumlah',
                'SumTbm',
                'SumTm',
                'SumTr',
                'SumJmlPetaniPekebun',
                'SumProduktivitas',
                'SumProduksi',
            ]) {
                data['asem' + temp] = current['asem' + temp];
                data['atap' + temp] = before['atap' + temp];
            }

            kategori.forEach(kat => {
                const katId = kat.id;

                data[katId] = data[katId] || { kategori: kat.nama };

                for (let temp of [
                    'SumJumlah',
                    'SumTbm',
                    'SumTm',
                    'SumTr',
                    'SumJmlPetaniPekebun',
                    'SumProduktivitas',
                    'SumProduksi',
                ]) {
                    if (current[katId]) {
                        data[katId]['asem' + temp] = current[katId]['asem' + temp] || 0;
                    }
                    if (before[katId]) {
                        data[katId]['atap' + temp] = before[katId]['atap' + temp] || 0;
                    }
                }

                data[katId]['list'] = data[katId]['list'] || {};
                komoditas.forEach(kom => {
                    if (kom.perkebunanMasterKategoriId === katId) {
                        const komId = kom.id;

                        data[katId]['ids'] = data[katId]['ids'] || [];

                        if (!data[katId]['ids'].includes(komId)) {
                            data[katId]['ids'].push(komId);
                        }

                        data[katId]['list'][komId] = data[katId]['list'][komId] || { komoditas: kom.nama }
                        for (let temp of [
                            'Tbm',
                            'Tm',
                            'Tr',
                            'Jumlah',
                            'Produksi',
                            'Produktivitas',
                            'JmlPetaniPekebun',
                        ]) {
                            if (current[katId]) {
                                if (current[katId]['list']) {
                                    if (current[katId]['list'][komId]) {
                                        data[katId]['list'][komId]['asem' + temp] = current[katId]['list'][komId]['asem' + temp] || 0;
                                    }
                                }
                            }
                            if (before[katId]) {
                                if (before[katId]['list']) {
                                    if (before[katId]['list'][komId]) {
                                        data[katId]['list'][komId]['atap' + temp] = before[katId]['list'][komId]['atap' + temp] || 0;
                                    }
                                }
                            }
                        }
                    }
                })
            })

            res.status(200).json(response(200, 'Get perkebunan successfully', { yearBefore, currentYear, data }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}