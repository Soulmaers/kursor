

class CalculateReports {

    static calculationMileage(data) {
        if (!data || data.length === 0) {
            return 'Н/Д'
        }
        const startMileage = Number(data[0].mileage)
        const finishMileage = Number(data[data.length - 1].mileage)
        return finishMileage - startMileage
    }

    static startAndFinishOil(data) {
        if (!data || data.length === 0) {
            return ['Н/Д', 'Н/Д']
        }
        const startOil = data[0].oil ? Number(data[0].oil) : Number(data[0].summatorOil)
        const finishOil = data[data.length - 1].oil ? Number(data[data.length - 1].oil) : Number(data[data.length - 1].summatorOil)
        return [startOil, finishOil]
    }

    static startAndFinishGeo(data) {
        const startGeo = [Number(data[0].lat), Number(data[0].lon)]
        const finishGeo = [Number(data[data.length - 1].lat), Number(data[data.length - 1].lon)]
        return [startGeo, finishGeo]
    }
    static startAndFinishTime(data) {
        const startTime = Number(data[0].last_valid_time)
        const finishTime = Number(data[data.length - 1].last_valid_time)
        return [CalculateReports.converterTimes(startTime), CalculateReports.converterTimes(finishTime)]
    }

    static converterTimes(data) {
        let date = new Date(data * 1000); // Преобразование в миллисекунды
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // Месяцы начинаются с 0
        let day = ("0" + date.getDate()).slice(-2);
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);

        let formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedTime
    }

    static formatTime(num) {
        var hours = Math.floor(num / 3600);
        var minutes = Math.floor((num % 3600) / 60);
        var seconds = num % 60;

        var formattedTime = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');

        return formattedTime;

    }
    static mediumEngineRPM(data) {
        const res = data.reduce((acc, e) => {
            acc += Number(e.engineRPM)
            return acc
        }, 0)
        const mediumRPM = res / data.length
        return !isNaN(mediumRPM) ? mediumRPM : 'Н/Д'
    }

    static maxEngineRPM(data) {
        const maxEngineRPM = Math.max(...data.map(item => item.engineRPM))
        return !isNaN(maxEngineRPM) ? maxEngineRPM : 'Н/Д'
    }

    static moto(data) {
        const res = data.reduce((acc, e) => {
            if (Number(e.engineOn) === 1) {
                if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0 && Number(acc[acc.length - 1][0].engineOn) === 1) {
                    acc[acc.length - 1].push(e);
                } else {
                    acc.push([e]);
                }
            } else if (Number(e.engineOn) === 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                acc.push([]);
            }
            return acc;
        }, [])

        const rest = res.filter(el => el.length > 0)
        const ress = rest.reduce((acc, el) => {
            const time = Number(el[el.length - 1].last_valid_time) - Number(el[0].last_valid_time)
            if (time > 300) {
                const zapravka = CalculateReports.calculateOilUp(el)[0];
                const maxEngineRPM = el.reduce((max, current) => {
                    return Math.max(max, Number(current.engineRPM));
                }, 0);
                const totalRPM = el.reduce((sum, current) => {
                    return sum + Number(current.engineRPM);
                }, 0);

                const mediumEngineRPM = totalRPM / el.length;
                const rashodDUT = el[0].oil ? parseFloat(Number(el[0].oil) + zapravka - Number(el[el.length - 1].oil)).toFixed(2) : 'Н/Д'
                const distance = Number(el[el.length - 1].mileage) - Number(el[0].mileage)
                const rashodDUTKM = el[0].oil ? parseFloat((rashodDUT / distance) * 100).toFixed(2) : 'Н/Д'
                const diffMoto = time

                acc.push([{ time: el[0].last_valid_time, oil: el[0].oil ? el[0].oil : 'Н/Д', geo: [el[0].lat, el[0].lon] },
                { time: el[el.length - 1].last_valid_time, oil: el[el.length - 1].oil ? el[el.length - 1].oil : 'Н/Д', geo: [el[el.length - 1].lat, el[el.length - 1].lon] }, {
                    mediumEngineRPM: !isNaN(mediumEngineRPM) ? mediumEngineRPM : 'Н/Д',
                    maxEngineRPM: !isNaN(maxEngineRPM) ? maxEngineRPM : 'Н/Д',
                    moto: diffMoto,
                    rashodDUT: rashodDUT,
                    rashodDUTKM: rashodDUTKM,
                    distance: parseFloat(distance.toFixed(2)),
                    time: time
                }])
            }
            return acc
        }, [])

        const motoAll = ress.reduce((acc, e) => {
            acc += e[2].time
            return acc
        }, 0)
        //  console.log(motoAll)
        return { moto: ress, motoAll: motoAll }
    }


    static timeStringToUnix(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const milliseconds = (hours * 3600 + minutes * 60 + seconds);
        return milliseconds
    }
    static traveling(data, settings) {
        let minTime;
        let maxTime;
        if (settings) {
            minTime = CalculateReports.timeStringToUnix(settings.distance[0])
            maxTime = CalculateReports.timeStringToUnix(settings.distance[1])

        }
        //  console.log(minTime)
        const resz = data.reduce((acc, e) => {
            if (Number(e.speed) > 10 && Number(e.sats) >= 7 && Number(e.engineOn) === 1) {
                if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0 && Number(acc[acc.length - 1][0].speed) > 10 && Number(acc[acc.length - 1][0].sats) >= 7 && Number(acc[acc.length - 1][0].engineOn) === 1) {
                    acc[acc.length - 1].push(e);
                } else {
                    acc.push([e]);
                }
            } else if (Number(e.engineOn) === 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0 ||
                Number(e.sats) < 7 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0 ||
                Number(e.speed) <= 10 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                acc.push([]);
            }
            return acc;
        }, [])

        const rest = resz.filter(el => el.length > 0)
        const res = rest.reduce((acc, el) => {
            const maxSpeed = el.reduce((max, current) => {
                return Math.max(max, Number(current.speed));
            }, 0);
            const totalSpeed = el.reduce((sum, current) => {
                return sum + Number(current.speed);
            }, 0);

            const averageSpeed = totalSpeed / el.length;
            const distance = Number(el[el.length - 1].mileage) - Number(el[0].mileage)
            const time = Number(el[el.length - 1].last_valid_time) - Number(el[0].last_valid_time)
            if (distance > 0.5) {
                acc.push([{ time: el[0].last_valid_time, oil: el[0].oil, geo: [el[0].lat, el[0].lon] },
                { time: el[el.length - 1].last_valid_time, oil: el[el.length - 1].oil, geo: [el[el.length - 1].lat, el[el.length - 1].lon] }, {
                    maxSpeed: maxSpeed, averageSpeed: parseFloat(averageSpeed.toFixed(0)), distance: parseFloat(distance.toFixed(2)), time: time
                }])
            }
            return acc
        }, [])
        return res
    }

    static parkings(data) {
        const resz = data.reduce((acc, e) => {
            if (Number(e.engineOn) === 0) {
                if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0 && Number(acc[acc.length - 1][0].engineOn) === 0) {
                    acc[acc.length - 1].push(e);
                } else {
                    acc.push([e]);
                }
            } else if (Number(e.engineOn) === 1 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                acc.push([]);
            }
            return acc;
        }, [])

        const rest = resz.filter(el => el.length > 0)
        const res = rest.reduce((acc, el) => {
            const time = Number(el[el.length - 1].last_valid_time) - Number(el[0].last_valid_time)
            if (time > 300) {
                acc.push({ time: Number(el[0].last_valid_time), geo: [el[0].lat, el[0].lon], diff: time })
            }
            return acc
        }, [])

        return res
    }

    static stops(data) {
        const resz = data.reduce((acc, e) => {
            if (Number(e.speed) <= 10 && Number(e.sats) >= 7 && Number(e.engineOn) === 1) {
                if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0 && Number(acc[acc.length - 1][0].speed) <= 10 && Number(acc[acc.length - 1][0].sats) >= 7 && Number(acc[acc.length - 1][0].engineOn) === 1) {
                    acc[acc.length - 1].push(e);
                } else {
                    acc.push([e]);
                }
            } else if (Number(e.engineOn) === 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0 ||
                Number(e.sats) < 7 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0 ||
                Number(e.speed) > 10 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                acc.push([]);
            }
            return acc;
        }, [])

        const rest = resz.filter(el => el.length > 0)
        const res = rest.reduce((acc, el) => {
            const time = Number(el[el.length - 1].last_valid_time) - Number(el[0].last_valid_time)
            if (time > 300) {
                acc.push({ time: Number(el[0].last_valid_time), geo: [el[0].lat, el[0].lon], diff: time })
            }
            return acc
        }, [])

        return res
    }

    static calculateOilUp(data) {
        //   console.log(data)
        const increasingIntervals = [];
        let start = 0;
        let end = 0;
        for (let i = 0; i < data.length - 1; i++) {
            const currentObj = data[i]
            const nextObj = data[i + 1];
            if (currentObj.oil < nextObj.oil) {
                if (start === end) {
                    start = i;
                }
                end = i + 1;
            } else if (currentObj.oil > nextObj.oil) {
                if (start !== end) {
                    increasingIntervals.push([data[start], data[end]]);
                }
                start = end = i + 1;
            }
        }
        if (start !== end) {
            increasingIntervals.push([data[start], data[end]]);
        }
        //    console.log(increasingIntervals)
        const zapravkaAll = increasingIntervals.filter((interval, index) => {
            const firstOil = interval[0].oil;
            const lastOil = interval[interval.length - 1].oil;
            const difference = lastOil - firstOil;
            const threshold = firstOil * 0.15;
            if (index < increasingIntervals.length - 1) {
                const nextInterval = increasingIntervals[index + 1];
                const currentTime = interval[interval.length - 1].last_valid_time;
                const nextTime = nextInterval[0].last_valid_time;
                const timeDifference = nextTime - currentTime;
                if (timeDifference < 5 * 60 * 1000) {
                    interval.push(nextInterval[nextInterval.length - 1]);
                    interval.splice(1, 1)
                }
            }
            return firstOil > 5 && difference > 40 && difference >= threshold;
        });
        //  console.log(zapravkaAll)
        const oilUpArray = zapravkaAll.reduce((acc, el) => {
            const diff = el[1].oil - el[0].oil
            acc += diff
            return acc
        }, 0)

        // console.log(oilUpArray)
        const countZapravki = zapravkaAll.reduce((acc, el) => {
            const diff = el[1].oil - el[0].oil
            acc.push({ time: el[0].last_valid_time, geo: [el[0].lat, el[0].lon], startOil: el[0].oil, finishOil: el[1].oil, value: diff, value2: 0 })
            return acc
        }, [])
        // console.log(countZapravki)
        return [oilUpArray, countZapravki]
    }

    static calculateOilSliv(data) {
        const increasingIntervals = [];
        let start = 0;
        let end = 0;
        for (let i = 0; i < data.length - 1; i++) {
            const currentObj = data[i];
            const nextObj = data[i + 1];
            if (currentObj.oil > nextObj.oil) {
                if (start === end) {
                    start = i;
                }
                end = i + 1;
            } else if (currentObj.oil < nextObj.oil) {
                if (start !== end) {
                    increasingIntervals.push([data[start], data[end]]);
                }
                start = end = i + 1;
            }
        }
        if (start !== end) {
            increasingIntervals.push([data[start], data[end]]);
        }
        const slivAll = increasingIntervals.filter((interval, index) => {
            const firstOil = interval[0].oil;
            const lastOil = interval[interval.length - 1].oil;
            const difference = firstOil - lastOil;
            const threshold = firstOil * 0.15;
            if (index < increasingIntervals.length - 1) {
                const nextInterval = increasingIntervals[index + 1];
                const currentTime = interval[interval.length - 1].last_valid_time;
                const nextTime = nextInterval[0].last_valid_time;
                const timeDifference = nextTime - currentTime;
                if (timeDifference < 5 * 60) {
                    interval.push(nextInterval[nextInterval.length - 1]);
                    interval.splice(1, 1)
                }
            }
            const timeDifference = interval[interval.length - 1].last_valid_time - interval[0].last_valid_time;
            return timeDifference < 300 && lastOil > 5 && difference > 40 && difference >= threshold;
        });
        const oilUpArray = slivAll.reduce((acc, el) => {
            const diff = el[0].oil - el[1].oil
            acc += diff
            return acc
        }, 0)
        const countSliv = slivAll.reduce((acc, el) => {
            const diff = el[0].oil - el[1].oil
            acc.push({ time: Number(el[0].last_valid_time), geo: [el[0].lat, el[0].lon], startOil: el[0].oil, finishOil: el[1].oil, value: 0, value2: diff })
            return acc
        }, [])
        return [oilUpArray, countSliv]
    }
}

module.exports = { CalculateReports }