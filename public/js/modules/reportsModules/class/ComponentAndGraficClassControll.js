
import { Content } from './ContentGeneration.js'
import { Validation } from './Validation.js'

export class ComponentAndGraficControll {
    constructor(arrayBlocks, block, setTemplates) {
        this.attributeValue = setTemplates
        this.arrayBlocks = arrayBlocks
        this.blocks = block
        this.checkboxStates = {
            statistic: {},
            component: {},
            graphic: {}
        }; //Переменная хранения состояний
        this.init()
    }

    async init() {
        this.renderButtons()
        //this.caseElements()
        //   this.addValueToDOMElements()
        //  this.valid()

    }

    renderButtons() {
        console.log(this.blocks)
        this.blocks.forEach(({ block, arrayButtons, indexs, stores }) => {
            console.log(stores)
            // Очищаем содержимое блока
            block.innerHTML = Content.addButtonTypeBlock(arrayButtons, indexs, stores);
            const buttons = block.querySelectorAll('.type_navi');
            const cards = block.parentElement.querySelectorAll('.celevoy_card');
            buttons.forEach((e) => e.nextElementSibling.classList.add('flex_none'));
            cards.forEach((e) => e.classList.add('flex_none'));
            this.addEventListeners(block, buttons);
        });
    }

    addEventListeners(block, buttons) {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.controllStows(block, button);
            });
        });

        this.saveStateCheckbox()

    }

    /*
        addValueToDOMElements() {
            this.updateTrevaling()
            this.updateProstoy()
        }
    
        updateProstoy() {
            this.minDistanceProstoyValue.value = this.attributeValue['Простои на холостом ходу'].longTime !== '' ? this.attributeValue['Простои на холостом ходу'].longTime : this.minDistanceProstoyValue.value
            this.check([this.blocks[0].block.parentElement.querySelector('#min_distance_prostoy')],
                [this.attributeValue['Простои на холостом ходу'].longTime])
            const dat = document.querySelector('#datchik_ugla')
            if (dat) {
                const items = this.blocks[0].block.parentElement.querySelectorAll('.porog_value')
                items[0].value = this.attributeValue['Простои на холостом ходу'].datchikUgla[0]
                items[1].value = this.attributeValue['Простои на холостом ходу'].datchikUgla[1]
                this.check([dat, dat],
                    [this.attributeValue['Простои на холостом ходу'].datchikUgla[0], this.attributeValue['Простои на холостом ходу'].datchikUgla[1]])
            }
        }
        updateTrevaling() {
            this.minDistanceValue.value = this.attributeValue['Поездки'].distance[0] !== '' ? this.attributeValue['Поездки'].distance[0] : this.minDistanceValue.value
            this.maxDistanceValue.value = this.attributeValue['Поездки'].distance[1] !== '' ? this.attributeValue['Поездки'].distance[1] : this.maxDistanceValue.value
            this.minMileageValue.value = this.attributeValue['Поездки'].mileageSet[0] !== '' ? this.attributeValue['Поездки'].mileageSet[0] : this.minMileageValue.value
            this.maxMileageValue.value = this.attributeValue['Поездки'].mileageSet[1] !== '' ? this.attributeValue['Поездки'].mileageSet[1] : this.maxMileageValue.value
            this.check([this.blocks[0].block.parentElement.querySelector('#min_distance'), this.blocks[0].block.parentElement.querySelector('#max_distance'),
            this.blocks[0].block.parentElement.querySelector('#min_mileage'), this.blocks[0].block.parentElement.querySelector('#max_mileage')],
                [this.attributeValue['Поездки'].distance[0], this.attributeValue['Поездки'].distance[1],
                this.attributeValue['Поездки'].mileageSet[0], this.attributeValue['Поездки'].mileageSet[1]])
        }
    
        caseElements() {
            this.inputsDistance = this.blocks[0].block.parentElement.querySelectorAll('.input_distance')
            this.inputsTime = this.blocks[0].block.parentElement.querySelectorAll('.input_time')
            this.inputsProstoyTime = this.blocks[0].block.parentElement.querySelector('#min_distance_prostoy')
            this.minDistanceProstoyValue = this.blocks[0].block.parentElement.querySelector('#min_distance_prostoy').nextElementSibling.nextElementSibling
            this.minDistanceValue = this.blocks[0].block.parentElement.querySelector('#min_distance').nextElementSibling.nextElementSibling
            this.maxDistanceValue = this.blocks[0].block.parentElement.querySelector('#max_distance').nextElementSibling.nextElementSibling
            this.minMileageValue = this.blocks[0].block.parentElement.querySelector('#min_mileage').nextElementSibling.nextElementSibling
            this.maxMileageValue = this.blocks[0].block.parentElement.querySelector('#max_mileage').nextElementSibling.nextElementSibling
            this.mess = document.querySelector('.valid_message')
        }
    
        check(arrayDOM, arrayValue) {
            arrayValue.forEach((e, index) => {
                if (e !== '') {
                    arrayDOM[index].checked = true
                    arrayDOM[index].nextElementSibling.nextElementSibling.disabled = false
                }
            })
        }*/
    saveStateCheckbox() {
        this.arrayBlocks.forEach(e => {
            // Добавляем обработчик изменения чекбоксов
            const checkboxes = e.querySelectorAll('.checkbox-list input[type="checkbox"]');
            checkboxes.forEach(cb => {
                this.updateCheckboxStates(e);
                cb.addEventListener('change', () => {
                    const celInput = cb.getAttribute('name')
                    if (celInput === 'Совместить график давления и температуры') {
                        console.log(cb)
                        if (cb.checked) {
                            cb.closest('.checkbox_item').previousElementSibling.children[0].checked = false
                            cb.closest('.checkbox_item').previousElementSibling.previousElementSibling.children[0].checked = false
                        }
                    }
                    this.updateCheckboxStates(e);
                });
            });
        })
    }

    updateCheckboxStates(block) {
        // Определяем тип блока
        const blockRel = block.getAttribute('data-att') || 'default';
        if (!this.checkboxStates[blockRel]) return;
        // Обрабатываем контейнеры чекбоксов
        const containers = block.querySelectorAll('.checkbox-list');
        containers.forEach(container => {
            const containerRel = container.getAttribute('rel'); // Например, 'button1', 'button2'
            this.checkboxStates[blockRel][containerRel] = Array.from(container.querySelectorAll('input[type="checkbox"]')).map(cb => ({
                name: cb.name,
                checked: cb.checked
            }));
        });
    }


    controllStows(block, button) {
        const currentContainer = button.nextElementSibling;
        const indexButton = button.getAttribute('data-att')
        const buttons = block.querySelectorAll('.type_navi');
        const cards = block.parentElement.querySelectorAll('.celevoy_card');
        buttons.forEach(btn => {
            if (btn !== button) {
                const siblingContainer = btn.nextElementSibling;
                const indexButton = btn.getAttribute('data-att')
                if (siblingContainer) {
                    siblingContainer.classList.add('flex_none'); // Скрываем другой контейнер
                    cards[Number(indexButton)] ? cards[Number(indexButton)].classList.add('flex_none') : null
                    btn.classList.remove('activ_fon')
                }
                this.toggleArrow(btn, false); // Сбрасываем стрелку
            }
        });

        let isVisible = !currentContainer.classList.contains('flex_none');
        // Управление видимостью текущего контейнера
        currentContainer.classList.toggle('flex_none', isVisible);
        button.classList.toggle('activ_fon', !isVisible);
        cards[Number(indexButton)] ? cards[Number(indexButton)].classList.toggle('flex_none', isVisible) : null
        this.toggleArrow(button, !isVisible); // Управляем стрелкой
    }

    toggleArrow(button, isExpanded) {
        const arrow = button.querySelector('i'); // предполагается, что стрелка находится внутри кнопки
        arrow.classList.toggle('fa-angle-down', !isExpanded);
        arrow.classList.toggle('fa-angle-up', isExpanded);
        arrow.classList.toggle('active_fon_srows', isExpanded);
    }

    valid() {
        Validation.validationData([this.minDistanceProstoyValue, this.minDistanceValue, this.maxDistanceValue])
        Validation.validDistance([this.minMileageValue, this.maxMileageValue])
        Validation.validationMoreLittle(this.minDistanceValue, this.maxDistanceValue, this.mess, 'statusTime')
        Validation.validationMoreLittle(this.minMileageValue, this.maxMileageValue, this.mess, 'statusDistance')
        Validation.inputsCheck(this.inputsTime, this.mess, 'statusTime')
        Validation.inputsCheck(this.inputsDistance, this.mess, 'statusDistance')
        Validation.inputsOne(this.inputsProstoyTime)
    }
}