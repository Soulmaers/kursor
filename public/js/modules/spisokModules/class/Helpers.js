

export class Helpers {

    static convert = (ob) => {
        const uniq = new Set(ob.map(e => JSON.stringify(e)));
        return Array.from(uniq).map(e => JSON.parse(e));
    }

    static generDav(el, arrBar) {
        let generatedValue;
        if (el >= Number(arrBar.dnmin) && el <= Number(arrBar.dnmax)) {
            generatedValue = 3;
        }
        if (el > Number(arrBar.knd) && el <= Number(arrBar.dnmin) || el > Number(arrBar.dnmax) && el <= Number(arrBar.kvd)) {
            generatedValue = 2;
        }
        if (el <= Number(arrBar.knd) || el >= Number(arrBar.kvd)) {
            generatedValue = 1;
        }
        return generatedValue;
    };

    static coloring(shina, params, arg, osi, engine) {
        const objColorFront = {
            1: '#FF0000',
            2: '#FFFF00',
            3: '#009933',//#009933',
            5: '#fff'
        }
        if (params.result) {
            const modelUniqValues = Helpers.convert(params.result)
            arg.result.forEach((el) => {
                const matchingItem = modelUniqValues.find(item => el.params == item.pressure);
                if (matchingItem) {
                    const matchingTyre = [...shina].find(e => e.id == matchingItem.tyresdiv);
                    if (matchingTyre) {
                        const integer = el.value;
                        const backgroundStyle = engine === 0 || engine === null ? '#000' : el.status === 'false' ? 'gray' :
                            integer !== null ? objColorFront[Helpers.generDav(integer, osi.result.find(it => it.idOs == matchingItem.osNumber))] : null
                        matchingTyre.children[0].style.fill = backgroundStyle
                    }
                }
            });
        }
    }
    static convertTime(seconds) {
        var days = Math.floor(seconds / (24 * 60 * 60));
        var hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        var minutes = Math.floor((seconds % (60 * 60)) / 60);
        var remainingSeconds = seconds % 60; // Рассчитываем оставшиеся секунды

        if (days > 0) {
            return `${days} д. ${hours} ч. ${minutes} мин.`;
        } else if (hours > 0) {
            return `${hours} ч. ${minutes} мин.`;
        } else if (minutes === 0) {
            // Включаем секунды в последнее условие
            return `${minutes} мин. ${remainingSeconds} сек.`;
        }
        else {
            return `${minutes} мин.`
        }
    }

    static sorting(data) {
        // Функция для определения, является ли символ латиницей
        const isLatin = char => /^[A-Za-z]$/.test(char);

        // Функция для очистки строк: удаление лишних пробелов и перевод в верхний регистр
        const cleanString = str => str.trim().replace(/\s+/g, ' ').toLowerCase();

        // Сортировка по первой букве названий аккаунтов
        data.sort((a, b) => {
            const firstCharA = cleanString(a.name).charAt(0);
            const firstCharB = cleanString(b.name).charAt(0);

            // Определение порядка с учетом приоритета латиницы
            const aIsLatin = isLatin(firstCharA);
            const bIsLatin = isLatin(firstCharB);

            if (aIsLatin && !bIsLatin) return -1; // Латиница выше
            if (!aIsLatin && bIsLatin) return 1;  // Кириллица ниже
            return firstCharA.localeCompare(firstCharB);
        });

        // Сортировка групп внутри каждого аккаунта
        data.forEach(account => {
            // Проверка на наличие ungroupedObjects и добавление группы "Без группы"
            if (account.ungroupedObjects && account.ungroupedObjects.length > 0) {
                const noGroup = {
                    group_name: 'Без группы',
                    group_id: 'ungrouped',
                    objects: account.ungroupedObjects
                };
                account.groups.push(noGroup);
            }

            // Сортировка групп
            account.groups.sort((a, b) => {
                const firstCharGroupA = cleanString(a.group_name).charAt(0);
                const firstCharGroupB = cleanString(b.group_name).charAt(0);

                const aIsLatin = isLatin(firstCharGroupA);
                const bIsLatin = isLatin(firstCharGroupB);

                if (aIsLatin && !bIsLatin) return -1; // Латиница выше
                if (!aIsLatin && bIsLatin) return 1;  // Кириллица ниже
                return firstCharGroupA.localeCompare(firstCharGroupB);
            });

            // Сортировка объектов внутри каждой группы
            account.groups.forEach(group => {
                if (group.objects && group.objects.length > 0) {
                    group.objects.sort((a, b) => {
                        const firstCharObjectA = cleanString(a.object_name).charAt(0);
                        const firstCharObjectB = cleanString(b.object_name).charAt(0);

                        const aIsLatin = isLatin(firstCharObjectA);
                        const bIsLatin = isLatin(firstCharObjectB);

                        if (aIsLatin && !bIsLatin) return -1; // Латиница выше
                        if (!aIsLatin && bIsLatin) return 1;  // Кириллица ниже
                        return firstCharObjectA.localeCompare(firstCharObjectB);
                    });
                }
            });
        });
    }
    static updateIconsSensors(data, listItemCar, statusnew, sats, type, engine) {
        const countElem = document.querySelectorAll('.newColumn')
        let condition;
        let updatetime;

        const objCondition = {
            0: `<i class="fas fa-parking toogleIcon"rel="03g"></i>`,
            1: `<i class="fas fa-arrow-alt-circle-right toogleIcon" rel="01g"></i>`,
            2: `<i class="fas fa-pause-circle toogleIcon"rel="02g"></i>`
        }

        let oil;
        const summator = data.find(i => i.params === 'summatorOil') || null;;
        if (summator && summator.meta === 'ON') {
            oil = `${Number(summator.value).toFixed(0)} л.`
        }
        else {
            const oilValue = data.find(i => i.params === 'oil') || null;
            oil = oilValue ? oilValue.value === null || Number(oilValue.value).toFixed(0) < 1 ? 'Н/Д' : `${Number(oilValue.value).toFixed(0)} л.` : 'Н/Д';
        }

        const pwrValue = data.find(i => i.params === 'pwr') || null;;
        const pwr = pwrValue ? parseFloat(Number(pwrValue.value).toFixed(1)) : 'Н/Д';
        const meliageValue = data.find(i => i.params === 'mileage') || null;;
        const meliage = meliageValue ? `${Number(meliageValue.value).toFixed(0)} км.` : 'Н/Д';
        const speedValue = data.find(i => i.params === 'speed') || null;;
        const speed = speedValue && speedValue.value != null ? Math.round(speedValue.value) : '-';
        const lastTimeValue = data.find(i => i.params === 'last_valid_time') || null;;
        if (lastTimeValue) {
            const nowTimeInSeconds = Math.floor(Date.now() / 1000);
            const lastTimeInSeconds = Number(lastTimeValue.value);

            if (lastTimeInSeconds === 0) {
                updatetime = 'Н/Д';
            } else {
                const timeDifference = nowTimeInSeconds - lastTimeInSeconds;
                statusnew = timeDifference > 3600 ? 'ВЫКЛ' : statusnew;
                updatetime = Helpers.convertTime(timeDifference);
            }
        }

        if (speed !== '-' && (speed || speed === 0)) {
            const num = (speed > 0 && engine === 1) ? 1 : (speed === 0 && engine === 1) ? 2 : (speed === 0 && engine === 0) ? 0 : undefined;
            condition = objCondition[num]
        }

        const iconValues = {
            statusnew: [statusnew, `<i class="fas fa-satellite-dish actIcon"></i>`],
            ingine: [engine, `<i class="fas fa-key actIcon"></i>`],
            condition: [condition, condition],
            oil: [oil, oil],
            pwr: [pwr, pwr],
            sats: [sats, sats],
            type: [type, type],
            meliage: [meliage, meliage],
            lasttime: [updatetime, updatetime]
        }

        for (let i = 0; i < countElem.length; i++) {
            const newClass = countElem[i].getAttribute('rel')
            const existingCel = listItemCar.querySelector(`.newCel[rel="${newClass}"]`);

            if (!existingCel) {
                const newCel = document.createElement('div')
                newCel.classList.add('newCel')
                newCel.classList.add('newCelChange')
                newCel.setAttribute('rel', `${newClass}`)
                newClass === 'type' ? newCel.style.width = '150px' : null
                newClass === 'oil' || newClass === 'pwr' ? (countElem[i].style.width = '50px', newCel.style.width = '50px') : null
                newClass === 'type' || newClass === 'meliage' ? newCel.classList.add('newCelTextType') : null
                const classes = ['meliage', 'pwr', 'oil', 'lasttime'];
                if (classes.includes(newClass)) {
                    newCel.classList.add('rightLine');
                }
                newClass === 'lasttime' ? newCel.classList.add('newCelTimeType') : null
                newCel.innerHTML = iconValues[newClass][1]
                iconValues[newClass][0] === undefined ? newCel.innerHTML = 'Н/Д' : null
                newClass === 'statusnew' && iconValues[newClass][0] === 'ВКЛ' ? newCel.children[0].classList.add('toogleIcon') : newClass === 'statusnew' && iconValues[newClass][0] === undefined ? newCel.innerHTML = 'Н/Д' : null
                newClass === 'ingine' && iconValues[newClass][0] === 1 ? newCel.children[0].classList.add('toogleIcon') : newClass === 'ingine' && iconValues[newClass][0] === '-' ? newCel.innerHTML = 'Н/Д' : null
                newClass === 'type' && iconValues[newClass][0] === 'Тип ТС' || newClass === 'type' && iconValues[newClass][0] == undefined ? newCel.innerHTML = 'Н/Д' : null
                listItemCar.appendChild(newCel)
            }
            else {
                existingCel.innerHTML = iconValues[newClass][1];
                newClass === 'statusnew' && iconValues[newClass][0] === 'ВКЛ' ? existingCel.children[0].classList.add('toogleIcon') : newClass === 'statusnew' && iconValues[newClass][0] === undefined ? existingCel.innerHTML = 'Н/Д' : null;
                newClass === 'ingine' && iconValues[newClass][0] === 1 ? existingCel.children[0].classList.add('toogleIcon') : newClass === 'ingine' && iconValues[newClass][0] === '-' ? existingCel.innerHTML = 'Н/Д' : null;
                newClass === 'type' && iconValues[newClass][0] === 'Тип ТС' || newClass === 'type' && iconValues[newClass][0] === undefined ? existingCel.innerHTML = 'Н/Д' : null;
                iconValues[newClass][0] === undefined ? existingCel.innerHTML = 'Н/Д' : null;
            }
        }

    }

    static format(datas, num) {
        let result;
        if (num === 1) {
            // Функция для извлечения всех объектов из группы
            const res = datas.flatMap(account => [
                ...account.groups.flatMap(group => group.objects),
                ...account.ungroupedObjects
            ]);

            // Удаляем дубликаты по object_id с использованием Map
            const uniqueObjectsMap = new Map(res.map(obj => [obj.object_id, obj]));
            result = Array.from(uniqueObjectsMap.values());
        }
        if (num === 0) {
            // Функция для извлечения всех idx объектов из группы
            const res = datas.flatMap(account => [
                ...account.groups.flatMap(group => group.objects.map(obj => obj.object_id)),
                ...account.ungroupedObjects.map(obj => obj.object_id)
            ]);
            result = Array.from(new Set(res));
        }
        if (num === 2) {
            // Функция для извлечения всех idx объектов из группы
            const res = datas.flatMap(account => [
                ...account.groups.flatMap(group => group.group_id),
            ]);
            result = Array.from(new Set(res));
        }
        if (num === 3) {
            result = datas.flatMap(account => [
                ...account.groups.flatMap(group => group),
                { group_name: 'ungroup', group_id: 'null', objects: account.ungroupedObjects }

            ]);

        }
        return result
    }
    static drawTyres(arr, element, selector) {
        // задаем радиус
        const obj = [];
        let counts = 0
        for (let i = 0; i < arr.tyres; i++) {
            counts++
            const ob = {}
            ob.tyres = counts
            ob.rate = 100 / arr.tyres
            obj.push(ob)
        }
        const svg = d3.select(element).select(`${selector}`).append("svg")
            .attr("class", "axis2")
            .attr("width", 18)
            .attr("height", 18)
            .style('margin', '0 0.5px')
            .append("g")
            .attr('class', 'gOs')
            .attr('id', arr.osi)
            .attr("transform",
                "translate(" + (9) + "," + (9) + ")");
        // задаем радиус
        const radius = 4;
        // создаем элемент арки с радиусом
        const arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(8)
            .startAngle(function (d) { return d.startAngle + Math.PI })
            .endAngle(function (d) { return d.endAngle + Math.PI });
        const pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.rate; });
        const g = svg.selectAll(".arc")
            .data(pie(obj))
            .enter().append("g")
            .attr("class", "arc")
        g.append("path")
            .attr("d", arc)
            .style('fill', 'white')
            .style("stroke", 'black');
        const g1 = svg.append("g")
            .attr("transform", function (d, i) {
                return "translate(0,0)";
            });
        g1.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 4)
            .style('fill', 'black')
            .style('stroke', 'gray')
        const g2 = svg.append("g")
            .attr("transform", function (d, i) {
                return "translate(0,0)";
            });
        g2.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 0.5)
            .style('fill', 'white')

    }

}