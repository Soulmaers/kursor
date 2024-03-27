
const connection = require('../config/db')
const wialonService = require('../services/wialon.service.js')
const databaseService = require('../services/database.service');

exports.spisok = async (req, res) => {
    const idw = req.body.idw
    const datas = req.body.uniqData
    if (datas) {
        const promises = datas.map(async (idw) => {
            const nameSensors = await databaseService.loadParamsViewList(idw.nameCar, Number(idw), idw); //получение основных данных по объектам из БД
            return { result: nameSensors, idw };
        });
        try {
            const result = await Promise.all(promises);
            res.json({ res: result, id: idw });
        } catch (err) {
            console.error(err);
            res.status(500).send("Произошла ошибка");
        }
    }
    else {
        const result = await databaseService.loadParamsViewList(idw, idw);
        res.json(result)
    }


}

exports.wialonObjects = async (req, res) => {
    const params = await databaseService.getWialonObjects() //получение всех объектов wialon из БД
    res.json(params)
}
exports.wialonObjectsId = async (req, res) => {
    const idw = req.body.idw
    const params = await databaseService.getWialonObjectsId(idw) //получение объектов wialon по id из БД
    res.json(params)
}

exports.fileDown = async (req, res) => { //создание файла pdf отчета
    const pdfmake = require('pdfmake/build/pdfmake');
    // const { PdfMakeWrapper } = require('pdfmake-wrapper');
    const vfsFonts = require('pdfmake/build/vfs_fonts');
    const fs = require('fs')
    const path = require('path'); // Подключаем модуль path

    const data = req.body.stats
    const titleReports = req.body.titleNameReports
    const tables = req.body.tables
    const rows = req.body.rows
    const tabl = tables.reduce((acc, e, i) => {
        const row = rows[i].reduce((acc, it) => {
            acc.push(it.c.map(el => {
                return el.t ? el.t : el
            }))
            return acc
        }, [])
        const arr = []
        arr.push(e.header)
        arr.push(...row)
        arr.push(e.total)
        acc.push({ table: arr, label: e.label })
        return acc
    }, [])
    const nameReport = data[0][1]
    pdfmake.vfs = vfsFonts.pdfMake.vfs;

    const imagePath = path.join(__dirname, 'g1.png'); // Создаем абсолютный путь к файлу
    const createPDF = (data, filePath) => {

        const docDefinition = {
            pageSize: {
                width: 600, // ширина страницы в пикселях (A4 размер)
                height: 842 // высота страницы в пикселях (A4 размер)
            },
            pageMargins: [20, 20, 20, 20], // отступы со всех сторон (левый, верхний, правый, нижний)
            headers: (currentPage, pageCount) => {
                return {
                    text: currentPage,
                    alignment: 'center',
                    fontSize: 10
                };
            },
            content: [
                {
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 560,//pageSize.width - 200,
                            h: 46,
                            color: '#061c47',  // устанавливаем цвет фона
                        }
                    ]
                },
                {
                    image: `data:image/png;base64,${fs.readFileSync(imagePath, 'base64')}`,
                    width: 30,
                    style: 'images',
                },
            ],
            styles: {
                header: {
                    fontSize: 15,
                    margin: [0, 40, 0, 10],
                    color: '#061c47'
                },
                tables: {
                    margin: [180, 0, 80, 0],
                },
                images: {
                    margin: [10, -40, 0, 0],
                },
                reportName: {
                    fontSize: 17,
                    bold: true,
                    margin: [0, -30, 0, 0],
                    color: '#fff'
                }
            },

            footer: (currentPage, pageCount) => {
                return {
                    text: `Page ${currentPage} of ${pageCount}`,
                    alignment: 'center',
                    fontSize: 10
                };
            },
        };
        docDefinition.pageNumber = {}
        docDefinition.content.push({ text: nameReport, style: 'reportName', alignment: 'center' })
        titleReports.forEach((e, index,) => {
            docDefinition.content.push({ text: e, linkToPage: 2, margin: index === 0 ? [0, 30, 0, 0] : [0, 2, 0, 0], fontSize: 10, color: '#061c47', width: 50 })
        })
        docDefinition.content.push({ text: 'Статистика', style: 'header', alignment: 'center' },
            {
                columns: [
                    { width: '*', text: '' },
                    {
                        width: 'auto',
                        table: {
                            body: data,
                            fontSize: 2,
                            alignment: "center"
                        }
                    },
                    { width: '*', text: '' },
                ]
            })
        //background: (currentPage, pageCount) => { console.log(currentPage) }
        tabl.forEach(e => {
            const count = e.table[0].length;
            const width = e.table[0].map((e, i) => {
                if (count > 6) {
                    return i === 1 || i === 3 ? 60 : 45;
                } else {
                    return 500 / count;
                }
            });

            //   docDefinition.background = (currentPage, pageCount) => { console.log(e) }
            docDefinition.content.push({ text: e.label, alignment: 'center', margin: [0, 30, 0, 10], pageBreak: 'before' });
            docDefinition.content.push({
                columns: [
                    { width: '*', text: '' },
                    {
                        width: 'auto',
                        table: {
                            widths: [...width],
                            body: e.table.map((row, i) => row.map(cell => ({
                                text: cell, fontSize: 9, alignment: 'center',
                                fillColor: i == 0 ? '#061c47' : (i == e.table.length - 1 ? '#ede6e6' : null),
                                bold: i === 0 ? true : false,
                                color: i == 0 ? '#fff' : null
                            }))),
                            headerRows: 1,
                            verticalAlignment: 'start',
                            alignment: 'center',
                        },
                    },
                    { width: '*', text: '' },
                ],
            });
        });
        const pdfDoc = pdfmake.createPdf(docDefinition);
        pdfDoc.getBase64((data) => {
            const buffer = Buffer.from(data, 'base64');
            // Сохранение файла PDF
            require('fs').writeFileSync(filePath, buffer);
        });
    };
    const filePath = path.join(__dirname, `rep.pdf`);
    createPDF(data, filePath);
    console.log(filePath)
    const file = fs.createReadStream(filePath)
    res.setHeader('Content-Type', `application/pdf`);
    res.setHeader('Content-Disposition', `attachment; filename=filename.pdf`);
    file.pipe(res);
};

exports.shablons = async (req, res) => {
    const data = await wialonService.getAllShablonsToWialon() //получание шаблонов отчетов wialona
    res.json(data)
}
exports.titleShablon = async (req, res) => {
    const idResourse = req.body.idResourse
    const idShablon = req.body.idShablon
    const idObject = req.body.idObject
    const interval = req.body.interval
    const data = await wialonService.getTitleShablonToWialon(idResourse, idShablon, idObject, interval) //получение названий заголовков отчетом wialona
    res.json(data)
}

exports.quantityLogs = async (req, res) => {
    const login = req.body.login;
    const data = await databaseService.quantityFindToBase(login) // получени счетчика прочитанных логов из БД
    res.json(data)
}

// В контроллере:
exports.file = async (req, res) => {
    const format = req.body.format
    const formatToWialon = req.body.formatToWialon
    const fs = require('fs');
    const data = await wialonService.getFileReportsToWialon(format, formatToWialon) // это путь к PDF файлу //получание файла отчета pdf wialona
    const file = fs.createReadStream(data)
    res.setHeader('Content-Type', `application/${format}`);
    res.setHeader('Content-Disposition', `attachment; filename=filename.${format}`);
    file.pipe(res);
}

exports.chartData = async (req, res) => {
    const interval = req.body.interval
    const idChart = req.body.att
    const data = await wialonService.getChartDatatToWialon(interval, idChart) //получаем данные для отрисовки графика в отчету wialona
    res.json(data)
}


exports.getEventMarkers = async (req, res) => {
    const id = req.body.id
    const t1 = req.body.nowDate
    const t2 = req.body.timeFrom
    const result = await wialonService.getEventFromToDayWialon(id, t1, t2)
    res.json(result)
}