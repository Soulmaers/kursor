
import { Helpers } from './Helpers.js'

export class ValidationStatus {

    static status = {
        statusTime: true,
        statusDistance: true
    }


    static validDistance(elements) {
        elements.forEach(e => {
            e.addEventListener('click', function (e) {
                //  this.setSelectionRange(0, 1);
                this.select()
            })
        })
        elements.forEach(e => e.addEventListener('keydown', function (e) {
            const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowLeft', 'ArrowRight', 'Backspace'];
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault(); // Запрещаем ввод любых символов, кроме цифр и навигационных клавиш
            }
        }))
    }

    static validationData(elements) {
        elements.forEach(e => {
            e.addEventListener('click', function (e) {
                const pos = this.selectionStart;
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
            e.addEventListener('keydown', function (e) {
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
            ValidationStatus.proverkaSosed([minElement, maxElement], mess, statusName)
        })
        max.addEventListener(com, () => {
            ValidationStatus.proverkaSosed([minElement, maxElement], mess, statusName)
        })

    }

    static sravnenie(min, max, mess, minElem, maxElem, statusName) {
        if (min >= max) {
            ValidationStatus.status[statusName] = false
            Array.from([minElem, maxElem]).forEach(e => e.classList.add('redBorder'))
            Helpers.viewRemark(mess, 'red', 'Введите корректные значения интервалов');
        }
        else {
            Array.from([minElem, maxElem]).forEach(e => e.classList.remove('redBorder'))
            ValidationStatus.status[statusName] = true
        }
    }


    static inputsOne(inputsElement) {
        inputsElement.addEventListener('change', () => {

            if (inputsElement.id === 'time_excess') {
                const maxSpeed = inputsElement.closest('.card_set').querySelector('#max_speed')
                maxSpeed.checked = inputsElement.checked
                maxSpeed.nextElementSibling.nextElementSibling.disabled = !maxSpeed.checked;
                inputsElement.nextElementSibling.nextElementSibling.disabled = !inputsElement.checked;
            }
            else if (inputsElement.id === 'max_speed') {
                const timeExcess = inputsElement.closest('.card_set').querySelector('#time_excess')

                if (timeExcess.checked) {
                    inputsElement.checked = timeExcess.checked;
                }
                inputsElement.nextElementSibling.nextElementSibling.disabled = !inputsElement.checked;


            }
            else {
                inputsElement.nextElementSibling.nextElementSibling.disabled = !inputsElement.checked;  // используем логическое отрицание
            }
        })

    }
    static inputsAngle(inputsElement) {
        inputsElement.addEventListener('change', () => {
            const elem = inputsElement.parentElement.querySelectorAll('.porog_value')
            elem.forEach(e => {
                e.disabled = !inputsElement.checked
            })
        });
    }

    static inputsCheck(inputsElement, mess, statusName) {
        inputsElement[0].addEventListener('change', () => {
            inputsElement[0].nextElementSibling.nextElementSibling.disabled = !inputsElement[0].checked;  // используем логическое отрицание
            ValidationStatus.proverkaSosed(inputsElement, mess, statusName)

        });
        inputsElement[1].addEventListener('change', () => {
            inputsElement[1].nextElementSibling.nextElementSibling.disabled = !inputsElement[1].checked;  // используем логическое отрицание
            ValidationStatus.proverkaSosed(inputsElement, mess, statusName)
        });


    }
    static proverkaSosed(inputsElement, mess, statusName) {
        const min = inputsElement[0].nextElementSibling.nextElementSibling
        const max = inputsElement[1].nextElementSibling.nextElementSibling
        if (inputsElement[1].checked === true && inputsElement[0].checked === true) {
            min.value.length < 8 ? ValidationStatus.sravnenie(Number(min.value), Number(max.value), mess, min, max, statusName)
                : ValidationStatus.sravnenie(Helpers.timeStringToUnix(min.value), Helpers.timeStringToUnix(max.value), mess, min, max, statusName)
        }
        else {
            [min, max].forEach(e => e.classList.remove('redBorder'))
            ValidationStatus.status[statusName] = true
        }
    }

}