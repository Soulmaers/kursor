



export class CreateDOMElements {

    static createListObject(data) {
        const groupsSklad = document.querySelectorAll('.groupsSklad')
        if (groupsSklad) groupsSklad.forEach(e => e.remove())
        const allModel = data.map(e => e.filter(it => it[0].result.length !== 0 && it[0].result[0].osi !== '-')).filter(e => e.length > 0);
        for (let el of allModel) {
            const lowList = document.querySelector('.list_body')
            const group = document.createElement('div')
            group.classList.add('groupsSklad')
            const nameGroup = el[0][7].replace(/\s/g, '_')
            group.classList.add(`${nameGroup}`)
            group.setAttribute('id', el[0][8])
            group.style.display = 'flex',
                group.style.flexDirection = 'column'
            group.style.width = 100 + '%',
                lowList.appendChild(group)
            const titleModal = document.createElement('div')
            titleModal.classList.add('titleModalSklad')
            titleModal.textContent = `${nameGroup}` + ' ' + '(' + `${el.length}` + ')'
            group.appendChild(titleModal)
            const hiddenModal = document.createElement('div')
            hiddenModal.classList.add('hiddenModalSklad')
            group.classList.add(`${nameGroup}`)
            group.setAttribute('rel', `${nameGroup}`)
            group.appendChild(hiddenModal)
            for (let elem of el) {
                if (Object.values(elem[0]).length !== 0) {
                    CreateDOMElements.createIconsAndLeftSpisok(elem, hiddenModal) // создание объектов, покраска колес, установка статусов и значений датчиков
                }
            }
        }
    }

    static createIconsAndLeftSpisok(elem, hiddenModal) {
        const listItemCar = document.createElement('div')
        listItemCar.classList.add('listItemSklad')
        listItemCar.classList.add(`${elem[4]}`)
        listItemCar.setAttribute('rel', `${elem[4]}`)
        listItemCar.setAttribute('id', `${elem[4]}`)
        listItemCar.textContent = elem[0].message
        hiddenModal.appendChild(listItemCar)
    }


    static createModelCar(data, elements) {
        const idw = data[4]
        const tyresCar = elements.filter(el => el.flag_status === '0' && el.idObject === String(idw))
        const model = data[0].result
        console.log(model)
        model.sort((a, b) => parseInt(a.osi) - parseInt(b.osi));
        let globalTyresCounter = 1; // Глобальный счётчик для всех шин
        const osElements = []
        model.forEach(({ trailer, tyres, osi }) => {
            osElements.push(CreateDOMElements.createOsElement(trailer, Number(tyres), globalTyresCounter, tyresCar, osi))
            globalTyresCounter += Number(tyres);
        });
        return osElements.join('')
    }
    static createOsElement(trailer, tires, globalTyresCounter, tyresCar, osi) {
        let centerChartOsHTML = `<div class="centerOs_shema_car" id='${osi}'rel="${trailer}"></div>`;
        const tyresHTML = [];
        for (let y = 0; y < tires; y++) {
            const currentTyreNumber = globalTyresCounter + y;
            const tyresInstall = tyresCar.find(el => Number(el.identifikator) === currentTyreNumber)
            const rel = tyresInstall ? tyresInstall.idw_tyres : ''
            const isHighlighted = tyresInstall ? `style="background-image: url(../../../../image/0000.png)"` : '';
            tyresHTML.push(`<div class="tyres_shema_car" id="${currentTyreNumber}"rel="${rel}"${isHighlighted}></div>`);
        }
        if (tires === 2) {
            return `<div class="osi_shema_car">
                    ${tyresHTML[0]}
                    ${centerChartOsHTML}
                    ${tyresHTML[1]}
                </div>`;
        } else {
            return `<div class="osi_shema_car">
                 ${tyresHTML[0]} ${tyresHTML[1]}
          <div class="centerOs_shema_car" style="width:70px" id='${osi}' rel ="${trailer}"></div>
                 ${tyresHTML[2]} ${tyresHTML[3]}
                </div>`;
        }
    }

    static createListModelsTyres(elem, data) {
        elem.innerHTML = data.map(el => {
            console.log(el)
            const styleFon = el.imagePath && el.imagePath !== '' ? `style="background-image: url('../../../..${el.imagePath}')"` :
                `style="background-image: url('../../../../image/zeto_tyres.png')"`
            return `<div class="row_model" rel="${el.uniqTyresID}">
                        <div class="img_tyres" ${styleFon}></div>
                        <div class="parametr_tyres">${el.type_tire} ${el.marka} ${el.model} ${el.type_tyres}
                         Размер:${el.radius}/${el.profil}/${el.width}  ${el.sezon} Индекс:${el.index_speed}/${el.index_massa}
                        </div>
                        </div>`
        }).join('')
    }
}