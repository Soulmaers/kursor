
const fs = require('fs')
const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const path = require('path'); // Подключаем модуль path
const { renderChartsLegend } = require('./renderChartsLegend')
const { createRowComponentTitle, createHeaderLowPages, createHeaderLowGroupAndObjectPages, pageStart, pageStatic, pageNavi, pageComponents } = require('./generationHTML')
const { addPageNumbers, addTocLinks, trueAttributes } = require('./servisNumberNavgationPages')
const { chartRegistry, renderDefault } = require('./chartRegistrary');

class PDFClassReports {
    constructor(nameObjects, nameReports, data, filePath) {
        this.imagePath = path.join(__dirname, './assets/logo_kursor.png'); // Создаем абсолютный путь к файлу
        this.imagePathLogoMini = path.join(__dirname, './assets/logo_mini.png');
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
        this.imageLogoMini = `data:image/png;base64,${fs.readFileSync(this.imagePathLogoMini, 'base64')}`;
    }




    async init() {
        this.pdfDoc = await PDFDocument.create();
        await this.buildHTML();   // он сам внутри поднимет браузер один раз
        addTocLinks(this.pdfDoc, this.pageNumberMap, this.data, this.typeTitleReports);             // ← добавили кликабельные переходы внутри PDF
        await addPageNumbers(this.pdfDoc);
        await this.savePDF();
        return this.filePath;
    }



    createPageStatistika() {
        const group_name = this.data[0]['Статистика'][0].result
        const object_name = this.data[0]['Статистика'][1].result
        const titleTable = 'СТАТИСТИКА'
        const header = createHeaderLowPages(titleTable, this.imageLogoMini)
        const low_header = createHeaderLowGroupAndObjectPages(group_name, object_name)
        const rows = this.data[0]['Статистика'].map(e => {
            return `<tr><td class="left_stat">${e.name}</td> 
            <td class="right_stat"> ${e.result || 'Н/Д'} ${e.local || ''}</td> 
             </tr>`
        }).join('')
        return pageStatic(this.styles, header, low_header, rows)
    }

    createPageStart() {
        const startTime = this.data[0]['Статистика'][2].result.slice(0, 8)
        const endTime = this.data[0]['Статистика'][3].result.slice(0, 8)
        const titleGroup = [this.data[0]['Статистика'][0].result]
        return pageStart(this.styles, this.image, this.nameReports, startTime, endTime, titleGroup, this.nameObjects)
    }

    createNavigationPages(sectionStartIndexes) {
        const titleTypeReports = this.typeTitleReports.map((e, index) => {
            if (index === 0) {
                return `
            <div class="title_type first">
                <div class="title_name">${e}</div>
                <div class="dashes"></div>
                <div class="title_number">${sectionStartIndexes[e] || '?'}</div>
            </div>
            `;
            } else {
                const componentsBlock = Object.keys(this.data[index])
                    .map(key => {
                        const rawList = this.data[index][key];
                        const filtered = trueAttributes(rawList); // отфильтровали только checked
                        if (!filtered || filtered.length === 0) return ''; // если ничего — пропускаем
                        return createRowComponentTitle(key, e, sectionStartIndexes)
                    })
                    .join('');
                return `<div class="next"><div class="title_name">${e}</div>${componentsBlock}</div> `;
            }
        }).join('');

        const header = createHeaderLowPages('ОГЛАВЛЕНИЕ', this.imageLogoMini)
        return pageNavi(this.styles, header, titleTypeReports)
    }




    createComponent(data, key) {
        const componentBorder = ['Поездки', 'Простои на холостом ходу', 'Стоянки', 'Остановки', 'Учёт топлива'].includes(key)
        const titleObject = this.data[0]['Статистика'][1].result
        const titleGroup = this.data[0]['Статистика'][0].result
        const landscape = key === 'Стоянки' || key === 'Остановки' ? false : true

        const width = landscape ? '100%' : '50%'
        const titleComponent = data.map(elem => `<th class="colums"> ${elem.name}</th >`).join('');
        //  console.log(key.toUpperCase())
        const header = createHeaderLowPages(key.toUpperCase(), this.imageLogoMini)
        const low_header = createHeaderLowGroupAndObjectPages(titleGroup, titleObject)
        //  console.log(header)
        if (!data[0].result) {
            console.error(`Нет данных для компонента: ${key} `);
            return pageComponents(this.styles, header, low_header, titleComponent, landscape, width)

        }
        const tableBody = data[0]?.result.map((el, index) => {
            if (el.length === 0) return ''; // Возвращаем пустую строку вместо null

            const cell = data.map(it => {
                const classleft = this.title.includes(it.name) ? 'left_stat' : ''
                const isLastRow = index === data[0].result.length - 1; // Проверяем, является ли это последней строкой
                const cellClass = isLastRow && componentBorder ? 'last-row-cell' : '';
                return `<td class="${classleft} ${cellClass}" > ${it.result[index] || '-'}</td > `
            }).join('');
            return `<tr>${cell}</tr>`;
        }).join('') || ''; // Обработка случая, когда data[0]?.result пуст

        return pageComponents(this.styles, header, low_header, titleComponent, landscape, width, tableBody)

    }

    // простой лимитер параллелизма (без доп. библиотек)
    pLimit(concurrency) {
        const queue = [];
        let activeCount = 0;
        const next = () => {
            activeCount--;
            if (queue.length > 0) {
                const fn = queue.shift();
                fn();
            }
        };
        return (fn) =>
            new Promise((resolve, reject) => {
                const run = () => {
                    activeCount++;
                    fn().then(
                        (val) => { resolve(val); next(); },
                        (err) => { reject(err); next(); }
                    );
                };
                if (activeCount < concurrency) run();
                else queue.push(run);
            });
    }

    // единый helper: HTML → PDF Buffer
    async renderHtmlToPdf(page, html, opts = {}) {
        await page.setContent(html, { waitUntil: 'load' }); // если есть внешние ресурсы — 'networkidle0'
        await page.emulateMediaType('screen');
        return page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            landscape: !!opts.landscape,
            margin: { top: '0mm', bottom: '5mm', left: '5mm', right: '5mm' },
            displayHeaderFooter: false,
            headerTemplate: '<span></span>',
            footerTemplate: '<span></span>',
        });
    }

    async buildHTML() {
        // 0) собрать задачи
        const pagesToRender = [];

        pagesToRender.push({
            html: this.createPageStatistika(),
            landscape: false,
            sectionTitle: 'Статистика',
        });

        for (const key in this.data[1]) {
            const data = trueAttributes(this.data[1][key]);
            if (!data || data.length === 0 || key === 'Техническое обслуживание') continue;
            if (key === 'Пробеги') data.pop();

            const component = this.createComponent(data, key); // { html, landscape? }
            pagesToRender.push({
                ...component,
                sectionTitle: this.typeTitleReports[1] + key,
            });
        }
        // Чарты (если нужны)
        for (const key in this.data[2]) {
            const data = trueAttributes(this.data[2][key]);
            if (!data || data.length === 0) continue;
            const components = await this.createChart(data, key); // может вернуть один или массив
            //
            if (Array.isArray(components)) {
                components.forEach((c) =>
                    pagesToRender.push({ ...c, sectionTitle: (c.sectionTitle || key) })
                );
            } else {
                pagesToRender.push(components);
            }
        }

        // 1) один браузер на всё
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const limit = this.pLimit(8); // параллелизм: подбери под сервер

        // 2) рендерим секции параллельно (с лимитом)
        const rendered = await Promise.all(
            pagesToRender.map(({ html, landscape = false, sectionTitle }) =>
                limit(async () => {
                    const page = await browser.newPage();
                    try {
                        const pdfBuffer = await this.renderHtmlToPdf(page, html, { landscape });
                        return { sectionTitle, pdfBuffer };
                    } finally {
                        await page.close();
                    }
                })
            )
        );

        // 3) посчитаем количества страниц в каждой секции
        const sectionPageCounts = {};
        for (const { sectionTitle, pdfBuffer } of rendered) {
            const tmpDoc = await PDFDocument.load(pdfBuffer);
            sectionPageCounts[sectionTitle] = tmpDoc.getPageCount();
        }

        // 4) посчитаем будущие стартовые номера (c учётом 2 страниц оглавления)
        const TOC_PAGES = 2;
        const sectionStartIndexes = {};
        {
            let acc = TOC_PAGES; // после двух страниц TOC
            for (const { sectionTitle } of rendered) {
                sectionStartIndexes[sectionTitle] = acc + 1; // страницы с 1
                acc += sectionPageCounts[sectionTitle];
            }
        }
        // 5) отрисуем 2 страницы оглавления (TOC + навигация), зная sectionStartIndexes
        const tocHtml = this.createPageStart(sectionStartIndexes);
        const tocNaviHtml = this.createNavigationPages(sectionStartIndexes);

        const tocBuf = await (async () => {
            const p = await browser.newPage();
            try { return await this.renderHtmlToPdf(p, tocHtml); }
            finally { await p.close(); }
        })();

        const naviBuf = await (async () => {
            const p = await browser.newPage();
            try { return await this.renderHtmlToPdf(p, tocNaviHtml); }
            finally { await p.close(); }
        })();

        // 6) браузер больше не нужен
        await browser.close();

        // 7) собрать итоговый PDF: сначала 2 страницы TOC, потом все секции
        const tocDoc = await PDFDocument.load(tocBuf);
        const naviDoc = await PDFDocument.load(naviBuf);

        const copiedToc = await this.pdfDoc.copyPages(tocDoc, tocDoc.getPageIndices());
        this.pdfDoc.addPage(copiedToc[0]);

        const copiedNavi = await this.pdfDoc.copyPages(naviDoc, naviDoc.getPageIndices());
        this.pdfDoc.addPage(copiedNavi[0]);

        for (const { sectionTitle, pdfBuffer } of rendered) {
            const doc = await PDFDocument.load(pdfBuffer);
            const copied = await this.pdfDoc.copyPages(doc, doc.getPageIndices());
            copied.forEach((p) => this.pdfDoc.addPage(p));
        }

        // 8) заполним карту "секция → страница"
        this.pageNumberMap = sectionStartIndexes;
    }

    async savePDF() {
        const pdfBytes = await this.pdfDoc.save();
        fs.writeFileSync(this.filePath, pdfBytes);
    }

    async createChart(data, key) {
        const titleObject = this.data[0]['Статистика'][1].result
        const titleGroup = this.data[0]['Статистика'][0].result
        const header = createHeaderLowPages(key.toUpperCase(), this.imageLogoMini)
        const low_header = createHeaderLowGroupAndObjectPages(titleGroup, titleObject)
        const typeTitle = this.typeTitleReports[2]; // "Графический"
        const renderer = chartRegistry.get(key) || renderDefault;
        return renderer({ key, data, styles: this.styles, typeTitle, header, low_header });
    }

}


module.exports = PDFClassReports



