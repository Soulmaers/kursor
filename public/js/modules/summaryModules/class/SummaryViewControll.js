
export class SummaryViewControll {
    constructor(objectsId) {
        this.objectsId = objectsId
        this.arrayInterval = ['Сегодня', 'Вчера', 'Неделя']
        this.params = document.querySelectorAll('.name_list')
        this.select = document.querySelectorAll('.select_dannie')
        this.data = [];
        this.count = 2
        this.params.forEach(el => el.addEventListener('click', this.toggleClassAndParamsCollection.bind(this, el)))
        this.select.forEach(el => el.querySelector('.toggle_list_select').addEventListener('click', this.toggleListSelect.bind(this, el)))
        this.select.forEach(el => el.querySelector('.select_summary').addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this, el)))
        this.select.forEach(el => el.querySelectorAll('.item_type').forEach(it => it.addEventListener('click', this.toggleCheckSelect.bind(this, it))))
        this.arrayInterval.forEach(el => this.getSummaryToBase(el))
        this.startUpdatingToday()
    }















    //выбирать и подсвечивать определенный выбранный селект также запуск метода для сбора и отрисовки данных в нужный слот
    toggleCheckSelect(it) {
        const titleList = it.closest('.select_dannie').querySelector('.titleChangeSort')
        it.children[0].classList.toggle('radio_choice')
        if (!it.children[0].classList.contains('radio_choice')) {
            titleList.textContent = it.children[0].nextElementSibling.textContent
        }
        else {
            titleList.textContent = it.parentElement.classList.contains('one') ? 'Вчера' : 'Неделя'
        }
        Array.from(it.closest('.select_summary').children).forEach(e => {
            if (e !== it && !e.children[0].classList.contains('radio_choice')) {
                e.children[0].classList.toggle('radio_choice')
            }
        })
        const slot = it.parentElement.classList.contains('one') ? 2 : 3
        this.getSummaryToBase(titleList.textContent, slot)
    }

    // скрывает список когда уходишь курсором
    hiddenListOutsideKursor(el) {
        el.children[1].classList.remove('hidden_view')
    }
    //скрывает и отображает список
    toggleListSelect(el) {
        el.children[1].classList.toggle('hidden_view')
        this.select.forEach(e => {
            if (e !== el && e.children[1].classList.contains('hidden_view')) {
                e.children[1].classList.toggle('hidden_view')
            }
        })
    }

    //обновляем статистику за сегодня
    startUpdatingToday() {
        setInterval(() => {
            this.getSummaryToBase('Сегодня');
        }, 60000);
    }

    //меняем тоггл класс по нажатию на параметр
    toggleClassAndParamsCollection(el) {
        this.params.forEach(e => {
            if (e.classList.contains('clickToggle'))
                e.classList.remove('clickToggle')
        })
        el.classList.toggle('clickToggle')
    }

    //основной метод . готовить интервалы, запрашивает данные из базы, считает показатели, выводит в таблицу
    async getSummaryToBase(el, slot) {
        const data = this.getIntervalDate(el)
        const result = await this.getRequestSummaryToBase(data)
        let summary;
        if (el === 'Неделя' || el === 'Месяц') {
            summary = this.filterWeekSummary(result)
        }
        else {
            summary = this.calculationParametrs(result)
        }
        el !== 'Сегодня' ? this.viewSummaryTable(summary, slot) : this.updateViewSummaryTable(summary)
        console.log(summary)
    }
    //подготовка итогового саммари для неделя и месяц
    filterWeekSummary(data) {
        const jobElementTs = data.reduce((acc, el) => {
            if (el.jobTS === 1) {
                acc.push(el)
            }
            return acc
        }, [])
        const count = this.uniqSort(data)
        const jobTS = this.uniqSort(jobElementTs)
        const arraySummaryView = []
        arraySummaryView.push(count)
        arraySummaryView.push(jobTS)
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

    //ищем уникальные элементы
    uniqSort(data) {
        let uniqueItems = {};
        for (let i = 0; i < data.length; i++) {
            let idw = data[i].idw;
            uniqueItems[idw] = uniqueItems[idw] ? uniqueItems[idw] + 1 : 1;
        }
        let count = Object.keys(uniqueItems).length;
        return count
    }

    //выводим в таблицу сегодня и обновляем ее
    updateViewSummaryTable(data) {
        this.params.forEach((el, index) => {
            el.parentElement.children[1].textContent = data[index]
        })
    }
    //выводим в таблицу вчера и неделю
    viewSummaryTable(data, slot) {
        if (!slot) {
            this.params.forEach((el, index) => {
                el.parentElement.children[this.count].textContent = data[index]
            })
            this.count++
        }
        else {
            this.params.forEach((el, index) => {
                el.parentElement.children[slot].textContent = data[index]
            })
        }
    }
    //складываем значения
    calculateParam(data, paramName) {
        return data.reduce((acc, el) => acc + el[paramName], 0)
    }
    //подготовка итогового саммари для сегодня и вчера
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

    //форматируем секунды в часыи минуты
    timesFormat(dates) {
        console.log(dates)
        const totalSeconds = Math.floor(dates);
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const motoHours = `${hours}:${minutes}`;
        return motoHours;
    }

    //забираем из бд данные
    async getRequestSummaryToBase(data) {
        const arrayId = this.objectsId
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ data, arrayId }))
        }
        try {
            const mods = await fetch('/api/summaryYestoday', params)
            const models = await mods.json()
            return models
        }
        catch (e) {
            console.log(e)
        }
    }

    //готовим нужный интервал
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
    //форматируем юникс в дату
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