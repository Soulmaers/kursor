
export class SummaryViewControll {
    constructor(objectsId) {
        this.objectsId = objectsId
        this.arrayInterval = ['Сегодня', 'Вчера', 'Неделя']
        this.params = document.querySelectorAll('.name_list')
        this.selectOne = document.querySelector('.select_summary')[0]
        this.selectTwo = document.querySelector('.select_summary')[1]
        this.data = [];
        this.count = 2
        this.params.forEach(el => el.addEventListener('click', this.toggleClassAndParamsCollection.bind(this, el)))
        this.arrayInterval.forEach(el => this.getSummaryToBase(el))
        this.startUpdatingToday()
    }

    startUpdatingToday() {
        setInterval(() => {
            this.getSummaryToBase('Сегодня');
        }, 60000); // Every 5 minutes
    }


    //меняем тоггл класс по нажатию на параметр
    toggleClassAndParamsCollection(el) {
        this.params.forEach(e => {
            if (e.classList.contains('clickToggle'))
                e.classList.remove('clickToggle')
        })
        el.classList.toggle('clickToggle')
    }

    async getSummaryToBase(el) {
        const data = this.getIntervalDate(el)
        const result = await this.getRequestSummaryToBase(data)
        const summary = this.calculationParametrs(result)
        el !== 'Сегодня' ? this.viewSummaryTable(summary) : this.updateViewSummaryTable(summary)
        console.log(summary)
    }

    updateViewSummaryTable(data) {
        this.params.forEach((el, index) => {
            el.parentElement.children[1].textContent = data[index]
        })
    }

    viewSummaryTable(data) {
        this.params.forEach((el, index) => {
            el.parentElement.children[this.count].textContent = data[index]
        })
        this.count++
    }

    calculateParam(data, paramName) {
        return data.reduce((acc, el) => acc + el[paramName], 0)
    }
    calculationParametrs(data) {
        const arraySummaryView = []
        arraySummaryView.push(data.length)
        arraySummaryView.push(this.calculateParam(data, 'jobTS'))
        arraySummaryView.push(this.calculateParam(data, 'probeg'))
        arraySummaryView.push(this.calculateParam(data, 'rashod'))
        arraySummaryView.push(this.calculateParam(data, 'zapravka'))
        arraySummaryView.push(this.calculateParam(data, 'dumpTrack'))
        arraySummaryView.push(this.calculateParam(data, 'moto') / 1000)
        arraySummaryView.push(this.calculateParam(data, 'prostoy'))
        arraySummaryView.push(this.calculateParam(data, 'moto') / 1000 - this.calculateParam(data, 'prostoy'))
        arraySummaryView.push(parseFloat((this.calculateParam(data, 'medium') / data.filter(el => el.medium > 0).length).toFixed(0)))
        arraySummaryView.push(data.filter(el => el.oilHH > 0).length === 0 ? 0 : parseFloat((this.calculateParam(data, 'oilHH') / data.filter(el => el.oilHH > 0).length).toFixed(0)))
        const structura = arraySummaryView.reduce((acc, el, index) => {
            if (index === 6 || index === 7 || index === 8) {
                acc.push(this.timesFormat(el));
            } else {
                acc.push(el);
            }
            return acc;
        }, []);
        return structura
    }

    timesFormat(dates) {
        console.log(dates)
        const totalSeconds = Math.floor(dates);
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const motoHours = `${hours}:${minutes}`;
        return motoHours;
    }

    async getRequestSummaryToBase(data) {
        const arrayId = this.objectsId
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ data, arrayId }))
        }
        const mods = await fetch('/api/summaryYestoday', params)
        const models = await mods.json()
        return models
    }
    getIntervalDate(interval) {
        let int;
        if (interval === 'Неделя') {
            int = 7
        }
        if (interval === 'Месяц') {
            int = 30
        }
        if (interval === 'Вчера') {
            int = 1
        }
        if (interval === 'Сегодня') {
            int = 0
        }
        const data = [];
        if (int <= 1) {
            data.push(this.convertDate(int))
        }
        else {
            data.push(this.convertDate(int), this.convertDate(1))
        }

        return data
    }

    convertDate(num) {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - num)
        const year = yesterday.getFullYear();
        const month = String(yesterday.getMonth() + 1).padStart(2, '0');
        const day = String(yesterday.getDate()).padStart(2, '0');
        const data = `${year}-${month}-${day}`;
        return data
    }

}