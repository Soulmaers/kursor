import { storStatistika, storComponentOil, storComponentTravel, storComponentMoto, storComponentTO } from "../stor/stor.js";

export class Content {


    static addContent(data) {
        console.log(data)
        const lists = data.map(e => `<option value="${e.id}"  rel="${e.idResoure}"class='row_list_element'>${e.name}</option>)`).join('')
        return lists
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
        //  console.log(indexs);
        return fields
            .map((field, index) => {
                // Формируем id чекбокса
                const checkboxId = `${field.name}${indexs}${type}`;
                // Устанавливаем атрибуты checked и disabled
                const checkedAttr = field.checked ? 'checked' : '';
                const disabledAttr = indexs === '0' && index < 4 ? 'checked disabled' : '';

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
                case 'statistic':
                    fields = storStatistika
                    break;
                case 'Топливо':
                    fields = storComponentOil
                    break;
                case 'Поездки':
                    fields = storComponentTravel
                    break;
                case 'Моточасы':
                    fields = storComponentMoto
                    break;
                case 'Техническое обслуживание':
                    fields = storComponentTO
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
<div class="body_checkbox_fields" data-att="component""></div>
</div>
<div class="body_type_tamplate grafics_temp">
<div class="title_type_template">Графический</div>
<div class="body_checkbox_fields" data-att="graphic""></div>
</div>
</div>
<div class="footer_index">
<div class="valid_message"></div>
<div class="button_setting bnt_set add_resourse">Добавить к ресурсу</div>
  <div class="button_setting bnt_set btn_template">Сохранить</div></div>
</div>
                       </div>`
    }




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
                                <div class="create_reports">Создать отчет</div>
                                <div class="inform"></div>
                            </div>
                        </div>
                        <div class="wrapper_result">
                            <div class="title_result_reports">Заголовки отчетов</div>
                            <ul class="list_reports">
                                <div class="loaders_report">
                                    <div class="loaders-globe-report"></div>
                                </div>
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
                                <div class="titleChange_list_name title_file" rel="'Экспорт'">Экспорт
                                </div><i class="fas fa-angle-down toggle_reports toggle_file"></i>
                            </div>
                            <ul class="list_file">
                                <li class="item_type_file" rel="8" data-attribute="xlsx"><i
                                        class="fas fa-file-excel type_file"></i>
                                    <p class="text_type text_file">XLSX</p>
                                </li>
                                <li class="item_type_file" rel="2" data-attribute="pdf"><i
                                        class="fas fa-file-pdf type_file"></i>
                                    <p class="text_type text_file">PDF</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`
    }
}