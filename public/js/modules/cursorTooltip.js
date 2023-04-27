import { Tooltip } from '../class/Tooltip.js'



export function tooltip() {
    const iconCard = document.querySelectorAll('.icon_card');
    // console.log(iconCard[7].getAttribute('rel'))
    iconCard.forEach(e => {
        new Tooltip(e, [e.getAttribute('rel')]);
    })

}
/*
class Tooltip {
    constructor(element) {
        this.element = element;
        this.tooltip = null;

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.element.addEventListener('mouseenter', this.show.bind(this));
        this.element.addEventListener('mouseleave', this.hide.bind(this));
    }

    show() {
        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('tooltip');
        this.tooltip.textContent = this.element.dataset.tooltip;

        document.body.appendChild(this.tooltip);

        const elementRect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        this.tooltip.style.top = `${elementRect.top - tooltipRect.height}px`;
        this.tooltip.style.left = `${elementRect.left}px`;
    }

    hide() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }
}*/

/*
Этот класс создает всплывающую подсказку для элемента, у которого есть атрибут data - tooltip
 с текстом подсказки.Подсказка появляется при наведении на элемент и скрывается при уходе курсора с элемента.
 Класс также позиционирует подсказку относительно элемента.*/

