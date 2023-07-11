


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


    arrayGlobal.forEach(el => {
        console.log(el)
        const title = document.querySelector(`[rel="${el[0][6]}"]`).closest('.left_block').nextElementSibling.children[0]
        title.textContent = el[0][6]
        const wrapper = document.querySelector(`[rel="${el[0][6]}"]`).closest('.left_block').nextElementSibling
        const check = document.createElement('div')
        check.classList.add('checkIn')
        wrapper.appendChild(check)
        for (let i = 0; i < el.length; i++) {
            const list = document.createElement('p')
            list.classList.add('checkListStart')
            list.innerHTML = `<input class="inputStart" type="checkbox" rel=${el[i][4]}
    value=${el[i][4]} id=${el[i][4]}>${el[i][0].message}`
            check.appendChild(list)
        }
    })
}