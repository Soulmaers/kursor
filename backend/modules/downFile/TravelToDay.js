const fs = require('fs');
const puppeteer = require('puppeteer');


const path = require('path');

const scriptContent = fs.readFileSync(path.join(__dirname, 'travelFunc.js'), 'utf-8');

class TravelToDay {
    constructor(chartData) {
        this.chartData = chartData;
    }

    async renderChartImageBase64() {
        const monthDataArray = this.processFunc();
        const results = [];

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

        for (let i = 0; i < monthDataArray.length; i++) {
            const html = this._generateHtml(monthDataArray[i], i);

            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const element = await page.$('.chart_travel');

            if (!element) {
                console.warn(`⚠️ Элемент .chart_travel не найден для месяца ${monthDataArray[i].month}`);
                await page.close();
                continue;
            }

            const base64 = await element.screenshot({ encoding: 'base64' });
            results.push({ month: monthDataArray[i].month, base64 });
            await page.close();
        }

        await browser.close();
        return results;
    }

    async saveChartHtml(filePath) {
        const html = this._generateHtml();
        fs.writeFileSync(filePath, html, 'utf-8');
        //  console.log(`⚠️ Сохранён debug HTML: ${filePath}`);
    }

    processFunc() {
        // console.log(this.chartData)
        const date = (this.chartData.filter(e => e.name === 'Начало').map(e => (e.result)))[0]
        const mileage = (this.chartData.filter(e => e.name === 'Пробег').map(e => (e.result)))[0]

        // Формируем массив объектов с датой и пробегом
        const chartData = date.map((d, i) => ({
            date: d,
            mileage: mileage[i]
        }));

        // Группируем по месяцам
        const groupedByMonth = {};

        chartData.forEach(item => {
            const [day, month, year] = item.date.split(".");
            const monthKey = `${month}.${year}`; // пример: '05.2025'

            if (!groupedByMonth[monthKey]) {
                groupedByMonth[monthKey] = [];
            }

            groupedByMonth[monthKey].push(item);
        });

        // Преобразуем объект в массив
        const monthlyChartData = Object.entries(groupedByMonth).map(([month, data]) => ({
            month,
            data
        }));

        return monthlyChartData

    }

    _generateHtml(monthEntry, index) {
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; font-family: sans-serif; }
    .chart_travel { width: 1200px; height: 300px; margin-bottom: 30px; }
  </style>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div class="chart_travel" id="chart_${index}"></div>
  <script>
    window.chartData = ${JSON.stringify(monthEntry.data)};
    window.chartContainerId = "chart_${index}";
  </script>
  <script>
    ${scriptContent}
  </script>
</body>
</html>
    `;
    }
}

module.exports = TravelToDay;