const fs = require('fs');
const puppeteer = require('puppeteer');


const path = require('path');

const scriptContent = fs.readFileSync(path.join(__dirname, 'oilFunc.js'), 'utf-8');

class ChartOil {
    constructor(chartData) {
        this.chartData = chartData;
    }

    async renderChartImageBase64() {
        const html = this._generateHtml();

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'networkidle0' });

        const element = await page.$('.chart_oil');

        if (!element) {
            //  console.error('❌ Элемент .chart_oil не найден!');
            await page.screenshot({ path: 'debug_no_chart_oil.png' });
            await browser.close();
            return undefined;
        }

        const screenshot = await element.screenshot({ encoding: 'base64' });
        // console.log('✅ Скриншот base64 длина:', screenshot?.length);

        await browser.close();
        return screenshot;
    }

    async saveChartHtml(filePath) {
        const html = this._generateHtml();
        fs.writeFileSync(filePath, html, 'utf-8');
        //  console.log(`⚠️ Сохранён debug HTML: ${filePath}`);
    }

    _generateHtml() {

        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; font-family: sans-serif; }
    .chart_oil { width: 1100px; height: 500px; }
  </style>
  <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
  <div class="chart_oil" style="position: relative;"></div>
  <script>
    window.chartData = ${JSON.stringify(this.chartData)};
     window.iconRefillBase64 = "${fs.readFileSync(path.join(__dirname, 'assets/ref.png'), 'base64')}";
  window.iconDrainBase64 = "${fs.readFileSync(path.join(__dirname, 'assets/drain.png'), 'base64')}";

  </script>
  <script>
    ${scriptContent}
  </script>
</body>
</html>
`;
    }
}

module.exports = ChartOil;