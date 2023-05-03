
export function grafikStartPress() {
    console.log('Работаем')
    // Определяем размеры графика
    var margin = { top: 80, right: 30, bottom: 20, left: 110 },
        width = 750 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(".infoGraf")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //read data
    d3.csv("https://raw.githubusercontent.com/zonination/perceptions/master/probly.csv", function (data) {

        // Get the different categories and count them
        var categories = data.columns
        var n = categories.length

        // Add X axis
        var x = d3.scaleLinear()
            .domain([-10, 140])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Create a Y scale for densities
        var y = d3.scaleLinear()
            .domain([0, 0.4])
            .range([height, 0]);

        // Create the Y axis for names
        var yName = d3.scaleBand()
            .domain(categories)
            .range([0, height])
            .paddingInner(1)
        svg.append("g")
            .call(d3.axisLeft(yName));

        // Compute kernel density estimation for each column:
        var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
        var allDensity = []
        for (let i = 0; i < n; i++) {
            const key = categories[i]
            const density = kde(data.map(function (d) { return d[key]; }))
            allDensity.push({ key: key, density: density })
        }

        // Add areas
        svg.selectAll("areas")
            .data(allDensity)
            .enter()
            .append("path")
            .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
            .datum(function (d) { return (d.density) })
            .attr("fill", "#69b3a2")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(function (d) { return x(d[0]); })
                .y(function (d) { return y(d[1]); })
            )

    })

    // This is what I need to compute kernel density estimation
    function kernelDensityEstimator(kernel, X) {
        return function (V) {
            return X.map(function (x) {
                return [x, d3.mean(V, function (v) { return kernel(x - v); })];
            });
        };
    }
    function kernelEpanechnikov(k) {
        return function (v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }

}

/*// Задаем ширину и высоту графика
var width = 800;
var height = 400;

// Создаем SVG элемент
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Задаем отступы и размеры осей
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var plotWidth = width - margin.left - margin.right;
var plotHeight = height - margin.top - margin.bottom;
var xAxisHeight = 20;
var yAxisWidth = 40;

// Задаем диапазон и область значений для осей
var x = d3.scaleLinear()
  .range([0, plotWidth])
  .domain([0, 100]);

var y = d3.scaleLinear()
  .range([plotHeight, 0])
  .domain([0, 1]);

// Создаем оси
var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

// Создаем группу для графика
var plot = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Загружаем данные
d3.csv("data.csv", function(data) {

  // Группируем данные по годам
  var groups = d3.nest()
    .key(function(d) { return d.year; })
    .entries(data);

  // Извлекаем список годов
  var years = groups.map(function(d) { return d.key; });

  // Задаем шкалу цветов
  var color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(years);

  // Задаем шаблон для линий на графике
  var area = d3.area()
    .x(function(d) { return x(d.value); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y1); })
    .curve(d3.curveCatmullRom);

  // Создаем группы для каждого года
  var yearGroups = plot.selectAll(".year")
    .data(groups)
    .enter()
    .append("g")
    .attr("class", "year")
    .attr("transform", function(d) { return "translate(0," + (years.indexOf(d.key) * (plotHeight / years.length) + xAxisHeight) + ")"; });

  // Создаем линии для каждой группы
  yearGroups.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return area(d.values); })
    .style("fill", function(d) { return color(d.key); });

  // Добавляем оси
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + plotHeight) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + xAxisHeight) + ")")
    .call(yAxis);

});*/