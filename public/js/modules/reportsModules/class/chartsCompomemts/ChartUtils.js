
import { Helpers } from '../Helpers.js'

export class ChartUtils {


    static createTooltipRect(arrayTool) {

        const text = arrayTool.map(e => {
            const value = e.local === '' ? Helpers.timesFormat(e.value) : e.value
            const local = e.local === '' ? 'чч:мм' : e.local
            return `<div class="row_report_tooltip">
            <div class="elem_tooltip color_line_tooltip" style="height:20px; background-color: ${e.color};"></div>
             <div class="elem_tooltip name_line_tooltip" style="min-width:100px">${e.name}</div>
             <div class="elem_tooltip value_line_tooltip">${value} ${local}</div>
            </div>`
        }).join('')


        return `<div class="body_report_tooltip">${text}</div>`
    }
    static createTooltip(chartGroup, container, data, x) {
        // Выбираем тултип, если он уже существует
        let tooltip = d3.select('[data-chart-id="' + container + '"]').select('.tooltip_reports');

        // Если тултип не существует, создаем его
        if (tooltip.empty()) {
            tooltip = d3.select('[data-chart-id="' + container + '"]').append('div')
                .attr("class", `tooltip_reports ${container}`)
                .style("opacity", 0) // Изначально скрываем tooltip
                .style("display", "none"); // Задаем display: none
        }

        chartGroup
            .on("mousemove", (event) => {
                const [xPosition, yPosition] = d3.mouse(chartGroup.node());
                let text;

                if (d3.event.target.classList.contains('icon_image_reports')) {
                    const time = d3.event.target.id;
                    const value = d3.event.target.getAttribute('rel');
                    const type = d3.event.target.getAttribute('type');
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
    static createAxis(scale, orientation, svg, type) {

        if (type) {
            return orientation === 'left' ? d3.axisLeft(scale) : d3.axisBottom(scale);
        }
        else {
            if (orientation === 'left') {
                const axis = d3.axisLeft(scale)
                return axis
            }
            else { //разбиваем строку чтобы сделать перенос если ширина текста превышает порог
                const axis = d3.axisBottom(scale);
                return function (g) {
                    g.call(axis)
                    svg.selectAll(".tick text")
                        .style("text-anchor", "middle")
                        .attr("dy", "0.5em")
                        .each((d, i, nodes) => { // Используем each, чтобы обработать каждый элемент text отдельно
                            const text = d3.select(nodes[i]);
                            const words = text.text().split(/\s+/); // Разбиваем текст на слова
                            text.text(null); // Очищаем исходный текст

                            let lineNumber = 0;
                            const lineHeight = 1.2; // ems, Adjust as needed
                            const y = text.attr("y");
                            const dy = parseFloat(text.attr("dy"));

                            let tspan = text.append("tspan")
                                .attr("x", 0)
                                .attr("y", y)
                                .attr("dy", dy + "em")
                                .style("text-anchor", "middle"); // Ensure text is centered

                            let line = [];
                            // console.log(words)
                            for (let i = 0; i < words.length; i++) {
                                const word = words[i];
                                line.push(word);
                                tspan.text(line.join(" "));

                                if (line.length > 2) {
                                    // Если строка слишком длинная и содержит больше одного слова
                                    line.pop(); // Удаляем последнее слово
                                    tspan.text(line.join(" ")); // Обновляем текст tspan
                                    lineNumber++; // Переходим на новую строку
                                    tspan = text.append("tspan")
                                        .attr("x", 0)
                                        .attr("y", y)
                                        .attr("dy", (lineNumber * lineHeight) + dy + "em") // Смещаем новую строку вниз
                                        .style("text-anchor", "middle")
                                        .text(word); // Добавляем последнее слово на новую строку
                                    line = [word]; // Начинаем новую строку
                                }
                            }
                        });
                };
            }
        }
    }

}


