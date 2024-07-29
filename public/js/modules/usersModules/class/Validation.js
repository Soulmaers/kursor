import { Helpers } from "./Helpers.js";
import { Requests } from './RequestStaticMethods.js'
import { ContentGeneration } from './CreateContent.js'

export class Validation {

    static updateUZRowVisibility(roles, uzRow, objel, groupel) {
        // Функция для обновления видимости элементов
        function updateVisibility() {
            const selectedValue = roles.value;
            let shouldHide = false;

            // Проверяем, нужно ли скрыть элементы
            if (selectedValue === 'Курсор' || selectedValue === 'Интегратор' || selectedValue === 'Сервис-инженер') {
                shouldHide = true;
                const groupsCar = document.querySelectorAll('.activ_check');
                groupsCar.forEach(e => e.classList.remove('activ_check'));
            }

            // Обновляем видимость элементов
            uzRow.style.display = shouldHide ? 'none' : 'flex';
            objel.style.display = shouldHide ? 'none' : 'flex';
            groupel.style.display = shouldHide ? 'none' : 'flex';
            uzRow.children[1].selectedIndex = -1; // Сброс выбранного значения
        }

        // Добавляем обработчик события изменения значения селекта
        roles.addEventListener('change', updateVisibility);

        // Инициализируем состояние видимости при загрузке
        updateVisibility();
    }

    // Функция для проверки совпадения паролей
    static checkPasswords(passwordInput, confirmPasswordInput, mess) {
        confirmPasswordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            if (password !== confirmPassword) {
                confirmPasswordInput.style.border = '1px solid red'
            }
            else {
                confirmPasswordInput.style.border = '1px solid green'
            }
        });
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            if (password !== confirmPassword) {
                confirmPasswordInput.style.border = '1px solid red'
            }
            else {
                confirmPasswordInput.style.border = '1px solid green'
            }
        });
    }


    static filterRole(roles, selectedRole, createsUser, uzRow) {

        const options = roles.options
        const optionUz = uzRow.options
        // Блокируем опции в зависимости от выбранной роли
        if (selectedRole === 'Интегратор') {
            disableOptions(['Интегратор', 'Курсор']);
        } else if (selectedRole === 'Сервис-инженер') {
            disableOptions(['Интегратор', 'Курсор', 'Сервис-инженер']);
        }
        // Функция для блокировки опций
        function disableOptions(valuesToDisable) {
            for (let i = 0; i < options.length; i++) {
                if (valuesToDisable.includes(options[i].value)) {
                    options[i].setAttribute('disabled', 'disabled');
                }
            }
        }
        createsUser.addEventListener('change', function (event) {
            const title = document.querySelectorAll('.name_check_title')
            title.forEach(e => e.textContent = '')
            roles.selectedIndex = -1;
            uzRow.selectedIndex = -1;
            for (let i = 0; i < options.length; i++) {
                options[i].removeAttribute('disabled');
                optionUz[i].style.display = 'block'
            }
            // Получаем выбранное значение
            const selectedValue = this.options[this.selectedIndex].getAttribute('data-att');
            const creator = this.options[this.selectedIndex].value
            // Переприменяем фильтрацию ролей при изменении
            Validation.filterAccount(creator, uzRow, selectedValue)
            Validation.filterRole(roles, selectedValue, createsUser, uzRow);

        });
    }



    static filterCreater(createsUser, uzRow,) {
        createsUser.addEventListener('change', function (event) {
            const title = document.querySelectorAll('.name_check_title')
            title.forEach(e => e.textContent = '')
            const optionUz = uzRow.options
            uzRow.selectedIndex = -1;
            for (let i = 0; i < optionUz.length; i++) {
                optionUz[i].style.display = 'block'
            }

            // Получаем выбранное значение
            const selectedValue = this.options[this.selectedIndex].getAttribute('data-att');
            const creator = this.options[this.selectedIndex].value
            console.log(selectedValue, creator)
            // Переприменяем фильтрацию ролей при изменении
            Validation.filterAccount(creator, uzRow, selectedValue)
        });
    }

    static filterCreaterObject(createsUser, uzRow, rowKrytery) {
        createsUser.addEventListener('change', function (event) {
            const title = document.querySelectorAll('.name_check_title')
            title.forEach(e => e.textContent = '')
            const optionUz = uzRow.options
            uzRow.selectedIndex = -1;
            for (let i = 0; i < optionUz.length; i++) {
                optionUz[i].style.display = 'block'
            }
            rowKrytery.forEach(el => el.style.display = 'flex')
            // Получаем выбранное значение
            const selectedValue = this.options[this.selectedIndex].getAttribute('data-att');
            const creator = this.options[this.selectedIndex].value
            // Переприменяем фильтрацию ролей при изменении
            Validation.filterAccount(creator, uzRow, selectedValue)
            Validation.filterObject(creator, rowKrytery, selectedValue)
            rowKrytery.forEach(e => e.querySelector('.flag_sorting').classList.remove('activ_check'))
        });
    }

    static check(row) {
        console.log('выбор чек')
        row.forEach(e => e.addEventListener('click', () => {
            console.log('клик')
            e.querySelector('.flag_sorting').classList.toggle('activ_check')
        }))
    }


    static filterAccount(creator, uzRow, selectedValue) {
        console.log('селект аккаунт')
        if (selectedValue === 'Курсор') return
        const options = uzRow.options
        for (let i = 0; i < options.length; i++) {
            console.log(creator, options[i].getAttribute('data-att'), options[i].getAttribute('global_creator'))
            if (creator !== options[i].getAttribute('data-att') && creator !== options[i].getAttribute('global_creator')) {
                options[i].style.display = 'none'
            }
            else {
                options[i].style.display = 'block'
            }
        }
    }

    static filterObject(creator, rowKrytery, selectedValue) {
        if (selectedValue === 'Курсор') return
        for (let i = 0; i < rowKrytery.length; i++) {
            const id = rowKrytery[i].querySelector('.text_sotring').getAttribute('data-att')
            const globalId = rowKrytery[i].querySelector('.text_sotring').getAttribute('global')
            if (creator !== id && creator !== globalId) {
                rowKrytery[i].style.display = 'none'
            }
        }
    }

    static filterSelectAccount(account, rowKrytery) {
        account.addEventListener('change', async function (event) {
            const title = document.querySelectorAll('.name_check_title')
            title.forEach(e => e.textContent = '')
            rowKrytery.forEach(el => el.style.display = 'flex')
            const displays = document.querySelector('.displays')
            if (displays) displays.classList.remove('displays')
            // Получаем выбранное значение
            const incriment_account = this.options[this.selectedIndex].value
            // Переприменяем фильтрацию ролей при изменении
            Validation.filterElements(incriment_account, rowKrytery)
            rowKrytery.forEach(e => e.querySelector('.flag_sorting').classList.remove('activ_check'))
        });

    }

    static filterElements(incriment_account, rowKrytery) {
        let bool = false
        for (let i = 0; i < rowKrytery.length; i++) {
            const account_element_incriment = rowKrytery[i].querySelector('.text_sotring').getAttribute('incriment_account')
            if (incriment_account !== account_element_incriment) {
                rowKrytery[i].style.display = 'none'
            }
            else {
                bool = true
            }
        }
        return bool
    }

    static creator(selects, creator) {
        const options = selects.options
        Array.from(options).forEach(i => { if (Number(i.value) === creator) { i.selected = true } })
    }

    static role(selects, role) {
        const options = selects.options
        Array.from(options).forEach(i => { if (i.value === role) { i.selected = true } })
    }
    static protokol(selects, protokol) {
        const options = selects.options
        Array.from(options).forEach(i => { if (i.value === protokol) { i.selected = true } })
    }

    static account(selects, incriment) {
        const options = selects.options
        Array.from(options).forEach(i => {
            if (Number(i.value) === incriment) { i.selected = true }
        })
    }
    static protokol(selects, element) {
        function sel(selects, element) {
            console.log('здесь')
            console.log(selects)
            const selectedOption = selects.options[selects.selectedIndex].value
            element.parentElement.style.display = selectedOption === 'Wialon API' ? 'flex' : 'none'
        }
        sel(selects, element)

        selects.addEventListener('change', () => sel(selects, element))
    }

    static activated(objects, groups, property) {
        const activateFlags = (elements, incriments) => {
            elements.forEach(e => {
                if (incriments.includes(Number(e.querySelector('.text_sotring').getAttribute('uniqid')))) {
                    e.querySelector('.flag_sorting').classList.add('activ_check');
                }
            });
        };

        if (objects) activateFlags(objects.querySelectorAll('.row_kritery'), property.objects.map(e => e.incriment));
        if (groups) activateFlags(groups.querySelectorAll('.row_kritery'), property.groups.map(e => e.incriment));

    }
}
