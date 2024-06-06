export class Crafika {
    constructor(data, nameGrafik) {
        this.pref = nameGrafik;
        this.data = data;
        this.container = document.querySelector('.analitika');
        this.protektors = null;
        this.statuss = null;
        this.object = {
            '0': 'Установлено',
            '1': 'На складе',
            '2': 'В ремонте',
            '3': 'Утилизировано'
        };
        this.objColors = {
            5: 'В норме', // зеленый
            4: 'В норме', // зеленый
            3: 'Средний', // желтый
            2: 'Умеренный', // оранжевый
            1: 'Критический'  // красный
        };

        this.init();
    }

    init() {
        this.deletNowGraf();
        this.protektors = this.data.map(e => e.ostatok);
        this.polymor();
    }

    deletNowGraf() {
        d3.select(this.container).select("svg").remove();
    }

    polymor() {
        switch (this.pref) {
            case 'sklad':
                this.statuss = this.getStruktura();
                this.createDonutChart(this.statuss, this.object, ["Установлено", "На складе", "В ремонте", "Утилизировано"], ["#87CEEB", "green", "gray", "red"], this.toggleStatus.bind(this));
                break;
            case 'install':
                this.protektors = this.getStrukturaInstall();
                this.createDonutChart(this.protektors, this.objColors, ["Критический", "Умеренный", "Средний", "В норме"], ["#FF0000", "#FF6633", "#c1bd3d", "#009933"], this.toggleStatusInstall.bind(this));
                break;
        }
    }

    getStruktura() {
        const statusCounts = this.data.reduce((acc, item) => {
            acc[item.flag_status] = (acc[item.flag_status] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(statusCounts).map(key => ({
            status: this.object[key],
            count: statusCounts[key]
        }));
    }

    getStrukturaInstall() {
        const statusCounts = this.data.reduce((acc, item) => {
            const status = this.objColors[this.gener(item.ostatok)];
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(statusCounts).map(key => ({
            status: key,
            count: statusCounts[key]
        }));
    }

    createDonutChart(data, legendMap, legendKeys, colors, toggleStatusCallback) {
        const width = 600;
        const height = 500;
        const radius = Math.min(width, height) / 2;
        const innerRadius = radius - 150;

        const color = d3.scaleOrdinal()
            .domain(legendKeys)
            .range(colors);

        const svg = d3.select(this.container)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const chartGroup = svg.append("g")
            .attr("transform", `translate(${(width / 2)}, ${height / 2})`);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const g = chartGroup.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.status));

        g.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .text(d => `(${d.data.count})`)
            .style("text-anchor", "middle")
            .style("font-size", "16px");

        g.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", "1.35em")
            .text(d => `${((d.data.count / d3.sum(data, d => d.count)) * 100).toFixed(2)}%`)
            .style("text-anchor", "middle")
            .style("font-size", "16px");

        const legendGroup = chartGroup.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(0, -${innerRadius / 2})`);

        const legend = legendGroup.selectAll(".legend-item")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(-35, ${i * 20})`);

        legend.append("rect")
            .attr("x", -9)
            .attr("width", 18)
            .attr("height", 18)
            .style("cursor", "pointer")
            .style("fill", d => data.find(s => s.status === d) ? color(d) : "white")
            .style("stroke", d => color(d))
            .on("click", d => toggleStatusCallback(d));

        legend.append("text")
            .attr("x", 12)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "14px")
            .text(d => legendMap[d] || d);
    }

    toggleStatus(status) {
        const index = this.statuss.findIndex(d => d.status === status);
        if (index > -1) {
            this.statuss.splice(index, 1);
        } else {
            const originalItem = this.getStruktura().find(d => d.status === status);
            if (originalItem) {
                this.statuss.push(originalItem);
            }
        }
        this.deletNowGraf();
        this.createDonutChart(this.statuss, this.object, ["Установлено", "На складе", "В ремонте", "Утилизировано"], ["#87CEEB", "green", "gray", "red"], this.toggleStatus.bind(this));
    }

    toggleStatusInstall(status) {
        const index = this.protektors.findIndex(d => d.status === status);
        if (index > -1) {
            this.protektors.splice(index, 1);
        } else {
            const originalItem = this.getStrukturaInstall().find(d => d.status === status);
            if (originalItem) {
                this.protektors.push(originalItem);
            }
        }
        this.deletNowGraf();
        this.createDonutChart(this.protektors, this.objColors, ["Критический", "Умеренный", "Средний", "В норме"], ["#FF0000", "#FF6633", "#c1bd3d", "#009933"], this.toggleStatusInstall.bind(this));
    }

    gener(el) {
        if (el >= 100) return 5;
        if (el >= 80) return 4;
        if (el >= 60) return 3;
        if (el >= 40) return 2;
        return 1;
    }
}