
import { Helpers } from './Helpers.js'
export class Validation {

    static validDistance(elements) {
        elements.forEach(e => {
            e.addEventListener('click', function (e) {
                this.setSelectionRange(0, 1);
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

    static validationMoreLittle(min, max, mess, statusName) {
        const minElement = min.previousElementSibling.previousElementSibling
        const maxElement = max.previousElementSibling.previousElementSibling
        min.addEventListener('input', () => {
            Validation.proverkaSosed([minElement, maxElement], mess, statusName)
        })
        max.addEventListener('input', () => {
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
        console.log(min, max)
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