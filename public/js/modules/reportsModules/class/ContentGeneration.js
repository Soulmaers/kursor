import { storStatistika, storComponentOil, storComponentMotoGraf, storComponentOilGraf, storComponentTravel, storComponentProstoy, storComponentSKDSHComp, storComponentSKDSHGraf, storComponentParkings, storComponentStops, storComponentMoto, storComponentTO } from "../stor/stor.js";
import { Helpers } from './Helpers.js'

export class Content {


    static renderComponentsReport(data, stata, prop, object) {

        const newRows = data.map((el, index) => {
            const name = stata[index][1].result
            const group = stata[index][0].result

            const [displayClass, currentSymbol] = Helpers.returnVariable(stata, object, name, prop)
            if (!el[0].result) {
                return `<div class="item_reports"><div class="swich ${currentSymbol === '-' ? 'toggleClass' : ''}">${currentSymbol}</div><div class="rows_spoyler object_new_rows">${name}</div>
                <div class="rows_spoyler group_new_rows">${group}</div></div>
                      <div class="cell_params ${displayClass} stat_reports">Нет данных</div>`
            }
            const attributesCell = el[0].result.map((e, index) => {
                const cell = el.map(it => `<td class="cell_reports">${it.result[index]} ${it.local}</td>`).join('')
                return `<tr>${cell}</tr>`
            }).join('')
            const titlerows = el.map(e => `<td class="cell_reports cell_title_reports">${e.name}</td>`).join('')
            return `<div class="item_reports"><div class="swich ${currentSymbol === '-' ? 'toggleClass' : ''}">${currentSymbol}</div><div class="rows_spoyler object_new_rows">${name}</div><div class="rows_spoyler group_new_rows">${group}</div></div>
                      <table class="cell_params ${displayClass} stat_reports"><tr>${titlerows}</tr>${attributesCell}</table>`
        }).join('')
        return newRows
    }

    static renderChartsContent(data, stata, types, prop, object) {

        const newRows = data.map((el, index) => {
            const name = stata[index][1].result
            const group = stata[index][0].result
            const [displayClass, currentSymbol] = Helpers.returnVariable(stata, object, name, prop)

            const chartHtml = `<div class="chart_container ${displayClass}" id="${types}${index}"></div>`;

            if (!el.graphic[types][0].result || el.graphic[types][0]?.result.length === 0) {
                return `<div class="item_reports"><div class="swich ${currentSymbol === '-' ? 'toggleClass' : ''}">${currentSymbol}</div><div class="rows_spoyler object_new_rows">${name}</div><div class="rows_spoyler group_new_rows">${group}</div></div>
                      <div class="chart_container ${displayClass}">Нет данных</div>`
            }
            return `<div class="item_reports"><div class="swich ${currentSymbol === '-' ? 'toggleClass' : ''}">${currentSymbol}</div><div class="rows_spoyler object_new_rows">${name}</div>
            <div class="rows_spoyler group_new_rows">${group}</div><i class="fas fa-expand full_screen"></i></div>
                    ${chartHtml}`
        }).join('')

        return newRows
    }

    static renderTableStatic(stata, prop, object) {

        const newRows = stata.map((el, index) => {
            const name = stata[index][1].result
            const [displayClass, currentSymbol] = Helpers.returnVariable(stata, object, name, prop)
            const row = el.map(e => `<tr><td class="cell_reports">${e.name}</td><td class="cell_reports">${e.result !== undefined ? e.result : 'Н/Д'} ${e.local ? e.local : ''}</td></tr>`).join('')
            return `<div class="item_reports"><div class="swich ${currentSymbol === '-' ? 'toggleClass' : ''}">${currentSymbol}</div><div class="rows_spoyler object_new_rows">${el[1].result}</div><div class="rows_spoyler group_new_rows">${el[0].result}</div></div>
            <table class="cell_params ${displayClass}">
            <tr><td class="cell_reports">Название</td><td class="cell_reports">Значение</td></tr>
        ${row}</table> `
        }).join('')
        return newRows
    }


    static renderTitlesReport(data) {
        const stats = Helpers.trueTitles(data[0])
        const components = Helpers.trueTitles(data[1])
        const graphics = Helpers.trueTitles(data[2])
        const statName = stats.map((e, index) => `<li class="titleNameReport spoyler_report ${index === 0 ? 'activeTitleReports' : ''}" id=${e}>${e}</li>`).join('')
        const componentName = components.map((e, index) => `<li class="titleNameReport " id=${'components' + e}>${e}</li>`).join('')
        const graphicName = graphics.map((e, index) => `<li class="titleNameReport" id=${'graphics' + e}>${e}</li>`).join('')

        return `${statName}<div class="body_content_report flex_none"></div><div class="spoyler_report">Компонентный</div><div class="body_content_report flex_none" id="components">${componentName}</div> <div class="spoyler_report">Графический</div><div class="body_content_report flex_none"  id="grafics">${graphicName}</div>`
    }
    static addContent(data) {
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

    static addContentHTML(data) {
        const list = data.map((e) => {
            const objectsElements = e[1].map((el, index) => `
       <div class="checkbox_item rows_list object_list" group="${e[0]}" name="${el.name}" idobject="${el.id}" rel="${el.typeobject}">
           <input class="object_checks"  type="checkbox" id="${el.id}_${index}">
           <label class="label_check_tambplate" for="${el.id}_${index}" rel="${el.typeobject}">${el.name}</label>
       </div>`).join('');
            return `<div class="container_group_object">
               <div class="checkbox_item rows_list group_list">
               <div class="switch">-</div>
           <input class="group_checks"  type="checkbox" id="${e[0]}">
           <label class="label_check_tambplate" for="${e[0]}"">${e[0]}</label>
       </div>
        <div class="objects_container">${objectsElements}</div>
                </div>`}).join('')

        return `<div class="header_rows_reports">
        <div class="visible_list_objects">
         <div class="span_controll on_hidden">+</div>
          <div class="span_controll off_hidden">-</div>
            </div>
               <div class="discription_header_visible_list">Свернуть/Развернуть</div>
          </div>
        <div class="rows_objects_reports">${list}</div><div class="footer_rows_reports">
        <div class="btn_list_rows start_save">ОК</div>
              <div class="btn_list_rows cancel_start">Отмена</div>
        </div>`
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
        return fields
            .map((field, index) => {
                // Формируем id чекбокса
                const checkboxId = `${field.name}${indexs}${type}`;
                // Устанавливаем атрибуты checked и disabled
                const checkedAttr = field.checked ? 'checked' : '';
                const disabledAttr = field.disabled ? 'disabled' : '';

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
        if (!fields) {
            switch (type) {
                case 'Статистика':
                    fields = storStatistika
                    break;
                case 'Топливо':
                    fields = indexs === '1' ? storComponentOil : storComponentOilGraf
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
                    fields = indexs === '1' ? storComponentMoto : storComponentMotoGraf
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


    static formaFilters(type, name, templates) {
        return `<div class="wrap_lk wrap_object wrap_edit">
        <div class="header_index header_edit"><div class="buttons_menu" rel="${type ? type : ''}" id='objectID'>${name}</div>
                    <div class="buttons_menu templates_title">${templates}</div>
        <i class="fas fa fa-times close_modal_window"></i></div>
                      <div class="settings_stor"></div>
                                <div class="footer_index">
              <div class="valid_message mess_edit_object"></div>
              <div class="button_setting short_btn">Выполнить</div>
                     </div>
                                        `
    }

    static addRazmetka() {
        return ` <div class="wraaper reports_module">
                <div class="up_block">
                    <div class="up_title">Отчеты</div>
                    <div class="up_content">
                        <div class="wrapper_shablon">
                            <div class="title_result_reports">Шаблоны</div>
                            <div class="wrapper_preferens">
                             <div class="object">
                                        <div class="select_list">
                                            <div class="titleChange_list_name" rel="Выбор объектов">Выбор объекта </div>
                                               <input class="field_find">
                                                 <div class="toggle_reports list_objects_reports">
                                                  </div><div class="numberOfChoise">(0)</div>
                                                                                   </div>
                                                                                   </div>

                                <div class="up_shablons">
                                         <div class="select_list">
                                             <div class="titleChange_list_name" rel="Выбор отчета">Выбор отчета
                                                </div>
                                                <select class="toggle_reports">
                                            </select><i class="fas fa-wrench edition_template"></i>
                                            <i class="fas fa fa-times delete_template"></i>
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
                                                                                      <button class="complite btm_formStart control">Выполнить</button>
                                                 <button class="complite control btm_formStart addWindowFilters">Выполнить с редактированием</button>
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
                <div class="wrap_visible_reports">
                            <span class="fas fa-plus visible_reports one_element_icon_toggle_reports"></span>
                             <span class="fas fa-minus visible_reports active_btn"></span>
</div>
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