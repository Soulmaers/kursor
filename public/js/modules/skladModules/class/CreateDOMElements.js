
import { ContentGeneration } from "../html/content.js";
import { objColors } from '../html/stor.js'
import { Helpers } from "./Helpers.js";
export class CreateDOMElements {

    static createListObject(data) {
        const groupsSklad = document.querySelectorAll('.groupsSklad')
        if (groupsSklad) groupsSklad.forEach(e => e.remove())


        const allModel = data
            .map(el => ({
                ...el,
                objects: el.objects.filter(obj =>
                    obj[0].result &&
                    obj[0].result.length > 0 &&
                    obj[0].result[0].osi !== '-'
                )
            }))
            .filter(el => el.objects.length > 0); // Фильтрация элементов с непустыми objects

        console.log(allModel);
        for (let el of allModel) {
            const lowList = document.querySelector('.list_body')
            const group = document.createElement('div')
            group.classList.add('groupsSklad')
            const nameGroup = el.group_name
            //   group.classList.add(`${nameGroup}`)
            group.setAttribute('id', el.group_id)
            group.style.display = 'flex',
                group.style.flexDirection = 'column'
            group.style.width = 100 + '%',
                lowList.appendChild(group)
            const titleModal = document.createElement('div')
            titleModal.classList.add('titleModalSklad')
            titleModal.textContent = `${nameGroup}`
            group.appendChild(titleModal)
            const hiddenModal = document.createElement('div')
            hiddenModal.classList.add('hiddenModalSklad')
            //   group.classList.add(`${nameGroup}`)
            group.setAttribute('rel', `${nameGroup}`)
            group.appendChild(hiddenModal)
            console.log(el)
            for (let elem of el.objects) {
                CreateDOMElements.createIconsAndLeftSpisok(elem, hiddenModal) // создание объектов, покраска колес, установка статусов и значений датчиков

            }
        }
    }

    static createIconsAndLeftSpisok(elem, hiddenModal) {
        const listItemCar = document.createElement('div')
        listItemCar.classList.add('listItemSklad')
        listItemCar.classList.add(`${Number(elem.object_id)}`)
        listItemCar.setAttribute('rel', `${Number(elem.object_id)}`)
        listItemCar.setAttribute('id', `${Number(elem.object_id)}`)
        listItemCar.textContent = elem.object_name
        hiddenModal.appendChild(listItemCar)
    }


    static createModelCar(data, elements) {
        const idw = data[4]
        const tyresCar = elements.filter(el => el.flag_status === '0' && el.idObject === String(idw))
        const sensors = data[1].result
        const model = data[0].result
        model.sort((a, b) => parseInt(a.osi) - parseInt(b.osi));
        let globalTyresCounter = 1; // Глобальный счётчик для всех шин
        const osElements = []
        model.forEach(({ trailer, tyres, osi }) => {
            osElements.push(CreateDOMElements.createOsElement(trailer, Number(tyres), globalTyresCounter, tyresCar, osi, sensors))
            globalTyresCounter += Number(tyres);
        });
        return osElements.join('')
    }
    static createOsElement(trailer, tires, globalTyresCounter, tyresCar, osi, sensors) {
        let centerChartOsHTML = `<div class="centerOs_shema_car" id='${osi}'rel="${trailer}"></div>`;
        const tyresHTML = [];
        for (let y = 0; y < tires; y++) {
            const currentTyreNumber = globalTyresCounter + y;
            const tyresInstall = tyresCar.find(el => Number(el.identifikator) === currentTyreNumber)

            const sensor = sensors.filter(el => Number(el.tyresdiv) === currentTyreNumber).map(it => it.pressure)[0]
            const rel = tyresInstall ? tyresInstall.idw_tyres : ''
            const relId = tyresInstall ? tyresInstall.id_bitrix : ''
            const ostatok = tyresInstall ? `${Number(tyresInstall.ostatok)}%` : null
            const minN = tyresInstall ? Math.min(...Helpers.protek(tyresInstall)) : ''
            console.log(minN)
            const isHighlighted = tyresInstall ? `background-image: url(../../../../image/0000.png);` : '';
            const styleColor = tyresInstall ? `color: ${objColors[ContentGeneration.gener(Number(tyresInstall.ostatok))]};` : '';
            const combinedStyle = `${isHighlighted} ${styleColor}`;
            const side = tires === 2 ? (y === 0 ? 'left' : 'right') : (y < 2 ? 'left' : 'right');
            tyresHTML.push(`<div class="tyres_shema_car" id="${currentTyreNumber}" minN='${minN}' rel="${rel}"style="${combinedStyle}" data-att="${sensor}" relid="${relId}" side="${side}">${ostatok}</div>`);
        }
        if (tires === 2) {
            return `<div class='container_na_osi'>
            <div class='left_container charts_wrap_wheel'></div>
            <div class="osi_shema_car">
                    ${tyresHTML[0]}
                    ${centerChartOsHTML}
                    ${tyresHTML[1]}
                </div>
                     <div class='right_container charts_wrap_wheel'></div>
                </div>`;
        } else {
            return `<div class='container_na_osi'>
               <div class='left_container charts_wrap_wheel'></div>
            <div class="osi_shema_car">
                 ${tyresHTML[0]} ${tyresHTML[1]}
          <div class="centerOs_shema_car" style="width:50px" id='${osi}' rel ="${trailer}"></div>
                 ${tyresHTML[2]} ${tyresHTML[3]}
                </div>
                 <div class='right_container charts_wrap_wheel'></div>
                </div>`;
        }
    }

    static createListModelsTyres(elem, data) {
        elem.innerHTML = data.map(el => {
            const styleFon = el.imagePath && el.imagePath !== '' ? `style="background-image: url('../../../..${el.imagePath}')"` :
                `style="background-image: url('../../../../image/zeto_tyres.png')"`
            return `<div class="row_model" rel="${el.uniqTyresID}" 
             marka='${el.marka}' model='${el.model}' radius='${el.radius}'
       type='${el.type_tyres}' tire='${el.type_tire}' massa='${el.index_massa}' speed='${el.index_speed}' sezon='${el.sezon}'
        width='${el.width}' profil='${el.profil}'>
                        <div class="img_tyres" ${styleFon}></div>
                        <div class="parametr_tyres">${el.type_tire} ${el.marka} ${el.model} ${el.type_tyres}
                         Размер:${el.radius}/${el.width}/${el.profil}  ${el.sezon} Индекс:${el.index_massa} ${el.index_speed}
                        </div>
                        </div>`
        }).join('')
    }
}