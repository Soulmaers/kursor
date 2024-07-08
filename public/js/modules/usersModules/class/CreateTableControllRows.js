import { ContentGeneration } from "./CreateContent.js"
import { Requests } from './RequestStaticMethods.js'


export class CreateTableControllRows {
    constructor(index, container) {
        console.log(container)
        this.index = index
        this.table = container.querySelector('.table_data_info')
        this.creater = document.querySelector('.role').getAttribute('data-att')
        this.prava = document.querySelector('.role').getAttribute('rel')
        this.init()
    }


    init() {
        this.controller()
    }


    controller() {
        switch (this.index) {
            case '0': this.createTableAccount()
                break
            case '1': this.createTableUser()
                break
        }
    }


    async createTableAccount() {
        this.table.innerHTML = ContentGeneration.addTableAccount()
        this.result = await Requests.getAccountUsers(this.creater)

        // Создаем объект для хранения количества пользователей по уникальному аккаунту
        const usersCountByAccount = {};

        // Итерируемся по массиву данных
        this.result.forEach(item => {
            const accountId = item.incriment[0];
            const userId = item.incriment[1];

            // Если аккаунт уже есть в объекте, увеличиваем счетчик пользователей
            if (usersCountByAccount[accountId]) {
                usersCountByAccount[accountId]++;
            } else {
                // Иначе инициализируем счетчик с единицей
                usersCountByAccount[accountId] = 1;
            }
        });
        this.addContentAccount()

    }


    addContentAccount() {
        const tableParent = this.table.querySelector('.table_stata')
        const uniqueAccounts = {};

        // Итерируемся по массиву данных
        this.result.forEach(item => {
            const accountId = item.incriment[0];
            const user = item.incriment[1]
            // Если аккаунт уже есть в объекте, увеличиваем счетчик пользователей
            if (uniqueAccounts[accountId] && user !== item.uniqCreater) {
                uniqueAccounts[accountId].usersCount++;
            } else {
                // Иначе создаем новую запись для аккаунта
                uniqueAccounts[accountId] = {
                    id: item.uniqCreater,
                    role: item.creator_role,
                    creater: item.creater,
                    name: item.name[0],
                    creator_name: item.creator_name,
                    uniqTP: item.uniqTP,
                    usersCount: user !== item.uniqCreater ? 1 : 0,
                    incrimentAccount: accountId
                };
            }
        });

        // Преобразуем объект в массив для удобства использования
        const data = Object.values(uniqueAccounts).map(account => {
            return [{ id: account.id, role: account.role, creater: account.creater, incrimentAccount: account.incrimentAccount },
            [account.name, account.creator_name, account.uniqTP, account.usersCount, 0, 0, 'x']];
        });
        console.log(data)
        data.forEach(el => {
            if (this.prava === 'Курсор') {
                this.addRowToTable(tableParent, el)
            }
            else if (this.prava === 'Интегратор') {
                if (el[0].id === Number(this.creater) || el[0].creater === Number(this.creater)) {
                    this.addRowToTable(tableParent, el)
                }
            } else {
                if (el[0].id === Number(this.creater)) {
                    this.addRowToTable(tableParent, el)
                }
            }
        });
    }
    // Функция для добавления строки в таблицу
    addRowToTable(tableParent, rowData) {
        console.log(rowData)
        const tr = document.createElement('tr');
        tr.classList.add('rows_stata', 'rows_move_kursor');
        tr.innerHTML = rowData[1].map(it => `<th class="cell_stata cell cell_table_auth">${it}</th>`).join('');
        tableParent.appendChild(tr);
        const lastRow = tableParent.lastElementChild;
        const lastCell = lastRow.lastElementChild;
        this.idDelete = this.index === '0' ? rowData[0].incrimentAccount : rowData[0].id
        lastCell.addEventListener('click', this.updateTable.bind(this, this.idDelete));
    };

    async updateTable(id) {
        await Requests.deleteAccount(id, this.index)
        this.init()
    }
    async createTableUser() {
        this.table.innerHTML = ContentGeneration.addTableUser()
        this.result = await Requests.getAccountUsers(this.creater)
        this.addContentUsers()

    }

    addContentUsers() {
        const tableParent = this.table.querySelector('.table_stata')
        console.log(this.result)
        const data = this.result.map(el => {
            return [{ id: el.incriment[1], role: el.role, creater: el.creater, uniqCreater: el.uniqCreater },
            [el.name[1], el.creator_name, el.name[0], el.uniqTP, el.role, 'x']];
        });

        console.log(data)
        data.forEach(el => {
            if (this.prava === 'Курсор') {
                this.addRowToTable(tableParent, el)
            }
            else if (this.prava === 'Интегратор') {
                if (el[0].uniqCreater === Number(this.creater) || el[0].creater === Number(this.creater)) {
                    this.addRowToTable(tableParent, el)
                }
            } else {
                if (el[0].uniqCreater === Number(this.creater)) {
                    this.addRowToTable(tableParent, el)
                }
            }
        });
    }
}
