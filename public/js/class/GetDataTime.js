

export class GetDataTime {
    constructor() {
        this.time = null
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