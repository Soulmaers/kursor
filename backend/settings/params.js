
const carId = {
    1: 25594204,
    2: 25343786,
    3: 25766831
}



//поиск значений датчиков по последнему сообщению
const prms1 = {
    "unitId": 25766831, //25594204 dtrmx,..25343786 зз933
    "sensors": []
};
const prms12 = {
    "unitId": 25766831, //25594204 dtrmx,
    "sensors": []
};


//все параметры
const flags = 1 + 1026
const prms = {
    "spec": {
        "itemsType": "avl_unit",
        "propName": "sys_name",
        "propValueMask": "*",
        "sortType": "sys_name"
    },
    "force": 1,
    "flags": flags,
    "from": 0,
    "to": 0
};







/*

const prms2 = {
    "id": 25766831, //25343786,-pres //25594204 dtrmx, //25766831-кран
    "flags": 1025
};

const prms22 = {
    "id": 25343786, //25343786,-pres //25594204 dtrmx, //25766831-кран
    "flags": 1025
};
*/


module.exports = {
    prms,
    carId
}