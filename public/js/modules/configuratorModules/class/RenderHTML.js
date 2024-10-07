


export class RenderHTML {


    static addModalSetParams(e, metaItem) {
        return `<div class="body_set_params">
           <div class="name_params">Название <span class="span_sens">${e.sensor}</span></div>
             <div class="name_params">Параметр <span class="span_sens">${metaItem ? `${metaItem.meta} : ${metaItem.value}` : ''}</span></div>
                                               <div class="name_params">Формула <input class="span_sens val_koef" value="x>"></div>
                                               ${RenderHTML.renderFooter(e.parametr)}
     </div >
  
     `

    }

    static addModalSetParamsMileage(e, metaItem) {
        const value = metaItem.value === undefined || metaItem.value === '-348201.4' ? '-Н/Д' : Number(metaItem.value).toFixed(2)

        return `<div class="body_set_params">
           <div class="name_params">Название <span class="span_sens">${e.sensor}</span></div>
             <div class="name_params">Параметр <span class="span_sens">${metaItem ? `${metaItem.meta} : ${metaItem.value}` : ''}</span></div>
                <div class="name_params">Одометр терминала <span class="span_sens odometr_terminal">${metaItem ? value : ''}</span></div>
                                               <div class="name_params">Формула <input class="span_sens val_koef" value="(x+0)"></div>
                                                      <div class="name_params">Одометр ТС <input class="span_sens val_koef_ts" value="${metaItem ? value : ''}"></div>
                                               ${RenderHTML.renderFooter(e.parametr)}</div >`
    }
    static addModalSetParamsOil(e, metaItem) {
        return `<div class="body_set_params">
        <div class="name_params">Название <span class="span_sens">${e.sensor}</span></div>
             <div class="name_params">Параметр <span class="span_sens">${metaItem ? `${metaItem.meta} : ${metaItem.value}` : ''}</span></div>
                  <div class="name_params">Тарировка <div class="span_sens all_props_button">
                  <div class="btn_props table_tarir" rel=${e.parametr}>Таблица</div>
                       <div class="btn_props">График</div>
                            <div class="btn_props excel_tarir_export" rel=${e.parametr}>Экспорт</div>
                  </div></div>
                    <div class="name_params">Формула <input class="span_sens val_koef" value="x*" ></div>
                     ${RenderHTML.renderFooter(e.parametr)}
     </div>`
    }

    static addModalSetParamsAny(e, metaItem) {
        return `<div class="body_set_params">
           <div class="name_params">Название <span class="span_sens">${e.sensor}</span></div>
             <div class="name_params">Параметр <span class="span_sens">${metaItem ? `${metaItem.meta} : ${metaItem.value}` : ''}</span></div>
                                               <div class="name_params">Тест <input class="span_sens val_koef"></div>
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
            const value = e[1] === undefined || e[1] === '-348201.4' ? '-Н/Д' : arrayNameParams.includes(e[0]) ? ` :${parseFloat(Number(e[1]).toFixed(2))}` : ` :${e[1]}`
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
}

