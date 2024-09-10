

export class ContentGeneration {


  static addListStor(data) {

    const html = data.map(e => `<div class="row_stor_history">
  <div class="cell_stor_history ">${e.action}</div>
    <div class="cell_stor_history ">${e.data}</div>
   <div class="cell_stor_history ">${e.nameUsers}</div>
   <div class="cell_stor_history ">${e.nameAccount}</div>
  </div>`).join('')

    return `<div class="row_stor_history"> 
    <div class="cell_stor_history title_stor_history">Действие</div>
    <div class="cell_stor_history title_stor_history">Дата</div>
   <div class="cell_stor_history title_stor_history">Пользователь</div>
   <div class="cell_stor_history title_stor_history">Учётная запись</div></div>
   ${html}`
  }

  static addIerarhia(data) {
    return data.map(account => `
    <div class="accounts_ierarhia">
        <div class="name_suzh acc_suz"><i class="fas fa-toggle-on check_ier slash_check" rel="plus"></i>
            <i class="fas fa-toggle-off check_ier" rel="minus"></i>${account.nameAccount}</div>
        <div class="body_suzh">
            <div class="name_suzh"><i class="fas fa-toggle-on check_ier slash_check" rel="plus"></i>
            <i class="fas fa-toggle-off check_ier" rel="minus"></i>Пользователи (${account.users.length}):</div>
            <div class="body_suzh">${account.users.map(user => `<div class="name_children_suzh">${user}</div>`).join('')}</div>
            
            <div class="name_suzh"><i class="fas fa-toggle-on check_ier slash_check" rel="plus"></i>
            <i class="fas fa-toggle-off check_ier" rel="minus"></i>Группы (${account.groups.length}):</div>
            <div class="body_suzh">${account.groups.map(group => `<div class="name_children_suzh">${group}</div>`).join('')}</div>
            
            <div class="name_suzh"><i class="fas fa-toggle-on check_ier slash_check" rel="plus"></i>
            <i class="fas fa-toggle-off check_ier" rel="minus"></i>Объекты (${account.objects.length}):</div>
            <div class="body_suzh">${account.objects.map(object => `<div class="name_children_suzh">${object}</div>`).join('')}</div>
            
            <div class="name_suzh"><i class="fas fa-toggle-on check_ier slash_check" rel="plus"></i>
            <i class="fas fa-toggle-off check_ier" rel="minus"></i>Ретрансляторы (${account.retras.length}):</div>
            <div class="body_suzh">${account.retras.map(retra => `<div class="name_children_suzh">${retra}</div>`).join('')}</div>
        </div>
    </div>
`).join('');


  }
  static fomraSetting(role) {
    return `<div class="container_index">
        <div class="header_index"><div class="icons_clear_rows"><i class="fas fa-check-circle position_icons" rel="nodeletes"></i>
        <i class="fas fa-times-circle position_icons" rel="deletes"></div></i>Панель администратора <i class="fas fa-ellipsis-h ierarhia"></i><i class="fas fa fa-times close_modal_window"></i></div>
        <div class="body_index">
        <div class="navi_setting">
        <div class="type_navi" rel="Создать учетную запись" ${role === 'Администратор' ? 'style="display:none;"' : ''} data-att="0">Учетные записи<i class="fas fa-angle-down srows"></i></div>
           <div class="type_navi" rel="Создать пользователя" data-att="1">Пользователи<i class="fas fa-angle-down srows"></i></div>
                   <div class="type_navi" rel="Создать группу" data-att="3">Группы объектов<i class="fas fa-angle-down srows"></i></div>
              <div class="type_navi" rel="Создать объект" data-att="2">Объекты<i class="fas fa-angle-down srows"></i></div>
                             <div class="type_navi" rel="Создать тарифный план"  ${role === 'Администратор' ? 'style="display:none;"' : ''} data-att="4">Тарифные планы<i class="fas fa-angle-down srows"></i></div>
                       <div class="type_navi" rel="Создать ретранслятор" ${role === 'Администратор' ? 'style="display:none;"' : ''}  data-att="5">Ретрансляторы<i class="fas fa-angle-down srows"></i></div>
        </div>
         <div class="table_setting">
         <div class="table_data_info"></div>
               <div class="magazin_stor"></div>
         </div>
        </div>
                      </div>`
  }

  static createFindAndButton(buttonText, index) {
    console.log(index)
    const objectFilterAttribute = {
      '0': [{ attribute: '0', name: 'Имя' }, { attribute: '1', name: 'Создатель' }, { attribute: '2', name: 'Тариф' }],
      '1': [{ attribute: '0', name: 'Имя' }, { attribute: '1', name: 'Создатель' }, { attribute: '2', name: 'Учетная запись' }, { attribute: '3', name: 'Тариф' }],
      '2': [{ attribute: '0', name: 'Имя' }, { attribute: '1', name: 'Создатель' }, { attribute: '2', name: 'Тариф' }, { attribute: '3', name: 'Учетная запись' }, { attribute: '5', name: 'IMEI' }],
      '3': [{ attribute: '0', name: 'Имя' }, { attribute: '1', name: 'Создатель' }, { attribute: '2', name: 'Учетная запись' }],
      '5': [{ attribute: '0', name: 'Имя' }, { attribute: '1', name: 'Создатель' }, { attribute: '2', name: 'Учетная запись' }, { attribute: '3', name: 'Протокол' }]
    }
    const filters = objectFilterAttribute[index] || [];
    const options = filters.map(filter => `<option value="${filter.attribute}">${filter.name}</option>`).join('');
    return `<div class="wrap_settings">
        <div class="moved"><span class="title_moved mov">Действие</span><div class="button_setting" rel="${index}">${buttonText}</div></div>
            <div class="moved"><span class="title_moved fin">Поиск</span><div class="search_list inputs_setting">
                     <select class="select_index_filter">
 <option value="" disabled selected>Фильтр</option>
                     ${options}
                    </select>
                        <input class="search_input set find_input" placeholder="Поиск">
                    </div>
                    <div class="button_setting">Поиск</div>
                    </div>
        </div>`
  }


  static createLK(login, role, creator, creators) {
    console.log(login, role, creator, creators)
    const creatorsRows = creators !== undefined ? [...creators].filter(it => it.incriment !== Number(creator)).map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    return `<div class="wrap_lk">
        <div class="header_index">Новая учетная запись<i class="fas fa fa-times close_modal_window"></i></div>
  <div class="body_indexs">
<div class="row_index"><div class="text_index optional_field">Имя учетной записи</div><input class="input_index" id="uzname"></div>
<div class="row_index"><div class="text_index optional_field">Тарифный план</div><select class="select_index tp">
 <option value="" disabled selected></option>
                        <option value="ТП1">ТП1</option>
                        <option value="ТП2">ТП2</option>
                        <option value="ТП3">ТП3</option>
                    </select></div>
<div class="row_index"><div class="text_low">Создатель</div><select class="select_index creates">
                       <option value="${creator}" data-att="${role}">${login}</option>
                    ${creatorsRows}
                    </select>
</div >
<div class="row_index"><div class="text_index optional_field">Пароль пользователя</div><input class="input_index" id="password" type="password"></div>
<div class="row_index"><div class="text_index optional_field">Подтвердите пароль</div><input class="input_index" id="confirm_password" type="password"></div>

</div>
<div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }

  static editLK(login, prava, creator, property, creators, name, data) {
    console.log(property)
    console.log([creators].length)
    const incriment_account = property.incriment
    const creatorsRows = prava !== 'Сервис-инженер' && [creators].length !== 1 ? [...creators].filter(it => it.incriment !== Number(creator)).map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') :
      ''

    const usersList = data.uniqueUsers.filter(it => it.incriment !== it.uniqCreater && it.incriment_account === incriment_account).map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.name}</div>`).join('')
    const retrasList = data.uniqueRetras.filter(it => it.incriment_account === incriment_account).map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.name}</div>`).join('')
    const groupsList = data.uniqueGroups.filter(it => it.incriment_account === incriment_account).map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.name}</div>`).join('')
    const objectsList = data.uniqueObjects.filter(it => it.incriment_account === incriment_account).map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.name}</div>`).join('')

    return `<div class="wrap_lk">
        <div class="header_index header_edit"><div class="buttons_menu click_button_object" id='objectID'>Учетная запись</div>
        <div class="buttons_menu">Журнал событий</div>
        <i class="fas fa fa-times close_modal_window"></i></div>
  <div class="body_indexs">
<div class="row_index"><div class="text_index optional_field">Имя учетной записи</div><input class="input_index" id="uzname"  value="${name}"></div>
<div class="row_index"><div class="text_index optional_field">Тарифный план</div><select class="select_index tp">
      <option value="${property.tp}">${property.tp}</option>
                        <option value="ТП1">ТП1</option>
                        <option value="ТП2">ТП2</option>
                        <option value="ТП3">ТП3</option>
                    </select></div>
<div class="row_index"><div class="text_low">Создатель</div><select class="select_index creates">
                                                                                                                              <option value="${creator}" data-att="${prava}">${login}</option>
                       ${creatorsRows}
                                                                                                                              </select>
</div ></div>
<div class="sostav_indexs">
<div class="card_indexs users_sostav">
<div class="header_sostav">Пользователи</div>
<div class="body_sostav">${usersList}</div>
</div>
<div class="card_indexs retra_sostav">
<div class="header_sostav">Ретрансляторы</div>
<div class="body_sostav">${retrasList}</div>
</div>
<div class="card_indexs groups_sostav">
<div class="header_sostav">Группы</div>
<div class="body_sostav">${groupsList}</div>
</div>
<div class="card_indexs objects_sostav">
<div class="header_sostav">Объекты</div>
<div class="body_sostav">${objectsList}</div>
</div>
</div>
   <div class="history_stor"></div>
    <div class="footer_index">
<div class="valid_message"></div>
<div class="button_setting recover">Восстановить</div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }

  static createUser(login, role, creator, creators, data) {
    console.log(data)
    const accounts = data.uniqueAccounts
    const objects = data.uniqueObjects
    const groups = data.uniqueGroups
    const usersAcc = data.uniqueUsers
    const acc = usersAcc.find(e => e.incriment === Number(creator))
    const incriment_account = acc ? acc.incriment_account : null
    const account = accounts.find(e => incriment_account === e.incriment)
    console.log(incriment_account)
    const objectsHTML = ContentGeneration.renderModalCheckList(objects, 'объекты')
    const groupsHTML = ContentGeneration.renderModalCheckList(groups, 'группы')
    const propertyResourseHTML = ContentGeneration.renderModalCheckList([{ name: 'Редактирование отчетов', incriment: 'reports' },
    { name: 'Бордовый цвет шапки', incriment: 'settings' }], 'ресурсы', 'resourse')
    const creatorsRows = creators !== undefined ? [...creators].filter(it => it.incriment !== Number(creator)).map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' resourse="${e.resourse}" global_creator="${e.global_creator}" data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''


    return `<div class="wrap_lk wrap_user">
        <div class="header_index">Новый пользователь<i class="fas fa fa-times close_modal_window"></i></div>
          <div class="body_indexs">
<div class="row_index"><div class="text_index optional_field">Имя пользователя</div><input class="input_index" id="username"></div>
<div class="row_index"><div class="text_index optional_field">Пароль пользователя</div><input class="input_index" id="password" type="password"></div>
<div class="row_index"><div class="text_index optional_field">Подтвердите пароль</div><input class="input_index" id="confirm_password" type="password"></div>
<div class="row_index"><div class="text_index optional_field">Права доступа</div><select class="select_index roles" ${role === 'Администратор' ? 'disabled' : ''}>
<option value="" disabled ${role !== 'Администратор' ? 'selected' : ''}></option>
                                              <option value="Курсор">Курсор</option>
                        <option value="Интегратор">Интегратор</option>
                         <option value="Сервис-инженер">Сервис-инженер</option>
                                                     <option value="Пользователь"  ${role === 'Администратор' ? 'selected' : ''}>Пользователь</option>
                    </select></div>
<div class="row_index"><div class="text_low">Создатель</div><select class="select_index creates">
                        <option value="${creator}" data-att="${role}">${login}</option>
                    ${creatorsRows}
                                        </select></div>
<div class="row_index" rel="lk">
    <div class="text_index optional_field">Учетная запись</div>
    <select class="select_index uz" ${role === 'Администратор' ? 'disabled' : ''}>
        ${role !== 'Администратор'
        ? accountsRows
        : `<option value="${account.incriment}" rel="${account.idx}" use="${acc.incriment}" global_creator="${account.global_creator}" data-att="${account.incriment}" selected>${account.name}</option>`}
    </select>
</div>
                     <div class="row_index"><div class="text_index no_optional obj_el">Объекты</div>
                                     <div class="select_index check_list"><div class="name_check_title"></div><i class="fas fa-angle-down icons_open_check_list"></i></div>
                                     <div class="check_container">
                                    ${objectsHTML}
                                   </div>
  </div>
                      <div class="row_index"><div class="text_index no_optional group_el">Группы</div>
                                     <div class="select_index check_list"><div class="name_check_title"></div><i class="fas fa-angle-down icons_open_check_list"></i></div>
                                     <div class="check_container">
                                        ${groupsHTML}
                                   </div>
                    
                    </div>
                     <div class="row_index"><div class="text_index no_optional resourse_el">Ресурсы</div>
                                     <div class="select_index check_list"><div class="name_check_title"></div><i class="fas fa-angle-down icons_open_check_list"></i></div>
                                     <div class="check_container">
                                        ${propertyResourseHTML}
                                   </div>
                    
                    </div>
                    <div class="footer_index">
<div class="valid_message"></div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }


  static editUser(login, role, creator, property, creators, name, data) {
    console.log(property)
    console.log(login)
    const accounts = data.uniqueAccounts
    const objects = data.uniqueObjects
    const groups = data.uniqueGroups
    const usersAcc = data.uniqueUsers
    console.log(objects)
    const objectsHTML = ContentGeneration.renderModalCheckList(objects, 'объекты')
    const groupsHTML = ContentGeneration.renderModalCheckList(groups, 'группы')
    const propertyResourseHTML = ContentGeneration.renderModalCheckList([{ name: 'Редактирование отчетов', incriment: 'reports' },
    { name: 'Бордовый цвет шапки', incriment: 'settings' }], 'ресурсы', 'resourse')
    const creatorsRows = creators !== undefined ? [...creators].filter(it => it.incriment !== property.incriment[1]).map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' del="${e.del}" resourse="${e.resourse}" global_creator="${e.global_creator}" data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''

    const groupsList = property.groups.map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.nameGroup}</div>`).join('')
    const objectsList = property.objects.map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.objectname}</div>`).join('')

    const acc = usersAcc.find(e => e.incriment === Number(creator))
    const incriment_account = acc ? acc.incriment_account : null
    const account = accounts.find(e => incriment_account === e.incriment)

    return `<div class="wrap_lk wrap_user">
       <div class="header_index header_edit"><div class="buttons_menu click_button_object" id='objectID'>Пользователь</div>
        <div class="buttons_menu">Журнал событий</div><i class="fas fa fa-times close_modal_window"></i></div>
          <div class="body_indexs">
<div class="row_index"><div class="text_index optional_field">Имя пользователя</div><input class="input_index" id="username" value="${name}"></div>
<div class="row_index"><div class="text_index optional_field">Пароль пользователя</div><input class="input_index" id="password" type="password" value="${property.password}"></div>
<div class="row_index"><div class="text_index optional_field">Подтвердите пароль</div><input class="input_index" id="confirm_password" type="password"  value="${property.password}"></div>
<div class="row_index"><div class="text_index optional_field">Права доступа</div><select class="select_index roles" ${role === 'Администратор' ? 'disabled' : ''}>
<option value="" disabled ${role !== 'Администратор' ? 'selected' : ''}></option>
                                              <option value="Курсор">Курсор</option>
                        <option value="Интегратор">Интегратор</option>
                         <option value="Сервис-инженер">Сервис-инженер</option>
                                                     <option value="Пользователь"  ${role === 'Администратор' ? 'selected' : ''}>Пользователь</option>
                    </select></div>
<div class="row_index"><div class="text_low">Создатель</div><select class="select_index creates" ${role === 'Администратор' ? 'disabled' : ''}>
   ${role === 'Администратор' ? `<option value="${creator}" rel='${property.global_creator}' data-att="${role}" selected>${login}</option>` : creatorsRows}
                    </select></div>

<div class="row_index" rel="lk">
    <div class="text_index optional_field">Учетная запись</div>
    <select class="select_index uz" ${role === 'Администратор' ? 'disabled' : ''}>
        ${role !== 'Администратор'
        ? accountsRows
        : `<option value="${account.incriment}" rel="${account.idx}" use="${acc.incriment}" global_creator="${account.global_creator}" data-att="${account.incriment}" selected>${account.name}</option>`}
    </select>
</div>
                     <div class="row_index"><div class="text_index no_optional obj_el">Объекты</div>
                                     <div class="select_index check_list"><div class="name_check_title"></div><i class="fas fa-angle-down icons_open_check_list"></i></div>
                                     <div class="check_container">
                                    ${objectsHTML}
                                   </div>
  </div>
                      <div class="row_index"><div class="text_index no_optional group_el">Группы</div>
                                     <div class="select_index check_list"><div class="name_check_title"></div><i class="fas fa-angle-down icons_open_check_list"></i></div>
                                     <div class="check_container">
                                        ${groupsHTML}
                                   </div>
                 
  </div>
    <div class="row_index"><div class="text_index no_optional resourse_el">Ресурсы</div>
                                     <div class="select_index check_list"><div class="name_check_title"></div><i class="fas fa-angle-down icons_open_check_list"></i></div>
                                     <div class="check_container">
                                        ${propertyResourseHTML}
                                   </div>
                    
                    </div>
  </div>
                   
                   <div class="sostav_indexs">
<div class="card_indexs groups_sostav" style="width:49%">
<div class="header_sostav">Группы</div>
<div class="body_sostav">${groupsList}</div>
</div>
<div class="card_indexs objects_sostav" style="width:49%">
<div class="header_sostav">Объекты</div>
<div class="body_sostav">${objectsList}</div>
</div> </div>
                      <div class="history_stor"></div>
                    <div class="footer_index">
<div class="valid_message"></div>
<div class="button_setting recover">Восстановить</div>
  <div class="button_setting bnt_set">Сохранить</div></div>
                </div>`
  }


  static createObj(login, role, creator, creators, data) {
    const accounts = data.uniqueAccounts
    const usersAcc = data.uniqueUsers
    const creatorsRows = creators !== undefined ? [...creators].map(e => `<option value= "${e.incriment}" rel = '${e.idx}' data - att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' global_creator="${e.global_creator}" data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''
    const acc = usersAcc.find(e => e.incriment === Number(creator))
    const incriment_account = acc ? acc.incriment_account : null
    const account = accounts.find(e => incriment_account === e.incriment)
    return ` <div class="wrap_lk wrap_object">
        <div class="header_index">Новый объект<i class="fas fa fa-times close_modal_window"></i></div>
        <div class="body_indexs">
                     
             <div class="row_index">
                  <div class="text_index optional_field">Имя объекта</div><input rel="nameObject" id="objectname" class="input_index">
                </div>
                  <div class="row_index">
                  <div class="text_index no_optional">Тип объекта</div><input rel="typeObject" id="typeobject" class="input_index">
                 </div>
               <div class="row_index">
                <div class="text_index optional_field">Тип устройства</div><input rel="typeDevice" id="typedevice" class="input_index">
                </div>
                 <div class="row_index">
                <div class="text_index optional_field">Порт</div><input rel="port" id="port" class="input_index">
              </div>
                 <div class="row_index">
                <div class="text_index optional_field">Адрес сервера</div><input rel="adress" id="addressserver" class="input_index">
                 </div>
               <div class="row_index">
                 <div class="text_index optional_field">Уникальный ID устройства</div><input rel="imei" id="imeidevice" class="input_index">
                </div>
                <div class="row_index"><div class="text_low">Создатель</div><select class="select_index creates">
                         <option value="${creator}" data-att="${role}">${login}</option>  ${creatorsRows}
                                      </select></div>
<div class="row_index" rel="lk">
    <div class="text_index optional_field">Учетная запись</div>
    <select class="select_index uz" ${role === 'Администратор' ? 'disabled' : ''}>
        ${role !== 'Администратор'
        ? accountsRows
        : `<option value="${account.incriment}" rel="${account.idx}" use="${acc.incriment}" global_creator="${account.global_creator}" data-att="${account.incriment}" selected>${account.name}</option>`}
    </select>
</div>
                                                                          <div class="row_index"><div class="text_index optional_field">Тарифный план</div><select class="select_index tp">
 <option value="" disabled selected></option>
                        <option value="ТП1">ТП1</option>
                        <option value="ТП2">ТП2</option>
                        <option value="ТП3">ТП3</option>
                    </select></div>
                  <div class="row_index">
                  <div class="text_index no_optional">Телефонный номер</div><input rel="number" id="phonenumber" class="input_index">
                </div>
                <div class="row_index">
                 <div class="text_index no_optional">Марка</div><input rel="marka" id="markaobject" class="input_index">
                </div>
              <div class="row_index">
                  <div class="text_index no_optional">Модель</div><input rel="model" id="modelobject" class="input_index">
                 </div>
                 <div class="row_index">
                  <div class="text_index no_optional">VIN</div><input rel="vin" id="vinobject" class="input_index">
                </div>
                <div class="row_index">
                <div class="text_index no_optional">Гос. номер</div><input rel="gosnomer" id="gosnomerobject"  class="input_index">
               </div>
                <div class="row_index hidden_row">
           <div class="text_index no_optional">ДУТ</div><input rel="dut" class="input_index">
                </div>
                    <div class="row_index hidden_row">
                  <div class="text_index no_optional">Угол наклона</div><input rel="angle" class="input_index">
               </div>
                   <div class="row_index">
                  <div class="text_index no_optional">ID Bitrix</div><input rel="idBitrix" id="idbitrixobject" class="input_index">
                </div>
            </div>
            <div class="footer_index">
              <div class="valid_message"></div>
              <div class="button_setting bnt_set">Сохранить</div>
              </div>
        
    </div>`
  }

  static editObj(login, role, property, creator, creators, names, data) {
    //  console.log(login, role, creator, property, creators, names, data)
    console.log(data)
    const { name_retra, incriment_retra, name, typeobject, typeDevice, port, addressserver, imeidevice, idbitrixobject, phonenumber, markaobject, modelobject, vinobject, gosnomerobject } = property
    const accounts = data.uniqueAccounts
    const usersAcc = data.uniqueUsers
    function filt(obj) {
      return obj ? obj : '-'
    }
    const creatorsRows = creators !== undefined ? [...creators].filter(it => it.incriment !== property.incriment[1]).map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' del="${e.del}" global_creator="${e.global_creator}" data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''
    const acc = usersAcc.find(e => e.incriment === Number(creator))
    const incriment_account = acc ? acc.incriment_account : null
    const account = accounts.find(e => incriment_account === e.incriment)

    return ` <div class="wrap_lk wrap_object wrap_edit">
        <div class="header_index header_edit"><div class="buttons_menu click_button_object" id='objectID'>Объект</div>
         <div class="buttons_menu">Журнал событий</div>
        <div class="buttons_menu" id='configID'>Конфигуратор параметров</div>${names}<i class="fas fa fa-times close_modal_window"></i></div>
        <div class="body_indexs">
                     
             <div class="row_index">
                  <div class="text_index optional_field">Имя объекта</div><input rel="nameObject" id="objectname" class="input_index" value="${names}">
                </div>
                  <div class="row_index">
                  <div class="text_index no_optional">Тип объекта</div><input rel="typeObject" id="typeobject" class="input_index" value="${filt(typeobject)}">
                 </div>
               <div class="row_index">
                <div class="text_index optional_field">Тип устройства</div><input rel="typeDevice" id="typedevice" class="input_index" value="${filt(typeDevice)}">
                </div>
                 <div class="row_index">
                <div class="text_index optional_field">Порт</div><input rel="port" id="port" class="input_index" value="${filt(port)}">
              </div>
                 <div class="row_index">
                <div class="text_index optional_field">Адрес сервера</div><input rel="adress" id="addressserver" class="input_index" value="${filt(addressserver)}">
                 </div>
               <div class="row_index">
                 <div class="text_index optional_field">Уникальный ID устройства</div><input rel="imei" id="imeidevice" class="input_index" value="${filt(imeidevice)}">
                </div>
                    <div class="row_index">
                   <div class="text_low">Создатель</div><select class="select_index creates" ${name_retra || role === 'Администратор' ? 'disabled' : ''}>
                     ${!name_retra ? role === 'Администратор' ? `<option value="${creator}" rel='${property.global_creator}' data-att="${role}" selected>${login}</option>` : creatorsRows : `<option value="${incriment_retra}" selected>${name_retra}</option>`}
                                      </select></div>
                                      <div class="row_index" rel="lk"><div class="text_index optional_field">Учетная запись</div><select class="select_index uz" ${name_retra || role === 'Администратор' ? 'disabled' : ''}>
   ${!name_retra ? role === 'Администратор' ? `<option value="${account.incriment}" rel="${account.idx}" use="${acc.incriment}" global_creator="${account.global_creator}" data-att="${account.incriment}" selected>${account.name}</option>`
        : accountsRows : `<option value="${property.incriment[1]}" disabled selected>${name}</option>`}
                                     </select></div>
                                                                          <div class="row_index"><div class="text_index optional_field">Тарифный план</div><select class="select_index tp">
                         <option value="${property.tp ? property.tp : '-'}">${property.tp ? property.tp : '-'}</option>
                        <option value="ТП1">ТП1</option>
                        <option value="ТП2">ТП2</option>
                        <option value="ТП3">ТП3</option>
                    </select></div>
                  <div class="row_index">
                  <div class="text_index no_optional">Телефонный номер</div><input rel="number" id="phonenumber" class="input_index" value="${filt(phonenumber)}">
                </div>
                <div class="row_index">
                 <div class="text_index no_optional">Марка</div><input rel="marka" id="markaobject" class="input_index" value="${filt(markaobject)}">
                </div>
              <div class="row_index">
                  <div class="text_index no_optional">Модель</div><input rel="model" id="modelobject" class="input_index" value="${filt(modelobject)}">
                 </div>
                 <div class="row_index">
                  <div class="text_index no_optional">VIN</div><input rel="vin" id="vinobject" class="input_index" value="${filt(vinobject)}">
                </div>
                <div class="row_index">
                <div class="text_index no_optional">Гос. номер</div><input rel="gosnomer" id="gosnomerobject"  class="input_index" value="${filt(gosnomerobject)}">
               </div>
                <div class="row_index hidden_row">
           <div class="text_index no_optional">ДУТ</div><input rel="dut" class="input_index">
                </div>
                    <div class="row_index hidden_row">
                  <div class="text_index no_optional">Угол наклона</div><input rel="angle" class="input_index">
               </div>
                   <div class="row_index">
                  <div class="text_index no_optional">ID Bitrix</div><input rel="idBitrix" id="idbitrixobject" class="input_index"  value="${filt(idbitrixobject)}">
                </div>
            </div>
            <div class="config_params config_params_wrap">
                <div class="listStorMeta">
                    <div class="item_stor_title">
                        <div class="sensor_stor_name">Название датчика</div>
                        <div class="param_stor_name">Параметр</div>
                        <div class="param_meta_name">Входящий параметр</div>
                    </div>
                    <ul class="list_meta">
                    </ul>
                </div>
                <div class="listDataOldParams">
                    <div class="title_stor_meta">Выбрать параметр<div class="search_list_meta">
                            <i class="loop_find_meta fas fa-search"></i>
                            <input class="search_input_meta" placeholder="Поиск">
                        </div>
                    </div>
                    <ul class="list_old_data"></ul>
                </div>
            </div>
               <div class="sostav_indexs"></div>
               <div class="history_stor"></div>
            <div class="footer_index">
              <div class="valid_message"></div>
              <div class="button_setting recover">Восстановить</div>
              <div class="button_setting bnt_set">Сохранить</div>
              </div>
        
    </div>`
  }


  static editGroup(login, role, creator, property, creators, names, data) {
    console.log(creator, property, creators, names, data)
    const { name_retra, incriment_retra, name, face, facecontact } = property
    const objectsRow = data.uniqueObjects
    const accounts = data.uniqueAccounts
    const usersAcc = data.uniqueUsers
    const objectsHTML = ContentGeneration.renderModalCheckList(objectsRow, 'объекты')
    const creatorsRows = creators !== undefined ? [...creators].map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' global_creator="${e.global_creator}" data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''
    const objectsList = property.objects.map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.objectname}</div>`).join('')
    console.log(objectsList)
    function filt(obj) {
      return obj ? obj : '-'
    }
    const acc = usersAcc.find(e => e.incriment === Number(creator))
    const incriment_account = acc ? acc.incriment_account : null
    const account = accounts.find(e => incriment_account === e.incriment)

    const style = name_retra ? 'style="display: none"' : 'style="display: flex"'
    return ` <div class="wrap_lk wrap_group">
         <div class="header_index header_edit"><div class="buttons_menu click_button_object" id='objectID'>Группа</div>
        <div class="buttons_menu">Журнал событий</div><i class="fas fa fa-times close_modal_window"></i></div>
        <div class="body_indexs">
                     
             <div class="row_index">
                  <div class="text_index optional_field">Имя Группы</div><input rel="nameGroup" id="nameGroup" class="input_index" value="${names}">
                </div>
             <div class="row_index">
                <div class="text_index no_optional">Контактное лицо</div><input rel="face" id="face" class="input_index" value="${filt(face)}">
                </div>
              <div class="row_index">
                <div class="text_index no_optional">Контакт</div><input rel="facecontact" id="facecontact" class="input_index" value="${filt(facecontact)}">
              </div>          
              <div class="row_index">
                <div class="text_low">Создатель</div><select class="select_index creates" ${name_retra || role === 'Администратор' ? 'disabled' : ''}>
                     ${!name_retra ? role === 'Администратор' ? `<option value="${creator}" rel='${property.global_creator}' data-att="${role}" selected>${login}</option>` : creatorsRows : `<option value="${incriment_retra}" selected>${name_retra}</option>`}
                                      </select></div>
                                      <div class="row_index" rel="lk"><div class="text_index optional_field">Учетная запись</div><select class="select_index uz" ${name_retra || role === 'Администратор' ? 'disabled' : ''}>
   ${!name_retra ? role === 'Администратор' ? `<option value="${account.incriment}" rel="${account.idx}" use="${acc.incriment}" global_creator="${account.global_creator}" data-att="${account.incriment}" selected>${account.name}</option>`
        : accountsRows : `<option value="${property.incriment[1]}" disabled selected>${name}</option>`}
                                     </select></div>
                                  <div class="row_index"><div class="text_index no_optional obj_el" ${style}>Объекты</div>
                                     <div class="select_index check_list"   ${style}><div class="name_check_title"></div><i class="fas fa-angle-down icons_open_check_list"></i></div>
                                     <div class="check_container">
                                     ${objectsHTML}
                                   </div>
                            </div>

                                  <div class="sostav_indexs">
<div class="card_indexs objects_sostav" style="width:80%">
<div class="header_sostav">Объекты</div>
<div class="body_sostav">${objectsList}</div>
</div> </div>

        
    </div>
     <div class="sostav_indexs"></div>
   <div class="history_stor"></div>
            <div class="footer_index">
              <div class="valid_message"></div>
              <div class="button_setting recover">Восстановить</div>
              <div class="button_setting bnt_set">Сохранить</div>
              </div>`
  }

  static createGroup(login, role, creator, creators, data) {
    console.log(data)
    const objectsRow = data.uniqueObjects
    const accounts = data.uniqueAccounts
    const usersAcc = data.uniqueUsers
    console.log(accounts)
    const objectsHTML = ContentGeneration.renderModalCheckList(objectsRow, 'объекты')
    const creatorsRows = creators !== undefined ? [...creators].map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' global_creator="${e.global_creator}" data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''

    const acc = usersAcc.find(e => e.incriment === Number(creator))
    const incriment_account = acc ? acc.incriment_account : null
    const account = accounts.find(e => incriment_account === e.incriment)

    return ` <div class="wrap_lk wrap_group">
        <div class="header_index">Новая Группа<i class="fas fa fa-times close_modal_window"></i></div>
        <div class="body_indexs">
                     
             <div class="row_index">
                  <div class="text_index optional_field">Имя Группы</div><input rel="nameGroup" id="nameGroup" class="input_index">
                </div>
             <div class="row_index">
                <div class="text_index no_optional">Контактное лицо</div><input rel="face" id="face" class="input_index">
                </div>
              <div class="row_index">
                <div class="text_index no_optional">Контакт</div><input rel="facecontact" id="facecontact" class="input_index">
              </div>          
              <div class="row_index">
                <div class="text_low">Создатель</div><select class="select_index creates">
                         <option value="${creator}" data-att="${role}">${login}</option>
${creatorsRows}
                                      </select></div>
                                    <div class="row_index" rel="lk">
    <div class="text_index optional_field">Учетная запись</div>
    <select class="select_index uz" ${role === 'Администратор' ? 'disabled' : ''}>
        ${role !== 'Администратор'
        ? accountsRows
        : `<option value="${account.incriment}" rel="${account.idx}" use="${acc.incriment}" global_creator="${account.global_creator}" data-att="${account.incriment}" selected>${account.name}</option>`}
    </select>
</div>
                                    <div class="row_index"><div class="text_index no_optional">Объекты</div>
                                     <div class="select_index check_list"><div class="name_check_title"></div><i class="fas fa-angle-down icons_open_check_list"></i></div>
                                     <div class="check_container">
                                     ${objectsHTML}
                                   </div>
                            </div>

            <div class="footer_index">
              <div class="valid_message"></div>
              <div class="button_setting bnt_set">Сохранить</div>
              </div>
        
    </div>`
  }


  static renderModalCheckList(objects, title, pref) {
    console.log(objects)

    const addClass = pref ? 'resourse_row' : ''
    const accountsRows = objects !== undefined ? [...objects].map(e => `<div class="row_kritery flasher ${addClass}"> <i class="fa fa-check flag_sorting"></i><div class="text_sotring" uniqid="${e.incriment}" incriment_account="${e.incriment_account}" rel='${e.idx}'global="${e.global_creator}" data-att="${e.uniqCreater}">${e.name}</div></div>`).join('') : ''
    const vstavka = ` <div class='header_podtver head_confirm'>Добавить ${title}</div>
            <div class='body_podtver body_sorting list_object_rows'>
            ${accountsRows}
                   </div>
            <div class='button_podtver head_confirm'>
                <div class="ok_podtver">Ок</div>
                <div class="cancel_podtver">Отмена</div>
            </div>`


    return vstavka
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
  static createRetra(login, role, creator, creators, data) {
    const accounts = data.uniqueAccounts
    const creatorsRows = creators !== undefined ? [...creators].map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' global_creator="${e.global_creator}" data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''

    return ` <div class="wrap_lk wrap_retra">
        <div class="header_index">Новый ретранслятор<i class="fas fa fa-times close_modal_window"></i></div>
        <div class="body_indexs">
                     
             <div class="row_index">
                  <div class="text_index optional_field">Имя Ретранслятора</div><input rel="nameRetra" id="nameRetra" class="input_index">
                </div>
                     <div class="row_index"><div class="text_index optional_field">Протокол ретрансляции</div><select class="select_index retra">
              <option value="" disabled selected></option>
                          <option value="Wialon API">Wialon API</option>
                        <option value="Wialon IPS">Wialon IPS</option>
                        <option value="Wialon Retranslation">Wialon Retranslation</option>
                                      </select></div>
                                         <div class="row_index">
                <div class="text_index optional_field">Токен <span class="get_token">получить токен</span></div><input rel="tokenRetra" id="tokenRetra" class="input_index">
              </div>
             <div class="row_index">
                <div class="text_index optional_field">Порт</div><input rel="port_protokol" id="port_protokol" class="input_index">
                </div>
              <div class="row_index">
                <div class="text_low">Создатель</div><select class="select_index creates">
                         <option value="${creator}" data-att="${role}">${login}</option>
${creatorsRows}
                                      </select></div>
                                      <div class="row_index" rel="lk"><div class="text_index optional_field">Учетная запись</div><select class="select_index uz">
<option value="" disabled selected></option>    
  ${accountsRows}
                                     </select></div>
                                                              </div>

            <div class="footer_index">
              <div class="valid_message"></div>
              <div class="button_setting bnt_set">Сохранить</div>
              </div>
        
    </div>`
  }


  static editRetra(creator, creators, property, name, data) {
    // console.log(login, role, creator, creators, property, data)
    console.log(data)
    const accounts = data.uniqueAccounts

    const creatorsRows = creators !== undefined ? [...creators].map(e => `<option value="${e.incriment}" rel='${e.idx}' data-att="${e.role}"'>${e.name}</option>`).join('') : ''
    const accountsRows = accounts !== undefined ? [...accounts].map(e => `<option value="${e.incriment}" rel='${e.idx}' global_creator="${e.global_creator}" data-att="${e.uniqCreater}"'>${e.name}</option>`).join('') : ''

    const groupsList = property.groups.map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.nameGroup}</div>`).join('')
    const objectsList = property.objects.map(e => `<div class="rows_sostav" rel="${e.incriment}">${e.objectname}</div>`).join('')

    return ` <div class="wrap_lk wrap_retra">
        <div class="header_index header_edit"><div class="buttons_menu click_button_object" id='objectID'>Ретранслятор</div>
        <div class="buttons_menu">Журнал событий</div><i class="fas fa fa-times close_modal_window"></i></div>
        <div class="body_indexs">
                     
             <div class="row_index">
                  <div class="text_index optional_field">Имя Ретранслятора</div><input rel="nameRetra" id="nameRetra" class="input_index" value="${name}">
                </div>
                    <div class="row_index"><div class="text_index optional_field">Протокол ретрансляции</div><select class="select_index retra">
                                     <option value="Wialon API">Wialon API</option>
                        <option value="Wialon IPS">Wialon IPS</option>
                        <option value="Wialon Retranslation">Wialon Retranslation</option>
                                      </select></div>
             <div class="row_index">
                <div class="text_index optional_field">Порт</div><input rel="port_protokol" id="port_protokol" class="input_index" value="${property.port_protokol}">
                </div>
              
                 <div class="row_index">
                <div class="text_index optional_field">Токен <span class="get_token">получить токен</span></div><input rel="tokenRetra" id="tokenRetra" class="input_index" value="${property.tokenRetra}">
              </div>
                        <div class="row_index">
                <div class="text_low">Создатель</div><select class="select_index creates">
                     ${creatorsRows}
                                      </select></div>
                                      <div class="row_index" rel="lk"><div class="text_index optional_field">Учетная запись</div><select class="select_index uz">
<option value="" disabled selected></option>    
  ${accountsRows}
                                     </select></div>
                                                              </div>
            <div class="sostav_indexs">
<div class="card_indexs groups_sostav" style="width:49%">
<div class="header_sostav">Группы</div>
<div class="body_sostav">${groupsList}</div>
</div>
<div class="card_indexs objects_sostav" style="width:49%">
<div class="header_sostav">Объекты</div>
<div class="body_sostav">${objectsList}</div>
</div> </div>
   <div class="history_stor"></div>
            <div class="footer_index">
              <div class="valid_message"></div>
              <div class="button_setting recover">Восстановить</div>
              <div class="button_setting bnt_set">Сохранить</div>
              </div>
        
    </div>`
  }

  static addTableAccount() {
    return `<table class="table_stata table_admin_panel">
      <tr class="rows_statas">
        <th class="cell_stata cel header_account_table">Имя</th>
        <th class="cell_stata cel header_account_table">Создатель</th>
        <th class="cell_stata cel header_account_table">Тарифный план</th>
        <th class="cell_stata cel header_account_table">Пользователи</th>
             <th class="cell_stata cel header_account_table">Ретрансляторы</th>
           <th class="cell_stata cel header_account_table">Группы</th>
        <th class="cell_stata cel header_account_table">Объекты</th>
             <th class="cell_stata cel header_account_table">Удалить</th>
      </tr>
    </table>`
  }

  static addTableUser() {
    return `<table class="table_stata table_admin_panel">
      <tr class="rows_statas">
        <th class="cell_stata cel header_account_table">Имя</th>
        <th class="cell_stata cel header_account_table">Создатель</th>
        <th class="cell_stata cel header_account_table">Учетная запись</th>
        <th class="cell_stata cel header_account_table">Тарифный план</th>
        <th class="cell_stata cel header_account_table">Права</th>
             <th class="cell_stata cel header_account_table">Группы</th>
                  <th class="cell_stata cel header_account_table">Объекты</th>
             <th class="cell_stata cel header_account_table">Удалить</th>
      </tr>
    </table>`
  }
  static addTableObject() {
    return `<table class="table_stata table_admin_panel">
      <tr class="rows_statas">
        <th class="cell_stata cel header_account_table">Имя</th>
        <th class="cell_stata cel header_account_table">Создатель</th>
        <th class="cell_stata cel header_account_table">Тарифный план</th>
        <th class="cell_stata cel header_account_table">Учетная запись</th>
        <th class="cell_stata cel header_account_table">Группы</th>
        <th class="cell_stata cel header_account_table">IMEI</th>
        <th class="cell_stata cel header_account_table">Удалить</th>
      </tr>
    </table>`
  }

  static addTableGroup() {
    return `<table class="table_stata table_admin_panel">
      <tr class="rows_statas">
        <th class="cell_stata cel header_account_table">Имя</th>
        <th class="cell_stata cel header_account_table">Создатель</th>
              <th class="cell_stata cel header_account_table">Учетная запись</th>
        <th class="cell_stata cel header_account_table">Объекты</th>
             <th class="cell_stata cel header_account_table">Удалить</th>
      </tr>
    </table>`
  }

  static addTableRetra() {
    return `<table class="table_stata table_admin_panel">
      <tr class="rows_statas">
        <th class="cell_stata cel header_account_table">Имя</th>
        <th class="cell_stata cel header_account_table">Создатель</th>
              <th class="cell_stata cel header_account_table">Учетная запись</th>
                  <th class="cell_stata cel header_account_table">Протокол</th>
        <th class="cell_stata cel header_account_table">Объекты</th>
         <th class="cell_stata cel header_account_table">Группы</th>
             <th class="cell_stata cel header_account_table">Удалить</th>
      </tr>
    </table>`
  }



  static confirm(obj, name) {
    return `
        <div class="modal_podtver del_admin_panel">
        <div class='header_podtver'>Подтверждение</div>
          <div class='body_podtver_install '>Удалить ${obj} ${name}</div>
          <div class='button_podtver'>
          <div class="ok_podtver">Ок</div>
          <div class="cancel_podtver">Отмена</div>
          </div>
        </div>`
  }
}