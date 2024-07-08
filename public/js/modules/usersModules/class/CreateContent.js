

export class ContentGeneration {


  static fomraSetting() {
    return `<div class="container_index">
        <div class="header_index">Панель администратора<i class="fas fa fa-times close_modal_window"></i></div>
        <div class="body_index">
        <div class="navi_setting">
        <div class="type_navi" rel="Создать учетную запись" data-att="0">Учетные записи<i class="fas fa-angle-down srows"></i></div>
           <div class="type_navi" rel="Создать пользователя" data-att="1">Пользователи<i class="fas fa-angle-down srows"></i></div>
              <div class="type_navi" rel="Создать объект" data-att="2">Объекты<i class="fas fa-angle-down srows"></i></div>
                 <div class="type_navi" rel="Создать группу" data-att="3">Группы объектов<i class="fas fa-angle-down srows"></i></div>
                    <div class="type_navi" rel="Создать тарифный пан"data-att="4">Тарифные планы<i class="fas fa-angle-down srows"></i></div>
                       <div class="type_navi" rel="Создать ретранслятор" data-att="5">Ретрансляторы<i class="fas fa-angle-down srows"></i></div>
        </div>
         <div class="table_setting">
         <div class="table_data_info"></div>
               <div class="magazin_stor"></div>
         </div>
        </div>
                </div>`
  }

  static createFindAndButton(buttonText, index) {
    return `<div class="wrap_settings">
        <div class="moved"><span class="title_moved mov">Действие</span><div class="button_setting" rel="${index}">${buttonText}</div></div>
            <div class="moved"><span class="title_moved fin">Поиск</span><div class="search_list inputs_setting">
                     <select class="select_index_filter">
 <option value="" disabled selected>Фильтр</option>
                        <option value="1">Имя</option>
                        <option value="2">Объект</option>
                        <option value="3">Группа</option>
                    </select>
                        <input class="search_input set find_input" placeholder="Поиск">
                    </div>
                    <div class="button_setting">Поиск</div>
                    </div>
        </div>`
  }


  static createLK(login, role, creator, creators) {
    const creatorsRows = creators !== undefined ? [...creators].map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''

    return `<div class="wrap_lk">
        <div class="header_index">Новая учетная запись<i class="fas fa fa-times close_modal_window"></i></div>
  <div class="body_indexs">
<div class="row_index"><div class="text_index">Имя учетной записи</div><input class="input_index" id="uzname"></div>
<div class="row_index"><div class="text_index">Тарифный план</div><select class="select_index tp">
 <option value="" disabled selected></option>
                        <option value="1">ТП1</option>
                        <option value="2">ТП2</option>
                        <option value="3">ТП3</option>
                    </select></div>
<div class="row_index"><div class="text_low">Создатель</div><select class="select_index creates">
                       <option value="${creator}" data-att="${role}">${login}</option>
                    ${creatorsRows}
                    </select>
</div ></div>
<div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }


  static createUser(login, role, creator, creators, accounts) {
    console.log(login, role, creator, creators, accounts)
    const creatorsRows = creators !== undefined ? [...creators].map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''

    return `<div class="wrap_lk wrap_user">
        <div class="header_index">Новый пользователь<i class="fas fa fa-times close_modal_window"></i></div>
          <div class="body_indexs">
<div class="row_index"><div class="text_index">Имя пользователя</div><input class="input_index" id="username"></div>
<div class="row_index"><div class="text_index">Пароль пользователя</div><input class="input_index" id="password" type="password"></div>
<div class="row_index"><div class="text_index">Подтвердите пароль</div><input class="input_index" id="confirm_password" type="password"></div>
<div class="row_index"><div class="text_index">Права доступа</div><select class="select_index roles">
<option value="" disabled selected></option>
                                              <option value="Курсор">Курсор</option>
                        <option value="Интегратор">Интегратор</option>
                         <option value="Сервис-инженер">Сервис-инженер</option>
                          <option value="Администратор">Администратор</option>
                             <option value="Пользователь">Пользователь</option>
                    </select></div>
<div class="row_index"><div class="text_low">Создатель</div><select class="select_index creates">
                        <option value="${creator}" data-att="${role}">${login}</option>
                    ${creatorsRows}
                    </select></div>
<div class="row_index" rel="lk"><div class="text_index">Учетная запись</div><select class="select_index uz">
<option value="" disabled selected></option>
                    ${accountsRows}
                    </select></div></div>
                    <div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }
  static createObj() {
    return `<div class="wrap_lk wrap_user">
        <div class="header_index">Новый объект<i class="fas fa fa-times close_modal_window"></i></div>
          <div class="body_indexs"></div>
            <div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }
  static createGroup() {
    return `<div class="wrap_lk wrap_user">
        <div class="header_index">Новая группа<i class="fas fa fa-times close_modal_window"></i></div>
             <div class="body_indexs"></div>
            <div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }
  static createPrice() {
    return `<div class="wrap_lk wrap_user">
        <div class="header_index">Новый тарифный план<i class="fas fa fa-times close_modal_window"></i></div>
             <div class="body_indexs"></div>
            <div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }
  static createRetro() {
    return `<div class="wrap_lk wrap_user">
        <div class="header_index">Новый ретранслятор<i class="fas fa fa-times close_modal_window"></i></div>
             <div class="body_indexs"></div>
            <div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }



  static addTableAccount() {
    return `<table class="table_stata">
      <tr class="rows_stata ">
        <th class="cell_stata cel header_account_table">Имя</th>
        <th class="cell_stata cel header_account_table">Создатель</th>
        <th class="cell_stata cel header_account_table">Тарифный план</th>
        <th class="cell_stata cel header_account_table">Пользователи</th>
        <th class="cell_stata cel header_account_table">Объекты</th>
        <th class="cell_stata cel header_account_table">Группы</th>
        <th class="cell_stata cel header_account_table">Удалить</th>
      </tr>
    </table>`
  }

  static addTableUser() {
    return `<table class="table_stata">
      <tr class="rows_stata">
        <th class="cell_stata cel header_account_table">Имя</th>
        <th class="cell_stata cel header_account_table">Создатель</th>
        <th class="cell_stata cel header_account_table">Учетная запись</th>
        <th class="cell_stata cel header_account_table">Тарифный план</th>
        <th class="cell_stata cel header_account_table">Права</th>
             <th class="cell_stata cel header_account_table">Удалить</th>
      </tr>
    </table>`
  }
}