
import { Tooltip } from '../../../class/Tooltip.js'

export class CreateList {
    constructor(data, login, role) {
        this.data = data;
        this.login = login;
        this.role = role;
        this.lowList = document.querySelector('.low_list');

        this.init();
    }

    init() {
        this.addContainerList();
    }

    addContainerList() {
        // Очищаем предыдущие данные
        this.lowList.innerHTML = '';

        if (this.role === 'Пользователь' || this.role === 'Администратор') {
            // Если аккаунтов нет, отображаем только группы и объекты без групп
            const groupsHtml = this.data.map(el => this.createGroups(el.groups)).join('');
            // Объединяем HTML для групп и объектов без групп
            this.lowList.innerHTML = groupsHtml

        } else {
            this.lowList.innerHTML = this.data.map(el => this.createAccounts(el)).join('');
        }

        this.items = document.querySelectorAll('.listItem');
    }


    createAccounts(el) {
        const nameAccount = el.name;
        const idAccount = el.id;
        const incAccount = el.inc_account;

        return `
            <div class="accounts parent_class" id="${idAccount}"  name="${nameAccount}"rel="${incAccount}" style="display: flex; flex-direction: column; width: 100%;">
                <div class="titleModal">
                   <i class="fas fa-wrench settingsAccount icon_controll" rel="${incAccount}"  idx="${idAccount}"></i>
                      <i class="fa fa-check accountCheck"></i>
                   ${this.createTitleIcons()}
                    ${this.login === 'Демо' ? 'Учетная запись...' : nameAccount}
                </div>
                <div class="hiddenModal" rel="${nameAccount}">
                    ${this.createGroups(el.groups)}   
                                  </div>
            </div>
        `;

    }


    createGroups(groups) {
        return groups.map(group => `
            <div class="groups parent_class" id="${group.group_id}" name="${group.group_name}"rel="${group.inc_group}"idx="${group.group_id}" style="display: flex; flex-direction: column; width: 100%;">
                <div class="titleModalGroup">
                 <i class="fas fa-wrench settingsGroup icon_controll" rel="${group.inc_group}"  idx="${group.group_id}"></i>
                      <i class="fa fa-check chekHidden"></i>
                 ${this.createTitleIcons()}
                    ${this.login === 'Демо' ? 'Группа...' : group.group_name} (${group.objects.length})
                </div>
                <div class="hiddenModal" rel="${group.group_name}">
                    ${this.createObjects(group.objects)}
                </div>
            </div>
        `).join('');
    }

    createObjects(objects) {
        return objects.map(object => `
            <div class="listItem" rel="${object.inc_object}" id="${object.object_id}" name="${object.object_name}" idx="${object.object_id}">
                <div class="list_name2" rel="name">
                  <i class="fas fa-wrench pref icon_controll" rel="${object.inc_object}"  idx="${object.object_id}"></i>
                    <i class="fa fa-check checkInList icon_controll" rel="${object.object_name}" id="${object.object_name}"></i>
                                              ${object.object_name}
                </div>
                  <div class="newCelChange list_profil2" rel="pressure tagach"></div>
                <div class="newCelChange list_trail2" rel="pressure pricep"></div>
            </div>
                 `).join('');
    }

    createTitleIcons() {
        return `
                              <i class="fas fa-toggle-on minusS last_elem"></i>
            <i class="fas fa-toggle-off plusS last_elem"></i>
            <i class="fas fa-sort-amount-up filterV"></i>
            <i class="fas fa-sort-amount-down filterVN" style="display: ${this.login === 'Курсор' ? 'none' : 'inline-block'};"></i>
                `;
    }



}