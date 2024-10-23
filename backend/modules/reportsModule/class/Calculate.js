const { OilCalculator } = require('./OilControllCalculater')

class CalculateReports {

    static calculationMileage(data) {
        if (!data || data.length === 0) {
            return 'Н/Д'
        }
        const startMileage = Number(data[0].mileage ? data[0].mileage : 0)
        const finishMileage = Number(data[data.length - 1].mileage ? data[data.length - 1].mileage : 0)
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

    static async moto(data, settings, id) {

        const { minDuration } = settings['Моточасы']
        const minTime = CalculateReports.timeStringToUnix(minDuration)

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
        const ress = await Promise.all(rest.map(async (el) => {
            const time = Number(el[el.length - 1].last_valid_time) - Number(el[0].last_valid_time)
            if (time > minTime) {
                const instance = new OilCalculator(el, settings, id);
                const result = await instance.init()
                const zapravka = result ? result[0] : 0
                const maxEngineRPM = el.reduce((max, current) => {
                    return Math.max(max, Number(current.engineRPM));
                }, 0);
                const totalRPM = el.reduce((sum, current) => {
                    return sum + Number(current.engineRPM);
                }, 0);

                const mediumEngineRPM = totalRPM / el.length;
                const rashodDUT = el[0].oil ? parseFloat(Number(el[0].oil) + zapravka - Number(el[el.length - 1].oil)).toFixed(2) : 'Н/Д'
                const distance = Number(el[el.length - 1].mileage) - Number(el[0].mileage)
                let rashodDUTKM;
                if (distance !== 0) {
                    rashodDUTKM = el[0].oil
                        ? parseFloat((Number(rashodDUT) / distance) * 100).toFixed(2)
                        : 'Н/Д';
                } else {
                    rashodDUTKM = 'Н/Д';
                }
                const diffMoto = time

                return [{ time: el[0].last_valid_time, oil: el[0].oil ? el[0].oil : 'Н/Д', geo: [el[0].lat, el[0].lon] },
                { time: el[el.length - 1].last_valid_time, oil: el[el.length - 1].oil ? el[el.length - 1].oil : 'Н/Д', geo: [el[el.length - 1].lat, el[el.length - 1].lon] }, {
                    mediumEngineRPM: !isNaN(mediumEngineRPM) ? mediumEngineRPM : 'Н/Д',
                    maxEngineRPM: !isNaN(maxEngineRPM) ? maxEngineRPM : 'Н/Д',
                    moto: diffMoto,
                    rashodDUT: rashodDUT,
                    rashodDUTKM: rashodDUTKM,
                    distance: parseFloat(distance.toFixed(2)),
                    time: Number(time)
                }]
            }

        }))
        const filteredRess = ress.filter(item => item !== undefined);
        const motoAll = filteredRess.reduce((acc, e) => {
            acc += e[2].time
            return acc
        }, 0)
        return { moto: filteredRess, motoAll: motoAll }
    }


    static timeStringToUnix(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const milliseconds = (hours * 3600 + minutes * 60 + seconds);
        return milliseconds
    }

    static getTimeCondition(minTime, maxTime) {

        if (minTime && maxTime) {
            return (time) => time > minTime && time < maxTime;  // Условие: значение времени больше minTime и меньше maxTime
        } else if (minTime) {
            return (time) => time > minTime;  // Условие: значение времени больше minTime
        } else if (maxTime) {
            return (time) => time < maxTime;  // Условие: значение времени меньше maxTime
        } else {
            return () => true;  // Если никаких ограничений нет, возвращаем истинное значение
        }
    }

    static traveling(data, settings) {
        const { duration, mileage } = settings['Поездки']

        const minTime = duration.minDuration ? CalculateReports.timeStringToUnix(duration.minDuration) : null
        const maxTime = duration.maxDuration ? CalculateReports.timeStringToUnix(duration.maxDuration) : null
        const minDistance = mileage.minMileage && mileage.minMileage !== '0' ? mileage.minMileage : null
        const maxDistance = mileage.maxMileage && mileage.maxMileage !== '0' ? mileage.maxMileage : null
        const timeCondition = CalculateReports.getTimeCondition(minTime, maxTime);
        const mileageCondition = CalculateReports.getTimeCondition(minDistance, maxDistance);

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
            if (mileageCondition(distance) && timeCondition(time)) {
                acc.push([{ time: el[0].last_valid_time, oil: el[0].oil, geo: [el[0].lat, el[0].lon] },
                { time: el[el.length - 1].last_valid_time, oil: el[el.length - 1].oil, geo: [el[el.length - 1].lat, el[el.length - 1].lon] }, {
                    maxSpeed: maxSpeed, averageSpeed: parseFloat(averageSpeed.toFixed(0)), distance: parseFloat(distance.toFixed(2)), time: time
                }])
            }
            return acc
        }, [])
        return res
    }

    static parkings(data, settings) {
        const { minDuration } = settings['Стоянки']
        const minTime = CalculateReports.timeStringToUnix(minDuration)

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
            if (time > minTime) {
                acc.push({ time: Number(el[0].last_valid_time), geo: [el[0].lat, el[0].lon], diff: time })
            }
            return acc
        }, [])

        return res
    }

    static stops(data, settings) {

        const { minDuration } = settings['Остановки']
        const minTime = CalculateReports.timeStringToUnix(minDuration)
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
            if (time > minTime) {
                acc.push({ time: Number(el[0].last_valid_time), geo: [el[0].lat, el[0].lon], diff: time })
            }
            return acc
        }, [])

        return res
    }
}

module.exports = { CalculateReports }