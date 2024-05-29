export class ContentGeneration {
    static objColors = {
        5: '#009933', // зеленый
        4: '#009933', // зеленый
        3: '#c1bd3d', // желтый
        2: '#FF6633', // оранжевый
        1: '#FF0000'  // красный
    };

    static gener(el) {
        if (el >= 100) return 5;
        if (el >= 80) return 4;
        if (el >= 60) return 3;
        if (el >= 40) return 2;
        return 1;
    }


    static tyresRow = (el, data) => {
        const dataObject = data.find(e => e[6].idObject === el.idObject)
        const nomer = dataObject === undefined || dataObject[6].gosnomer === null ? '-' : dataObject[6].gosnomer


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

        const model = el.flag_status !== '0' ? '' : ContentGeneration.createIconsCar(el, dataObject, color)
        const probeg = dataObject ? ContentGeneration.calcValue(dataObject, el) : null

        const upElement = `${el.marka} ${el.model} ${el.radius}/${el.profil}/${el.width}   ${el.index_speed}   ${el.index_massa}`
        const lowElement = el.flag_status !== '0' ?
            `${el.probeg_now} км   ${el.idw_tyres}   ${el.dateInputSklad}` :
            `${nomer}  ${probeg} км   ${el.idw_tyres}   ${el.dateZamer}`


        const backgroundUrl = el.sezon === 'Лето' ? '../../../../image/leto.png' : '../../../../image/zima.png';
        const deleniesWithBackground = [1, 2, 3, 4].slice(0, level).map(i => `<div class="delenie" style="background-color: ${color};"></div>`).join('');
        const deleniesWithoutBackground = [1, 2, 3, 4].slice(level).map(i => `<div class="delenie" style="border: 1px solid ${color};"></div>`).join('');
        const fon = `style="background-image: url(../../../..${el.imagePath})";`
        return `<div class="row_sklad" rel="${el.idw_tyres}" data-att="${el.idObject}">
            <div class="left_wrap_sklad">
                <div class="icon_tyres" ${fon}></div>
                <div class="ostatok_tyres">
                    <div class="protektor_tyres">
                        <div class="battery" style="border-color: ${color}; color: ${color};">
                            ${deleniesWithoutBackground}  <!-- Сначала сегменты без фона -->
                            ${deleniesWithBackground}    <!-- Потом сегменты с фоном -->
                        </div>
                    </div>
                    <div class="protektor_tyres text_value" style="color: ${color};"> ${ostatok || ''} %</div>
                    <div class="protektor_tyres text_value" style="color: ${color};">${el.passportProtektor || ''} мм</div>
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

    static calcValue(data, tyres) {//считает пробег-текущий и остаток
        const params = data[2].result
        const findMileage = params.find(e => e.params === 'mileage')
        const mileage = findMileage ? findMileage.value : '-'
        const realMileage = (Math.round(parseFloat(mileage)) - Math.round(parseFloat(tyres.mileage))) + Number(tyres.probeg_now)
        return realMileage
    }

    static createIconsCar(element, data, color) {
        const model = data[0].result
        const identificator = Number(element.identifikator)
        model.sort((a, b) => parseInt(a.osi) - parseInt(b.osi));
        let globalTyresCounter = 1; // Глобальный счётчик для всех шин
        const osElements = []
        model.forEach(({ trailer, tyres }) => {
            osElements.push(ContentGeneration.createOsElement(trailer, Number(tyres), globalTyresCounter, identificator, color))
            globalTyresCounter += Number(tyres);
        });
        return osElements.join('')
    }
    static createOsElement(trailer, tires, globalTyresCounter, identificator, color) {
        let centerChartOsHTML = `<div class="centerOs_shema" rel="${trailer}"></div>`;
        const tyresHTML = [];
        for (let y = 0; y < tires; y++) {
            const currentTyreNumber = globalTyresCounter + y;
            const isHighlighted = currentTyreNumber === identificator ? `style="background-color: ${color};"` : '';
            tyresHTML.push(`<div class="tyres_shema"${isHighlighted}></div>`);
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
                    <div class="field-label">Радиус</div>
                    <input class="styled-input" type="text" id="radius"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Профиль</div>
                    <input class="styled-input" type="text" id="profil"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Ширина</div>
                    <input class="styled-input" type="text" id="width"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Сезонность</div>
                    <input class="styled-input" type="text" id="sezon"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Индекс скорости</div>
                    <input class="styled-input" type="text" id="index_speed"  autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Индекс нагрузки</div>
                    <input class="styled-input" type="text" id="index_massa"  autocomplete="off">
                </div>
                         </div>
        </div>
        <div class="footer_card_model_window">
            <div class="mess_validation"></div>
            <div class="save_params">Сохранить</div>

        </div>
    </div>`
    }


    static createCardTyres() {
        return `   <div class="card_model_tyres">
        <div class="header_card_tyres">Карточка колеса</div>
        <div class="body_card_tyres">
            <div class="image_container">
                <div class="discripiton_image">Изображение</div>
                <div class="image_card_wiew" id="imageContainer_wiew"></div>
                        </div>

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
           
        <div class="footer_card_tyres">
            <div class="mess_validation_wiew"></div>
            <div class="reduct_params">Редактировать</div>
            </div>

            <div class="input-fields_params">
                <div class="field-row">
                    <div class="field-label">ID Bitrix</div>
                    <input class="styled-input" type="text" id="id_bitrix_wiew" autocomplete="off">
                </div>
             <div class="field-row">
                    <div class="field-label">Рабочее давление в PSI</div>
                    <input class="styled-input" type="text" id="psi_wiew" autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Давление в Bar</div>
                    <input class="styled-input" type="text" id="bar_wiew" readonly="disabled" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Пробег по паспорту, км</div>
                    <input class="styled-input" type="text" id="probeg_passport_wiew" autocomplete="off">
                </div>
                              <div class="field-row">
                    <div class="field-label">Текущий пробег, км</div>
                    <input class="styled-input" type="text" id="probeg_now_wiew" value="0" autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Остаточный пробег, км</div>
                    <input class="styled-input" type="text" id="probeg_last_wiew" autocomplete="off">
                </div>
                  <div class="field-row">
                    <div class="field-label">Протектор по паспорту, мм</div>
                    <input class="styled-input" type="text" id="protektor_passport_wiew" autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Высота протектора 1, мм</div>
                    <input class="styled-input protektors" type="text" id="N1" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Высота протектора 2, мм</div>
                    <input class="styled-input protektors" type="text" id="N2" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Высота протектора 3, мм</div>
                    <input class="styled-input protektors" type="text" id="N3" autocomplete="off">
                </div>
                 <div class="field-row">
                    <div class="field-label">Высота протектора 4, мм</div>
                    <input class="styled-input protektors" type="text" id="N4" autocomplete="off">
                </div>
                  <div class="field-row">
                    <div class="field-label">Остаток протектора, %</div>
                    <input class="styled-input" type="text" id="ostatok" autocomplete="off">
                </div>
                  <div class="field-row">
                    <div class="field-label">Код, RFID</div>
                    <input class="styled-input" type="text" id="rfid_cod" autocomplete="off">
                </div>
                <div class="field-row">
                    <div class="field-label">Цена, руб.</div>
                    <input class="styled-input" type="text" id="price_tyres" autocomplete="off">
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
        console.log(parent)
        console.log(tyre)
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
            <option value="" disabled selected>Выберите действие</option>
              <option value="1">На склад</option>
                    <option value="2">В ремонт</option>
            <option value="3">Утилизация</option>
                      </select>
        <textarea class="comm"></textarea>
    </div>
    <div class='button_podtver'>
        <div class="ok_podtver">Ок</div>
        <div class="cancel_podtver">Отмена</div>
    </div>
</div>
`
        }
        /*   else if (tyre) {
               install = `
       <div class="modal_podtver">
       <div class='header_podtver'>Подтверждение</div>
       <div class='body_podtver'>
           <select id="actionSelect" class="styled-select">
               <option value="" disabled selected>Выберите действие</option>
                                 <option value="2">В ремонт</option>
               <option value="3">Утилизация</option>
                  <option value="4">Ротация</option>
                         </select>
                          
           <textarea class="comm"></textarea>
       </div>
       <div class='button_podtver'>
           <div class="ok_podtver">Ок</div>
           <div class="cancel_podtver">Отмена</div>
       </div>
   </div>
   `
           }*/
        else {
            console.log('другие условия')
        }
        return install
    }


}