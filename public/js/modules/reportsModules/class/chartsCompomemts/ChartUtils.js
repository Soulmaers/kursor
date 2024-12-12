
import { Helpers } from '../Helpers.js'

export class ChartUtils {


    static createTooltipRect(arrayTool) {

        const text = arrayTool.map(e => {
            const value = e.local === '' ? Helpers.timesFormat(e.value) : e.value
            const local = e.local === '' ? 'чч:мм' : e.local
            return `<div class="row_report_tooltip">
            <div class="elem_tooltip color_line_tooltip" style="height:20px; background-color: ${e.color};"></div>
             <div class="elem_tooltip name_line_tooltip" style="width:100px">${e.name}</div>
             <div class="elem_tooltip value_line_tooltip">${value} ${local}</div>
            </div>`
        }).join('')


        return `<div class="body_report_tooltip">${text}</div>`
    }
    static createTooltip(chartGroup, container, data, x) {
        const tooltip = d3.select('[data-chart-id="' + container + '"]').append('div')
            .attr("class", `tooltip_reports ${container}`)
            .style("opacity", 0) // Изначально скрываем tooltip
            .style("display", "none"); // Задаем display: none

        chartGroup
            .data(data[0].result)
            .on("mousemove", (event) => {
                console.log(d3.event.target)
                const [xPosition, yPosition] = d3.mouse(chartGroup.node());
                let text;

                if (d3.event.target.classList.contains('icon_image_reports')) {
                    const time = d3.event.target.id
                    const value = d3.event.target.getAttribute('rel')
                    const type = d3.event.target.getAttribute('type')
                    text = `<div class="text_refill_drain">Время:${time}  ${type}: ${value} л.</div>`;
                } else {
                    text = ChartUtils.findTimeAndContentReturn(x, xPosition, data);
                }

                tooltip
                    .style("opacity", .9)
                    .style("display", "block");
                tooltip.html(`${text}`)
                    .style("left", xPosition < 24 ? `${xPosition + 80}px` : (xPosition > 1314 ? `${xPosition - 240}px` : `${xPosition + 40}px`))
                    .style("top", yPosition <= 241 ? `${yPosition + 55}px` : `${yPosition - 35}px`);
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0)
                    .style("display", "none");
            });
    }


    static findTimeAndContentReturn(xScale, xPosition, data) {
        const numberArray = data[0].result.map(e => Number(e)); // Убедитесь, что это массив временных меток
        const date = xScale.invert(xPosition);
        const timestamp = Math.floor(date.getTime() / 1000); // Получаем timestamp в секундах
        const bisect = d3.bisector(d => d).left; // Используем d => d для сравнения значений
        const i = bisect(numberArray, timestamp);
        const d0 = numberArray[i - 1];
        const d1 = numberArray[i];
        const res = (timestamp - d0 > d1 - timestamp) ? d1 : d0;
        const index = numberArray.indexOf(res)
        const { timeString, dateString } = Helpers.formatUnixTime(res)
        const headerHTML = `<div class="header_tooltip_report"><span>${timeString}</span><span>${dateString}</span></div>`
        const arrayTool = data.filter(e => e.checked && e.chartType === 'line')

        const text = arrayTool.map(e => `<div class="row_report_tooltip">
            <div class="elem_tooltip color_line_tooltip" style="background-color: ${e.color};"></div>
             <div class="elem_tooltip name_line_tooltip">${e.name}</div>
             <div class="elem_tooltip value_line_tooltip">${e.result[index]} литров</div>
            </div>`).join('')
        return `${headerHTML}<div class="body_report_tooltip">${text}</div>`
    }
    // Метод для создания линии
    static createLine(data, time, xScale, yScale, color, strokeWidth, pref) {
        let line;
        if (pref) {
            line = d3.line()
                .x(d => xScale(new Date(d.dates)))
                .y((d) => yScale(+d.tvalue || 0))
                .curve(d3.curveLinear);

        }
        else {
            line = d3.line()
                .x((d, i) => xScale(new Date(Number(time[i]) * 1000)))
                .y((d) => yScale(+d || 0))
                .curve(d3.curveLinear);

        }

        return {
            path: line(data),
            color: color,
            strokeWidth: strokeWidth
        };
    }

    // Метод для создания области
    static createArea(data, xScale, yScale, color) {
        const area = d3.area()
            .x(d => xScale(new Date(d.dates)))
            .y0(yScale(0)) // Задаем нижнюю границу области (обычно 0)
            .y1((d) => yScale(+d.value || 0))
            .curve(d3.curveStep);

        return {
            path: area(data),
            color: color
        };
    }

    //  метод для создания прямоугольников
    static createRect(data, xScale, height, color, strokeWidth) {
        const startTime = new Date(Number(data[0].time) * 1000); // Время начала
        const endTime = new Date(Number(data[1].time) * 1000); // Время конца

        // Вычисляем координаты и размеры прямоугольника
        const xStart = xScale(startTime);
        const xEnd = xScale(endTime);
        const width = xEnd - xStart; // Ширина прямоугольника
        return {
            xStart: xStart,
            width: width,
            height: height,
            color: color,
            strokeWidth: strokeWidth
        };
    }

    static createRectSecond(data, xScale, color, strokeWidth) {
        return {
            xStart: xScale(data),
            width: 70,
            height: data,
            color: color,
            strokeWidth: strokeWidth
        };
    }

    // Метод для создания оси
    static createAxis(scale, orientation, height) {
        const axis = (orientation === 'left') ? d3.axisLeft(scale) : d3.axisBottom(scale);
        return axis;
    }
}


