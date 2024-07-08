import { Helpers } from "./Helpers.js";


export class Validation {

    static updateUZRowVisibility(roles, uzRow) {
        roles.addEventListener('change', () => {
            let shouldHide = false;
            const selectedValue = roles.value;
            console.log(selectedValue)
            if (selectedValue === 'Курсор' || selectedValue === 'Интегратор' || selectedValue === 'Сервис-инженер') {
                shouldHide = true;
            }
            uzRow.style.display = shouldHide ? 'none' : 'flex';
            console.log(uzRow.children[0])
            uzRow.children[1].selectedIndex = -1;
        });
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
        console.log(uzRow)
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
            roles.selectedIndex = -1;
            uzRow.selectedIndex = -1;
            for (let i = 0; i < options.length; i++) {
                options[i].removeAttribute('disabled');
            }
            for (let i = 0; i < options.length; i++) {
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

    static filterAccount(creator, uzRow, selectedValue) {
        console.log(creator, uzRow, selectedValue)
        if (selectedValue === 'Курсор') return
        const options = uzRow.options
        console.log(options)
        for (let i = 0; i < options.length; i++) {
            if (creator !== options[i].getAttribute('data-att')) {
                options[i].style.display = 'none'
            }
        }
    }

}
