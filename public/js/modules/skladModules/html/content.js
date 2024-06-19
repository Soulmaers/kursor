
import { objectDiscription } from './stor.js'
export class ContentGeneration {
    static objColors = {
        5: 'rgba(5, 159, 16, 0.8)',//#009933',//зеленый
        4: 'rgba(5, 159, 16, 0.8)',//#009933', //зеленый
        3: 'rgba(200, 202, 8, 0.8)',//#FFFF00',//желтый
        2: 'rgba(205, 95, 5, 0.8)',//#FF6633',//оранж
        1: 'rgba(209, 3, 13, 0.8)'///'#FF0000'//красный
    }

    static gener(el) {
        let generatedValue;
        if (el === 100) {
            generatedValue = 5;
        }
        if (el >= 80 && el < 100) {
            generatedValue = 4;
        }
        if (el >= 60 && el < 80) {
            generatedValue = 3;
        }
        if (el >= 40 && el < 60) {
            generatedValue = 2;
        }
        if (el < 40) {
            generatedValue = 1;
        }
        return generatedValue;
    };

    static objSezon = {
        'Лето': '../../../../image/leto.png',
        'Зима': '../../../../image/zima.png',
        'Всесезонная': '../../../../image/vse.png'
    }


    static tyresRow = (el, data) => {
        const dataObject = data.find(e => e[6].idObject === el.idObject)
        const nomer = dataObject === undefined || dataObject[6].gosnomer === null ? '-' : dataObject[6].gosnomer

        console.log(el)
        const defaultColor = 'rgba(6, 28, 71, 1)';
        let ostatok = el.ostatok.trim(); // Убираем пробельные символы
        let level, color;

        if (ostatok === '') {
            color = defaultColor; // Устанавливаем стандартный цвет, если ostatok пуст
            level = 0; // Не выводим никакие деления
        } else {
            ostatok = parseInt(ostatok);
            level = ContentGeneration.gener(ostatok);
            color = ContentGeneration.objColors[level];
        }
        const model = el.flag_status !== '0' ? this.statusTyres(el.flag_status) : dataObject ? ContentGeneration.createIconsCar(el, dataObject, color) : ''
        const probeg = dataObject ? ContentGeneration.calcValue(dataObject, el) : null

        const upElement = `${el.marka} ${el.model} R${el.radius} ${el.width}/${el.profil}   ${el.index_massa} ${el.index_speed}`
        const lowElement = el.flag_status !== '0' ?
            `${el.probeg_now} км   ${el.idw_tyres}   ${el.dateInputSklad}` :
            `${nomer}  ${probeg} км   ${el.idw_tyres}   ${el.dateZamer}`

        const backgroundUrl = ContentGeneration.objSezon[el.sezon]
        const deleniesWithBackground = [1, 2, 3, 4].slice(0, level).map(i => `<div class="delenie" style="background-color: ${color};"></div>`).join('');
        const deleniesWithoutBackground = [1, 2, 3, 4].slice(level).map(i => `<div class="delenie" style="border: 1px solid ${color};"></div>`).join('');
        const fon = `style="background-image: url(../../../..${el.imagePath})";`
        return `<div class="row_sklad" marka='${el.marka}' model='${el.model}' radius='${el.radius}'
       type='${el.type_tyres}' tire='${el.type_tire}' massa='${el.index_massa}' speed='${el.index_speed}' sezon='${el.sezon}'
        width='${el.width}' profil='${el.profil}'
        rel="${el.idw_tyres}" nameCar="${el.nameCar}"data-att="${el.idObject}" relid="${el.id_bitrix}">
            <div class="left_wrap_sklad">
                <div class="icon_tyres" ${fon}></div>
                <div class="ostatok_tyres">
                    <div class="protektor_tyres">
                        <div class="battery" style="border-color: ${color}; color: ${color};">
                            ${deleniesWithoutBackground}  <!-- Сначала сегменты без фона -->
                            ${deleniesWithBackground}    <!-- Потом сегменты с фоном -->
                        </div>
                    </div>
                    <div class="protektor_tyres text_value" style="color: ${color};"> ${ostatok != null ? ostatok : ''} %</div>
                    <div class="protektor_tyres text_value" style="color: ${color};">${el.protektor_passport || ''} мм</div>
                </div>
                <div class="sezon_tyres_and_type">
                    <div class="sezon_tyres" style="background-image:url(${backgroundUrl});"></div>
                    <div class="type_tyres">
                      ${el.type_tyres}
                    </div>
                </div>
            </div>
            <div class="right_wrap_sklad">
                <div class="cel_tyres_sklad up_element">${upElement}</div>
                <div class="cel_tyres_sklad down_element">${lowElement}</div>
                     </div>
                          <div class="right_model_wrap_sklad">
${model}
                     </div>
        </div>`;
    }

    static statusTyres(flag) {
        const status = {
            '1': { element: `<i class="fas fa-database status_tyres" status="Склад" rel="1" flag="true"></i>`, class: 'fa-database', text: 'На cкладе' },
            '2': { element: `<i class="fas fa-tools status_tyres" status="Ремонт" rel="2" flag="false"></i>`, class: 'fa-tools', text: 'В ремонте' },
            '3': { element: `<i class="fas fa-trash status_tyres" status="Утилизация" rel="3" flag="false"></i>`, class: 'fa-trash', text: 'Утилизация' }
        }
        return status[flag].element


    }
    static calcValue(data, tyres) {//считает пробег-текущий и остаток
        const params = data[2].result
        const findMileage = params.find(e => e.params === 'mileage')
        const mileage = findMileage ? findMileage.value : '-'
        const realMileage = (Math.round(parseFloat(mileage)) - Math.round(parseFloat(tyres.mileage))) + Number(tyres.probeg_now)
        return realMileage
    }

    static createIconsCar(element, data, color) {
        const sensors = data[1].result
        const model = data[0].result
        const identificator = Number(element.identifikator)
        model.sort((a, b) => parseInt(a.osi) - parseInt(b.osi));
        let globalTyresCounter = 1; // Глобальный счётчик для всех шин
        const osElements = []
        model.forEach(({ trailer, tyres }) => {
            osElements.push(ContentGeneration.createOsElement(trailer, Number(tyres), globalTyresCounter, identificator, color, sensors))
            globalTyresCounter += Number(tyres);
        });
        return osElements.join('')
    }
    static createOsElement(trailer, tires, globalTyresCounter, identificator, color, sensors) {
        let centerChartOsHTML = `<div class="centerOs_shema" rel="${trailer}"></div>`;
        const tyresHTML = [];
        for (let y = 0; y < tires; y++) {
            const currentTyreNumber = globalTyresCounter + y;
            const isHighlighted = currentTyreNumber === identificator ? `style="background-color: ${color};"` : '';
            const sensor = currentTyreNumber === identificator ? sensors.filter(e => Number(e.tyresdiv) === identificator).map(it => it.pressure)[0] : ''
            tyresHTML.push(`<div class="tyres_shema"${isHighlighted} rel="${sensor}"></div>`);
        }
        if (tires === 2) {
            return `<div class="osi_shema">
                    ${tyresHTML[0]}
                    ${centerChartOsHTML}
                    ${tyresHTML[1]}
                </div>`;
        } else {
            return `<div class="osi_shema">
                 ${tyresHTML[0]} ${tyresHTML[1]}
          <div class="centerOs_shema" style="width:4px" rel ="${trailer}"></div>
                 ${tyresHTML[2]} ${tyresHTML[3]}
                </div>`;
        }
    }

    static createWindowModelTyres() {
        return `   <div class="card_model_window">
        <div class="header_card_model_window">Карточка модели колеса<i class="fas fa fa-times close_modal_window"></i>
        </div>
        <div class="body_card_model_window">
            <div class="image_container">
                <div class="discripiton_image">Изображение</div>
                <div class="image_card" id="imageContainer"></div>
                <input type="file" id="imageUpload" accept="image/*" style="display: none;">
                <div class="load_image" id="uploadButton">Загрузить</div>
            </div>

            <div class="input-fields">
                <div class="field-row">
                    <div class="field-label">Тип шины</div>
                    <input class="styled-input" type="text" id="type_tire"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Производитель</div>
                    <input class="styled-input" type="text" id="marka"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Модель</div>
                    <input class="styled-input" type="text" id="model"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Тип колеса</div>
                    <input class="styled-input" type="text" id="type_tyres"  autocomplete="off">
                </div>
                   <div class="field-row">
                    <div class="field-label">Сезонность</div>
                    <input class="styled-input" type="text" id="sezon"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Радиус</div>
                    <input class="styled-input" type="text" id="radius"  autocomplete="off">
                </div>
                  <div class="field-row">
                    <div class="field-label">Ширина</div>
                    <input class="styled-input" type="text" id="width"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Профиль</div>
                    <input class="styled-input" type="text" id="profil"  autocomplete="off">
                </div>
              
              <div class="field-row">
                    <div class="field-label">Индекс нагрузки</div>
                    <input class="styled-input" type="text" id="index_massa"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Индекс скорости</div>
                    <input class="styled-input" type="text" id="index_speed"  autocomplete="off">
                </div>
               
                         </div>
        </div>
        <div class="footer_card_model_window">
            <div class="mess_validation"></div>
            <div class="save_params">Сохранить</div>

        </div>
    </div>`
    }


    static createCardTyres(flag) {
        const status = flag && flag !== '0' ? this.statusTyres(flag) : ''
        return `   <div class="card_model_tyres">
        <div class="header_card_tyres">Карточка колеса</div>
        <div class="body_card_tyres">
            <div class="image_container">
                <div class="discripiton_image">Изображение</div>
                <div class="image_card_wiew" id="imageContainer_wiew"></div>
                        </div>
${status}
            <div class="input-fields_wiew">
                <div class="field-row">
                    <div class="field-label">Тип шины</div>
                    <div class="styled-input" type="text" id="type_tire_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Производитель</div>
                    <div class="styled-input" type="text" id="marka_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Модель</div>
                    <div class="styled-input" type="text" id="model_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Тип колеса</div>
                    <div class="styled-input" type="text" id="type_tyres_wiew"></div>
                </div>
                  <div class="field-row">
                    <div class="field-label">Сезонность</div>
                    <div class="styled-input" type="text" id="sezon_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Радиус</div>
                    <div class="styled-input" type="text" id="radius_wiew"></div>
                </div>
                   <div class="field-row">
                    <div class="field-label">Ширина</div>
                    <div class="styled-input" type="text" id="width_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Профиль</div>
                    <div class="styled-input" type="text" id="profil_wiew"></div>
                </div>
                            <div class="field-row">
                    <div class="field-label">Индекс нагрузки</div>
                    <div class="styled-input" type="text" id="index_massa_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Индекс скорости</div>
                    <div class="styled-input" type="text" id="index_speed_wiew"></div>
                </div>
                                          </div>
           
        <div class="footer_card_tyres">
            <div class="mess_validation_wiew"></div>
            <div class="reduct_params">Редактировать</div>
            </div>

            <div class="input-fields_params">
                <div class="field-row">
                    <div class="field-label">Цена*, руб.</div>
                    <input class="styled-input valid_input vvod" type="text" id="price_tyres" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Пробег по паспорту*, км</div>
                    <input class="styled-input valid_input vvod" type="text" id="probeg_passport_wiew" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Начальная высота протектора*, мм</div>
                    <input class="styled-input valid_input vvod" type="text" id="protektor_passport_wiew" autocomplete="off">
                </div>
             <div class="field-row">
                    <div class="field-label">Максимальное давление в PSI*</div>
                    <input class="styled-input valid_input vvod" type="text" id="psi_wiew" autocomplete="off">
                </div>
                <div class="field-row center_body_list">
                    <div class="field-label">Максимальное давление в Bar</div>
                    <input class="styled-input" type="text" id="bar_wiew" readonly="disabled" autocomplete="off">
                </div>
                                              <div class="field-row">
                    <div class="field-label">Текущий пробег, км</div>
                    <input class="styled-input vvod" type="text" id="probeg_now_wiew" value="0" autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Остаточный пробег, км</div>
                    <input class="styled-input vvod" type="text" id="probeg_last_wiew" autocomplete="off">
                </div>
                                 <div class="field-row">
                    <div class="field-label">Высота протектора 1, мм</div>
                    <input class="styled-input protektors vvod" type="text" id="N1" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Высота протектора 2, мм</div>
                    <input class="styled-input protektors vvod" type="text" id="N2" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Высота протектора 3, мм</div>
                    <input class="styled-input protektors vvod" type="text" id="N3" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Высота протектора 4, мм</div>
                    <input class="styled-input protektors vvod" type="text" id="N4" autocomplete="off">
                </div>
                  <div class="field-row center_body_list">
                    <div class="field-label">Остаток протектора, %</div>
                    <input class="styled-input vvod" type="text" id="ostatok" autocomplete="off">
                </div>
                  <div class="field-row">
                    <div class="field-label">Код, RFID</div>
                    <input class="styled-input" type="text" id="rfid_cod" autocomplete="off">
                </div>
              
                  <div class="field-row">
                    <div class="field-label">ID Bitrix</div>
                    <input class="styled-input" type="text" id="id_bitrix_wiew" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Комментарий</div>
                    <input class="styled-input" type="text" id="comment" autocomplete="off">
                </div>
                             </div>
        </div>
        <div class="footer_card_model_window">
            <div class="mess_validation"></div>
            <div class="save_params">Сохранить</div>
        </div>
    </div>`
    }



    static modalValidation(dropzone, drag) {
        const parent = dropzone.closest('.sklad_tyres')
        const tyre = dropzone.getAttribute('rel')
        const parentElement1 = dropzone.closest('.container_shema')
        const parentElement2 = drag.closest('.container_shema')
        let install;
        if (parentElement1 && parentElement2) {
            install = `
        <div class="modal_podtver">
        <div class='header_podtver'>Подтверждение</div>
          <div class='body_podtver_install'>Провести ротацию?</div>
          <div class='button_podtver'>
          <div class="ok_podtver">Ок</div>
          <div class="cancel_podtver">Отмена</div>
          </div>
        </div>`
        }
        else if (!parent && !tyre) {
            install = `
        <div class="modal_podtver">
        <div class='header_podtver'>Подтверждение</div>
          <div class='body_podtver_install'>Установить колесо?</div>
          <div class='button_podtver'>
          <div class="ok_podtver">Ок</div>
          <div class="cancel_podtver">Отмена</div>
          </div>
        </div>`
        }
        else if (parent || tyre) {
            install = `
    <div class="modal_podtver">
    <div class='header_podtver'>Подтверждение</div>
    <div class='body_podtver'>
        <select id="actionSelect" class="styled-select">
            <option value="-" disabled selected>Выберите действие</option>
              <option value="1">На склад</option>
                    <option value="2">В ремонт</option>
            <option value="3">Утилизация</option>
                      </select>
        <textarea class="comm" placeholder="комментарии..."></textarea>
    </div>
    <div class='button_podtver'>
        <div class="ok_podtver">Ок</div>
        <div class="cancel_podtver">Отмена</div>
    </div>
</div>
`
        }
        else {
            console.log('другие условия')
        }
        return install
    }

    static htmlContantModal(flag) {
        const optionsHTML = ['1', '2', '3']
            .filter(value => value !== flag)
            .map(value => {
                const text = value === '1' ? 'На склад' : value === '2' ? 'В ремонт' : 'Утилизация';
                return `<option value="${value}">${text}</option>`;
            })
            .join('');

        return `
    <div class="modal_podtver">
        <div class='header_podtver'>Подтверждение</div>
        <div class='body_podtver'>
            <select id="actionSelect" class="styled-select">
                <option value="-" disabled selected>Выберите действие</option>
                ${optionsHTML}
            </select>
            <textarea class="comm" placeholder="комментарии..."></textarea>
        </div>
        <div class='button_podtver'>
            <div class="ok_podtver">Ок</div>
            <div class="cancel_podtver">Отмена</div>
        </div>
    </div>`;
    }


    // < div class="field-label titleMM" > N4</div > -->
    static createCarWheel() {
        return `   <div class="card_model_tyres_wheel">
            <div class="header_card_tyres_wheel">
           <div class="image_container_wheel">
                        <div class="image_card_wiew" id="imageContainer_wiew"></div>
                        </div>
                       <div class="protector">
                    <div class="title_prot">График замера протектора</div>
                    <div class="progressBar2">

                        <div class="maxMMM"> 
                        <input class="styled-input mmtext" type="text" id="protektor_passport_wiew" autocomplete="off">
                        </div>
                        <p class="mm0">0</p>
                        <div class="contBar22">
                            <canvas id="drawLine2" height="60"></canvas>
                        </div>
                        <div class="contBar22">
                            <canvas id="drawLine3" height="60"></canvas>
                        </div>
                        <div class="contBar22">
                            <canvas id="drawLine4" height="60"></canvas>
                        </div>
                    </div>
                    <div class="headerMM">
                                                <div class="field-row_wheel">
                                   <input class="styled-input protektors_wheel" type="text" id="N1" autocomplete="off">
                </div>
                 <div class="field-row_wheel">
                                 <input class="styled-input protektors_wheel" type="text" id="N2" autocomplete="off">
                </div>
                 <div class="field-row_wheel">
                                  <input class="styled-input protektors_wheel" type="text" id="N3" autocomplete="off">
                </div>
                 <div class="field-row_wheel">
                                  <input class="styled-input protektors_wheel" type="text" id="N4" autocomplete="off">
                </div>
                    </div>
                </div>
        </div>
        <div class="all_body">
                <div class="body_card_tyres_wheel">
                     <div class="input-fields_wiew">
                <div class="field-row">
                    <div class="field-label">Тип шины</div>
                    <div class="styled-input" type="text" id="type_tire_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Производитель</div>
                    <div class="styled-input" type="text" id="marka_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Модель</div>
                    <div class="styled-input" type="text" id="model_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Тип колеса</div>
                    <div class="styled-input" type="text" id="type_tyres_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Радиус</div>
                    <div class="styled-input" type="text" id="radius_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Профиль</div>
                    <div class="styled-input" type="text" id="profil_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Ширина</div>
                    <div class="styled-input" type="text" id="width_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Сезонность</div>
                    <div class="styled-input" type="text" id="sezon_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Индекс скорости</div>
                    <div class="styled-input" type="text" id="index_speed_wiew"></div>
                </div>
                <div class="field-row">
                    <div class="field-label">Индекс нагрузки</div>
                    <div class="styled-input" type="text" id="index_massa_wiew"></div>
                </div>
                           </div>
                            <div class="input-fields_params">
                          <div class="field-row">
                    <div class="field-label new_card_label">Рабочее давление в PSI</div>
                    <input class="styled-input new_card_input" type="text" id="psi_wiew" autocomplete="off" disabled>
                </div>
                <div class="field-row">
                    <div class="field-label new_card_label">Давление в Bar</div>
                    <input class="styled-input new_card_input" type="text" id="bar_wiew" readonly="disabled" autocomplete="off">
                </div>
                                              <div class="field-row">
                    <div class="field-label new_card_label">Текущий пробег, км</div>
                    <input class="styled-input new_card_input" type="text" id="probeg_now_wiew" value="0" autocomplete="off" disabled>
                </div>
                <div class="field-row">
                    <div class="field-label new_card_label">Остаточный пробег, км</div>
                    <input class="styled-input new_card_input" type="text" id="probeg_last_wiew" autocomplete="off" disabled>
                </div>
                                <div class="field-row">
                    <div class="field-label new_card_label">Остаток протектора, %</div>
                    <input class="styled-input new_card_input" type="text" id="ostatok" autocomplete="off" disabled>
                </div>
                                <div class="field-row">
                    <div class="field-label new_card_label">Комментарий</div>
                    <input class="styled-input new_card_input" type="text" id="comment" autocomplete="off">
                </div>
                             </div>
        </div>
<div class="analitika_wheel"><div class="child_chart"></div></div>
        </div>
        <div class="footer_card_model_window">
            <div class="mess_validation"></div>
            <div class="save_params">Сохранить</div>
        </div>
    </div>`
    }

    static contentVisualWheel() {
        return `<div class="wrapper_visual_wheel"><div class="header_card_tyres">Информация</div>
                        <div class="protector wheel_card">
                        <div class="dannie_wheel_info">
                        <div class="info_discription"></div>
                             <div class="info_discription"></div>
                                  <div class="info_discription"></div>
                                     <div class="info_discription"></div>
                        </div>
                        <div class="right_container_chart">
                            <div class="title_prot right_chart">График замера протектора</div>
                            <div class="progressBar2 right_chart">
                                <div class="maxMMM">
                                    <div class="styled-input mmtext" id="protektor_passport_wiew_chart"></div>
                                </div>
                                <p class="mm0">0</p>
                                <div class="contBar22">
                                    <canvas id="drawLine2" height="60"></canvas>
                                </div>
                                <div class="contBar22">
                                    <canvas id="drawLine3" height="60"></canvas>
                                </div>
                                <div class="contBar22">
                                    <canvas id="drawLine4" height="60"></canvas>
                                </div>
                            </div>
                               <div class="headerMM">
                                                <div class="field-row_wheel row_wheel_sklad">
                                 <div class="styled-input protektors_wheel"id="N1_wiew_chart"></div>
                </div>
                 <div class="field-row_wheel row_wheel_sklad">
                              <div class="styled-input protektors_wheel"id="N2_wiew_chart"></div>
                </div>
                 <div class="field-row_wheel row_wheel_sklad">
                                    <div class="styled-input protektors_wheel"id="N3_wiew_chart"></div>
                </div>
                 <div class="field-row_wheel row_wheel_sklad">
                                    <div class="styled-input protektors_wheel"id="N4_wiew_chart"></div>
                </div>
                    </div></div>
                        </div>
                        <div class="analitika_wheel card_wheel">
                            <div class="child_chart card_wheel_chart">
                            <div class="legend_wheel_chart">
    <div class="legend-item">
        <span class="dot green"></span>
        <span class="label">Выбранный замер</span>
    </div>
      <div class="legend-item">
        <span class="dot contur"></span>
        <span class="label">Замеры протектора</span>
    </div>
    <div class="legend-item">
        <span class="line_wheel dashed_red"></span>
        <span class="label">Прогноз остатка пробега</span>
    </div>
    <div class="legend-item">
        <span class="line_wheel dashed_blue"></span>
        <span class="label">Расчетный пробег</span>
    </div>
    <div class="legend-item">
        <span class="line_wheel solid bold"></span>
        <span class="label">Выбранный сегмент пробега</span>
    </div>
    <div class="legend-item">
        <span class="line_wheel thin"></span>
        <span class="label">Сегмент пробега</span>
    </div>
</div></div>
                            <div class="list_data_time">
                            <div class="header_list_data_time">Замеры</div>
                             <div class="body_zamer">
                             
                             </div>
                            </div>
                        </div>
                        <div class="table_ishue"> 
                        <div class="dannie_stat pressure_stat">
                        <div class="header_stat">Данные по давлению</div>
                        <table class="table_stata">
                            <tr class="rows_stata">
                                                             <th class="cell_stata cel">Ожидание</th>
                                <th class="cell_stata cel">Низкое</th>
                                <th class="cell_stata cel">Ниже нормы</th>
                                <th class="cell_stata cel">Норма</th>
                                <th class="cell_stata cel">Выше нормы</th>
                                <th class="cell_stata cel">Высокое</th>
                                <th class="cell_stata cel">Всего</th>
                            </tr>
                        </table>
                        <div class="description_wheel"></div>
                     
                        </div>
                         <div class="dannie_stat speed_stat">
                           <div class="header_stat">Данные по скорости</div>
                         <table class="table_stata">
                            <tr class="rows_stata">
                             <th class="cell_stata cel">В норме</th>
                                <th class="cell_stata cel">Превышение</th>
                                <th class="cell_stata cel">Всего</th>
                            </tr>
                        </table>
                        <div class="description_wheel"></div>
                                              </div>
                        </div>
                        </div>`
    }


    static addContainerCharts(idw) {
        // Создаем общий контейнер progressBar
        const progressBar = document.createElement('div');
        progressBar.classList.add('progressBar2');
        progressBar.setAttribute('rel', idw)
        // Массив с классами для контейнеров
        const containerClasses = ['drawLine2', 'drawLine3', 'drawLine4'];

        // Создаем три контейнера с canvas в цикле
        for (let i = 0; i < containerClasses.length; i++) {
            const container = document.createElement('div');
            container.classList.add('contBar22');
            const canvas = document.createElement('canvas');
            canvas.classList.add(containerClasses[i]);
            canvas.id = containerClasses[i];
            canvas.height = 60;

            container.appendChild(canvas);
            progressBar.appendChild(container);

        }
        progressBar.appendChild(ContentGeneration.addDiscriptionWheel(idw))
        return progressBar;
    }

    static addDiscriptionWheel(idw) {
        // Создаем общий контейнер progressBar
        const div = document.createElement('div');
        div.classList.add('discription_shina_wrap');
        div.setAttribute('rel', idw)
        // Массив с классами для контейнеров
        const number = 3
        // Создаем три контейнера  в цикле
        for (let i = 0; i < number; i++) {
            const row = document.createElement('div');
            row.classList.add('row_text_shina');
            div.appendChild(row);
        }

        return div;
    }

    static renderDiscription(prop) {
        return objectDiscription[prop].map(e => `<li class='list_discription'>${e}</li>`).join('')
    }

}


