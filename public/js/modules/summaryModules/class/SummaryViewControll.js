
export class SummaryViewControll {
    constructor(objectsId) {
        this.objectsId = objectsId
        this.arrayInterval = ['Сегодня', 'Вчера', 'Неделя']
        this.params = document.querySelectorAll('.pointer_chart')
        this.content = document.querySelectorAll('.name_list')
        this.select = document.querySelectorAll('.select_dannie')
        this.title = document.querySelectorAll('.titleChangeSort')
        this.data = [];
        this.count = 2
        this.params.forEach(el => el.addEventListener('click', this.toggleClassAndParamsCollection.bind(this, el)))
        this.select.forEach(el => el.querySelector('.toggle_list_select').addEventListener('click', this.toggleListSelect.bind(this, el)))
        this.select.forEach(el => el.querySelector('.select_summary').addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this, el)))
        this.select.forEach(el => el.querySelectorAll('.item_type').forEach(it => it.addEventListener('click', this.toggleCheckSelect.bind(this, it))))
        this.arrayInterval.forEach(el => this.getSummaryToBase(el))
        this.startUpdatingToday()
    }

    //обновляем саммари учитывая заголовки для запроса
    clickListUpdateSummary() {
        const arrayTitle = ['Сегодня']
        this.title.forEach(e => {
            arrayTitle.push(e.textContent)
        })
        arrayTitle.forEach(el => {
            this.getSummaryToBase(el)
        })
    }
    //выбирать и подсвечивать определенный выбранный селект также запуск метода для сбора и отрисовки данных в нужный слот
    async toggleCheckSelect(it) {
        console.log('тут?0')
        const titleList = it.closest('.select_dannie').querySelector('.titleChangeSort')
        it.children[0].classList.toggle('radio_choice')
        const slot = it.parentElement.classList.contains('one') ? 2 : 3

        Array.from(it.closest('.select_summary').children).forEach(e => {
            if (e !== it && !e.children[0].classList.contains('radio_choice')) {
                e.children[0].classList.toggle('radio_choice')
            }
        })

        if (!it.children[0].classList.contains('radio_choice')) {
            if (it.lastElementChild.textContent === 'Календарь') {
                const resultDates = await this.openCalendarChoise(it)
                titleList.textContent = `${resultDates[1][0]} - ${resultDates[1][1]}`
                this.getSummaryToBase(resultDates[0], slot)

            }
            else {
                titleList.textContent = it.children[0].nextElementSibling.textContent
                this.getSummaryToBase(titleList.textContent, slot)
            }
        }
        else {
            console.log('тут?')
            titleList.textContent = it.parentElement.classList.contains('one') ? 'Вчера' : 'Неделя'
            this.getSummaryToBase(titleList.textContent, slot)
        }
    }

    //открываем календарь для выбора интервала из дат и возвращаем  даты в масссиве
    async openCalendarChoise(element) {
        const calendar = element.parentElement.nextElementSibling;
        calendar.style.display = 'block'
        calendar.addEventListener('mouseleave', () => {
            calendar.style.display = 'none'
            element.children[0].classList.add('radio_choice')
        })
        const interval = await this.choisIntervalDate(calendar)
        return interval
    }

    //выбор времени
    async choisIntervalDate(calendar) {
        const id = `#${!calendar.children[0].children[0] ? calendar.children[0].id : calendar.children[0].children[0].id}`
        const date = await new Promise((resolve, reject) => {
            try {
                const fp = flatpickr(`${id}`, {
                    mode: "range",
                    dateFormat: "d-m-Y",
                    locale: "ru",
                    static: true,
                    "locale": {
                        "firstDayOfWeek": 1 // устанавливаем первым днем недели понедельник
                    },
                    onChange: function (selectedDates, dateStr, instance) {
                        const formattedDates = selectedDates.map(date => {
                            const year = date.getFullYear();
                            const month = ("0" + (date.getMonth() + 1)).slice(-2); // добавляем ведущий ноль, если месяц < 10
                            const day = ("0" + date.getDate()).slice(-2); // добавляем ведущий ноль, если день < 10
                            return `${year}-${month}-${day}`;

                        })
                        formattedDates.length === 2 ? resolve(formattedDates) : null
                    }
                })
            }
            catch (e) {
                console.log(e)
            }
        })
        const btn = calendar.children[1]
        const input = calendar.children[0].children[0]
        return new Promise((resolve, reject) => {
            Array.from(btn.children).forEach(elem =>
                elem.addEventListener('click', () => {
                    const formatString = date.map(e => {
                        const parts = e.split('-');
                        const formattedDate = `${parts[1].replace(/^0+/, '')}/${parts[2]}`;
                        return formattedDate
                    })
                    input.value = '', elem.closest('.calendar').style.display = 'none'
                    calendar.previousElementSibling.lastElementChild.children[0].classList.add('radio_choice')
                    if (elem.textContent === 'Очистить') {
                        resolve(null);
                    }
                    else {
                        resolve([date, formatString]);
                    }

                })
            )
        });
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
            if (e.children[0].classList.contains('clickToggle'))
                e.children[0].classList.remove('clickToggle')
        })
        el.children[0].classList.toggle('clickToggle')
    }



    //сверка активных объектов с данными для подсчета саммари и отображения
    controllActiveObject(array) {
        const checkObjectsId = Array.from(document.querySelectorAll('.checkInList')).reduce((acc, el) => {
            if (el.classList.contains('changeColorCheck')) {
                acc.push(Number(el.closest('.listItem').id))
            }
            return acc
        }, [])
        const originalObjectsData = array.reduce((acc, el) => {
            if (!checkObjectsId.includes(el.idw)) {
                acc.push(el)
            }
            return acc
        }, [])
        return originalObjectsData
    }
    //основной метод . готовить интервалы, запрашивает данные из базы, считает показатели, выводит в таблицу
    async getSummaryToBase(el, slot) {
        const data = this.getIntervalDate(el)
        const result = await this.getRequestSummaryToBase(data)
        const cleanObject = this.controllActiveObject(result)
        let summary;
        if (el === 'Неделя' || el === 'Месяц' || el.length === 2) {
            summary = this.filterWeekSummary(cleanObject)
        }
        else {
            summary = this.calculationParametrs(cleanObject)
        }
        el !== 'Сегодня' ? this.viewSummaryTable(summary, slot) : this.updateViewSummaryTable(summary)
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
        arraySummaryView.push(data.length === 0 || this.calculateParam(data, 'medium') === 0 ? 0 : parseFloat((this.calculateParam(data, 'medium') / data.filter(el => el.medium > 0).length).toFixed(0)))
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
        this.content.forEach((el, index) => {
            el.parentElement.children[1].textContent = data[index]
        })
    }
    //выводим в таблицу вчера и неделю
    viewSummaryTable(data, slot) {
        console.log(data)
        if (!slot) {
            this.content.forEach((el, index) => {
                el.parentElement.children[this.count].textContent = data[index]
            })
            this.count === 3 ? this.count = 2 : this.count++
        }
        else {
            this.content.forEach((el, index) => {
                el.parentElement.children[slot].textContent = data[index]
            })
        }
    }
    //складываем значения
    calculateParam(data, paramName) {
        if (paramName === 'medium') {
        }
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
        arraySummaryView.push(data.length === 0 || this.calculateParam(data, 'medium') === 0 ? 0 : parseFloat((this.calculateParam(data, 'medium') / data.filter(el => el.medium > 0).length).toFixed(0)))
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
        const data = [];
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
        if (interval.length === 2) {
            data.push(interval[0], interval[1])
        }
        else if (int <= 1) {
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