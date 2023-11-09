

export class SelectObjectsView {

    constructor() {
        this.listObjects = document.querySelectorAll('.listItem')
        this.object = document.querySelector('.object')
        this.file = document.querySelector('.file')
        this.shablons = document.querySelector('.shablons')
        this.interval = document.querySelector('.interval_reports')
        this.buttons = document.querySelector('.btn_speedStart_reports')
        this.titleReports = document.querySelector('.list_reports')
        this.mapContainer = document.querySelector('.reports_maps')
        this.reports_module = document.querySelector('.reports_module')
        this.stats = null
        this.tablesReports = null
        this.rows = null
        this.requestParams = {
            idResourse: null,
            idShablon: null,
            idObject: null,
            timeInterval: null,
        }
        this.createMap()
        this.createListObjects()
        this.createListShablons()

        this.checkObjects = this.object.querySelector('.toggle_reports')
        this.checkShablons = this.shablons.querySelector('.toggle_reports')
        this.checkInterval = this.interval.querySelector('.toggle_reports')
        this.checkTypeFile = this.file.querySelector('.toggle_reports')
        this.selectObjects = this.object.children[0].lastElementChild
        this.selectShablons = this.shablons.children[0].lastElementChild
        this.selectinterval = this.interval.children[0].lastElementChild
        this.selectTypeFile = this.file.lastElementChild
        this.checkShablons.addEventListener('click', this.hiddenView.bind(this))
        this.checkObjects.addEventListener('click', this.hiddenView.bind(this))
        this.checkInterval.addEventListener('click', this.hiddenView.bind(this))

        this.checkTypeFile.addEventListener('click', this.hiddenView.bind(this))
        this.file.querySelectorAll('.item_type_file').forEach(el => el.addEventListener('click', this.changeTitleRequestFile.bind(this, el)))
        this.object.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
        this.interval.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
        this.selectObjects.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.selectShablons.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.selectinterval.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.selectTypeFile.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.buttons.children[1].addEventListener('click', this.requestDataTitleReport.bind(this))
    }

    changeTitleRequestFile(el) {
        const title = el.closest('.file').querySelector('.titleChange_list_name')
        title.textContent = el.lastElementChild.textContent
        this.downloadFileReports(el)
    }

    async downloadFileReports(el) {
        const object = (this.object.querySelector('.titleChange_list_name').textContent).replace(/\s+/g, '_')
        const shablons = (this.shablons.querySelector('.titleChange_list_name').textContent).replace(/\s+/g, '_')
        const format = el.getAttribute('data-attribute')
        const formatToWialon = el.getAttribute('rel')
        console.log(this.requestParams)
        const time = this.requestParams.timeInterval.reduce((acc, el) => {
            acc.push(this.converterTimes(el))
            return acc
        }, [])

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ format, formatToWialon })
        }

        const resfile = await fetch('/api/file', params)
        const blob = await resfile.blob()
        const link = document.createElement('a')
        console.log(blob)
        link.href = URL.createObjectURL(blob)
        link.download = `${shablons}.${object}.${time[0]}_по_${time[1]}}.${format}`
        link.click()
    }

    converterTimes(data) {
        let date = new Date(data * 1000); // Преобразование в миллисекунды
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // Месяцы начинаются с 0
        let day = ("0" + date.getDate()).slice(-2);
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);

        let formattedTime = `${year}-${month}-${day}(${hours}-${minutes}-${seconds})`;
        return formattedTime
    }
    async requestDataTitleReport() {
        const titleNameReport = document.querySelectorAll('.titleNameReport')
        if (titleNameReport) {
            titleNameReport.forEach(e => e.remove())
        }
        const loaders = document.querySelector('.loaders_report')
        loaders.style.display = 'flex'
        let bool = true;
        for (let key in this.requestParams) {
            this.requestParams[key] == null ? bool = false : null
        }
        if (!bool) {
            console.log('Выберите данные')
            return
        }
        const idResourse = this.requestParams.idResourse
        const idShablon = this.requestParams.idShablon
        const idObject = this.requestParams.idObject
        const interval = this.requestParams.timeInterval
        const res = await fetch('/api/titleShablon', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idResourse, idShablon, idObject, interval })
        })
        const result = await res.json()
        console.log(result)
        this.tablesReports = result.data.reportResult.tables
        this.stats = result.data.reportResult.stats
        this.rows = result.rows
        this.clearTable()
        this.createListTitleReports(this.tablesReports, this.stats)

        loaders.style.display = 'none'
        if (this.stats !== null) {
            const li = document.createElement('li')
            li.classList.add('titleNameReport')
            li.classList.add('activeTitleReports')
            li.textContent = 'Статистика'
            this.titleReports.prepend(li)
            this.reports_module.lastElementChild.children[0].textContent = this.titleReports.children[0].textContent
            this.createStatsTable(this.stats)
        }
        else {
            this.reports_module.lastElementChild.children[0].textContent = this.reports_module.lastElementChild.children[0].getAttribute('rel')
        }
        const titleNameReports = document.querySelectorAll('.titleNameReport')
        titleNameReports.forEach(el => el.addEventListener('click', this.createMetaTable.bind(this, el)))


    }
    createMetaTable(el) {
        this.clearTable()
        const titleNameReport = document.querySelectorAll('.titleNameReport')
        titleNameReport.forEach(it => it.classList.remove('activeTitleReports'))
        el.classList.toggle('activeTitleReports')
        if (!el.id) {
            this.createStatsTable(this.stats)
        }
        else {
            this.createTable(this.tablesReports, this.rows, el.id)
        }
    }

    createTable(tables, rows, id) {
        const uniqTable = tables.filter((e, index) => index === Number(id))
        const uniqRows = rows.filter((e, index) => index === Number(id))
        const cellRows = uniqRows[0].reduce((acc, el) => {
            const modifiedC = el.c.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return item.t;
                }
                return item;
            });
            acc.push(modifiedC);
            return acc;
        }, []);
        const table = document.createElement('table');
        table.classList.add('cell_params')
        table.style.width = '100%'
        const headerRow1 = document.createElement('tr');
        headerRow1.classList.add('headersRow')
        headerRow1.classList.add('row_up')
        uniqTable[0].header.forEach(it => {
            const header = document.createElement('th');
            header.classList.add('header_table_reports')
            header.textContent = it.replace(/Grouping/g, 'Дата')
            headerRow1.appendChild(header);
        })
        const headerRow2 = document.createElement('tr');
        headerRow2.classList.add('headersRow')
        headerRow2.classList.add('row_footer')
        uniqTable[0].total.forEach(it => {
            const header = document.createElement('th');
            header.classList.add('header_table_reports')
            header.textContent = it.replace(/Total/g, 'Итого').replace(/l/g, 'л').replace(/h/g, 'ч').replace(/km/g, 'км').replace(/days/g, 'д.');
            headerRow2.appendChild(header);
        })
        table.appendChild(headerRow1);
        cellRows.forEach(it => {
            const row = document.createElement('tr');
            for (var i = 0; i < it.length; i++) {
                const cell = document.createElement('td');
                cell.textContent = it[i].replace(/l/g, 'л').replace(/h/g, 'ч').replace(/km/g, 'км').replace(/days/g, 'д.');
                row.appendChild(cell);
            }
            table.appendChild(row);
        })
        table.appendChild(headerRow2);
        headerRow1.style.position = 'sticky';
        headerRow1.style.top = '0';
        headerRow2.style.position = 'sticky';
        headerRow2.style.bottom = '0';
        this.reports_module.lastElementChild.children[1].children[0].appendChild(table);
    }


    createStatsTable(stats) {
        const table = document.createElement('table');
        table.classList.add('cell_params')
        for (var i = 0; i < stats.length; i++) {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            const cell2 = document.createElement('td');
            cell1.textContent = stats[i][0];
            cell2.textContent = stats[i][1].replace(/l/g, 'л').replace(/h/g, 'ч').replace(/km/g, 'км').replace(/days/g, 'д.');
            row.appendChild(cell1);
            row.appendChild(cell2);
            table.appendChild(row);
        }
        this.reports_module.lastElementChild.children[1].children[0].appendChild(table);
    }


    clearTable() {
        const cell_params = document.querySelector('.cell_params')
        if (cell_params) {
            cell_params.remove()
        }
    }
    createListTitleReports(titleReports) {
        const titleNameReport = document.querySelectorAll('.titleNameReport')
        if (titleNameReport) {
            titleNameReport.forEach(e => e.remove())
        }
        titleReports.forEach((el, index) => {
            const li = document.createElement('li')
            li.classList.add('titleNameReport')
            li.setAttribute('id', index)
            li.textContent = el.label
            this.titleReports.appendChild(li)
        })

    }


    hiddenListOutsideKursor(event) {
        event.target.classList.remove('hidden_view')
    }
    checkChoice(el) {
        const title = el.closest('.select_list').querySelector('.titleChange_list_name')
        el.firstElementChild.classList.toggle('radio_choice')
        if (el.firstElementChild.classList.contains('radio_choice')) {
            title.textContent = title.getAttribute('rel')
            this.clearParams(el)
        }
        else {
            title.textContent = el.lastElementChild.textContent
            this.pushParams(el)

        }
        Array.from(el.parentNode.children).forEach(e => {
            if (e !== el && !e.firstElementChild.classList.contains('radio_choice')) {
                e.firstElementChild.classList.toggle('radio_choice')
            }
        })
    }

    pushParams(el) {
        if (el.parentNode.parentNode.parentNode.classList.contains('shablons')) {
            this.requestParams.idResourse = el.getAttribute('rel')
            this.requestParams.idShablon = el.getAttribute('data-attribute')
        }
        if (el.parentNode.parentNode.parentNode.classList.contains('object')) {
            this.requestParams.idObject = el.getAttribute('rel')

        }
        if (el.parentNode.parentNode.parentNode.classList.contains('interval_reports')) {
            const time = this.getTimeInterval(el.lastElementChild.textContent)
            this.requestParams.timeInterval = time

        }
    }
    clearParams(el) {
        if (el.parentNode.parentNode.parentNode.classList.contains('shablons')) {
            this.requestParams.idResourse = null
            this.requestParams.idShablon = null
        }
        if (el.parentNode.parentNode.parentNode.classList.contains('object')) {
            this.requestParams.idObject = null

        }
        if (el.parentNode.parentNode.parentNode.classList.contains('interval_reports')) {
            //  const time = this.getTimeInterval(el.lastElementChild.textContent)
            this.requestParams.timeInterval = null

        }
    }
    getTimeInterval(interval) {
        var nowa = new Date(); // Текущая дата и время
        var currentDay = nowa.getDay()
        console.log(currentDay)
        const nows = new Date();
        let now = Math.floor(new Date(nows.getFullYear(), nows.getMonth(), nows.getDate(), 0, 0, 0).getTime() / 1000);
        let start, end;

        if (interval === 'Неделя') {
            const time = this.getPreviousWeekUnixTimestamps()
            start = time[0]
            end = time[1]

        }
        if (interval === 'Месяц') {
            const time = this.getPreviousMonthUnixTimestamps()
            start = time[0]
            end = time[1]
        }
        if (interval === 'Вчера') {
            start = now - (1 * 86400); // 1 день в секундах
            end = start + 86399; // Добавляем 1 день
        }
        if (interval === 'Сегодня') {
            start = now;
            end = start + 86399; // Добавляем 1 день
        }
        console.log([start, end])
        return [start, end];
    }

    getPreviousMonthUnixTimestamps() {
        const currentDate = new Date();
        const previousMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const previousMonthStartUnixTime = Math.floor(previousMonthStartDate.getTime() / 1000);
        const previousMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const previousMonthEndUnixTime = Math.floor(previousMonthEndDate.getTime() / 1000) - 1;
        return [previousMonthStartUnixTime, previousMonthEndUnixTime];
    }
    getPreviousWeekUnixTimestamps() {
        const now = new Date();
        const currentDay = now.getDay();
        const oneDayMilliseconds = 24 * 60 * 60 * 1000;
        const elapsedMilliseconds = (currentDay - 1) * oneDayMilliseconds;
        const startPreviousWeekMilliseconds = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()) - elapsedMilliseconds - (7 * oneDayMilliseconds);
        const endPreviousWeekMilliseconds = startPreviousWeekMilliseconds + (7 * oneDayMilliseconds) - 1000;
        const startPreviousWeekUnix = Math.floor(startPreviousWeekMilliseconds / 1000);
        const endPreviousWeekUnix = Math.floor(endPreviousWeekMilliseconds / 1000);
        return [startPreviousWeekUnix, endPreviousWeekUnix];
    }
    hiddenView(event) {
        const container = event.target.parentNode.nextElementSibling
        container.classList.toggle('hidden_view')
    }

    createListObjects() {
        const container = this.object.children[0].lastElementChild
        Array.from(this.listObjects).forEach(e => {
            const li = document.createElement('li')
            li.classList.add('item_type')
            container.appendChild(li)
            const i = document.createElement('i')
            i.classList.add('fa')
            i.classList.add('fa-check')
            i.classList.add('radio_choice')
            li.appendChild(i)
            const p = document.createElement('p')
            p.classList.add('text_type')
            li.appendChild(p)
            p.textContent = e.children[0].textContent
            li.setAttribute('rel', e.id)
        });

    }

    createShablonsObjects(resurse) {
        const container = this.shablons.children[0].lastElementChild
        resurse.forEach(e => {
            const obj = Object.values(e)[0]
            for (let key in obj) {
                const li = document.createElement('li')
                li.classList.add('item_type')
                container.appendChild(li)
                const i = document.createElement('i')
                i.classList.add('fa')
                i.classList.add('fa-check')
                i.classList.add('radio_choice')
                li.appendChild(i)
                const p = document.createElement('p')
                p.classList.add('text_type')
                li.appendChild(p)
                p.textContent = obj[key].n
                li.setAttribute('rel', Object.keys(e))
                li.setAttribute('data-attribute', obj[key].id)
            }
        })
    }


    async createListShablons() {
        const resurse = await this.requestAllShablons()
        this.createShablonsObjects(resurse)
        console.log(this.shablons)
        this.shablons.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
    }

    async requestAllShablons() {
        const res = await fetch('/api/shablons', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const shablons = await res.json()
        const resurse = shablons.items.reduce((acc, el) => {
            acc.push({ [el.id]: el.rep })
            return acc
        }, [])
        return resurse
    }


    createMap() {
        const karta = document.getElementById('reportsMap')
        if (!karta) {
            const div = document.createElement('div')
            div.classList.add('miniMapReports')
            div.setAttribute('id', 'reportsMap')
            div.style.width = '100%'
            div.style.height = '100%'
            div.style.zIndex = 0;
            this.mapContainer.appendChild(div)
            const map = L.map('reportsMap').setView([59.9386, 30.3141], 9);

            map.attributionControl.setPrefix(false);
            const leaf = document.querySelector('.leaflet-control-attribution');
            leaf.style.display = 'none';
            const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.control.scale({ imperial: '' }).addTo(map);
            map.addLayer(layer);

            setTimeout(() => {
                map.invalidateSize();
            }, 0);

        }
    }
}


