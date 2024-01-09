import { NaviChartLegenda } from "./NaviChartLegends.js"
import { initSummary } from "../../spisok.js"
import { Tooltip } from "../../../class/Tooltip.js"

export class SelectObjectsView {

    constructor() {
        this.listObjects = document.querySelectorAll('.listItem')
        this.groups = document.querySelectorAll('.groups')
        this.object = document.querySelector('.object')
        this.file = document.querySelector('.file')
        this.shablons = document.querySelector('.shablons')
        this.interval = document.querySelector('.interval_reports')
        this.buttons = document.querySelector('.btn_speedStart_reports')
        this.titleReports = document.querySelector('.list_reports')
        this.mapContainer = document.querySelector('.reports_maps')
        this.reports_module = document.querySelector('.reports_module')
        this.globalChartData = null
        this.svg = null;
        this.xScaleStart = null;
        this.marker = null;
        this.map = null;
        this.stats = null
        this.tablesReports = null
        this.rows = null
        this.attachments = null
        this.backgroundRegions = null
        this.markers = null
        this.requestParams = {
            idResourse: null,
            idShablon: null,
            idObject: null,
            timeInterval: null,
        }
        this.createMap()
        //  this.createListShablons()
        this.createCalendar()
        this.checkObjects = this.object.querySelector('.toggle_reports')
        this.checkShablons = this.shablons.querySelector('.toggle_reports')
        this.checkInterval = this.interval.querySelector('.toggle_reports')
        this.checkTypeFile = this.file.querySelector('.toggle_reports')
        this.selectObjects = this.object.children[0].lastElementChild
        this.selectShablons = this.shablons.children[0].lastElementChild
        this.selectinterval = this.interval.children[0].lastElementChild
        this.selectTypeFile = this.file.lastElementChild
        this.checkShablons.addEventListener('click', this.hiddenView.bind(this))
        this.checkInterval.addEventListener('click', this.hiddenView.bind(this))
        this.checkTypeFile.addEventListener('click', this.hiddenView.bind(this))
        this.file.querySelectorAll('.item_type_file').forEach(el => el.addEventListener('click', this.changeTitleRequestFile.bind(this, el)))
        this.interval.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
        this.selectShablons.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.selectinterval.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.selectTypeFile.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.buttons.children[1].addEventListener('click', this.requestDataTitleReport.bind(this))
    }


    async createCalendar() {
        const calendar = this.interval.nextElementSibling
        const id = `#${!calendar.children[0] ? calendar.id : calendar.children[0].id}`

        const fp = flatpickr(`${id}`, {
            mode: "range",
            dateFormat: "d-m-Y",
            locale: "ru",
            static: true,
            "locale": {
                "firstDayOfWeek": 1 // устанавливаем первым днем недели понедельник
            },
            onChange: (selectedDates, dateStr, instance) => {
                const unixTime = selectedDates.map(date => {
                    const unix = Math.floor(date.getTime() / 1000)
                    return unix;
                })
                unixTime.length === 2 ? this.requestParams.timeInterval = unixTime : null
            }
        })
    }

    changeTitleRequestFile(el) {
        const title = el.closest('.file').querySelector('.titleChange_list_name')
        title.textContent = el.lastElementChild.textContent
        if (this.requestParams.idResourse === 'cursor') {
            this.convertPDF(this.globalChartData)
        }
        else {
            this.downloadFileReports(el)
        }

    }

    async convertPDF(data) {
        console.log(data)
        const titleNameReports = Array.from(document.querySelectorAll('.titleNameReport')).reduce((acc, el) => {
            acc.push(el.textContent)
            return acc
        }, [])
        console.log(titleNameReports)
        const stats = data.stats
        const tables = data.tables
        const rows = data.row
        console.log(rows)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stats, titleNameReports, tables, rows })
        }

        const resfile = await fetch('/api/fileDown', params)
        console.log(resfile)
        const blob = await resfile.blob()
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `report.pdf`
        link.click()

    }
    async downloadFileReports(el) {
        const object = (this.object.querySelector('.titleChange_list_name').textContent).replace(/\s+/g, '_')
        const shablons = (this.shablons.querySelector('.titleChange_list_name').textContent).replace(/\s+/g, '_')
        const format = el.getAttribute('data-attribute')
        const formatToWialon = el.getAttribute('rel')
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
        link.href = URL.createObjectURL(blob)
        link.download = `${shablons}.${object}.${time[0]}_по_${time[1]}.${format}`
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

        let formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedTime
    }
    converterTimesTooltip(data) {
        let date = new Date(data * 1000); // Преобразование в миллисекунды
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // Месяцы начинаются с 0
        let day = ("0" + date.getDate()).slice(-2);
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);

        let formattedTime = `${day}.${month} ${hours}:${minutes}`;
        return formattedTime
    }
    formatTime(num) {
        var hours = Math.floor(num / 3600);
        var minutes = Math.floor((num % 3600) / 60);
        var seconds = num % 60;

        var formattedTime = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');

        return formattedTime;
    }

    async requestDataTitleReport() {
        const titleNameReport = document.querySelectorAll('.titleNameReport')
        if (titleNameReport) {
            titleNameReport.forEach(e => e.remove())
        }
        let bool = true;
        for (let key in this.requestParams) {
            this.requestParams[key] == null ? bool = false : null
        }
        if (!bool) {
            const inform = document.querySelector('.inform')
            inform.textContent = 'Выберите все параметры отчета'
            setTimeout(() => inform.textContent = '', 5000)
            return
        }
        const loaders = document.querySelector('.loaders_report')
        loaders.style.display = 'flex'
        const idResourse = this.requestParams.idResourse
        const idShablon = this.requestParams.idShablon
        const idObject = this.requestParams.idObject
        const interval = this.requestParams.timeInterval

        if (idResourse === 'cursor') {
            const globalChartData = await this.requestData(idShablon, idObject, interval)
            this.globalChartData = globalChartData
            this.stats = globalChartData.stats
            this.attachments = globalChartData.attachments
            this.tablesReports = globalChartData.tables
            this.rows = globalChartData.row
            this.clearTable()
            this.createListTitleReports(this.tablesReports, this.stats, this.attachments)
            loaders.style.display = 'none'
        }
        else {

            const res = await fetch('/api/titleShablon', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idResourse, idShablon, idObject, interval })
            })
            const result = await res.json()
            this.tablesReports = result.data.reportResult.tables
            this.stats = result.data.reportResult.stats
            this.rows = result.rows
            this.attachments = result.data.reportResult.attachments

            this.clearTable()
            this.createListTitleReports(this.tablesReports, this.stats, this.attachments)
            loaders.style.display = 'none'
        }
        if (this.stats.length !== 0) {
            const li = document.createElement('li')
            li.classList.add('titleNameReport')
            li.classList.add('activeTitleReports')
            li.textContent = 'Статистика'
            this.titleReports.prepend(li)
            this.reports_module.lastElementChild.children[0].textContent = this.titleReports.children[0].textContent
            this.createStatsTable(this.stats)
            const titleNameReports = document.querySelectorAll('.titleNameReport')
            titleNameReports.forEach(el => el.addEventListener('click', this.createMetaTable.bind(this, el)))
        }
        else {
            const titleNameReports = document.querySelectorAll('.titleNameReport')
            titleNameReports[0].classList.add('activeTitleReports')
            this.tablesReports.length !== 0 ? this.createTable(this.tablesReports, this.rows, titleNameReports[0].id) : null
            this.checkPointerToMaps()
            this.reports_module.lastElementChild.children[0].textContent = titleNameReports[0].textContent
            titleNameReports.forEach(el => el.addEventListener('click', this.createMetaTable.bind(this, el)))
        }


    }

    createMetaTable(el) {
        this.clearTable()
        this.marker ? this.hiddenMarkerToMap() : null
        const titleNameReport = document.querySelectorAll('.titleNameReport')
        titleNameReport.forEach(it => it.classList.remove('activeTitleReports'))
        this.reports_module.lastElementChild.children[0].textContent = el.textContent
        el.classList.toggle('activeTitleReports')
        if (!el.id) {
            this.createStatsTable(this.stats)
        }
        else if (el.id === 'chart') {
            this.requestParams.idResourse === 'cursor' ? this.createChartToWialon(this.globalChartData) :
                this.requestChartData(el.getAttribute('rel'))
        }
        else {
            this.createTable(this.tablesReports, this.rows, el.id)
            this.checkPointerToMaps()
        }
    }

    async requestChartData(att) {
        const interval = this.requestParams.timeInterval
        const res = await fetch('/api/chartData', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ interval, att })
        })
        const chartData = await res.json()
        this.createChartToWialon(chartData)
    }


    createOsiFormat(chartData, conteiner, svg) {
        const datasets = Object.values(chartData.datasets).map(dataset => {
            const xScale = d3.scaleTime()
                .domain(d3.extent(dataset.data.x, x => new Date(x * 1000)))
                .range([70, conteiner.clientWidth - 410]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset.data.y, y => parseFloat(y))])
                .range([(conteiner.clientHeight - 30), 35]);

            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(parseFloat(d.y)))
            //   .curve(d3.curveStep)
            return {
                data: dataset.data.x.map((value, i) => ({
                    x: new Date(value * 1000),
                    y: parseFloat(dataset.data.y[i]) < -100 ? parseFloat(dataset.data.y[i - 1]) : parseFloat(dataset.data.y[i])
                })),
                name: dataset.name,
                color: typeof dataset.color === 'number' ? dataset.color.toString(16) : dataset.color,
                uniq: dataset.y_axis,
                xScale: xScale,
                yScale: yScale,
                line: line
            }
        });
        return datasets
    }

    createLine(datasets, svg) {
        datasets.forEach(dataset => {
            svg.append('path')
                .datum(dataset.data)
                .attr('class', 'linezoom')
                .attr("clip-path", "url(#clip)")
                .attr('d', dataset.line)
                .attr('rel', `${dataset.color}`)
                .attr('stroke', `#${dataset.color}`)
                .attr('stroke-width', 1.5)
                .attr('fill', 'none')

        });
    }

    createArea(set, svg, xScaleStart, conteiner) {
        set.interval.forEach((region) => {
            svg.append('rect')
                .attr('x', xScaleStart(new Date(Math.round(region[0][0] ? region[0][0] * 1000 : region[0] * 1000)))) // начало интервала в формате даты
                .attr('y', 35) // отступ сверху
                .attr('class', 'areazoom')
                .attr("clip-path", "url(#clip)")
                .attr('width', xScaleStart(new Date(Math.round(region[1][0] ? region[1][0] * 1000 : region[1] * 1000))) - xScaleStart(new Date(Math.round(region[0][0] ? region[0][0] * 1000 : region[0] * 1000)))) // ширина от начала до конца интервала в пикселях
                .attr('height', (conteiner.clientHeight - 65)) // высота
                .attr('rel', `${set.id}`)
                .attr('fill', `#${set.color}`) // цвет фона
                .attr('stroke', 'none'); // без рамки
        });
    }
    createMarkers(markers, svg, xScaleStart) {
        const markersIcon = {
            8: "../../../image/ref.png",
            32: "../../../image/parking.png",
            256: "../../../image/sliv.png",
            128: "../../../image/stop.png",
            64: "../../../image/maxspeed.png",
            4: "../../../image/er.png",
            10: "../../../image/tah.png",
            11: "../../../image/prst.png",
            12: "../../../image/drain.png"
        }
        svg.selectAll("image")
            .data(markers)
            .enter()
            .append("image")
            .attr('class', 'markerszoom')
            .attr("clip-path", "url(#clip)")
            .attr("x", d => xScaleStart(new Date(d.time.x * 1000)))
            .attr('rel', function (d) { return d.type })
            .attr("xlink:href", function (d) { return markersIcon[d.type] })
            .attr("width", 16)
            .attr("height", 16)
            .style("opacity", 1)
            .attr("transform", "translate(-8,10)")
            .each(function (d, i, nodes) {
                new Tooltip(nodes[i], d.type !== 8 ? [[`${d.tool}: ${d.time.str}`], [`Длительность: ${d.time.duration}`]] :
                    [[`${d.name}: ${d.time.start}`], [`${d.tool}: ${d.time.value} л.`]]); //чтобы работали тултипы на виалоновских маркерах надо везде указать  название маркера

            });
    }

    createLegendaNavi(leg, chartData) {
        const markersIcon = {
            8: "../../../image/ref.png",
            32: "../../../image/parking.png",
            256: "../../../image/sliv.png",
            128: "../../../image/stop.png",
            64: "../../../image/maxspeed.png",
            4: "../../../image/er.png",
            10: "../../../image/tah.png",
            11: "../../../image/prst.png",
            12: "../../../image/drain.png"
        }

        if (chartData.markers) {
            const div = document.createElement('div')
            div.classList.add('markers')
            leg.appendChild(div)
            const divItem = document.createElement('div')
            divItem.classList.add('item_type_p')
            div.appendChild(divItem)
            const i = document.createElement('i')
            i.classList.add('fa')
            i.classList.add('fa-check')
            i.classList.add('checkAll')
            divItem.appendChild(i)
            const p = document.createElement('p')
            p.classList.add('text_type_p')
            p.textContent = 'Все маркеры'
            divItem.appendChild(p)
            const divMarkers = document.createElement('div')
            divMarkers.classList.add('markers_container')
            div.appendChild(divMarkers)
            chartData.markers.forEach(el => {
                const divfpoo = document.createElement('div')
                divfpoo.classList.add('wrapper_marker')
                divMarkers.appendChild(divfpoo)
                const image = document.createElement('div')
                image.classList.add('markers_image')
                image.style.backgroundImage = `url(${markersIcon[el.type]})`
                image.setAttribute('rel', el.type)
                divfpoo.appendChild(image)
                new Tooltip(image, [el.sensor])
            })
        }
        if (chartData.background_regions) {
            const div = document.createElement('div')
            div.classList.add('area')
            leg.appendChild(div)
            const divItem = document.createElement('div')
            divItem.classList.add('item_type_p')
            div.appendChild(divItem)
            const i = document.createElement('i')
            i.classList.add('fa')
            i.classList.add('fa-check')
            i.classList.add('checkAll')
            divItem.appendChild(i)
            const p = document.createElement('p')
            p.classList.add('text_type_p')
            p.textContent = 'Все области'
            divItem.appendChild(p)
            const divMarkers = document.createElement('div')
            divMarkers.classList.add('area_line_container')
            div.appendChild(divMarkers)
            chartData.background_regions.forEach(el => {
                const divItem = document.createElement('div')
                divItem.classList.add('item_type_lineANDarea')
                divMarkers.appendChild(divItem)
                const i = document.createElement('i')
                i.classList.add('fa')
                i.classList.add('fa-check')
                i.classList.add('marg')
                i.classList.add('galka')
                i.setAttribute('rel', el.id)
                divItem.appendChild(i)
                const middleDiv = document.createElement('div')
                middleDiv.classList.add('fon')
                middleDiv.style.background = `#${el.color.toString(16)}`
                divItem.appendChild(middleDiv)
                const p = document.createElement('p')
                p.classList.add('text_type_p')
                p.classList.add('fonAndArea')
                p.textContent = `${el.name}`
                divItem.appendChild(p)
            })

        }
        if (chartData.datasets) {
            const div = document.createElement('div')
            div.classList.add('line')
            leg.appendChild(div)
            const divItem = document.createElement('div')
            divItem.classList.add('item_type_p')
            div.appendChild(divItem)
            const i = document.createElement('i')
            i.classList.add('fa')
            i.classList.add('fa-check')
            i.classList.add('checkAll')
            divItem.appendChild(i)
            const p = document.createElement('p')
            p.classList.add('text_type_p')
            p.textContent = 'Все линии'
            divItem.appendChild(p)
            const divMarkers = document.createElement('div')
            divMarkers.classList.add('area_line_container')
            div.appendChild(divMarkers)

            Object.values(chartData.datasets).forEach(el => {
                const divItem = document.createElement('div')
                divItem.classList.add('item_type_lineANDarea')
                divMarkers.appendChild(divItem)
                const i = document.createElement('i')
                i.classList.add('fa')
                i.classList.add('fa-check')
                i.setAttribute('rel', typeof el.color === 'number' ? el.color.toString(16) : el.color)
                i.classList.add('galka')
                divItem.appendChild(i)
                const middleDiv = document.createElement('div')
                middleDiv.classList.add('fon')
                middleDiv.classList.add('line_color')
                middleDiv.style.background = `#${el.color.toString(16)}`
                divItem.appendChild(middleDiv)
                const p = document.createElement('p')
                p.classList.add('text_type_p')
                p.classList.add('small_discription')
                p.textContent = `${el.name}`
                divItem.appendChild(p)
            })
        }

    }
    createChartToWialon(chartData) {
        const char = document.querySelector('.chart_to_wialon')
        if (char) {
            char.remove()
        }
        const legenda = document.querySelector('.legenda_navi')
        if (legenda) {
            legenda.remove()
        }
        const conteiner = this.reports_module.lastElementChild.children[1].children[0]
        const leg = document.createElement('div')
        leg.classList.add('legenda_navi')
        leg.style.height = (conteiner.clientHeight - 20) + 'px'
        this.reports_module.lastElementChild.children[1].children[0].appendChild(leg)
        const graf = document.createElement('div')
        graf.classList.add('chart_to_wialon')
        this.reports_module.lastElementChild.children[1].children[0].appendChild(graf)
        const titleOsisY = this.attachments[0].axis_y
        conteiner.style.display = 'flex'
        conteiner.style.justifyContent = 'space-around'
        conteiner.style.alignItems = 'center'


        this.createLegendaNavi(leg, chartData)

        const svg = d3.select(".chart_to_wialon")
            .append("svg")
            .attr('class', 'chart_reports')
            .attr("width", conteiner.clientWidth - 300)
            .attr("height", conteiner.clientHeight)//390)
        this.svg = svg
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("class", "clipart")
            .attr("width", conteiner.clientWidth - 480) // or the width of your chart area
            .attr("height", conteiner.clientHeight)//390)// or the height of your chart area
            .attr('x', 70)
            .attr('y', 0)
        const xScaleStart = d3.scaleTime()
            .domain(d3.extent(chartData.possitions.time, x => new Date(x * 1000)))
            .range([70, conteiner.clientWidth - 410]);
        this.xScaleStart = xScaleStart
        const datasets = this.createOsiFormat(chartData, conteiner, svg)

        if (chartData.background_regions) {
            this.backgroundRegions = chartData.background_regions.reduce((acc, el) => {
                acc.push({ name: el.name, id: el.id, priority: el.priority, interval: el.regions, color: el.color.toString(16) })
                return acc
            }, [])
            this.backgroundRegions.forEach(set => {
                this.createArea(set, svg, xScaleStart, conteiner)
            })
        }
        if (chartData.datasets) {
            this.createLine(datasets, svg)
        }

        if (chartData.markers !== undefined) {

            this.markers = chartData.markers.flatMap(e =>
                e.x.map(el => ({
                    name: e.sensor,
                    time: el,
                    type: e.type,
                    tool: e.tool
                }))
            );
            this.createMarkers(this.markers, svg, xScaleStart)
        }
        svg.append("g")
            .attr("transform", `translate(0, ${(conteiner.clientHeight - 30)})`)
            .attr('class', 'os1')
            .attr("clip-path", "url(#clip)")
            .call(d3.axisBottom(xScaleStart)
                //  .ticks(d3.timeHour.every(1))
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%H:%M")(d);
                })
            )

        svg.append("g")
            .attr("transform", `translate(0, ${(conteiner.clientHeight - 20)})`)
            .attr('class', 'os2')
            .attr("clip-path", "url(#clip)")
            .call(d3.axisBottom(xScaleStart)
                //   .ticks(d3.timeHour.every(1))
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%d.%m")(d);
                })
            )
            .style("stroke-width", 0)

        svg.append("g")
            .attr("transform", `translate(70,0)`)
            .attr('class', 'osy1')
            .call(d3.axisLeft(datasets[0].yScale).ticks(10));
        svg.append("g")
            .attr("transform", `translate(${(conteiner.clientWidth - 410)}, 0)`) // Сдвигаем ось вправо
            .attr('class', 'osy2')
            .call(d3.axisRight(datasets[1].yScale))
            .selectAll("text")
            .attr("dx", "5") // Сдвигаем текст оси вправо
            .attr("dy", "-.3em") // Сдвигаем текст оси вверх для улучшения отображения
            .style("text-anchor", "start");  // Переопределяем якорь текста, чтобы текст был выровнен в сторону графика

        svg.append("text")
            .attr("y", 10)
            .attr("x", -190)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style('font-size', '1rem')
            .style('font-weight', 400)
            .text(`${titleOsisY[0]}`);
        svg.append("text")
            .attr("y", (conteiner.clientWidth - 350))
            .attr("x", -190)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style('font-size', '1rem')
            .style('font-weight', 400)
            .text(`${titleOsisY[1]}`);


        new NaviChartLegenda()
        // Добавляем слушатель события прокрутки колеса мыши
        svg.call(d3.zoom().on("zoom", this.zoomed.bind(this, datasets, xScaleStart, svg)))
        this.createTooltip(svg, datasets, chartData, xScaleStart, conteiner)

    }

    createTooltip(svg, datasets, chartData, xScaleStart, conteiner) {
        const tool = document.querySelector('.chart-tooltip')
        if (tool) {
            tool.remove()
        }
        const body = document.querySelector('.chart_to_wialon');
        const tooltip = document.createElement('div');
        tooltip.classList.add('chart-tooltip');
        body.appendChild(tooltip);

        svg
            .on('mouseout', () => {
                tooltip.style.display = 'none'
            })
            .on('mousemove', handleMouseMove);

        function handleMouseMove() {
            const line = document.querySelector('.line')
            const noactive = Array.from(line.querySelectorAll('.noactive')).reduce((acc, el) => {
                acc.push(el.getAttribute('rel'))
                return acc
            }, [])
            const [xPosition, yPosition] = d3.mouse(this);
            if (yPosition < 30 || yPosition > 425) {
                tooltip.style.display = 'none'
            }
            else {
                const dataIndex = datasets.map(dataset => {
                    const closestIndex = findClosestDataIndex(xPosition, dataset.data);
                    // Добавить проверку индекса
                    if (closestIndex[1] <= 0) {
                        return -1; // или любое другое значение, которое показывает отсутствие данных
                    }
                    return closestIndex;
                });

                const tooltipData = dataIndex.reduce((acc, index, i) => {
                    const nameParts = datasets[i].name.split(' ');
                    const unit = nameParts.pop();
                    if (noactive.length !== 0) {

                        const filteredNoActive = noactive.filter(el => el !== datasets[i].color);
                        if (filteredNoActive.length === noactive.length) {
                            acc.push(createTooltipObject(datasets[i], nameParts, index, unit));
                        }
                    } else {
                        acc.push(createTooltipObject(datasets[i], nameParts, index, unit));
                    }
                    return acc
                }, []);

                function createTooltipObject(dataset, nameParts, index, unit) {
                    return {
                        color: dataset.color,
                        name: nameParts.join(' '),
                        value: parseFloat(dataset.data[index[1]].y === 'number' ? dataset.data[index[1]].y.toFixed(2) : dataset.data[index[1]].y),
                        val: unit,
                        uniq: dataset.color
                    };
                }
                const unix = Math.floor(new Date(dataIndex[0][0]).getTime() / 1000)
                const date = new Date(unix * 1000);
                const day = date.getDate().toString().padStart(2, '0'); // Добавляем ведущий ноль для дня
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Добавляем ведущий ноль для месяца
                const year = date.getFullYear();
                const hours = date.getHours().toString().padStart(2, '0'); // Добавляем ведущий ноль для часов
                const minutes = date.getMinutes().toString().padStart(2, '0'); // Добавляем ведущий ноль для минут
                const seconds = date.getSeconds().toString().padStart(2, '0'); // Добавляем ведущий ноль для секунд

                const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

                tooltip.innerHTML = `<div class="title_tooltip">${formattedDate}</div>
            <div class="body_tooltip">${tooltipData.map(data => `<div class="all_list_tooltip"><div class="color_tooltip" style="width: 20px; height: 2px; background: #${data.color}"></div>
<div class="list_tooltip" rel=${data.uniq}>${data.name}  ${data.value} ${data.val}</div></div>`).join('')}</div>`
                tooltip.style.left = xPosition <= 460 ? (xPosition + 30 + 'px') : (xPosition - 250 + 'px');
                tooltip.style.top = yPosition <= 320 ? (yPosition + 10 + 'px') : (yPosition - 60 + 'px');
                tooltip.style.display = 'block';
            }

            function findClosestDataIndex(xPosition, data) {
                const x0 = xScaleStart.invert(xPosition);
                const times = data.map((d, i) => { return d.x });
                const index = d3.bisect(times, x0);
                if (index < 0) {
                    return -1;
                }
                return [x0, index];
            }
        }

    }

    zoomed(datasets, xScaleStart, svg, chartData) {
        const transform = d3.event.transform;
        // Масштабируем оси с помощью текущего масштабного коэффициента
        const new_xScale = transform.rescaleX(xScaleStart);
        // Обновляем шкалю x для каждого датасета
        datasets.forEach(dataset => {
            dataset.xScale = transform.rescaleX(xScaleStart);
            dataset.line = dataset.line.x(d => dataset.xScale(d.x));
        });


        // Обновляем оси с новыми масштабами
        svg.select(".os1").call(d3.axisBottom(xScaleStart)
            .ticks(10)
            .tickFormat(function (d) {
                return d3.timeFormat("%H:%M")(d);
            })
            .scale(new_xScale));
        svg.select(".os2").call(d3.axisBottom(xScaleStart)
            .ticks(10)
            .tickFormat(function (d) {
                return d3.timeFormat("%d.%m")(d);
            })
            .scale(new_xScale));

        svg.selectAll(".linezoom")
            .data(datasets)
            .attr("d", d => d.line(d.data))
        this.backgroundRegions.forEach(set => {
            svg.selectAll(`[rel = '${set.id}']`)
                .data(set.interval) // Привязываем данные
                .attr('x', d => new_xScale(new Date(Math.round(d[0][0] ? d[0][0] * 1000 : d[0] * 1000)))) // Начало интервала в формате даты
                .attr('width', d => new_xScale(new Date(Math.round(d[1][0] ? d[1][0] * 1000 : d[1] * 1000))) - new_xScale(new Date(Math.round(d[0][0] ? d[0][0] * 1000 : d[0] * 1000))))
        })
        svg.selectAll(".markerszoom")
            .data(this.markers)
            .attr("x", d => new_xScale(new Date(d.time.x * 1000)))

        this.createTooltip(svg, datasets, chartData, new_xScale)
    }


    hiddenMarkerToMap() {
        this.map.removeLayer(this.marker)
    }

    checkPointerToMaps() {
        const pointer = document.querySelectorAll('.pointer_cell')
        pointer.forEach(el => el.addEventListener('click', () => {
            pointer.forEach(e => {
                e.classList.remove('active_cell')
            })
            el.classList.add('active_cell')
            const geo = (el.getAttribute('rel')).split(',')
            const contentPopap = el.textContent
            const LeafIcon = L.Icon.extend({
                options: {
                    iconSize: [20, 30],
                    iconAnchor: [10, 18],
                    popupAnchor: [0, 0]
                }
            });
            const iconCar = new LeafIcon({
                iconUrl: '../../image/map1.png',
                iconSize: [30, 22],
                iconAnchor: [20, 20],
                popupAnchor: [0, -10],
                className: 'custom-markers'
            });
            if (this.marker) {
                this.marker.setLatLng(geo).addTo(this.map)
            }
            else {
                this.marker = L.marker(geo, { icon: iconCar }).addTo(this.map);
            }
            this.map.setView(geo, 9);
            this.marker.bindPopup(contentPopap, { width: 60, className: 'reports_popup', autoPan: false })
            this.marker.on('mouseover', function (e) {
                this.openPopup();
            });
            this.marker.on('mouseout', function (e) {
                this.closePopup()
            });
        }))
    }

    createTable(tables, rows, id) {
        if (rows.length === 0) {
            // return
        }
        const uniqTable = tables.filter((e, index) => index === Number(id))
        const uniqRows = rows.filter((e, index) => index === Number(id))
        const cellRows = uniqRows[0].reduce((acc, el) => {
            const modifiedC = el.c.map(item => {
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
        if (uniqTable[0].total) {
            uniqTable[0].total.forEach(it => {
                const header = document.createElement('th');
                header.classList.add('header_table_reports')
                header.textContent = it
                headerRow2.appendChild(header);
            })
        }
        table.appendChild(headerRow1);
        cellRows.forEach(it => {
            const row = document.createElement('tr');
            for (var i = 0; i < it.length; i++) {
                const cell = document.createElement('td');
                if (typeof it[i] === 'object' && it[i] !== null) {
                    cell.textContent = it[i].t
                    cell.setAttribute('rel', [it[i].y, it[i].x])
                    cell.classList.add('pointer_cell')
                }
                else {
                    cell.textContent = it[i]
                }
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
        if (stats.length === 0) {
            return
        }
        const table = document.createElement('table');
        table.classList.add('cell_params')
        for (var i = 0; i < stats.length; i++) {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            const cell2 = document.createElement('td');
            cell1.textContent = stats[i][0];
            cell2.textContent = stats[i][1];
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
        const conteiner = this.reports_module.lastElementChild.children[1].children[0]
        conteiner.style.display = 'block'
        const char = document.querySelector('.chart_to_wialon')
        if (char) {
            char.remove()
        }
        const legenda = document.querySelector('.legenda_navi')
        if (legenda) {
            legenda.remove()
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
        if (this.attachments.length !== 0) {
            this.attachments.forEach((e, i) => {
                const li = document.createElement('li')
                li.classList.add('titleNameReport')
                li.setAttribute('id', 'chart')
                li.setAttribute('rel', `${i}`)
                li.textContent = e.name
                this.titleReports.appendChild(li)
            })

        }

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
            // const reports = document.querySelector('.reports')
            // reports.classList.add('hovering')
            const titleListObjects = document.querySelector('.list_item1')
            titleListObjects.style.color = 'red'
            setTimeout(() => {
                titleListObjects.style.color = ''
            }, 3000)
            //    this.requestParams.idObject = null
            this.requestParams.idResourse = el.getAttribute('rel')
            this.requestParams.idShablon = el.getAttribute('data-attribute')
            const unitsAndGroup = el.getAttribute('data-ct')
            this.object.style.display = 'block'
            const container = this.object.children[0].lastElementChild
            //   const title = this.object.querySelector('.titleChange_list_name')
            //  title.textContent = title.getAttribute('rel')
            Array.from(container.children).forEach(t => t.remove())
            if (unitsAndGroup === 'avl_unit') {
                this.createListObjects()
            }
            else {
                this.createListGroup()
            }
            this.object.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
        }
        if (el.parentNode.parentNode.parentNode.classList.contains('interval_reports')) {
            const time = this.getTimeInterval(el.lastElementChild.textContent)
            this.requestParams.timeInterval = time
            this.interval.nextElementSibling.children[0].value = ''
        }
    }
    clearParams(el) {
        if (el.parentNode.parentNode.parentNode.classList.contains('shablons')) {
            this.requestParams.idResourse = null
            this.requestParams.idShablon = null
            this.object.style.display = 'none'
        }

        if (el.parentNode.parentNode.parentNode.classList.contains('interval_reports')) {
            this.requestParams.timeInterval = null
        }
    }
    getTimeInterval(interval) {
        var nowa = new Date(); // Текущая дата и время
        var currentDay = nowa.getDay()
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

    createListGroupSelect(elem) {
        this.object.querySelector('.titleChange_list_name').textContent = elem.closest('.groups').getAttribute('rel')
        this.requestParams.idObject = elem.closest('.groups').id
    }
    createListGroup() {
        Array.from(this.listObjects).forEach(e => {
            e.querySelector('.checkInList').style.opacity = 0
        })
        Array.from(this.groups).forEach(e => {
            e.querySelector('.chekHidden').classList.add('changeColorCheck')
            e.querySelector('.chekHidden').style.opacity = 1
        })

    }

    createListObjectsSelect(elem) {
        this.object.querySelector('.titleChange_list_name').textContent = elem.getAttribute('rel')
        this.requestParams.idObject = elem.closest('.listItem').id
    }
    createListObjects() {
        Array.from(this.groups).forEach(e => {
            e.querySelector('.chekHidden').style.opacity = 0
        })
        Array.from(this.listObjects).forEach(e => {
            e.querySelector('.checkInList').classList.add('changeColorCheck')
            e.querySelector('.checkInList').style.opacity = 1
        })

    }

    createShablonsObjects(resurse) {
        const container = this.shablons.children[0].lastElementChild
        if (container.children.length > 0) {
            Array.from(container.children).forEach(e => {
                e.remove()
            })
        }
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
        p.textContent = 'Основной отчет Курсор'
        //  li.setAttribute('id', 'moto')
        li.setAttribute('rel', 'cursor')
        li.setAttribute('data-attribute', 'moto')
        li.setAttribute('data-ct', "avl_unit")

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
                li.setAttribute('data-ct', obj[key].ct)
            }
        })
    }


    async createListShablons(avl) {
        const resurse = await this.requestAllShablons()
        if (avl) {
            const resurseUnit = Object.values(resurse).reduce((acc, obj) => {
                const filteredValues = Object.values(Object.values(obj)[0]).reduce((acc, e, i) => { if (e.ct === avl) { acc[i] = e } return acc }, {});
                if (Object.values(filteredValues).length > 0) {
                    const newObj = { [Object.keys(obj)[0]]: filteredValues };
                    acc.push(newObj);
                }
                return acc;
            }, []);
            this.createShablonsObjects(resurseUnit)
            this.shablons.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
            const actModules = document.querySelector('.act_modules').parentNode.children[0]
            this.createListObjectsSelect(actModules)
        }
        else {
            this.createShablonsObjects(resurse)
            this.shablons.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
        }


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
            this.map = L.map('reportsMap').setView([59.9386, 30.3141], 9);

            this.map.attributionControl.setPrefix(false);
            const leaf = document.querySelector('.leaflet-control-attribution');
            leaf.style.display = 'none';
            const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
            L.control.scale({ imperial: '' }).addTo(this.map);
            this.map.addLayer(layer);
            setTimeout(() => {
                this.map.invalidateSize();
            }, 0);
        }
    }

    convertUnixTime(unix) {
        const dt = new Date(unix * 1000);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return dateStr
    }

    async requestData(idShablon, idObject, interval) {
        const idw = idObject
        const ifPwr = await this.requstModel(idw)
        const [t1, t2] = interval
        const active = String(idObject)

        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ active, t1, t2 }))
        }
        const rest = await fetch('/api/viewChart', param)
        const resultt = await rest.json()
        resultt.sort((a, b) => {
            if (a.data > b.data) {
                return 1;
            }
            if (a.data < b.data) {
                return -1;
            }
            return 0;
        })
        const extractData = (params) => {
            let prevVal = null;
            return resultt.flatMap(el => {
                return JSON.parse(el.allSensParams).reduce((acc, e, i) => {
                    if (params !== 'Топливо' ? e[0].startsWith(params) : e[0] === params) {
                        const val = e[2] < -10 ? (prevVal !== null ? prevVal - i : e[2] - i) : e[2];
                        prevVal = val;
                        acc.push({ x: Number(el.data), y: e[2] !== null ? parseFloat(prevVal.toFixed(2)) : 0, geo: JSON.parse(el.geo), speed: el.speed, sats: el.sats });
                    }
                    return acc;
                }, []);
            });
        }
        const speed = resultt.flatMap(el => {
            return { x: Number(el.data), y: el.speed, geo: JSON.parse(el.geo) }
        })
        const sats = resultt.flatMap(el => {
            return { x: Number(el.data), y: el.sats }
        })

        const engine = extractData('Зажигание')
        const pwr = extractData('Бортовое')
        const oil = extractData('Топливо')
        const meliage = extractData('Пробег')

        const datas = [
            { oil: oil },
            { pwr: pwr },
            { engine: engine },
            { speed: speed },
            { sats: sats },
            { meliage: meliage }
        ]
        const minLength = Math.min(...datas.map(item => Object.values(item)[0].length)); // определяем минимальную длину массива
        const shortestArrays = datas.filter(item => Object.values(item)[0].length === minLength)
        const optim = Object.values(Object.values(shortestArrays)[0])[0].reduce((acc, el, i) => {
            const obj = {}
            datas.forEach(it => {
                const matchedObject = Object.values(it)[0].find(obj => obj.x === el.x)
                obj[Object.keys(it)[0]] = matchedObject.y

            })
            acc.push({ x: el.x, ...obj, geo: el.geo, speed: el.speed, sats: el.sats })
            return acc
        }, [])
        const gasStations = this.calculateOilUp(optim)
        const fuelDrain = this.calculateOilSliv(optim)
        const motohours = this.calculate(optim, ifPwr, 'Моточасы')
        const prostoy = this.calculate(optim, ifPwr, 'Простои')
        const engin = this.calculate(optim, ifPwr, 'Зажигание')
        const travel = this.calculate(optim, ifPwr, 'Скорость')
        const motoAll = motohours.length !== 0 ? this.diff(motohours) : 0
        const prostoyAll = prostoy.length !== 0 ? this.diff(prostoy) : 0
        const oilAllRashod = prostoy.length !== 0 ? this.diff(prostoy, 1) : 0
        const ItogSummaryTravel = travel.reduce((acc, e) => {
            acc.distance += parseFloat((e[2].distance.toFixed(2)));
            acc.oil += parseFloat((e[2].rashod.toFixed(2)))
            acc.duration += (e[1][0] - e[0][0])
            acc.maxSpeed = Math.max(acc.maxSpeed, e[2].maxSpeed)
            acc.averageSpeed += e[2].averageSpeed;
            acc.count++;
            return acc;
        }, { duration: 0, distance: 0, oil: 0, maxSpeed: 0, averageSpeed: 0, count: 0 });
        ItogSummaryTravel.averageSpeed = ItogSummaryTravel.averageSpeed / ItogSummaryTravel.count
        ItogSummaryTravel.averageRashod = parseFloat(((ItogSummaryTravel.oil / ItogSummaryTravel.distance) * 100).toFixed(1))
        console.log(ItogSummaryTravel)

        const workingTime = motoAll - prostoyAll

        const xtimeMoto = { type: 10, tool: 'Работа двигателя', sensor: 'Начало работы двигателя', x: motohours.length !== 0 ? this.xtimes(motohours) : [] }
        const xtimeProstoy = { type: 11, tool: 'Простой', sensor: 'Начало простоя на холостом ходу', x: prostoy.length !== 0 ? this.xtimes(prostoy) : [] }
        const xtimepOil = { type: 8, tool: 'Топливо', sensor: 'Заправка', x: gasStations.length !== 0 ? this.xtimesOil(gasStations) : [] }
        const xtimepDrain = { type: 12, tool: 'Топливо', sensor: 'Слив', x: fuelDrain.length !== 0 ? this.xtimesOil(fuelDrain) : [] }

        const time = resultt.map(el => Number(el.data))

        const datasetObject = {
            oil: ['Топливо, л.', '410c96'],
            pwr: ['Бортовое питание, В', 'd90b9e'],
            speed: ['Скорость, км/ч', '0eab5f'],
            sats: ['Спутники, шт.', '8f751a']
        }

        const updatedData = datas.filter(item => !item.hasOwnProperty('engine') && !item.hasOwnProperty('meliage'));

        const rowsMoto = motohours.map(el => {
            const moto = el[1][0] - el[0][0]
            return {
                c: [{ t: this.converterTimes(el[0][0]), y: el[0][1][0], x: el[0][1][1] }, el[0][1].join(''),
                { t: this.converterTimes(el[1][0]), y: el[1][1][0], x: el[1][1][1] }, el[1][1].join(''),
                this.formatTime(moto)]
            }
        })
        const rowsProstoy = prostoy.map(el => {
            const diff = parseFloat(el[0][2] - el[1][2]).toFixed(1)
            return {
                c: [{ t: this.converterTimes(el[0][0]), y: el[0][1][0], x: el[0][1][1] }, el[0][1].join(''),
                { t: this.converterTimes(el[1][0]), y: el[1][1][0], x: el[1][1][1] }, el[1][1].join(''),
                this.formatTime(el[1][0] - el[0][0]), diff > 0 ? `${diff} л.` : '-']
            }
        })
        const rowsOil = gasStations.map(el => {
            return {
                c: [{ t: this.converterTimes(el.timeStart), y: el.geo[0], x: el.geo[1] },
                { t: this.converterTimes(el.timeFinish), y: el.geo[0], x: el.geo[1] }, el.geo.join(''),
                `${el.startOilValue} л.`, `${el.finishOilValue} л.`, `${el.valueOil} л.`]
            }
        })
        const rowsOilDrain = fuelDrain.map(el => {
            return {
                c: [{ t: this.converterTimes(el.timeStart), y: el.geo[0], x: el.geo[1] },
                { t: this.converterTimes(el.timeFinish), y: el.geo[0], x: el.geo[1] }, el.geo.join(''),
                `${el.startOilValue} л.`, `${el.finishOilValue} л.`, `${el.valueOil} л.`]
            }
        })
        const rowsTravel = travel.map(el => {
            const averageRashod = ((el[2].rashod / el[2].distance) * 100).toFixed(1)
            return {
                c: [{ t: this.converterTimes(el[0][0]), y: el[0][1][0], x: el[0][1][1] }, el[0][1].join(''),
                { t: this.converterTimes(el[1][0]), y: el[1][1][0], x: el[1][1][1] }, el[1][1].join(''), el[2].duration, `${el[2].distance} км.`,
                `${el[2].averageSpeed} км.ч`, `${el[2].maxSpeed} км/ч`, `${el[2].rashod.toFixed(1)} л.`, `${averageRashod} л.`
                ]
            }
        })
        const ShablonName = this.shablons.querySelector('.titleChange_list_name').textContent
        const ObjectName = this.object.querySelector('.titleChange_list_name').textContent
        const globalChartData = {
            background_regions: [],
            datasets: {},
            markers: [],
            possitions: {
                time: time,
                lat: resultt.map(el => JSON.parse(el.geo)[0]),
                lon: resultt.map(el => JSON.parse(el.geo)[1])
            },
            attachments: [{ name: 'График', axis_y: [datasetObject.oil[0], datasetObject.pwr[0]] }],
            stats: [['Отчет', ShablonName],
            ['Объект', ObjectName],
            ['Начало интервала', this.converterTimes(this.requestParams.timeInterval[0])],
            ['Конец интервала', this.converterTimes(this.requestParams.timeInterval[1])]],
            tables: [],
            row: []
        }

        globalChartData.background_regions.push({ color: 'f2a974', id: 'chart_engine', name: 'Зажигание', regions: engin })
        if (travel.length !== 0) {
            globalChartData.tables.push({
                name: 'unit_travel',
                label: 'Поездки',
                header: ['Начало', 'Местоположение', 'Конец', 'Местоположение', 'Длительность', 'Пробег', 'Ср. скорость', 'Макс. скорость', 'Расход', 'Ср. расход на 100км'],
                total: [this.converterTimes(travel[0][0][0]), travel[0][0][1], this.converterTimes(travel[travel.length - 1][1][0]), travel[travel.length - 1][1][1],
                this.formatTime(ItogSummaryTravel.duration),
                `${ItogSummaryTravel.distance.toFixed(2)} км.`,
                `${ItogSummaryTravel.averageSpeed.toFixed(0)} км.ч`,
                `${ItogSummaryTravel.maxSpeed} км/ч`,
                `${ItogSummaryTravel.oil.toFixed(0)} л.`,
                `${ItogSummaryTravel.averageRashod.toFixed(1)} л.`]
            });
            globalChartData.row.push(rowsTravel)
            globalChartData.stats.push(['Пробег в поездках', `${ItogSummaryTravel.distance.toFixed(2)} км.`])
            globalChartData.stats.push(['Расход в поездках', `${ItogSummaryTravel.oil.toFixed(1)} л.`])
            globalChartData.stats.push(['Средний расход в поездках на 100км', `${ItogSummaryTravel.averageRashod} л.`])
            globalChartData.background_regions.push({ color: 'f7f488', id: 'chart_travel', name: 'Поездки', regions: travel })
        }
        if (motohours.length !== 0) {
            globalChartData.tables.push({
                name: 'unit_moto', label: 'Моточасы', header: ['Начало', 'Местоположение', 'Конец', 'Местоположение', 'Моточасы'],
                total: [this.converterTimes(motohours[0][0][0]), motohours[0][0][1],
                this.converterTimes(motohours[motohours.length - 1][1][0]), motohours[motohours.length - 1][1][1],
                this.formatTime(motoAll)]
            });
            globalChartData.row.push(rowsMoto)
            globalChartData.stats.push(['Моточасы', this.formatTime(motoAll)])
            globalChartData.stats.push(['Время полезной работы', this.formatTime(workingTime)])
            globalChartData.markers.push(xtimeMoto)
            globalChartData.background_regions.push({ color: '94f2a4', id: 'chart_moto', name: 'Моточасы', regions: motohours })
        }
        if (prostoy.length !== 0) {
            globalChartData.tables.push({
                name: 'unit_prostoy',
                label: 'Простои',
                header: ['Начало', 'Местоположение', 'Конец', 'Местоположение', 'Время простоя на холостом ходу', 'Расход на холостом ходу'],
                total: [this.converterTimes(prostoy[0][0][0]), prostoy[0][0][1], this.converterTimes(prostoy[prostoy.length - 1][1][0]), prostoy[prostoy.length - 1][1][1], this.formatTime(prostoyAll), `${oilAllRashod} л.`]
            });
            globalChartData.row.push(rowsProstoy)
            globalChartData.stats.push(['Простои', this.formatTime(prostoyAll)])
            globalChartData.stats.push(['Расход на холостом ходу', `${oilAllRashod} л.`])
            globalChartData.markers.push(xtimeProstoy)
            globalChartData.background_regions.push({ color: '90c1f0', id: 'chart_prostoy', name: 'Простои', regions: prostoy })
        }
        if (gasStations.length !== 0) {
            const allOil = gasStations.reduce((acc, el) => {
                acc += el.valueOil
                return acc
            }, 0)
            globalChartData.tables.push({
                name: 'unit_gasStation',
                label: 'Заправки',
                header: ['Начало', 'Конец', 'Местоположение', 'Нач. уровень', 'Кон. уровень', 'Заправлено'],
                total: ['---', '---', '---', `${gasStations[0].startOilValue} л.`, `${gasStations[gasStations.length - 1].finishOilValue} л.`, `${allOil} л.`]
            });
            globalChartData.row.push(rowsOil)
            globalChartData.stats.push(['Заправки', `${allOil} л.`])
            globalChartData.markers.push(xtimepOil)
        }
        if (fuelDrain.length !== 0) {
            const allOil = fuelDrain.reduce((acc, el) => {
                acc += el.valueOil
                return acc
            }, 0)
            globalChartData.tables.push({
                name: 'unit_fuelDrain',
                label: 'Сливы',
                header: ['Начало', 'Конец', 'Местоположение', 'Нач. уровень', 'Кон. уровень', 'Слито'],
                total: ['---', '---', '---', `${fuelDrain[0].startOilValue} л.`, `${fuelDrain[fuelDrain.length - 1].finishOilValue} л.`, `${allOil} л.`]
            });
            globalChartData.row.push(rowsOilDrain)
            globalChartData.stats.push(['Сливы', `${allOil} л.`])
            globalChartData.markers.push(xtimepDrain)
        }
        updatedData.forEach((el, i) => {
            const y = Object.values(el)[0].reduce((acc, e) => {
                acc.push(e.y)
                return acc
            }, [])
            globalChartData.datasets = { ...globalChartData.datasets, [i]: { name: datasetObject[Object.keys(el)[0]][0], y_axis: i, color: datasetObject[Object.keys(el)[0]][1], data: { x: time, y: y } } }
        })
        console.log(globalChartData)

        return globalChartData
    }

    xtimesOil(data) {
        const res = data.reduce((acc, e) => {
            const diff = e.valueOil
            acc.push({ x: e.timeStart, start: this.converterTimesTooltip(e.timeStart), value: diff })
            return acc
        }, [])

        return res
    }
    xtimes(data) {
        const res = data.reduce((acc, e) => {
            const diff = this.formatTime(e[1][0] - e[0][0])
            const start = this.converterTimesTooltip(e[0][0])
            const finish = this.converterTimesTooltip(e[1][0])
            acc.push({ x: e[0][0], duration: diff, str: `${start} - ${finish}` })
            return acc
        }, [])
        return res
    }

    diff(data, num) {
        let res;
        if (!num) {
            res = data.reduce((acc, el) => {
                const diff = el[1][0] - el[0][0]
                acc = acc + diff
                return acc
            }, 0)
        }
        else {
            res = data.reduce((acc, el) => {
                const diff = el[0][2] - el[1][2]
                acc = acc + (diff > 0 ? diff : 0)
                return parseFloat(acc.toFixed(1))
            }, 0)
        }
        return res
    }
    calculate(data, ifPwr, nameReports) {
        let res = []
        if (!ifPwr) {
            return res
        }
        else {
            if (nameReports === 'Моточасы') {
                res = data.reduce((acc, e) => {
                    if (e.pwr > ifPwr) {
                        if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0 && acc[acc.length - 1][0].pwr > ifPwr) {
                            acc[acc.length - 1].push(e);
                        } else {
                            acc.push([e]);
                        }
                    } else if (e.pwr <= ifPwr && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                        acc.push([]);
                    }
                    return acc;
                }, []).filter(el => el.length > 0).reduce((acc, el) => {
                    if (el[el.length - 1].x - el[0].x > 0) {
                        acc.push([[el[0].x, el[0].geo, el[0].oil], [el[el.length - 1].x, el[el.length - 1].geo, el[el.length - 1].oil]])
                    }

                    return acc
                }, [])
            }
            if (nameReports === 'Зажигание') {
                res = data.reduce((acc, e) => {
                    if (e.engine === 1) {
                        if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0 && acc[acc.length - 1][0].engine === 1) {
                            acc[acc.length - 1].push(e);
                        } else {
                            acc.push([e]);
                        }
                    } else if (e.engine === 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                        acc.push([]);
                    }
                    return acc;
                }, []).filter(el => el.length > 0).reduce((acc, el) => {
                    acc.push([[el[0].x, el[0].geo], [el[el.length - 1].x, el[el.length - 1].geo]])
                    return acc
                }, [])
            }
            if (nameReports === 'Скорость') {
                const uniqueData = Array.from(new Set(data.map(item => item.x))).map(x => data.find(item => item.x === x));
                const rr = [];
                let num = 0;
                for (let i = 0; i < uniqueData.length - 1; i++) {
                    const distance = this.calculateDistance(data[i].geo[0], data[i].geo[1], data[i + 1].geo[0], data[i + 1].geo[1]);
                    if (uniqueData[i].speed !== 0 && uniqueData[i].sats > 4 && uniqueData[i].pwr > ifPwr) {
                        uniqueData[i].distance = num
                        if (Array.isArray(rr[rr.length - 1]) && rr[rr.length - 1].length > 0) {
                            rr[rr.length - 1].push(uniqueData[i]);
                            num += distance
                        } else {
                            rr.push([uniqueData[i]]);
                        }
                    } else if (uniqueData[i].speed === 0 && uniqueData[i].sats > 4) {
                        rr.push([]);
                        num = 0
                    }
                }
                const rest = rr.filter(el => el.length > 0)
                res = rest.reduce((acc, el) => {
                    const maxSpeed = el.reduce((max, current) => {
                        return Math.max(max, current.speed);
                    }, 0);
                    const totalSpeed = el.reduce((sum, current) => {
                        return sum + current.speed;
                    }, 0);
                    const averageSpeed = totalSpeed / el.length;
                    const duration = this.formatTime(el[el.length - 1].x - el[0].x)
                    const distance = el.length > 1 ? (el[el.length - 1].distance - el[0].distance) : el[0].distance
                    const diff = el[el.length - 1].x - el[0].x
                    const deltaOil = el[0].oil - el[el.length - 1].oil
                    const rashod = deltaOil < 0 ? 0 : deltaOil

                    if (diff > 90 && distance > 0.15) {
                        acc.push([[el[0].x, el[0].geo, el[0].oil], [el[el.length - 1].x, el[el.length - 1].geo, el[el.length - 1].oil], {
                            distance: parseFloat(distance.toFixed(2)),
                            maxSpeed: maxSpeed, averageSpeed: parseFloat(averageSpeed.toFixed(0)), duration: duration, rashod: rashod
                        }])
                    }
                    return acc
                }, [])
            }
            if (nameReports === 'Простои') {
                res = data.reduce((acc, e) => {
                    if (e.pwr > ifPwr && e.speed === 0 && e.sats > 4) {
                        if (Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length > 0
                            && acc[acc.length - 1][0].pwr > ifPwr && acc[acc.length - 1][0].speed === 0 && acc[acc.length - 1][0].sats > 4) {
                            acc[acc.length - 1].push(e);
                        } else {
                            acc.push([e]);
                        }
                    } else if (e.pwr <= ifPwr && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                        || e.speed > 0 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0
                        || e.sats > 4 && Array.isArray(acc[acc.length - 1]) && acc[acc.length - 1].length !== 0) {
                        acc.push([]);
                    }
                    return acc;
                }, []).filter(el => el.length > 0).reduce((acc, el) => {
                    if (el[el.length - 1].x - el[0].x > 600) {
                        acc.push([[el[0].x, el[0].geo, el[0].oil], [el[el.length - 1].x, el[el.length - 1].geo, el[el.length - 1].oil]])
                    }
                    return acc
                }, [])
            }
            return res
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        function toRadians(degrees) {
            return degrees * (Math.PI / 180);
        }
        const R = 6371; // радиус Земли в километрах
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // расстояние между точками в километрах
        return distance;
    }

    async requstModel(idw) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const mod = await fetch('/api/modelView', params)
        const model = await mod.json()
        const ifPwr = model.result[0] && model.result[0].tsiControll ? model.result[0].tsiControll : false
        return ifPwr
    }



    calculateOilUp(data) {
        const increasingIntervals = [];
        let start = 0;
        let end = 0;
        for (let i = 0; i < data.length - 1; i++) {
            const currentObj = data[i];
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

        const zapravkaAll = increasingIntervals.filter((interval, index) => {
            const firstOil = interval[0].oil;
            const lastOil = interval[interval.length - 1].oil;
            const difference = lastOil - firstOil;
            const threshold = firstOil * 0.15;
            if (index < increasingIntervals.length - 1) {
                const nextInterval = increasingIntervals[index + 1];
                const currentTime = interval[interval.length - 1].x;
                const nextTime = nextInterval[0].x;
                const timeDifference = nextTime - currentTime;
                if (timeDifference < 5 * 60 * 1000) {
                    interval.push(nextInterval[nextInterval.length - 1]);
                    interval.splice(1, 1)
                }
            }
            return firstOil > 5 && difference > 40 && difference >= threshold;
        });
        const oilUpArray = zapravkaAll.reduce((acc, el) => {
            const diff = el[1].oil - el[0].oil
            acc.push({ timeStart: el[0].x, timeFinish: el[1].x, geo: el[0].geo, startOilValue: parseFloat(el[0].oil.toFixed(0)), finishOilValue: parseFloat(el[1].oil.toFixed(0)), valueOil: parseFloat(diff.toFixed(0)) })
            return acc
        }, [])

        return oilUpArray
    }


    calculateOilSliv(data) {
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
                const currentTime = interval[interval.length - 1].x;
                const nextTime = nextInterval[0].x;
                const timeDifference = nextTime - currentTime;
                if (timeDifference < 5 * 60) {
                    interval.push(nextInterval[nextInterval.length - 1]);
                    interval.splice(1, 1)
                }
            }
            const timeDifference = interval[interval.length - 1].x - interval[0].x;
            return timeDifference < 300 && lastOil > 5 && difference > 40 && difference >= threshold;
        });
        const oilUpArray = slivAll.reduce((acc, el) => {
            const diff = el[0].oil - el[1].oil
            acc.push({ timeStart: el[0].x, timeFinish: el[1].x, geo: el[0].geo, startOilValue: parseFloat(el[0].oil.toFixed(0)), finishOilValue: parseFloat(el[1].oil.toFixed(0)), valueOil: parseFloat(diff.toFixed(0)) })
            return acc
        }, [])
        return oilUpArray
    }
}




