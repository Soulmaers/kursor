import { NaviChartLegenda } from "./NaviChartLegends.js"

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
        this.createListShablons()
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
        this.checkObjects.addEventListener('click', this.hiddenView.bind(this))
        this.checkInterval.addEventListener('click', this.hiddenView.bind(this))

        this.checkTypeFile.addEventListener('click', this.hiddenView.bind(this))
        this.file.querySelectorAll('.item_type_file').forEach(el => el.addEventListener('click', this.changeTitleRequestFile.bind(this, el)))
        this.interval.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
        this.selectObjects.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.selectShablons.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.selectinterval.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.selectTypeFile.addEventListener('mouseleave', this.hiddenListOutsideKursor.bind(this))
        this.buttons.children[1].addEventListener('click', this.requestDataTitleReport.bind(this))
    }


    async createCalendar() {
        const calendar = this.interval.nextElementSibling
        console.log(this.interval.nextElementSibling)
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
                console.log(unixTime)
                unixTime.length === 2 ? this.requestParams.timeInterval = unixTime : null
            }
        })
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

        let formattedTime = `${year}-${month}-${day}(${hours}-${minutes}-${seconds})`;
        return formattedTime
    }
    async requestDataTitleReport() {
        const titleNameReport = document.querySelectorAll('.titleNameReport')
        if (titleNameReport) {
            titleNameReport.forEach(e => e.remove())
        }

        let bool = true;
        console.log(this.requestParams)
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
        this.attachments = result.data.reportResult.attachments
        this.clearTable()
        this.createListTitleReports(this.tablesReports, this.stats, this.attachments)
        loaders.style.display = 'none'

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
            console.log(titleNameReports)
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
            this.requestChartData()
        }
        else {
            this.createTable(this.tablesReports, this.rows, el.id)
            this.checkPointerToMaps()
        }
    }

    async requestChartData() {
        const interval = this.requestParams.timeInterval
        const res = await fetch('/api/chartData', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ interval })
        })
        const chartData = await res.json()
        this.createChartToWialon(chartData)
    }



    createOsiFormat(chartData, conteiner, svg) {
        const datasets = Object.values(chartData.datasets).map(dataset => {
            // create scales for each dataset
            const xScale = d3.scaleTime()
                .domain(d3.extent(dataset.data.x, x => new Date(x * 1000)))
                .range([70, conteiner.clientWidth - 410]);

            const yScale = d3.scaleLinear()
                .domain(d3.extent(dataset.data.y, y => y))
                .range([360, 20]);

            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));
            return {
                data: dataset.data.x.map((value, i) => ({
                    x: new Date(value * 1000),
                    y: dataset.data.y[i]
                })),
                color: dataset.color.toString(16),
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
                .attr('rel', `${dataset.uniq}`)
                .attr('stroke', `#${dataset.color}`)
                .attr('stroke-width', 1.5)
                .attr('fill', 'none')

        });
    }


    createArea(set, svg, xScaleStart) {
        console.log(set)
        set.interval.forEach((region) => {
            svg.append('rect')
                .attr('x', xScaleStart(new Date(Math.round(region[0] * 1000)))) // начало интервала в формате даты
                .attr('y', 20) // отступ сверху
                .attr('class', 'areazoom')
                .attr("clip-path", "url(#clip)")
                .attr('width', xScaleStart(new Date(Math.round(region[1] * 1000))) - xScaleStart(new Date(Math.round(region[0] * 1000)))) // ширина от начала до конца интервала в пикселях
                .attr('height', 340) // высота
                .attr('rel', `${set.id}`)
                .attr('fill', `#${set.color}`) // цвет фона
                .attr('stroke', 'none'); // без рамки
        });
    }

    createMarkers(markers, svg, xScaleStart) {
        console.log(markers)
        const markersIcon = {
            8: "../../../image/ref.png",
            32: "../../../image/parking.png",
            256: "../../../image/sliv.png",
            128: "../../../image/stop.png",
            64: "../../../image/maxspeed.png",
            4: "../../../image/er.png"
        }
        svg.selectAll("image")
            .data(markers)
            .enter()
            .append("image")
            .attr('class', 'markerszoom')
            .attr("clip-path", "url(#clip)")
            .attr("x", d => xScaleStart(new Date(d.time * 1000)))
            .attr('rel', function (d) { return d.type })
            .attr("xlink:href", function (d) { return markersIcon[d.type] })
            .attr("width", 16)
            .attr("height", 16)
            .style("opacity", 1)
            .attr("transform", "translate(-8,0)")
    }


    createLegendaNavi(leg, chartData) {
        console.log(chartData)
        const markersIcon = {
            8: "../../../image/ref.png",
            32: "../../../image/parking.png",
            256: "../../../image/sliv.png",
            128: "../../../image/stop.png",
            64: "../../../image/maxspeed.png",
            4: "../../../image/er.png"
        }

        if (chartData.markers) {
            console.log(chartData.markers)
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
                divMarkers.appendChild(divfpoo)
                const image = document.createElement('div')
                image.classList.add('markers_image')
                image.style.backgroundImage = `url(${markersIcon[el.type]})`
                image.setAttribute('rel', el.type)
                divfpoo.appendChild(image)


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
                i.setAttribute('rel', el.y_axis)
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
        const leg = document.createElement('div')
        leg.classList.add('legenda_navi')
        this.reports_module.lastElementChild.children[1].children[0].appendChild(leg)
        const graf = document.createElement('div')
        graf.classList.add('chart_to_wialon')
        this.reports_module.lastElementChild.children[1].children[0].appendChild(graf)
        const titleOsisY = this.attachments[0].axis_y
        const conteiner = this.reports_module.lastElementChild.children[1].children[0]
        conteiner.style.display = 'flex'
        conteiner.style.justifyContent = 'space-around'
        conteiner.style.alignItems = 'center'

        this.createLegendaNavi(leg, chartData)





        const svg = d3.select(".chart_to_wialon")
            .append("svg")
            .attr("width", conteiner.clientWidth - 300)
            .attr("height", 390)

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", conteiner.clientWidth - 480) // or the width of your chart area
            .attr("height", 390)// or the height of your chart area
            .attr('x', 70)
            .attr('y', 0)
        const xScaleStart = d3.scaleTime()
            .domain(d3.extent(chartData.possitions.time, x => new Date(x * 1000)))
            .range([70, conteiner.clientWidth - 410]);

        const datasets = this.createOsiFormat(chartData, conteiner, svg)

        if (chartData.background_regions) {
            this.backgroundRegions = chartData.background_regions.reduce((acc, el) => {
                acc.push({ name: el.name, id: el.id, priority: el.priority, interval: el.regions, color: el.color.toString(16) })
                return acc
            }, [])
            this.backgroundRegions.forEach(set => {
                this.createArea(set, svg, xScaleStart)
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
                }))
            );
            this.createMarkers(this.markers, svg, xScaleStart)
        }
        svg.append("g")
            .attr("transform", `translate(0, 360)`)
            .attr('class', 'os1')
            .call(d3.axisBottom(xScaleStart)
                //  .ticks(d3.timeHour.every(1))
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%H:%M")(d);
                })
            )

        svg.append("g")
            .attr("transform", `translate(0, 370)`)
            .attr('class', 'os2')
            .call(d3.axisBottom(xScaleStart)
                //   .ticks(d3.timeHour.every(1))
                .ticks(10)
                .tickFormat(function (d) {
                    return d3.timeFormat("%d.%m")(d);
                })
            )
            .style("stroke-width", 0)



        svg.append("g")
            .attr("transform", `translate(70, 0)`)
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


    }

    zoomed(datasets, xScaleStart, svg) {
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
            svg.selectAll(`[rel='${set.id}']`)
                .data(set.interval) // Привязываем данные
                .attr('x', d => new_xScale(new Date(Math.round(d[0] * 1000)))) // Начало интервала в формате даты
                .attr('width', d => new_xScale(new Date(Math.round(d[1] * 1000))) - new_xScale(new Date(Math.round(d[0] * 1000))))
        })
        svg.selectAll(".markerszoom")
            .data(this.markers)
            .attr("x", d => new_xScale(new Date(d.time * 1000)))
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
                header.textContent = it.replace(/Total/g, 'Итого').replace(/l/g, 'л').replace(/h/g, 'ч').replace(/km/g, 'км').replace(/days/g, 'д.');
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
        console.log(stats)
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
        console.log('тут?????')
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
            const li = document.createElement('li')
            li.classList.add('titleNameReport')
            li.setAttribute('id', 'chart')
            li.textContent = this.attachments[0].name
            this.titleReports.appendChild(li)
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
            this.requestParams.idObject = null
            this.requestParams.idResourse = el.getAttribute('rel')
            this.requestParams.idShablon = el.getAttribute('data-attribute')
            const unitsAndGroup = el.getAttribute('data-ct')
            this.object.style.display = 'block'
            const container = this.object.children[0].lastElementChild
            const title = this.object.querySelector('.titleChange_list_name')
            title.textContent = title.getAttribute('rel')
            Array.from(container.children).forEach(t => t.remove())
            if (unitsAndGroup === 'avl_unit') {
                this.createListObjects()
            }
            else {
                this.createListGroup()
            }
            this.object.querySelectorAll('.item_type').forEach(el => el.addEventListener('click', this.checkChoice.bind(this, el)))
        }
        if (el.parentNode.parentNode.parentNode.classList.contains('object')) {
            this.requestParams.idObject = el.getAttribute('rel')
        }
        if (el.parentNode.parentNode.parentNode.classList.contains('interval_reports')) {
            const time = this.getTimeInterval(el.lastElementChild.textContent)
            this.requestParams.timeInterval = time
            this.interval.nextElementSibling.children[0].value = ''
        }
    }
    clearParams(el) {
        console.log(el)
        if (el.parentNode.parentNode.parentNode.classList.contains('shablons')) {
            console.log('тут веджь?')
            this.requestParams.idResourse = null
            this.requestParams.idShablon = null
            this.object.style.display = 'none'
        }
        if (el.parentNode.parentNode.parentNode.classList.contains('object')) {
            this.requestParams.idObject = null

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


    createListGroup() {
        const container = this.object.children[0].lastElementChild
        Array.from(this.groups).forEach(e => {
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
            p.textContent = e.getAttribute('rel')
            li.setAttribute('rel', e.id)
        });
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
                li.setAttribute('data-ct', obj[key].ct)
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
}




