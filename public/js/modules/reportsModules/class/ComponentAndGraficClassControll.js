
import { Content } from './ContentGeneration.js'

export class ComponentAndGraficControll {
    constructor(arrayBlocks, block) {
        this.arrayBlocks = arrayBlocks
        this.blocks = block
        this.checkboxStates = {
            statistic: {},
            component: {},
            graphic: {}
        }; //Переменная хранения состояний
        this.init()
    }

    init() {
        this.renderButtons()

    }

    renderButtons() {
        console.log(this.blocks)
        this.blocks.forEach(({ block, arrayButtons, indexs, stores }) => {
            console.log(stores)
            // Очищаем содержимое блока
            block.innerHTML = Content.addButtonTypeBlock(arrayButtons, indexs, stores);
            const buttons = block.querySelectorAll('.type_navi');
            buttons.forEach((e) => e.nextElementSibling.classList.add('flex_none'));
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

    saveStateCheckbox() {
        this.arrayBlocks.forEach(e => {
            // Добавляем обработчик изменения чекбоксов
            const checkboxes = e.querySelectorAll('.checkbox-list input[type="checkbox"]');
            checkboxes.forEach(cb => {
                this.updateCheckboxStates(e);
                cb.addEventListener('change', () => {
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
        const buttons = block.querySelectorAll('.type_navi');
        buttons.forEach(btn => {
            if (btn !== button) {
                const siblingContainer = btn.nextElementSibling;
                if (siblingContainer) {
                    siblingContainer.classList.add('flex_none'); // Скрываем другой контейнер
                    btn.classList.remove('activ_fon')
                }
                this.toggleArrow(btn, false); // Сбрасываем стрелку
            }
        });

        let isVisible = !currentContainer.classList.contains('flex_none');
        // Управление видимостью текущего контейнера
        currentContainer.classList.toggle('flex_none', isVisible);
        button.classList.toggle('activ_fon', !isVisible);
        this.toggleArrow(button, !isVisible); // Управляем стрелкой
    }

    toggleArrow(button, isExpanded) {
        const arrow = button.querySelector('i'); // предполагается, что стрелка находится внутри кнопки
        arrow.classList.toggle('fa-angle-down', !isExpanded);
        arrow.classList.toggle('fa-angle-up', isExpanded);
        arrow.classList.toggle('active_fon_srows', isExpanded);
    }
}