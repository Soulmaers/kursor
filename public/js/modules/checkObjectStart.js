import { timesFormat, timesDate, convertDate, yesterdaySummary, times } from './startAllStatic.js'

export function startList(object) {
    const result = object
        .map(el => Object.values(el)) // получаем массивы всех значений свойств объектов
        .flat()
    result.forEach(el => {
        el[0].message === 'Цистерна ДТ' ? el.push('Цистерна') : el.push(el[0].result[0].type)
    })
    const array = result
        //   .filter(e => e[0].message.startsWith('Sitrack'))
        .filter(e => e[6].startsWith('Самосвал'))
        .map(e => e);
    const arrayGlobal = [];
    arrayGlobal.push(array.filter(item => item[6] === 'Самосвал'));
    arrayGlobal.push(array.filter(item => item[6] === 'Самосвал-Прицеп'));
    let count = 0;
    arrayGlobal.forEach(el => {
        count++
        const title = document.querySelector(`[rel="${el[0][6]}"]`).closest('.left_block').nextElementSibling.children[0]
        title.textContent = el[0][6]
        const wrapper = document.querySelector(`[rel="${el[0][6]}"]`).closest('.left_block').nextElementSibling
        const check = document.createElement('div')
        check.classList.add('checkInStart')
        wrapper.appendChild(check)
        const listAll = document.createElement('p')
        listAll.classList.add('checkListStart')
        listAll.innerHTML = `<input class="inputStartAll" type="checkbox"  value=${el[0][6]}checked>Все`
        check.appendChild(listAll)
        for (let i = 0; i < el.length; i++) {
            const list = document.createElement('p')
            list.classList.add('checkListStart')
            list.innerHTML = `<input class="inputStart-${count}" type="checkbox" rel=${el[i][4]}
    value=${el[i][4]} id=${el[i][4]}>${el[i][0].message}`
            check.appendChild(list)
        }
    })
    // Получаем все блоки чекбоксов
    const checkboxBlocks = document.querySelectorAll('.checkInStart');
    // Проходимся по каждому блоку
    checkboxBlocks.forEach((block, index) => {
        // Получаем чекбоксы в текущем блоке
        const checkboxes = Array.from(block.querySelectorAll('.checkListStart')).map(element => {
            return element.children;
        });
        checkboxes.shift()
        let enabledSettings = [];
        // Обработка изменений в текущем блоке
        function handleCheckboxChange() {
            enabledSettings = [];
            checkboxes.forEach(blockCheckboxes => {
                enabledSettings.push(...Array.from(blockCheckboxes).filter(i => i.checked).map(i => Number(i.value)));
            });
            const isOtherCheckboxChecked = checkboxes.find(blockCheckboxes => {
                return Array.from(blockCheckboxes).some(i => i.checked && i.value !== block.children[0].children.value);
            });
            // Если есть другие выбранные чекбоксы, снимаем выбор с "All"
            if (isOtherCheckboxChecked) {
                checkboxAll[0].checked = false;
            }
            const sele = Array.from(block.closest('.rigth_block').previousElementSibling.children[1].children[0].lastElementChild.children[0])
            const pointDate = times[times.length - 1]
            enabledSettings.length !== 0 ? viewStat(enabledSettings, sele, pointDate) : (yesterdaySummary(),
                yesterdaySummary('Вчера'), checkboxAll[0].checked = true);
        }
        // Обработка изменений для общего чекбокса "All" в текущем блоке
        function handleCheckboxAllChange(event) {
            const checkboxes = event.target.closest('.checkInStart').querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false
            });
            block.children[0].children[0].checked = true;
            const sele = Array.from(block.closest('.rigth_block').previousElementSibling.children[1].children[0].lastElementChild.children[0])
            sele[0].selected = true;
            yesterdaySummary()
            yesterdaySummary('Вчера')
        }
        // Добавляем обработчик события изменения для каждого чекбокса в текущем блоке
        checkboxes.forEach(checkbox => {
            checkbox[0].addEventListener('change', () => {
                handleCheckboxChange();
            });
        });
        // Добавляем обработчик события изменения для общего чекбокса "All" в текущем блоке
        const checkboxAll = block.children[0].children;
        checkboxAll[0].checked = true;
        checkboxAll[0].addEventListener('change', handleCheckboxAllChange);
    });
}
// Функция, которую вы хотите запускать при изменении состояния чекбоксов
export async function viewStat(checkedValues, sele, res) {
    // Здесь вы можете использовать выбранные значения
    let interval;
    sele.forEach(e => {
        if (e.selected === true) {
            interval = e.value;
        }
    });
    const dat = [];
    let int;
    if (interval === 'Неделя') {
        int = 8
    }
    else if (interval === 'Месяц') {
        int = 31
    }
    else if (interval === 'Вчера') {
        int = 1
    }
    else {
        int = res
    }
    !res ? dat.push([convertDate(0)], [convertDate(int), convertDate(1)]) : dat.push([convertDate(0)], [res[0], res[1]])
    const idw = checkedValues
    let count = 0;
    const dannie = [];
    for (let i = 0; i < dat.length; i++) {
        const data = dat[i]
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data, idw }),
        };
        const mods = await fetch('/api/summaryIdwToBase', params);
        const models = await mods.json();
        dannie.push(models);
    }
    dannie.forEach(el => {
        if (el.length === 1) {
            const propOrder = ["quantityTS", "jobTS", 'probeg', "rashod", "zapravka", "dumpTrack", "moto", "prostoy", "medium", "oilHH"];
            el.forEach(it => {
                const parentWrapper = document.querySelector(`[rel="${it.type}"]`).children
                it.quantityTS = el.length
                it.moto = timesDate(it.moto)
                it.prostoy = timesFormat(it.prostoy)
                delete it.id
                delete it.idw
                delete it.nameCar
                delete it.type
                delete it.data
                delete it.company
                const arr = propOrder.map(prop => it[prop]);
                arr.forEach((e, index) => {
                    if (count === 0) {
                        parentWrapper[index].children[1].textContent = (e !== undefined && e !== null) ? e : '-';

                    }
                    parentWrapper[index].children[2].textContent = (e !== undefined && e !== null) ? e : '-';
                })
            })
        }
        else {
            viewMoreElement(el, count)
        }
        count++
    })
}

function viewMoreElement(newArray, count) {
    const objectUniq = {}
    for (let i = 0; i < newArray.length; i++) {
        objectUniq[newArray[i].id] = newArray[i];
    }
    const globalInfo = {};
    const newObject = Object.entries(newArray).reduce((acc, [key, value]) => {
        if (value.jobTS === 1) {
            acc[key] = value; // Add only "e" value to the new object
        }
        return acc;
    }, {});
    for (const prop in newObject) {
        const subObj = newObject[prop];
        if (subObj.type) {
            if (globalInfo[subObj.type]) {
                for (const subProp in subObj) {
                    if (subProp !== 'type') {
                        globalInfo[subObj.type][subProp] = (globalInfo[subObj.type][subProp] || 0) + subObj[subProp];
                    }
                }
                globalInfo[subObj.type].quantityTS = (globalInfo[subObj.type].quantityTS || 0) + 1;
            }
            else {
                globalInfo[subObj.type] = Object.assign({}, subObj);
                globalInfo[subObj.type].quantityTS = 1;
            }
        }
    }
    const resultTS = Object.values(
        Object.values(objectUniq).reduce((acc, val) => {
            acc[val.idw] = Object.assign(acc[val.idw] ?? {}, val);
            return acc;
        }, {})
    );
    const resultJobTS = Object.values(
        Object.values(newObject).reduce((acc, val) => {
            if (val.jobTS === 1) {
                acc[val.idw] = Object.assign(acc[val.idw] ?? {}, val);
            }
            return acc;
        }, {})
    );
    for (const prop in globalInfo) {
        if (globalInfo[prop].type) {
            globalInfo[prop].quantityTS = resultTS.filter(subObj => subObj.type === globalInfo[prop].type).length;
            globalInfo[prop].jobTS = resultJobTS.filter(subObj => subObj.type === globalInfo[prop].type).length;
        }
    }
    let jobNum = 0;
    Object.values(newObject).forEach(it => {
        it.jobTS === 1 ? jobNum++ : null
    })
    Object.entries(globalInfo).forEach(el => {
        el[1].moto = timesDate(el[1].moto)
        el[1].prostoy = timesFormat(el[1].prostoy)
        el[1].medium = el[1].jobTS !== 0 ? Number((el[1].medium / (count === 1 ? jobNum : el[1].jobTS)).toFixed(2)) : 0;
        delete el[1].id
        delete el[1].idw
        delete el[1].nameCar
        delete el[1].type
        delete el[1].data
    })
    const propOrder = ["quantityTS", "jobTS", 'probeg', "rashod", "zapravka", "dumpTrack", "moto", "prostoy", "medium", "oilHH"];
    Object.entries(globalInfo).forEach(it => {
        const arr = propOrder.map(prop => it[1][prop]);
        const parentWrapper = document.querySelector(`[rel="${it[0]}"]`).children
        arr.forEach((e, index) => {
            if (count === 0) {
                console.log(count)
                parentWrapper[index].children[1].textContent = (e !== undefined && e !== null) ? e : '-'
            }
            console.log(count)
            parentWrapper[index].children[2].textContent = (e !== undefined && e !== null) ? e : '-'

        })
    })
    count++
}
