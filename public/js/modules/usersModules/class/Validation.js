import { Helpers } from "./Helpers.js";
import { Requests } from './RequestStaticMethods.js'
import { ContentGeneration } from './CreateContent.js'

export class Validation {


    static status = {
        statusTime: true,
        statusDistance: true
    }
    static updateUZRowVisibility(roles, uzRow, objel, groupel, resourseEl) {
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
            resourseEl.style.display = shouldHide ? 'none' : 'flex';
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



    static filterCreater(createsUser, uzRow) {
        console.log(createsUser, uzRow)
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
        console.log(options)
        for (let i = 0; i < options.length; i++) {
            console.log(creator, options[i].getAttribute('data-att'), options[i].getAttribute('use'), options[i].getAttribute('global_creator'))
            if (creator === options[i].getAttribute('data-att') || creator === options[i].getAttribute('use') || creator === options[i].getAttribute('global_creator')) {
                options[i].style.display = 'block'
            }
            else {
                options[i].style.display = 'none'
            }
        }
    }

    static filterObject(creator, rowKrytery, selectedValue) {
        if (selectedValue === 'Курсор') return
        for (let i = 0; i < rowKrytery.length; i++) {
            const id = rowKrytery[i].querySelector('.text_sotring').getAttribute('data-att')
            const globalId = rowKrytery[i].querySelector('.text_sotring').getAttribute('global')
            console.log(creator, id, globalId)
            if (creator !== id && creator !== globalId) {
                rowKrytery[i].style.display = 'none'
            }
        }
    }

    static filterSelectAccount(account, rowKrytery) {
        console.log(rowKrytery)
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
        console.log(incriment_account)
        console.log(rowKrytery)
        const rows = [...rowKrytery].filter(e => !e.classList.contains('resourse_row'))
        console.log(rows)
        let bool = false
        for (let i = 0; i < rows.length; i++) {
            const account_element_incriment = rows[i].querySelector('.text_sotring').getAttribute('incriment_account')
            console.log(account_element_incriment)
            if (incriment_account !== account_element_incriment) {
                rows[i].style.display = 'none'
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

    static type(selects, type) {
        console.log(selects)
        console.log(type)
        const options = selects.options
        Array.from(options).forEach(i => { if (i.value === type) { i.selected = true } })
    }


    static protokols(selects, protokol, elements) {
        const options = selects.options
        Array.from(options).forEach(i => { if (i.value === protokol) { i.selected = true } })
        Validation.protokol(selects, elements)
    }

    static account(selects, incriment) {
        const options = selects.options;
        Array.from(options).forEach(i => {
            if (Number(i.value) === incriment) {
                i.selected = true;
                if (i.getAttribute('del') === 'true') {
                    i.text = '';  // Если атрибут `del` равен 'true' или 'false', очищаем текст этого элемента
                    i.value = ''
                }
            }
        });
    }
    static protokol(selects, element) {
        function sel(selects, element) {
            const selectedOption = selects.options[selects.selectedIndex].value
            element.parentElement.style.display = selectedOption === 'Wialon API' ? 'flex' : 'none'
        }
        sel(selects, element)

        selects.addEventListener('change', () => sel(selects, element))
    }

    static activated(objects, groups, property, resourses) {
        const activateFlags = (elements, incriments) => {
            elements.forEach(e => {
                if (incriments.includes(e.querySelector('.text_sotring').getAttribute('uniqid'))) {
                    e.querySelector('.flag_sorting').classList.add('activ_check');
                }
            });
        };


        console.log(property.resourse[0])
        if (objects) activateFlags(objects.querySelectorAll('.row_kritery'), property.objects.map(e => String(e.incriment)));
        if (groups) activateFlags(groups.querySelectorAll('.row_kritery'), property.groups.map(e => String(e.incriment)));
        if (property.resourse[0]) {
            const getTrueKeys = Object.keys(property.resourse[0]).filter(key => property.resourse[0][key] === "true");
            activateFlags(resourses.querySelectorAll('.row_kritery'), getTrueKeys)

        }
    }


    static validDistance(elements) {
        elements.forEach(e => {
            e.addEventListener('click', function (e) {
                //  this.setSelectionRange(0, 1);
                this.select()
            })
        })
        elements.forEach(e => e.addEventListener('keydown', function (e) {
            const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowLeft', 'ArrowRight'];
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault(); // Запрещаем ввод любых символов, кроме цифр и навигационных клавиш
            }
        }))
    }

    static validationData(elements) {
        elements.forEach(e => {
            const time = e
            console.log(time)
            time.addEventListener('click', function (e) {
                const pos = this.selectionStart;
                console.log(pos)
                if (pos === 0) {
                    this.setSelectionRange(0, 1); // Выделить первый символ (часы)
                } else if (pos === 1) {
                    this.setSelectionRange(1, 2); // Выделить второй символ (часы)
                } else if (pos === 2) {
                    this.setSelectionRange(1, 2); // Выделить второй символ (часы)
                } else if (pos === 3) {
                    this.setSelectionRange(3, 4); // Выделить первый символ минут
                } else if (pos === 4) {
                    this.setSelectionRange(4, 5); // Выделить второй символ минут
                } else if (pos === 5) {
                    this.setSelectionRange(4, 5); // Выделить второй символ минут
                } else if (pos === 6) {
                    this.setSelectionRange(6, 7); // Выделить первый символ секунд
                } else if (pos === 7) {
                    this.setSelectionRange(7, 8); // Выделить второй символ секунд
                }
            });
            time.addEventListener('keydown', function (e) {
                const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowLeft', 'ArrowRight'];

                if (!allowedKeys.includes(e.key)) {
                    e.preventDefault(); // Запрещаем ввод любых символов, кроме цифр и навигационных клавиш
                }

                const pos = this.selectionStart;

                if (e.key >= '0' && e.key <= '9') {
                    if (pos === 0 || pos === 1) {
                        // Ввод часов
                        this.value = setCharAt(this.value, pos, e.key);
                        if (pos === 0) {
                            this.setSelectionRange(1, 2); // Переходим ко второй цифре часов
                        } else {
                            this.setSelectionRange(3, 4); // Пропускаем двоеточие и переходим к минутам
                        }
                    } else if (pos === 3 || pos === 4) {
                        // Ввод минут
                        this.value = setCharAt(this.value, pos, e.key);
                        if (pos === 3) {
                            this.setSelectionRange(4, 5); // Переходим ко второй цифре минут
                        } else {
                            this.setSelectionRange(6, 7); // Пропускаем двоеточие и переходим к секундам
                        }
                    } else if (pos === 6 || pos === 7) {
                        // Ввод секунд
                        this.value = setCharAt(this.value, pos, e.key);
                        if (pos === 6) {
                            this.setSelectionRange(7, 8); // Переходим ко второй цифре секунд
                        }
                    }
                    e.preventDefault(); // Запрещаем стандартное поведение
                }
            });

            // Функция для замены символа в строке
            function setCharAt(str, index, chr) {
                if (index > str.length - 1) return str;
                return str.substring(0, index) + chr + str.substring(index + 1);
            }
        })
    }


    static validationMoreLittle(min, max, mess, statusName, com) {
        const minElement = min.previousElementSibling.previousElementSibling
        const maxElement = max.previousElementSibling.previousElementSibling
        min.addEventListener(com, () => {
            Validation.proverkaSosed([minElement, maxElement], mess, statusName)
        })
        max.addEventListener(com, () => {
            Validation.proverkaSosed([minElement, maxElement], mess, statusName)
        })

    }

    static sravnenie(min, max, mess, minElem, maxElem, statusName) {
        console.log(min, max)
        console.log(minElem, maxElem)
        if (min > max) {
            Validation.status[statusName] = false
            Array.from([minElem, maxElem]).forEach(e => e.classList.add('redBorder'))
            Helpers.viewRemark(mess, 'red', 'Введите корректные значения интервалов');
        }
        else {
            Array.from([minElem, maxElem]).forEach(e => e.classList.remove('redBorder'))
            Validation.status[statusName] = true
        }
    }


    static inputsOne(inputsElement) {
        inputsElement.addEventListener('change', () => {
            inputsElement.nextElementSibling.nextElementSibling.disabled = !inputsElement.checked;  // используем логическое отрицание

        });
    }
    static inputsCheck(inputsElement, mess, statusName) {
        inputsElement[0].addEventListener('change', () => {
            inputsElement[0].nextElementSibling.nextElementSibling.disabled = !inputsElement[0].checked;  // используем логическое отрицание
            Validation.proverkaSosed(inputsElement, mess, statusName)

        });
        inputsElement[1].addEventListener('change', () => {
            inputsElement[1].nextElementSibling.nextElementSibling.disabled = !inputsElement[1].checked;  // используем логическое отрицание
            Validation.proverkaSosed(inputsElement, mess, statusName)
        });


    }
    static proverkaSosed(inputsElement, mess, statusName) {
        const min = inputsElement[0].nextElementSibling.nextElementSibling
        const max = inputsElement[1].nextElementSibling.nextElementSibling
        console.log(min.value, max.value)
        //   console.log(min, max)
        if (inputsElement[1].checked === true && inputsElement[0].checked === true) {
            min.value.length < 8 ? Validation.sravnenie(Number(min.value), Number(max.value), mess, min, max, statusName)
                : Validation.sravnenie(Helpers.timeStringToUnix(min.value), Helpers.timeStringToUnix(max.value), mess, min, max, statusName)
        }
        else {
            [min, max].forEach(e => e.classList.remove('redBorder'))
            Validation.status[statusName] = true
        }
    }

}
