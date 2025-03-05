



class Helpers {


    static getDateIntervals(startUnix, endUnix) {
        const intervals = [];

        const startDate = new Date(startUnix * 1000);
        const endDate = new Date(endUnix * 1000);

        const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endOfDay = new Date(startDay.getTime() + (24 * 60 * 60 * 1000) - 1);

        const endOfDayUnix = Math.floor(endOfDay.getTime() / 1000);

        if (startDay.getTime() <= endDate.getTime()) {

            const day = startDate.getDate().toString().padStart(2, '0'); // Добавляем ведущий ноль, если нужно
            const month = (startDate.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
            const year = startDate.getFullYear();

            intervals.push({
                date: `${day}.${month}.${year}`, // Формат 01.02.2025
                startUnix: startUnix,
                endUnix: Math.min(endUnix, endOfDayUnix)
            });

            if (endDate.getTime() > endOfDay.getTime()) {
                const nextDayStart = endOfDayUnix + 1;
                intervals.push(...Helpers.getDateIntervals(nextDayStart, endUnix));
            }
        }

        return intervals;
    }


    static formatHMS(unix) {
        const hours = Math.floor(unix / 3600);           // 1 час = 3600 секунд
        const minutes = Math.floor((unix % 3600) / 60);   // Остаток от часов / 60
        const seconds = unix % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedDate = `${hours}:${formattedMinutes}:${formattedSeconds}`;
        return formattedDate;
    }



    static processArrayRow(currentInterval, times) {
        const timeExcess = times ? times : 0
        const maxSpeed = currentInterval.reduce((max, current) => {
            return Math.max(max, Number(current.speed));
        }, 0);
        const totalSpeed = currentInterval.reduce((sum, current) => {
            return sum + Number(current.speed);
        }, 0);

        const averageSpeed = totalSpeed / currentInterval.length;
        const objectMaxSpeed = currentInterval.find(e => Number(e.speed) === maxSpeed)
        const distance = Number(currentInterval[currentInterval.length - 1].mileage) - Number(currentInterval[0].mileage)
        const time = Number(currentInterval[currentInterval.length - 1].last_valid_time) - Number(currentInterval[0].last_valid_time)
        if (time < timeExcess) return null
        const row = [{ time: currentInterval[0].last_valid_time, oil: currentInterval[0].oil, geo: [currentInterval[0].lat, currentInterval[0].lon] },
        { time: currentInterval[currentInterval.length - 1].last_valid_time, oil: currentInterval[currentInterval.length - 1].oil, geo: [currentInterval[currentInterval.length - 1].lat, currentInterval[currentInterval.length - 1].lon] }, {
            maxSpeed: maxSpeed, geoSpeed: [objectMaxSpeed.lat, objectMaxSpeed.lon], maxSpeedFieldColor: '', averageSpeed: parseFloat(averageSpeed.toFixed(0)), distance: parseFloat(distance.toFixed(2)), time: time, sub: true
        }]
        return row
    }
}


module.exports = Helpers