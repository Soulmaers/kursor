import { Tooltip } from '../class/Tooltip.js'

/*
export function tooltip() {
    // Находим элемент, на который нужно добавить подсказку
    const pl1_card = document.querySelector('.pl1_card');
    const pl2_card = document.querySelector('.pl2_card');
    //console.log(ohlCard)



    // Создаем элемент подсказки
    //  const element = document.querySelector('.element');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Охлаждающая жидкость';


    const tooltip2 = document.createElement('div');
    tooltip2.className = 'tooltip';
    tooltip2.textContent = 'Одометр';

    pl1_card.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
        tooltip.style.left = (x + 20) + 'px';
        tooltip.style.top = (y + 20) + 'px';
    });
    pl1_card.addEventListener('mouseover', function (e) {
        //  tooltip.style.top = (e.clientY + 20) + 'px';
        //tooltip.style.left = (e.clientX - 20) + 'px';
        tooltip.style.display = 'block';
        document.body.appendChild(tooltip);
    });

    pl1_card.addEventListener('mouseout', function (e) {
        tooltip.style.display = 'none';
        document.body.removeChild(tooltip);
    });


    pl2_card.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
        tooltip2.style.left = (x + 20) + 'px';
        tooltip2.style.top = (y + 20) + 'px';
    });
    pl2_card.addEventListener('mouseover', function (e) {
        //  tooltip.style.top = (e.clientY + 20) + 'px';
        //tooltip.style.left = (e.clientX - 20) + 'px';
        tooltip2.style.display = 'block';
        document.body.appendChild(tooltip2);
    });

    pl2_card.addEventListener('mouseout', function (e) {
        tooltip2.style.display = 'none';
        document.body.removeChild(tooltip2);
    });



}*/
export function tooltip() {
    const pl1_card = document.querySelector('.pl1_card');
    const pl2_card = document.querySelector('.pl2_card');

    new Tooltip(pl1_card, "Охлаждающая жидкость");
    new Tooltip(pl2_card, "Одометр");
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

