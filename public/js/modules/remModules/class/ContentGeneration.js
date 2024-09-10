


export class Content {

    static modalView(data) {
        const rows = data.map(e => `
    <label class="rows_rem">
        <input type="checkbox" class="rem_checkbox" rel="${e.imei}" id="${e.id}">
        <div class="rem_cel" rel="${e.id}">${e.id}</div>
        <div class="rem_cel" rel="${e.groupName ? e.groupName : 'Без Группы'}">${e.groupName ? e.groupName : 'Без Группы'}</div>
        <div class="rem_cel" rel="${e.name}">${e.name}</div>
        <div class="rem_cel" rel="${e.imei}">${e.imei}</div>
    </label>
`).join('');
        return `<div class="wrap_rem">
        <div class="header_index">Настройка объектов<i class="fas fa fa-times close_modal_window"></i></div>
     <label class="rows_rem title_rem">
    <input type="checkbox" class="all_check"id="select-all">
    <div class="rem_cel">ID объекта</div>
    <div class="rem_cel">Имя Группы</div>
    <div class="rem_cel">Имя объекта</div>
    <div class="rem_cel">IMEI</div>
</label>
         <div class="body_indexs body_rem">
                ${rows}</div>
                <div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set history_update">Привязать историю к выбранным объектам</div></div>
        </div>`
    }
}