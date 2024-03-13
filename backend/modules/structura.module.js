
const databaseService = require('../services/database.service');

exports.datas = async (objects, now, old) => {
    const result = objects
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()

    //   console.log(result)
    try {
        for (const e of result) {
            const params = e[1].result
            const osiBar = e[3].result//await databaseService.barViewToBase(e[4])
            const sensToParams = e[2].result
            const idw = String(e[4])
            const dannienew = await databaseService.geoLastInterval(old, now, idw)


            // Преобразование массива osss в объект для быстрого доступа
            const osssMap = {};
            osiBar.forEach(e => {
                osssMap[e.idOs] = e;
            });


            const paramnew = params.map(el => {
                if (osssMap[el.osNumber]) {
                    const sens = sensToParams.filter(e => e.params === el.params).map(it => ({ sens: it.sens }));
                    return {
                        sens: sens,
                        position: el.tyresdiv,
                        bar: osssMap[el.osNumber],
                        val: [],

                    };
                }
            })

            console.log(paramnew)
            const globalArray = sensToParams.filter(e => e.params.startsWith('tpms_p')).map(it => {
                return { sens: it.sens }
            })
            //console.log(globalArray)
            const dannie = await databaseService.viewChartDataToBase(e[4], old, now)
            // console.log(dannie)
            const itogy = dannie.map(it => {
                return {
                    id: it.idw,
                    nameCar: it.nameCar,
                    time: (new Date(it.data * 1000)).toISOString(),
                    speed: it.speed,
                    geo: JSON.parse(it.geo),
                    val: JSON.parse(it.sens)
                }
            })
            const sensTest = itogy.map(e => {
                return e.val
            })
            const timeArray = itogy.map(it => (new Date(it.time)).toISOString());
            const speedArray = itogy.map(it => it.speed);
            const geoArray = itogy.map(it => it.geo);
            const globals = [timeArray, speedArray, geoArray];
            const nameArr = dannie[dannie.length - 1] !== undefined ? dannie[dannie.length - 1].allSensParams ? JSON.parse(dannie[dannie.length - 1].allSensParams) : [] : [] //await fnParMessage(active)
            const allArrNew = [];
            nameArr.forEach((item) => {
                allArrNew.push({ sens: item[0], params: item[1], value: [] })
            })

            sensTest.forEach(el => {
                for (let i = 0; i < allArrNew.length; i++) {
                    allArrNew[i].value.push(Object.values(el)[i])
                }
            })
            const finishArrayData = []
            const finishArrayDataT = []
            const stop = [];
            allArrNew.forEach(e => {
                if (e.params.startsWith('tpms_p')) {
                    finishArrayData.push(e)
                }
                if (e.params.startsWith('tpms_t')) {
                    finishArrayDataT.push(e)
                }
                if (e.params.startsWith('pwr_ext') && e.sens.startsWith('Бортовое')) {
                    e.value.forEach(el => {
                        if (e[4] === '26821431') {
                            el >= 13 ? stop.push('ВКЛ') : stop.push('ВЫКЛ')
                            //    console.log('11')
                        }
                        else {
                            el >= 26.5 ? stop.push('ВКЛ') : stop.push('ВЫКЛ')
                            //   console.log('22')
                        }
                    })
                }
            })
            finishArrayData.forEach((el, index) => {
                el.tvalue = finishArrayDataT.length !== 0 ? finishArrayDataT[index].value : null
                el.speed = globals[1]
                el.geo = globals[2]
                el.stop = stop
            })
            finishArrayData.forEach(e => {
                params.forEach(it => {
                    if (e.params === it.pressure) {
                        e.bar = it.bar
                        e.position = Number(it.tyresdiv)
                    }
                })
            })
            const times = globals[0]
            const datar = finishArrayData
            const newData = datar.map((el, index) => {
                return {
                    ...el,
                    value: el.value.map((it, i) => {
                        if (it === -348201.3876) {
                            return -0.5
                        } else {
                            return it
                        }
                    }),
                    tvalue: el.tvalue !== null ? (el.tvalue.map(it => {
                        if (it === -348201.3876 || it === -128 || it === -50 || it === -51) {
                            return -0.5
                        } else {
                            return it
                        }
                    })) : null
                };
            });
            const global = {
                dates: times,
                series: newData
            }
            const gl = times.map(it => {
                return new Date(it)
            })
            const dat2 = global.series.map(({ position, bar, sens, value, tvalue, speed, stop, geo }) => ({
                sens,
                position,
                bar,
                val: value.map((val, i) => {
                    if (stop[i] === 'ВЫКЛ') {
                        return {
                            dates: gl[i],
                            value: -0.5,
                            tvalue: tvalue !== null ? -0.5 : null,
                            speed: Number(speed[i]),
                            stop: stop[i],
                            geo: geo[i]

                        };
                    } else {
                        return {
                            dates: gl[i],
                            value: Number(val),
                            tvalue: tvalue !== null ? Number(tvalue[i]) : null,
                            speed: Number(speed[i]),
                            stop: stop[i],
                            geo: geo[i]
                        };
                    }
                })
            }));

            dat2.sort((a, b) => {
                if (a.position > b.position) {
                    return 1;
                }
                if (a.position < b.position) {
                    return -1;
                }
                return 0;
            });
            dat2.forEach(e => e.val.sort((a, b) => {
                if (a.dates > b.dates) {
                    return 1;
                }
                if (a.dates < b.dates) {
                    return -1;
                }
                return 0;
            })
            )
            const data = new Date(old * 1000)
            //  console.log(data)
            const year = data.getFullYear();
            const month = String(data.getMonth() + 1).padStart(2, '0');
            const day = String(data.getDate()).padStart(2, '0');
            const dat = `${year}-${month}-${day}`;
            const mass = [];
            mass.push(dat)
            mass.push(e[4])
            mass.push(JSON.stringify(dat2))


            // console.log(mass)
            const res = dat2.length !== 0 ? await databaseService.saveStructuraToBase(mass) : null

        }
    }
    catch (e) {
        console.log(e)
    }
}