

export class GetDataTime {
    constructor() {
        this.time = null;
        this.startTime = null;
        this.startTimeUnix = null;
        this.onStartTimeChanged = null;
    }



    async initDatePickers(id, updateTimeInterval, time) {


        time = this.getStartOfDayUnix(time)
        const defaultDate = Math.floor(new Date().getTime() / 1000);
        console.log(defaultDate)
        document.getElementById(id).value = this.processConvertData(defaultDate);
        //  }
        console.log(id)
        flatpickr(`#${id}`, {
            mode: "single",
            locale: "ru",
            static: false,
            "locale": {
                "firstDayOfWeek": 1
            },
            defaultDate: new Date(defaultDate * 1000),
            dateFormat: "j F Y",
            onClose: (selectedDates, dateStr, instance) => {
                if (selectedDates.length > 0) {
                    this.startTimeUnix = Math.floor(selectedDates[0].getTime() / 1000);
                    time = this.getStartOfDayUnix(this.startTimeUnix)
                    updateTimeInterval(time);
                    document.getElementById(id).value = this.processConvertData(this.startTimeUnix);

                    if (this.onStartTimeChanged) {
                        this.onStartTimeChanged(this.startTimeUnix);
                    }
                }
            },
        });
    }

    onStartTimeChange(callback) {
        this.onStartTimeChanged = callback;
    }

    getStartOfDayUnix(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000); // Преобразуем в Date
        date.setHours(0, 0, 0, 0); // Устанавливаем время в 00:00:00
        return Math.floor(date.getTime() / 1000); // Возвращаем Unix timestamp
    }
    processConvertData(unixtime) {
        const date = new Date(unixtime * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'long' });
        const year = date.getFullYear();
        // Форматируем дату в нужный формат
        const formattedDate = `${day} ${month} ${year}`;
        console.log(formattedDate)
        return formattedDate
    }


    async getTimeInterval(calendar, id) {
        const ide = !id ? `#${!calendar.children[0].children[0] ? calendar.children[0].id : calendar.children[0].children[0].id}` : id;
        const fp = flatpickr(ide, {
            mode: "range",
            dateFormat: "d-m-Y",
            locale: "ru",
            static: true,
            "locale": {
                "firstDayOfWeek": 1
            },
        });

        return new Promise((resolve, reject) => {
            fp.config.onChange.push((selectedDates, dateStr, instance) => {
                const formattedDates = selectedDates.map(date => {
                    const year = date.getFullYear();
                    const month = ("0" + (date.getMonth() + 1)).slice(-2);
                    const day = ("0" + date.getDate()).slice(-2);
                    return [`${year}-${month}-${day}`, `${day}.${month}.${year}`, date.getTime() / 1000];
                });
                console.log(formattedDates)
                const result = formattedDates.map(el => el[el.length - 1])
                // console.log(result)
                formattedDates.length === 2 ? resolve(result) : null
                //resolve(formattedDates);
            });
        });
    }

    async getTimeIntervalOne(calendar, id) {
        const ide = !id ? `#${!calendar.children[0].children[0] ? calendar.children[0].id : calendar.children[0].children[0].id}` : id;
        const fp = flatpickr(ide, {
            mode: "single",  // Изменено с "range" на "single"
            dateFormat: "d-m-Y",
            locale: "ru",
            static: true,
            "locale": {
                "firstDayOfWeek": 1
            },
        });

        console.log(ide);

        return new Promise((resolve, reject) => {
            fp.config.onChange.push((selectedDates, dateStr, instance) => {
                if (selectedDates.length > 0) {
                    const date = selectedDates[0];
                    const year = date.getFullYear();
                    const month = ("0" + (date.getMonth() + 1)).slice(-2);
                    const day = ("0" + date.getDate()).slice(-2);
                    const formattedDate = `${year}-${month}-${day}`;
                    console.log(formattedDate);
                    resolve(formattedDate);
                }
            });
        });
    }
}