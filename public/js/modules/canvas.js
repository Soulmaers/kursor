import { objColors, gener } from './content.js'

//отрисовка графика скорости
/*
export function chrt1(arr, time, timeU) {
    const data = arr.map(function (i, ind) {
        return {
            speed: i,
            time: timeU[ind]

        }
    })

    alternativa(data)
    const config = {
        type: 'line',
        data: {
            datasets: [{
                data: arr,
                label: 'Скорость',
                fill: false,
                borderColor: 'green',
                yAxisID: 'left-y-axis',
                pointRadius: 1,
                borderWidth: 1,
                pointBorderWidth: 0.01,
                pointBackgroundColor: 'green'
            }],
            labels: time
        },
        options: {
            plugins: {
                datalabels: {
                    display: false,
                },
                legend: {
                    labels: {
                        font: {
                            size: 15,
                        },
                        color: 'gray'
                    }
                },

            },
            scales: {
                'left-y-axis': {
                    type: 'linear',
                    position: 'left',
                    min: 0,
                    max: 100,
                    lineWidth: 1,
                    ticks: {

                        font: {

                            size: 15,
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 1
                        }
                    }
                }
            },
        }
    };
    let chart = Chart.getChart('myChartg1'); // Pass the canvas ID
    if (chart) {
        chart.data.labels = time;
        chart.data.datasets[0].data = arr;
        chart.update();
    } else {
        new Chart('myChartg1', config)
    }

}
*/


export function alternativa(obj) {
    const newBoad = document.querySelector('.speed')
    if (newBoad) {
        newBoad.remove();
    }
    var margin = { top: 30, right: 10, bottom: 30, left: 25 },
        width = 350 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    console.log(obj)

    var svg = d3.select(".grafik1")
        .append("svg")
        .attr('class', 'speed')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width - 100)
        .attr("y", height - 150)
        .text("Скорость (км/ч)")
        .style('font-family', 'Roboto')

    const format = d3.time.format("%Y-%m-%dT%H:%M");
    const min = d3.min(obj, function (d) {
        return format.parse(d.time.slice(0, -8))
    })
    const max = d3.max(obj, function (d) {
        return format.parse(d.time.slice(0, -8))
    })
    // console.log(min)
    // console.log(max)
    const dataset = obj.map(e => {
        const obn = e.time.slice(0, -8)
        //  console.log(obn)
        return { time: format.parse(obn), speed: e.speed }
    })
    // console.log(dataset)


    var x = d3.scaleTime()
        .domain([min, max])
        .range([0, width]);
    const xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) { return +d.speed; })])
        .range([height, 0]);
    const yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    var line = svg.append('g')
        .attr("clip-path", "url(#clip)")

    // Add the line
    line.append("path")
        .datum(dataset)
        .attr("class", "line")  // I add the class line to be able to modify this line later on.
        .attr("fill", "steelblue")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.time) })
            .y(function (d) { return y(d.speed) })
        )


    // Add the brushing
    line
        .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

        // What are the selected boundaries?
        const extent = d3.event.selection

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain([4, 8])
        } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])])
            line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and line position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        line
            .select('.line')
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function (d) { return x(d.time) })
                .y(function (d) { return y(d.speed) })
            )


    }

    // If user double click, reinitialize the chart
    svg.on("dblclick", function () {
        x.domain([min, max])
        xAxis.transition().call(d3.axisBottom(x))
        line
            .select('.line')
            .transition()
            .attr("d", d3.line()
                .x(function (d) { return x(d.time) })
                .y(function (d) { return y(d.speed) })
            )

    });




    /*
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 350 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var svg = d3.select(".speedGraf")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const format = d3.time.format("%Y-%m-%dT%H:%M:%S.000Z");
    const min = d3.min(obj, function (d) {
        return format.parse(d.time)
    })
    const max = d3.max(obj, function (d) {
        return format.parse(d.time)
    })
    const dataset = obj.map(e => {
        return { time: format.parse(e.time), speed: e.speed }
    })

    var x = d3.scaleTime()
        .domain([min, max])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) { return +d.speed; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return x(d.time) })
            .y(function (d) { return y(d.speed) })
        )*/
}



const min = arr => arr.reduce((x, y) => Math.min(x, y));

export function protekGrafTwo(y1, y2, arr) {
    let number = min(arr)

    const c2 = document.getElementById("drawLine2");
    c2.width = 348
    c2.heigth = 60
    const ctx2 = c2.getContext("2d");
    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 60);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(348, y2);
    ctx2.lineTo(348, 60);
    ctx2.lineTo(0, 60);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 50);
    ctx2.lineTo(5, 50);
    ctx2.lineTo(10, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";

    ctx2.moveTo(166.5, 0);
    ctx2.lineTo(166.5 + 5, 50);
    ctx2.lineTo(166.5 + 10, 50);
    ctx2.lineTo(166.5 + 15, 0);
    //  ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(348, 50);
    ctx2.lineTo(348 - 5, 50);
    ctx2.lineTo(348 - 10, 0);
    ctx2.lineTo(348, 0);
    ctx2.fillStyle = "rgba(14, 12, 11, 1);";
    ctx2.fill();
    //  ctx2.stroke();

}



export function protekGrafThree(y1, y2, y3, arr) {
    let number = min(arr)

    const c2 = document.getElementById("drawLine2");
    const ctx2 = c2.getContext("2d");
    c2.width = 174
    c2.heigth = 60
    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 60);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(174, y2);
    ctx2.lineTo(174, 60);
    ctx2.lineTo(0, 60);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 50);
    ctx2.lineTo(5, 50);
    ctx2.lineTo(10, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    //ctx2.lineWidth = "1";
    //ctx2.strokeStyle = "#000";
    ctx2.moveTo(174, 50);
    ctx2.lineTo(174 - 5, 50);
    ctx2.lineTo(174 - 10, 0);
    ctx2.lineTo(174, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    const c3 = document.getElementById("drawLine3");
    c3.width = 174
    c3.heigth = 60
    const ctx3 = c3.getContext("2d");
    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, y2);
    ctx3.lineTo(174, y3);
    ctx3.lineTo(174, 60);
    ctx3.lineTo(0, 60);
    ctx3.fillStyle = objColors[gener(number)];
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 50);
    ctx3.lineTo(5, 50);
    ctx3.lineTo(10, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    //  ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(174, 50);
    ctx3.lineTo(169, 50);
    ctx3.lineTo(164, 0);
    ctx3.lineTo(174, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    //  ctx3.stroke();


}


export function protekGrafFour(y1, y2, y3, y4, arr) {

    let number = min(arr)

    const c2 = document.getElementById("drawLine2");
    const ctx2 = c2.getContext("2d");
    c2.width = 116
    c2.heigth = 60
    ctx2.beginPath();
    // ctx2.lineWidth = "1";
    // ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 60);
    ctx2.lineTo(0, y1);
    ctx2.lineTo(116, y2);
    ctx2.lineTo(116, 60);
    ctx2.lineTo(0, 60);
    ctx2.fillStyle = objColors[gener(number)];
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 50);
    ctx2.lineTo(5, 50);
    ctx2.lineTo(10, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(116, 50);
    ctx2.lineTo(116 - 5, 50);
    ctx2.lineTo(116 - 10, 0);
    ctx2.lineTo(116, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    const c3 = document.getElementById("drawLine3");
    const ctx3 = c3.getContext("2d");
    c3.width = 116
    c3.heigth = 60
    ctx3.beginPath();
    //  ctx3.lineWidth = "1";
    // ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, y2);
    ctx3.lineTo(116, y3);
    ctx3.lineTo(116, 60);
    ctx3.lineTo(0, 60);
    ctx3.fillStyle = objColors[gener(number)];
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 50);
    ctx3.lineTo(5, 50);
    ctx3.lineTo(10, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(116, 50);
    ctx3.lineTo(111, 50);
    ctx3.lineTo(106, 0);
    ctx3.lineTo(116, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    const c4 = document.getElementById("drawLine4");
    const ctx4 = c4.getContext("2d");
    c4.width = 116
    c4.heigth = 60
    ctx4.beginPath();
    //  ctx4.lineWidth = "1";
    //  ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, y3);
    ctx4.lineTo(116, y4);
    ctx4.lineTo(116, 60);
    ctx4.lineTo(0, 60);
    ctx4.fillStyle = objColors[gener(number)];
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(0, 50);
    ctx4.lineTo(5, 50);
    ctx4.lineTo(10, 0);
    ctx4.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(116, 50);
    ctx4.lineTo(111, 50);
    ctx4.lineTo(106, 0);
    ctx4.lineTo(116, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    // ctx4.stroke();

}




export function protekGrafFree() {
    const c2 = document.getElementById("drawLine2");
    const ctx2 = c2.getContext("2d");
    c2.width = 116
    c2.heigth = 60
    ctx2.beginPath();
    // ctx2.lineWidth = "1";
    // ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 60);
    ctx2.lineTo(0, 0);
    ctx2.lineTo(116, 0);
    ctx2.lineTo(116, 60);
    ctx2.lineTo(0, 60);
    ctx2.fillStyle = "green";
    ctx2.fill();
    // ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(0, 0);
    ctx2.lineTo(0, 50);
    ctx2.lineTo(5, 50);
    ctx2.lineTo(10, 0);
    ctx2.lineTo(0, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    ctx2.beginPath();
    ctx2.lineWidth = "1";
    ctx2.strokeStyle = "#000";
    ctx2.moveTo(116, 50);
    ctx2.lineTo(116 - 5, 50);
    ctx2.lineTo(116 - 10, 0);
    ctx2.lineTo(116, 0);
    ctx2.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx2.fill();
    //  ctx2.stroke();

    const c3 = document.getElementById("drawLine3");
    const ctx3 = c3.getContext("2d");
    c3.width = 116
    c3.heigth = 60
    ctx3.beginPath();
    //  ctx3.lineWidth = "1";
    // ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(116, 0);
    ctx3.lineTo(116, 60);
    ctx3.lineTo(0, 60);
    ctx3.fillStyle = "green";
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(0, 0);
    ctx3.lineTo(0, 50);
    ctx3.lineTo(5, 50);
    ctx3.lineTo(10, 0);
    ctx3.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    ctx3.beginPath();
    ctx3.lineWidth = "1";
    ctx3.strokeStyle = "#000";
    ctx3.moveTo(116, 50);
    ctx3.lineTo(111, 50);
    ctx3.lineTo(106, 0);
    ctx3.lineTo(116, 0);
    //ctx2.lineTo(0, 60);
    ctx3.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx3.fill();
    // ctx3.stroke();

    const c4 = document.getElementById("drawLine4");
    const ctx4 = c4.getContext("2d");
    c4.width = 116
    c4.heigth = 60
    ctx4.beginPath();
    //  ctx4.lineWidth = "1";
    //  ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(116, 0);
    ctx4.lineTo(116, 60);
    ctx4.lineTo(0, 60);
    ctx4.fillStyle = 'green'
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(0, 0);
    ctx4.lineTo(0, 50);
    ctx4.lineTo(5, 50);
    ctx4.lineTo(10, 0);
    ctx4.lineTo(0, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    //  ctx4.stroke();

    ctx4.beginPath();
    ctx4.lineWidth = "1";
    ctx4.strokeStyle = "#000";
    ctx4.moveTo(116, 50);
    ctx4.lineTo(111, 50);
    ctx4.lineTo(106, 0);
    ctx4.lineTo(116, 0);
    //ctx2.lineTo(0, 60);
    ctx4.fillStyle = 'rgba(14, 12, 11, 1)';
    ctx4.fill();
    // ctx4.stroke();

}