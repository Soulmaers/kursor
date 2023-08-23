
const login = document.querySelectorAll('.log')[1].textContent

export async function getStat() {
    const group = Array.from(document.querySelectorAll('.groups'))
    const ids = group.map(el => {
        return Array.from(el.children[1].children).map(it => it.id)
    }).flat()
    const result = await Promise.all(ids.map(async el => {
        return waitArrProtek(el)
    })
    )
    dashDav(result)
}

async function waitArrProtek(el) {
    const idw = el
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw, login }))
    }
    const resParams = await fetch('/api/parametrs', param)
    const resultParams = await resParams.json()
    const speed = resultParams.item && resultParams.item.pos && (typeof resultParams.item.pos.s === 'number' && resultParams.item.pos.s !== null) ? resultParams.item.pos.s.toFixed(0) : null;
    const parama = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const vals = await fetch('/api/viewStatus', parama)
    const val = await vals.json()
    const statusTSI = val.result.length !== 0 && val.result[0].status !== '-' ? val.result[0].status : 'undefined'
    const statusIng = val.result.length !== 0 ? val.result[0].statusIng : 'undefined'
    const nameCar = val.result.length !== 0 ? val.result[0].nameCar : 'undefined'
    const dashObject = {
        id: idw,
        nameCar: nameCar,
        params: [speed, statusTSI, statusIng]
    }
    return dashObject
}


function dashDav(arr) {
    //   console.log(arrg)
    // const arr = arrg.filter(item => item.nameCar !== null && item.params[0] !== null && item.params[1] !== null && item.params[2] !== null)
    const length = arr.length
    const color = {
        1: [],
        2: [],
        3: [],
        4: []

    }
    arr.forEach(el => {
        color[generStat(el.params)].push(el.nameCar)
    })
    function generStat(el) {
        let generatedValue;

        if (Number(el[0]) > 0) {
            generatedValue = 3;
        }
        if (Number(el[0]) === 0 && el[1] === 'ВЫКЛ') {
            generatedValue = 1;
        }
        if (Number(el[0]) === 0 && el[2] === 'ВКЛ') {
            generatedValue = 2;
        }
        if (el[0] === 'undefined') {
            generatedValue = 4;
        }
        if (el[1] === 'undefined') {
            generatedValue = 4;
        }
        if (el[2] === 'undefined') {
            generatedValue = 4;
        }
        return generatedValue;
    };
    const resultRed = Math.round(color[1].length / arr.length * 100);
    const resultOrange = Math.round(color[2].length / arr.length * 100);
    const resultYellow = Math.round(color[3].length / arr.length * 100);
    const resultGray = Math.round(color[4].length / arr.length * 100);
    const arrD = [[resultRed, 'Стоят', color[1]], [resultOrange, 'Стоят с зажиганием', color[2]], [resultYellow, 'Движутся', color[3]], [resultGray, 'Нет данных', color[4]]];
    const arrDC = [color[1].length, color[2].length, color[3].length, color[4].length];
    newBoard(arrD, arrDC, length)
}

function newBoard(ArrD, ArrDC, length) {
    const newBoad = document.querySelector('.axis2')
    if (length === 0) {
        newBoad.style.opacity = 0;
        return
    }
    const mass = [];
    mass.push(length)
    if (newBoad) {
        newBoad.remove();
    }
    const data = [];
    for (let i = 0; i < ArrD.length; i++) {
        data.push({ nameCar: ArrD[i][2], browser: ArrD[i][1], rate: ArrD[i][0], value: ArrDC[i] })
    }
    console.log(data)
    const height = 350,
        width = 300,
        margin = 30
    const colorScale = d3.scaleOrdinal()
        .domain(['Стоят', 'Стоят с зажиганием', 'Движутся', 'Нет данных'])
        .range(['lightblue', 'red', 'lightgreen', 'gray']);
    // задаем радиус
    const radius = Math.min(width - 2 * margin, height - 2 * margin) / 2.5;
    console.log(radius)
    // создаем элемент арки с радиусом
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(40);
    const pie = d3.pie()
        .sort(null)
        .value(function (d) { return d.rate; });
    const svg = d3.select(".stat").append("svg")
        .attr("class", "axis2")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + (width / 2) + "," + (height / 2) + ")");

    const g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .style('position', 'relative')
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return colorScale(d.data.browser); });
    g.append("text")
        .attr("transform", function (d) {
            console.log(arc.centroid(d)[0])
            if (arc.centroid(d)[0] != NaN) {
                return "translate(" + arc.centroid(d) + ")";
            }
        })
        .style("text-anchor", "middle")
        .style('font-size', '1rem')
        .text(function (d) {
            if (d.data.rate !== 0) {
                return d.data.rate + "%"
            }

        });
    g.append("text")
        .attr("transform", function (d) {
            const val = arc.centroid(d)
            const ar1 = parseFloat(val[0])
            const ar2 = parseFloat(val[1] + 15)
            const m = [];
            m.push(ar1, ar2)
            console.log(m[0])
            if (m[0] != NaN) {
                return "translate(" + m + ")";
            }
        })
        .style("text-anchor", "middle")
        .style('font-size', '1rem')

    const legendTable = d3.select(".stat").select('svg').append("g")
        .attr("transform", "translate(0, 10)")
        .attr("class", "legendTable");
    var legendas = legendTable.selectAll(".legendas")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "legendas")
        .attr("transform", function (d, i) {
            var translate = "translate(0," + (i * 15) + ")";
            return translate;
        });
    legendas.append("rect")
        .attr("x", width - 30)
        .attr("y", 4)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d) { return colorScale(d.data.browser); });

    legendas.append("text")
        .attr("x", width - 44)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('font-size', '0.9rem')
        .text(function (d) { return d.data.browser; });

    legendas.append("text")
        .attr("x", width - 4)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style('font-size', '0.9rem')
        .text(function (d) { return d.data.value; });

    var g2 = svg.append("g")
        .attr("transform", function (d, i) {
            return "translate(0,0)";
        });

    g2.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 45)
        .style('fill', 'white')
        .style('stroke', 'black')
    g2.append("text")
        .data(mass)
        .attr("x", 0)
        .attr("y", 5)
        .style('font-size', '1.5rem')
        .style("text-anchor", "middle")
        .text(function (d) { return d });


    const tool = document.createElement('div')
    tool.classList.add('toolpss')
    const stat = document.querySelector('.stat')
    stat.appendChild(tool)

    const tooltip = d3.select(".toolpss");

    g.on("mouseover", function (d, i) {
        tooltip.selectAll("*").remove();
        console.log(d.data.nameCar.length)
        for (let i = 0; i < d.data.nameCar.length; i++) {
            tooltip.append("div").text(`${d.data.nameCar[i]}`);
        }
        tooltip
            .style("display", "block")
            .style("left", `${d3.event.pageX}px`)
            .style("top", `${d3.event.pageY}px`);
    });

    g.on("mousemove", function (d, i) {
        tooltip
            .style("left", `${d3.event.pageX}px`)
            .style("top", `${d3.event.pageY}px`);
    });

    g.on("mouseout", function (d, i) {
        tooltip.style("display", "none");
    });
}


