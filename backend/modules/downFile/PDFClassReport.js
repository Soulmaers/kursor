const pdfmake = require('pdfmake/build/pdfmake');
// const { PdfMakeWrapper } = require('pdfmake-wrapper');
const vfsFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs')
const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const path = require('path'); // Подключаем модуль path
const { createCanvas } = require('canvas');
const ChartOil = require('./ChartOil')
const TravelToDay = require('./TravelToDay')

class PDFClassReports {
    constructor(nameObjects, nameReports, data, filePath) {
        //  console.log(nameObjects)
        // console.log(nameReports)
        //  console.log(data)
        this.imagePath = path.join(__dirname, './assets/logo_reports.png'); // Создаем абсолютный путь к файлу
        this.data = data
        this.filePath = filePath
        this.nameReports = nameReports
        this.nameObjects = nameObjects
        this.pdfDocuments = [];
        this.typeTitleReports = ['Статистика', 'Компонентный', 'Графический']
        this.count = 0
        this.title = ['Начальное местоположение', 'Местоположение', 'Конечное местоположение']
        this.pageNumberMap = {};
        this.styles = fs.readFileSync(path.join(__dirname, './report.css'), 'utf-8');
        this.image = `data:image/png;base64,${fs.readFileSync(this.imagePath, 'base64')}`;
    }




    async init() {

        this.pdfDoc = await PDFDocument.create();
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-dev-shm-usage'],
            ignoreHTTPSErrors: true,
            protocolTimeout: 180_000, // <-- общий протокольный таймаут Puppeteer (3 мин)
        });
        const page = await browser.newPage();
        //  console.log(page)
        console.time('сборка')
        await this.buildHTML(page); // ← передаём page внутрь
        console.timeEnd('сборка')
        await browser.close();
        await this.savePDF();
        return this.filePath;
    }



    createPageStatistika() {
        //  console.log(this.data[0])
        const title = this.data[0]['Статистика'][1].result
        const titleTable = 'Статистика'
        const rows = this.data[0]['Статистика'].map(e => {
            return `<tr><td class="left_stat">${e.name}</td> 
            <td class="right_stat"> ${e.result || 'Н/Д'} ${e.local || ''}</td> 
             </tr>`
        }).join('')
        return `
          <html>
            <head>
                <style>${this.styles}</style>
            </head>
            <body class="body_pdf"><div class="statistika_page">
      <div class="name_object">${title}</div>
      <div class="name_component">${titleTable}</div>
         <table class="statistika_table">
                           <tbody>
                ${rows}
              </tbody>
            </table>
      </div>
          </body>
        </html>`
    }
    createRowComponentTitle(key, e) {
        return `
                    <div class="title_type title_component_sub">
                        <div class="component_title">${key}</div>
                              <div class="dashes"></div>
                <div class="title_number">${this.pageNumberMap[e + key] || '?'}</div>
                                          </div>
                `;
    }



    createPageStart() {
        const startTime = this.data[0]['Статистика'][2].result.slice(0, 8)
        const endTime = this.data[0]['Статистика'][3].result.slice(0, 8)
        const titleTypeReports = this.typeTitleReports.map((e, index) => {
            if (index === 0) {
                return `
            <div class="title_type first">
                <div class="title_name">${e}</div>
                <div class="dashes"></div>
                <div class="title_number">${this.pageNumberMap[e] || '?'}</div>
            </div>
        `;
            } else {
                const componentsBlock = Object.keys(this.data[index])
                    .map(key => {
                        const rawList = this.data[index][key];
                        const filtered = this.trueAttributes(rawList); // отфильтровали только checked
                        if (!filtered || filtered.length === 0) return ''; // если ничего — пропускаем
                        return this.createRowComponentTitle(key, e)
                    })
                    .join('');
                return `<div class="next"><div class="title_name">${e}</div>${componentsBlock}</div>`;
            }
        }).join('');

        return `
        <html>
            <head>
                <style>${this.styles}</style>
            </head>
            <body class="body_pdf">
                             <div class="header_logo"><img class="img_logo" src="${this.image}" /></div>
                             <div class="title_container_meta">
                             <div class="row_meta"><div class="title_meta">Отчет:</div><div class="body_meta">${this.nameReports}</div></div>
                             <div class="row_meta"><div class="title_meta">Начало/Конец:</div><div class="body_meta">
                             ${startTime} / ${endTime}</div></div>
                            <div class="row_meta"><div class="title_meta">Объекты:</div><div class="body_meta">${this.nameObjects.join(', ')}</div></div>
                             </div>
                <div class="contant_title">${titleTypeReports}</div>
                                                         
                          </body>
        </html>
        `;
    }

    createComponent(data, key) {
        const componentBorder = ['Поездки', 'Простои на холостом ходу', 'Стоянки', 'Остановки', 'Учёт топлива'].includes(key)
        const titleObject = this.data[0]['Статистика'][1].result
        const titleGroup = this.data[0]['Статистика'][0].result
        const landscape = key === 'Стоянки' || key === 'Остановки' ? false : true
        const titleComponent = data.map(elem => `<th class="colums">${elem.name}</th>`).join('');
        //   console.log(data)
        if (!data[0].result) {
            console.error(`Нет данных для компонента: ${key}`);
            return {
                html: `
                 <html>
            <head>
                <style>${this.styles}</style>
            </head>
            <body class="body_pdf">
                       <div class="page_component">
                <div class="head_meta"><div class="nadpis">${titleObject}</div><div class="nadpis">${titleGroup}</div><div class="name_component">${key}</div></div>
                <table class="components_table">
                    <thead><tr>${titleComponent}</tr></thead>
                  
                </table>
                        </div>                                     
                          </body>
        </html>     `, landscape: landscape
            }

        }
        const tableBody = data[0]?.result.map((el, index) => {
            if (el.length === 0) return ''; // Возвращаем пустую строку вместо null

            const cell = data.map(it => {
                const classleft = this.title.includes(it.name) ? 'left_stat' : ''
                const isLastRow = index === data[0].result.length - 1; // Проверяем, является ли это последней строкой
                const cellClass = isLastRow && componentBorder ? 'last-row-cell' : '';
                return `<td class="${classleft} ${cellClass}">${it.result[index] || '-'}</td>`
            }).join('');
            return `<tr>${cell}</tr>`;
        }).join('') || ''; // Обработка случая, когда data[0]?.result пуст

        return {
            html: `
                 <html>
            <head>
                <style>${this.styles}</style>
            </head>
            <body class="body_pdf">
                       <div class="page_component">
                <div class="head_meta"><div class="nadpis">${titleObject}</div><div class="nadpis">${titleGroup}</div><div class="name_component">${key}</div></div>
                <table class="components_table">
                    <thead><tr>${titleComponent}</tr></thead>
                    <tbody>${tableBody}</tbody>
                </table>
                        </div>                                     
                          </body>
        </html>     `, landscape: landscape
        }

    }

    async createChart(data, key) {
        if (key === 'Поездки по дням') {
            const renderer = new TravelToDay(data);
            const charts = await renderer.renderChartImageBase64();
            const pages = [];
            for (let i = 0; i < charts.length; i += 2) {
                const pageCharts = charts.slice(i, i + 2);
                const imagesHtml = pageCharts.map(chart => `
                <div class="chart_oil">
                    <img src="data:image/png;base64,${chart.base64}" />
                              </div>
            `).join('');

                const html = `
                <html><head>
             <style>${this.styles}</style>
                                  
                </head>
                <body class="body_pdf">
                  <div class="page_component">
                    <div class="head_meta chart_head_meta">
                     <div class="name_component">${i === 0 ? key : ''}</div>
                    </div>
                </div>
                </div>
                    ${imagesHtml}
                                    </div>
                </body>
              </html>
            `;

                pages.push({ html, landscape: true, sectionTitle: `${this.typeTitleReports[2]}${key}` });
            }

            return pages;
        }
        // Default for other keys
        else if (key === 'Учёт топлива') {
            const renderer = new ChartOil(data);
            await renderer.saveChartHtml(path.join(__dirname, 'debug_chart.html'));
            const chartImageBase64 = await renderer.renderChartImageBase64();

            if (!chartImageBase64) return;
            return [{
                html: `<html><head><style>${this.styles}</style></head>
            <body class="body_pdf">
              <div class="page_component">
                <div class="head_meta chart_head_meta">
                  <div class="name_component">${key}</div>
                </div>
                <div class="chart_oil">
                  <img src="data:image/png;base64,${chartImageBase64}" />
                </div>
                ${this.renderChartsLegend(key)}
              </div>
            </body></html>`,
                landscape: true,
                sectionTitle: `${this.typeTitleReports[2]}${key}`
            }];
        }
        else {
            return [{
                html: `<html><head><style>${this.styles}</style></head>
            <body class="body_pdf">
              <div class="page_component">
                <div class="head_meta chart_head_meta">
                  <div class="name_component">${key}</div>
                </div>
                <div class="chart_oil">
                                </div>
                ${this.renderChartsLegend(key)}
              </div>
            </body></html>`,
                landscape: true,
                sectionTitle: `${this.typeTitleReports[2]}${key}`
            }];
        }
    }

    async buildHTML() {
        console.log('тута')
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const pagesToRender = [];

        // собираем все страницы
        pagesToRender.push({ html: this.createPageStatistika(), landscape: false, sectionTitle: 'Статистика' });
        for (let key in this.data[1]) {
            const data = this.trueAttributes(this.data[1][key]);
            if (!data || data.length === 0 || key === 'Техническое обслуживание') continue;
            if (key === 'Пробеги') data.pop();
            const component = this.createComponent(data, key);
            pagesToRender.push({ ...component, sectionTitle: this.typeTitleReports[1] + key });
        }
        /*   for (let key in this.data[2]) {
               console.log(key)
               const data = this.trueAttributes(this.data[2][key]);
               if (!data || data.length === 0) continue;
               const components = await this.createChart(data, key);
               if (Array.isArray(components)) {
                   components.forEach(c => pagesToRender.push(c));
               } else {
                   pagesToRender.push(components);
               }
           }*/
        console.log(pagesToRender)
        // генерим страницы параллельно
        const pdfBuffers = await Promise.all(pagesToRender.map(async (pageConfig) => {
            const page = await browser.newPage();
            await page.setContent(pageConfig.html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                landscape: pageConfig.landscape,
                margin: { top: '5mm', bottom: '10mm', left: '5mm', right: '5mm' },
                footerTemplate: `...`,
                headerTemplate: `<div></div>`
            });

            await page.close();
            return { pdfBuffer, sectionTitle: pageConfig.sectionTitle };
        }));

        await browser.close();

        // копируем страницы в итоговый pdf
        for (const { pdfBuffer, sectionTitle } of pdfBuffers) {
            const doc = await PDFDocument.load(pdfBuffer);
            this.pageNumberMap[sectionTitle] = this.pdfDoc.getPageCount() + 1;
            const copied = await this.pdfDoc.copyPages(doc, doc.getPageIndices());
            copied.forEach(p => this.pdfDoc.addPage(p));
        }

        // создаём оглавление
        const tocHtml = this.createPageStart();
        const tocPage = await puppeteer.launch({ args: ['--no-sandbox'] }).then(async b => {
            const p = await b.newPage();
            await p.setContent(tocHtml);
            const buf = await p.pdf({ format: 'A4', printBackground: true });
            await b.close();
            return buf;
        });

        const tocDoc = await PDFDocument.load(tocPage);
        const tocPages = await this.pdfDoc.copyPages(tocDoc, tocDoc.getPageIndices());
        const totalPages = this.pdfDoc.getPageCount();
        this.pdfDoc.insertPage(0, tocPages[0]);
    }

    async savePDF() {
        const pdfBytes = await this.pdfDoc.save();
        fs.writeFileSync(this.filePath, pdfBytes);
    }
    trueAttributes(obj) {
        const res = obj.filter(e => e.checked === true).map(it => it)
        return res
    }


    renderChartsLegend(types) {
        // console.log(types)
        let containers;
        if (types === 'Учёт топлива') {

            const arrayTitle = [{
                title: 'Заправки:',
                icon: '<div class="wrap_icon" rel="Заправка"><i class="fas fa-gas-pump" style="color:green"></i></div>'
            },
            {
                title: 'Сливы:',
                icon: '<div class="wrap_icon"  rel="Слив"><i class="fas fa-fill-drip  " style="color:red"></i></div>'
            }, {
                title: 'Уровень топлива:',
                icon: '<div class="rect_legend" rel="lineOil"></div>'
            }, {
                title: 'Поездки:',
                icon: '<div class="rect_legend" rel="Движение" style="background-color:rgb(183,170,14)"></div>'
            }, {
                title: 'Моточасы:',
                icon: '<div class="rect_legend" rel="Работа двигателя" style="background-color:rgb(255,209,215)"></div>'
            }]
            containers = arrayTitle.map(e => {
                return `<div class="uniqum_legend"><div class="title_legend">${e.title}</div>${e.icon}</div>`


            }).join('')
        }
        if (types === 'Моточасы') {
            const arrayTitle = [{
                title: 'Движение:',
                icon: '<div class="rect_legend_moto" rel="Движение" style="background-color:#8fd14f">Движение</div><div class="info_window" rel="Движение"></div>'
            },
            {
                title: 'Парковка:',
                icon: '<div class="rect_legend_moto" rel="Парковка" style="background-color:#3399ff">Парковка</div><div class="info_window" rel="Парковка"></div>'
            }, {
                title: 'Повёрнут ключ зажигания:',
                icon: '<div class="rect_legend_moto" rel="Повёрнут ключ зажигания:" style="background-color:#fef445">Повёрнут ключ зажигания</div><div class="info_window" rel="Повёрнут ключ зажигания"></div>'
            }, {
                title: 'Работа на холостом ходу:',
                icon: '<div class="rect_legend_moto" rel="Работа на холостом ходу" style="background-color:#f24726">Работа на холостом ходу</div><div class="info_window" rel="Работа на холостом ходу"></div>'
            }]
            containers = arrayTitle.map(e => {
                return `<div class="uniqum_legend">${e.icon}</div>`


            }).join('')
        }
        if (types === 'СКДШ') {
            const arrayTitle = [{
                title: 'Низкое:',
                icon: '<div class="rect_legend_moto skdsh_leg" rel="Низкое">Низкое:</div><div class="info_window skdsh_leg value_tool_skdah" rel="Низкое"></div>'
            },
            {
                title: 'Ниже нормы:',
                icon: '<div class="rect_legend_moto skdsh_leg" rel="Ниже нормы">Ниже нормы:</div><div class="info_window skdsh_leg value_tool_skdah" rel="Ниже нормы"></div>'
            }, {
                title: 'Нормальное:',
                icon: '<div class="rect_legend_moto skdsh_leg" rel="Нормальное">Нормальное:</div><div class="info_window skdsh_leg value_tool_skdah" rel="Нормальное"></div>'
            }, {
                title: 'Выше нормы:',
                icon: '<div class="rect_legend_moto skdsh_leg" rel="Выше нормы">Выше нормы:</div><div class="info_window skdsh_leg value_tool_skdah" rel="Выше нормы"></div>'
            },
            {
                title: 'Высокое:',
                icon: '<div class="rect_legend_moto skdsh_leg" rel="Высокое">Высокое:</div><div class="info_window skdsh_leg value_tool_skdah" rel="Высокое"></div>'
            },
            {
                title: 'Всего:',
                icon: '<div class="rect_legend_moto skdsh_leg" rel="Всего">Всего:</div><div class="info_window skdsh_leg value_tool_skdah" rel="Всего"></div>'
            },
            {
                title: 'Максимальное:',
                icon: '<div class="rect_legend_moto skdsh_leg" rel="Максимальное">Максимальное:</div><div class="info_window skdsh_leg value_tool_skdah" rel="Максимум"></div>'
            }]
            containers = arrayTitle.map(e => {
                return `<div class="uniqum_legend">${e.icon}</div>`


            }).join('')
        }


        return `<div class="legend_container"><div class="title_legend">${types === 'СКДШ' ? '' : 'Легенда'}</div>
        <div class="body_legend">${containers}
        </div></div>`
    }
}


module.exports = PDFClassReports



