


export class RenderHTML {


    static addModalSetParams(e, metaItem) {
        return `<div class="body_set_params">
           <div class="name_params">Название <span class="span_sens sensname">${e.sensor}</span></div>
             <div class="name_params">Параметр <span class="span_sens metaname">${metaItem ? `${metaItem.meta} : ${metaItem.value}` : ''}</span></div>
                                               <div class="name_params">Формула <input class="span_sens val_koef" value="x>"></div>
                                               ${RenderHTML.renderFooter(e.parametr)}
     </div >
  
     `

    }

    static addModalSetParamsMileage(e, metaItem) {
        const defaultValue = 0;

        // Проверяем, есть ли metaItem, если нет - задаем значения по умолчанию.
        const value = metaItem && (metaItem.value !== undefined && metaItem.value !== '-348201.4')
            ? Number(metaItem.value).toFixed(2)
            : defaultValue;

        const metaDisplay = metaItem ? `${metaItem.meta} : ${metaItem.value}` : defaultValue;

        return `<div class="body_set_params">
        <div class="name_params">Название <span class="span_sens sensname">${e.sensor}</span></div>
        <div class="name_params">Параметр <span class="span_sens metaname">${metaDisplay}</span></div>
        <div class="name_params">Одометр терминала <span class="span_sens odometr_terminal">${value}</span></div>
        <div class="name_params">Формула <input class="span_sens val_koef" value="(x+0)"></div>
        <div class="name_params">Одометр ТС <input class="span_sens val_koef_ts" value="${value}"></div>
        ${RenderHTML.renderFooter(e.parametr)}
    </div>`;
    }
    static addModalSetParamsOil(e, metaItem) {
        console.log(metaItem)
        return `<div class="body_set_params oils">
        <div class="name_params">Название <span class="span_sens sensname">${e.sensor}</span></div>
             <div class="name_params">Параметр <span class="span_sens metaname">${metaItem ? `${metaItem.meta} : ${metaItem.value}` : ''}</span></div>
                  <div class="name_params">Тарировка <div class="span_sens all_props_button">
                  <div class="btn_props table_tarir" rel=${e.parametr}>Таблица</div>
                       <div class="btn_props">График</div>
                            <div class="btn_props excel_tarir_export" rel=${e.parametr}>Экспорт</div>
                  </div></div>
                    <div class="name_params flex_none">Формула <input class="span_sens val_koef" ></div>
                                     <div class="name_params">Фильтрация <input class="span_sens val_koef_ts_oil" value="0" ></div>
                     ${RenderHTML.renderFooter(e.parametr)}
     </div>`
    }

    static addModalSetParamsAny(e, metaItem) {
        return `<div class="body_set_params">
           <div class="name_params">Название <span class="span_sens sensname">${e.sensor}</span></div>
             <div class="name_params">Параметр <span class="span_sens metaname">${metaItem ? `${metaItem.meta} : ${metaItem.value}` : ''}</span></div>
                                               <div class="name_params">Формула <input class="span_sens val_koef"></div>
                                                  ${RenderHTML.renderFooter(e.parametr)}
     </div >`

    }

    static addModalAlarm(e) {
        return `<div class="header_resourse">Предупреждение<i class="fas fa fa-times close_wrap_template_two"></i></div>
        <div class="body_set_params">Выберите параметр для ${e.sensor}</div >`

    }


    static renderFooter(parametr) {
        return `<div class="footer_index">
        <div class="valid_message"></div>
        <div class="button_setting btn_template set_save_param" rel="${parametr}">Сохранить</div></div>`
    }

    static renderStor(stor, meta) {
        const rows = stor
            .map(item => {
                const metaItem = meta.find(m => m.params === item.parametr);
                const paramMeta = (item.id < 7) ? item.parametr : (metaItem ? metaItem.meta : '');

                return {
                    itemHtml: `
                <li class="item_stor" rel="${item.parametr}">
                    <input class="sensor_stor" 
                           value="${metaItem ? metaItem.sens : item.sensor}" 
                           contenteditable="true">
                    <div class="param_stor" index="${item.index}">${item.parametr}</div>
                    <div class="param_meta">${paramMeta}</div>
                    <i class="fas fa-times clear_params"></i>
                </li>` + RenderHTML.controllRenderHTML(item, metaItem),
                    hasMeta: !!metaItem // Проверяем, есть ли metaItem
                };
            })
            .sort((a, b) => {
                // Сначала сортируем по наличию metaItem
                return (b.hasMeta - a.hasMeta); // если hasMeta = true у b, то b должно быть первым
            })
            .map(item => item.itemHtml) // Извлекаем только HTML после сортировки
            .join('');

        return rows;
    }


    static renderMeta(meta) {
        const arrayNameParams = ['engine_hours', 'can_engine_hours', 'mileage', 'can_mileage', 'inter_mileage', 'pwr_int', 'rs485fuel_level',
            'rs485fuel_temp', 'rs485fuel_level1', 'rs485fuel_temp1', 'rs485fuel_level2', 'rs485fuel_temp2']
        const rows = meta.map(e => {
            const value = e[1] === undefined || e[1] === '-348201.4' ? '-Н/Д' : arrayNameParams.includes(e[0]) ? `${parseFloat(Number(e[1]).toFixed(2))}` : `${e[1]}`
            return `
            <li class="item_meta">
                             <div class="item_meta_name">${e[0]}</div>
                <div class="item_meta_value">${value}</div>
                   </li>`}).join('');

        return rows
    }


    static controllRenderHTML(e, metaItem) {
        let sets;
        switch (e.index) {
            case 12:
            case 13: sets = RenderHTML.addModalSetParams(e, metaItem)
                break;
            case 14: sets = RenderHTML.addModalSetParamsMileage(e, metaItem)
                break;
            case 20: sets = RenderHTML.addModalSetParamsOil(e, metaItem)
                break;
            default: sets = RenderHTML.addModalSetParamsAny(e, metaItem)
                break;
        }

        return sets
    }

    static updateRows(data) {
        const rows = data.map(e => ` <li class="row_tarir_data"><input class="value_data value_dut" value=${e[0]}><input class="value_data value_oil" value=${e[1]}>
                    </li>`).join('')

        return rows
    }

    static addTarirHTML(data) {
        const rows = data.length !== 0 ? data.map(e => ` <li class="row_tarir_data"><input class="value_data value_dut" value=${e.dut}><input class="value_data value_oil" value=${e.litrazh}>
                    </li>`).join('') : `<li class="row_tarir_data"><input class="value_data value_dut"><input class="value_data value_oil">
        </li>
            <li class="row_tarir_data"><input class="value_data value_dut"><input class="value_data value_oil">
            </li>`

        return `<div class="header_tarir">
            <p class="title_tarir">Тарировочные данные</p><i class="fas fa fa-times closes"></i>
        </div>
        <div class="body_tarir">
            <div class="left_tarir_wrapper">
                <div class="item_stor_title">
                    <div class="chart_title">График</div>
                </div>
                <div class="chart_tarir"></div>
                <input type="file" id="fileInput" accept=".xlsx, .xls" style="display:none"/>
                <div class="load_image" id="downButton">Загрузить тарировочную таблицу</div>
<table id="dataTable"></table>
  <div class="name_params">Коэффициент<input class="span_sens koef_oil" value="1"></div>
            </div>
            <div class="right_tarir_wrapper">
                <div class="title_row">
                    <div class="title_data">ДУТ</div>
                    <div class="title_data">Литры</div>
                </div>
                <ul class="list_table_tarir">
                   ${rows}
                </ul>
            </div>
        </div>
        <div class="footer_modal">
            <div class="validation_message"></div>
            <div class="button_modal">
                <div class="btn_modal add_modal">Добавить строку</div>
                <div class="btn_modal ok_modal">Сохранить</div>
            </diV>`
    }
}

