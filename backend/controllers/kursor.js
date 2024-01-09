

const databaseService = require('../services/database.service');
const { sortData } = require('../helpers')
exports.getKursorObjects = async (req, res) => {
    const login = req.body.login
    const data = await databaseService.getKursorObjects(login)
    const ress = sortData(data)

    // console.log(ress)
    const massObject = [];
    for (const elem of ress) {
        let promises;
        promises = elem.objects.map(async el => {
            return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject));
        });
        const dataObjectGroup = await Promise.all(promises)
        elem.objects = dataObjectGroup
        const massSub = []
        for (const sub of elem.sub) {
            promises = sub.objects.map(async el => {
                return await databaseService.loadParamsViewList(el.nameObject, Number(el.idObject));
            });
            const dataObjectSub = await Promise.all(promises)
            sub.objects = dataObjectSub
            const result = sub.objects.map(e => {
                return [...e, sub.name_sub_g, Number(sub.id_sub_g)]
            })

            massSub.push(result)
        }
        // console.log(elem.objects)
        let result;
        if (elem.objects.length !== 0) {
            result = elem.objects.map(e => {
                return [...e, elem.name_g, Number(elem.idg), { sub: massSub }, 'kursor']
            })
        }
        else {
            result = [[{}, {}, {}, {}, null, elem.name_g, Number(elem.idg), { sub: massSub }, 'kursor']]

        }

        //   console.log(result)
        massObject.push(result)
    }
    res.json({ result: massObject })
}
