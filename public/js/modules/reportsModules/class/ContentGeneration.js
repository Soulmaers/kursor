import { storStatistika, storComponentOil, storComponentTravel, storComponentProstoy, storComponentSKDSHComp, storComponentSKDSHGraf, storComponentParkings, storComponentStops, storComponentMoto, storComponentTO } from "../stor/stor.js";
import { Helpers } from './Helpers.js'
export class Content {


    static renderComponentsReport(data) {
        if (!data[0].result) return 'Нет данных'
        const attributesCell = data[0].result.map((e, index) => {
            const cell = data.map(it => `<td class="cell_reports">${it.result[index]} ${it.local}</td>`).join('')
            return `<tr>${cell}</tr>`
        }).join('')
        const titlerows = data.map(e => `<td class="cell_reports cell_title_reports">${e.name}</td>`).join('')
        return `<table class="cell_params stat_reports"><tr>${titlerows}</tr>${attributesCell}</table> `
    }
    static renderTableStatic(data) {
        const row = data.map(e => `<tr><td class="cell_reports">${e.name}</td><td class="cell_reports">${e.result !== undefined ? e.result : 'Н/Д'} ${e.local ? e.local : ''}</td></tr>`).join('')
        return `<table class="cell_params">${row}</table> `
    }


    static renderTitlesReport(data) {
        const resultArray = Helpers.trueTitles(data)
        const titleName = resultArray.map((e, index) => `<li class="titleNameReport  ${index === 0 ? 'activeTitleReports' : ''}" id=${e}>${e}</li>`).join('')
        return titleName
    }
    static addContent(data) {
        console.log(data)
        const properties = ['idResoure', 'groupName']; // добавьте все возможные имена свойств
        const lists = data.map(e => {
            let attributes = '';
            properties.forEach(property => {
                if (e.hasOwnProperty(property)) { // проверяет, существует ли свойство в объекте
                    attributes = e[property];
                }
            });
            return `<option value="${e.id}" rel="${attributes}" type="${e.typeobject ? e.typeobject : null}"class='row_list_element'>${e.name}</option>`;
        }).join('');
        return lists;
    }

    static addButtonTypeBlock(arraynameBtn, indexs, updatedStores) {
        const buttons = arraynameBtn
            .map(
                (e, index) =>
                    `<div class="type_navi" data-att="${index}">${e}<i class="fas fa-angle-down srows"></i></div>  
            ${Content.renderContent(e, indexs, updatedStores ? updatedStores[e] : null)}`
            )
            .join('');

        return `
    <div class="navi_block">
        ${buttons}
    </div>`;
    }
    // Метод для генерации списка чекбоксов
    static generateCheckboxList(fields, indexs, type) {
        console.log(fields, indexs, type);
        return fields
            .map((field, index) => {
                // Формируем id чекбокса
                const checkboxId = `${field.name}${indexs}${type}`;
                // Устанавливаем атрибуты checked и disabled
                const checkedAttr = field.checked ? 'checked' : '';
                const disabledAttr = indexs === '0' && index < 4 ? 'checked disabled' : '' ||
                    indexs === '2' && index === 0 ? 'checked disabled' : '';

                // Объединяем атрибуты
                const checkboxAttrs = [checkedAttr, disabledAttr].filter(Boolean).join(' ');

                return `
                <div class="checkbox_item">
                    <input type="checkbox" id="${checkboxId}" name="${field.name}" ${checkboxAttrs}>
                    <label class="label_check_tambplate" for="${checkboxId}">${field.name}</label>
                </div>
            `;
            })
            .join('');
    }

    // Метод для рендеринга контента на основе типа
    static renderContent(type, indexs, fields) {
        console.log(type, indexs, fields)
        if (!fields) {
            switch (type) {
                case 'Статистика':
                    fields = storStatistika
                    break;
                case 'Топливо':
                    fields = storComponentOil
                    break;
                case 'Поездки':
                    fields = storComponentTravel
                    break;
                case 'Стоянки':
                    fields = storComponentParkings
                    break;
                case 'Остановки':
                    fields = storComponentStops
                    break;
                case 'Моточасы':
                    fields = storComponentMoto
                    break;
                case 'Простои на холостом ходу':
                    fields = storComponentProstoy
                    break;
                case 'Техническое обслуживание':
                    fields = storComponentTO
                    break;
                case 'СКДШ':
                    fields = indexs === '1' ? storComponentSKDSHComp : storComponentSKDSHGraf
                    break;
                default:
                    break;
            }
        }
        return `<div class="checkbox-list" rel="${type}" >${this.generateCheckboxList(fields, indexs, type)}</div>`;
    }

    static renderWindowResourse(data) {
        const rows = data.map(e => `
    <label class="rows_resourse">
        <input type="radio" name="accountSelection" value="${e.idResourse}">
        ${e.nameAccount}
    </label>
`).join('');
        return `<div class="wrap_resourse">
        <div class="header_resourse">Добавьте отчет к ресурсу<i class="fas fa fa-times close_wrap_template_two"></i></div>
        <div class="body_resourse">
        ${rows}
        </div>  
              <div class="footer_resourse">
              <div class="button_setting bnt_set save_resourse">Назначить</div>
              </div>
                </div>`

    }
    static addContentTemplate() {
        /* const buttons = ['Топливо', 'Поездки', 'Стоянки', 'Остановки', 'Моточасы', 'Простои на холостом ходу', 'Техническое обслуживание', 'СКДШ'].map((e, index) => {
             return Content.createSet(index)
         }).join('')*/
        return `<div class="wrapper_template">
         <div class="header_template">
        <input class="name_template" placeholder="Введите название отчета">
          Настройки отчета
         <i class="fas fa fa-times close_wrap_template"></i></div>
<div class="body_index">
<div class="body_type_tamplate statics_temp">
<div class="title_type_template">Статистический</div>
<div class="body_checkbox_fields" data-att="statistic"></div>
</div>
<div class="body_type_tamplate components_temp">
<div class="title_type_template">Компонентный</div>
<div class="body_checkbox_fields" data-att="component"></div>
</div>
<div class="body_type_tamplate grafics_temp">
<div class="title_type_template">Графический</div>
<div class="body_checkbox_fields" data-att="graphic"></div>

</div>
</div>
<div class="footer_index">
<div class="valid_message"></div>
<div class="button_setting bnt_set add_resourse">Добавить к ресурсу</div>
  <div class="button_setting bnt_set btn_template">Сохранить</div></div>
</div>
                       </div>`
    }

    /*
        static createSet(index) {
            console.log(index)
            let html;
            switch (index) {
                case 0: html = Content.renderDefault()
                    break;
                case 1: html = Content.renderTraveling()
                    break;
                case 2: html = Content.renderDefault()
                    break;
                case 3: html = Content.renderDefault()
                    break;
                case 4: html = Content.renderDefault()
                    break;
                case 5: html = Content.renderProstoy()
                    break;
                case 6: html = Content.renderDefault()
                    break;
                case 7: html = Content.renderDefault()
                    break;
            }
            return html
        }
    
        static renderDefault() {
            return `<div class="celevoy_card"></div>`
        }
        static renderProstoy() {
            return `   
            <div class="celevoy_card">
          <div class="card_set_prostoy card_rep">
         <div class="checkbox_item">
                        <input class="input_set" type="checkbox" id="min_distance_prostoy">
                        <label class="label_check_set label_check_set_prostoy" for="min_distance_prostoy">Мин. длительность простоя(чч:мм:сс)</label>
                        <input class="value_set" value=00:00:00 disabled>
                    </div>
    
                    </div>
          <div class="card_set_prostoy datchik_min_max card_rep">
         <div class="checkbox_item">
                        <input type="checkbox" id="datchik_ugla">
                        <label class="label_check_set_prostoy uniq_set_prostoy" for="datchik_ugla">Датчик угла наклона</label>
                     <div class="porog">min</div><input class="porog_value">
                          <div class="porog">max</div><input class="porog_value">
                    </div>
                                  </div></div>`
        }
    
        static renderTraveling() {
            return `
                 <div class="celevoy_card">
        <div class="card_set card_rep">
        <div class="distance">Длительность</div>
        <div class="checkbox_item">
                        <input class="input_time" type="checkbox" id="min_distance">
                        <label class="label_check_set" for="min_distance">Мин. длительность (чч:мм:сс)</label>
                        <input class="value_set" value=00:00:00 disabled>
                    </div>
                    <div class="checkbox_item">
                        <input class="input_time" type="checkbox" id="max_distance">
                        <label class="label_check_set" for="max_distance">Макс. длительность (чч:мм:сс)</label>
                        <input class="value_set" value=24:00:00 disabled>
                    </div>
                    </div>
    
                      <div class="card_set card_rep">
        <div class="distance">Пробег</div>
        <div class="checkbox_item">
                        <input class="input_distance" type="checkbox" id="min_mileage">
                        <label class="label_check_set set_mileage" for="min_mileage">Мин. пробег, км</label>
                        <input class="value_set set_mil"  maxlength="6" value=0 disabled>
                    </div>
                    <div class="checkbox_item">
                        <input class="input_distance" type="checkbox" id="max_mileage">
                        <label class="label_check_set set_mileage" for="max_mileage">Макс. пробег, км</label>
                        <input class="value_set set_mil"  maxlength="6" value=0 disabled>
                    </div>
                    </div>
                    </div>
                    `
        }*/

    static addRazmetka() {
        return ` <div class="wraaper reports_module">
                <div class="up_block">
                    <div class="up_title">Отчеты</div>
                    <div class="up_content">
                        <div class="wrapper_shablon">
                            <div class="title_result_reports">Шаблоны</div>
                            <div class="wrapper_preferens">
                                <div class="up_shablons">
                                         <div class="select_list">
                                             <div class="titleChange_list_name" rel="Выбор отчета">Выбор отчета
                                                </div>
                                                <select class="toggle_reports">
                                            </select><i class="fas fa-wrench edition_template"></i>
                                            <i class="fas fa fa-times delete_template"></i>
                                                     </div>
                                                        </div>
                                         
                                     <div class="object">
                                        <div class="select_list">
                                            <div class="titleChange_list_name" rel="Выбор объекта">Выбор объекта </div>
                                          <select class="toggle_reports">
                                                  </select>
                                                                                   </div>
                                                                                   </div>
                                  <div class="interval_reports">
                                      <div class="select_list">
                                                <div class="titleChange_list">
                                                    <div class="titleChange_list_name" rel="Выбор интервала">Выбор
                                                        интервала
                                                    </div>
                                                      <select class="toggle_reports">
                                                   <option value="Сегодня">Сегодня</option>
                                                    <option value="Вчера">Вчера</option>
                                                       <option value="Неделя">Неделя</option>
                                                    <option value="Месяц">Месяц</option>
                                                </select>
                                                </div>

                                            </div>
                                                                                   </div>
                                <div class="down_calendar">
                                    <div class="calendarReports">
                                                                                   
                                        <input class="input_data" type="text" id="dateranges5"
                                            placeholder="Выберите диапазон дат">
                                        <div class="btn_speedStart_reports">
                                            <button class="clear_report btm_formStart">Очистить</button>
                                            <button class="complite btm_formStart control">Выполнить</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="create_reports">Создать шаблон</div>
                                <div class="inform"></div>
                            </div>
                        </div>
                        <div class="wrapper_result">
                            <div class="title_result_reports">Заголовки отчетов</div>
                            <ul class="list_reports">
                                                         </ul>
                        </div>
                        <div class="wrapper_reports_map">
                            <div class="title_result_reports">Карта</div>
                            <div class="reports_maps"></div>
                        </div>
                    </div>
                </div>
                <div class="down_block">
                    <div class="down_title" rel="Детализация">Детализация</div>
                    <div class="down_content">
                        <div class="wrapper_reports"></div>
                    </div>
                    <div class="wrapper_file">
                        <div class="file">
                            <div class="titleChange_list">
                            <i class="fas fa-file-excel icon_print" data-attribute="xlsx" rel="8"></i>
                             <i class="fas fa-file-pdf icon_print" data-attribute="pdf" rel="2"></i>
                                                  
                        </div>
                    </div>
                </div>
            </div>`
    }
}