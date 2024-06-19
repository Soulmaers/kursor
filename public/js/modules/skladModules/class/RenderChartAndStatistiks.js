import { Helpers } from './Helpers.js'
import { viewDinamic } from '../../protector.js'
import { RequestStaticMetods } from './RequestStaticMetods.js';
import { SvodkaGeneration } from './SvodkaGeneration.js';



export class RenderChartAndStatistiks {
    constructor(history, data, container, instance) {
        this.history = history;
        this.instanceSkladTyres = instance
        this.data = data;
        this.containerCard = container;
        this.bodyZamer = this.containerCard.querySelector('.body_zamer');
        this.status = {
            '0': 'Установлено',
            '1': 'На складе',
            '2': 'В ремонте',
            '3': 'Утилизировано'
        }
        this.init();
    }

    async init() {
        this.uniqueDataWithPrice = Helpers.addStruktura(this.data, this.history)
        await this.getValue()
        this.preparation();
        this.addListElements();
        this.highlightLastDate();
        this.addDotClickHandlers();
        this.addSegmentClickHandlers();

    }

    async getValue() {
        const idw_tyres = this.data.idw_tyres
        this.historyValue = await RequestStaticMetods.getHistoryValueWheel(idw_tyres)
    }
    preparation() {
        this.date = Object.values(
            this.history.reduce((acc, item) => {
                // Собираем значения в массив
                const values = [item.N1, item.N2, item.N3, item.N4];
                // Подсчитываем количество пустых значений
                const emptyCount = values.filter(value => !value).length;
                // Если пустыми являются 2 или меньше значений, добавляем элемент
                if (emptyCount <= 2) {
                    const key = values.join('-');
                    acc[key] = item;
                }

                return acc;
            }, {})
        );
    }

    addListElements() {
        this.date.forEach(e => {
            const div = document.createElement('div');
            div.classList.add('listRows');
            div.textContent = e.dateZamer;
            div.setAttribute('rel', e.id);
            this.bodyZamer.appendChild(div);
            div.addEventListener('click', this.handleDateClick.bind(this));
        });
    }

    handleDateClick(event) {
        this.clearClass()
        const elementRel = event.target.getAttribute('rel');
        const selectedElement = this.bodyZamer.querySelector('.selected');
        if (selectedElement && selectedElement.getAttribute('rel') === elementRel) {
            this.highlightLastDate();
        } else {
            this.highlightElement(event.target);
            this.highlightDotById(elementRel);
            this.updateTooltip(elementRel); // Обновляем тултип
            this.renderChartById(elementRel);
            this.renderTexContent(elementRel)
            this.startSvodka(elementRel)

        }
    }

    highlightLastDate() {
        const listItems = this.bodyZamer.querySelectorAll('.listRows');
        listItems.forEach(item => item.classList.remove('selected'));
        const lastListItem = listItems[listItems.length - 1];
        lastListItem.classList.add('selected');
        const lastData = this.date[this.date.length - 1];
        this.highlightDotById(lastData.id);
        this.updateTooltip(lastData.id); // Обновляем тултип
        this.renderChartById(lastData.id);
        this.renderTexContent(lastData.id)
        this.startSvodka(lastData.id)

    }


    startSvodka(id, segment) {
        let interval;
        if (segment) {
            const idx = this.date.findIndex(e => e.id === Number(id));
            interval = [this.date[idx - 1].dateZamer, this.date[idx].dateZamer]

        } else {
            const object = this.date.find(e => e.id === Number(id));
            interval = [object.dateZamer]
        }
        new SvodkaGeneration(this.historyValue, interval, this.instanceSkladTyres.uniqData, this.containerCard, this.data)
    }
    highlightElement(element) {
        const listItems = this.bodyZamer.querySelectorAll('.listRows');
        listItems.forEach(item => item.classList.remove('selected'));
        element.classList.add('selected');
    }

    renderTexContent(id) {
        const object = this.date.find(e => e.id === Number(id));
        const obj = this.uniqueDataWithPrice.find(e => e.id === Number(id));
        const lastZamer = Math.floor(parseFloat(obj.minN)
            / parseFloat(obj.protektorOneKM));
        const last = lastZamer - Number(object.probeg_now)
        const container = this.containerCard.querySelectorAll('.info_discription');
        container[0].textContent = `ID: ${object.idw_tyres}`
        container[1].textContent = `Статус: ${this.status[object.flag_status]}`
        container[2].textContent = `Пробег: ${object.probeg_now} км`
        container[3].textContent = `Прогноз остатка пробега: ${last} км`
    }
    renderChartById(id) {
        const object = this.date.find(e => e.id === Number(id));
        Helpers.renderProtektors(object, this.containerCard)
        const pro = Helpers.protek(object);
        const container = this.containerCard.querySelectorAll('.contBar22');
        if (pro.length > 0) viewDinamic(pro, object.protektor_passport, container, object.ostatok, 2);
    }

    highlightDotById(id) {
        const dots = this.containerCard.querySelectorAll('.dot');
        dots.forEach(dot => {
            const dotDataId = dot.getAttribute('data-id');
            if (dotDataId == id) {
                dot.style.fill = 'green';
                dot.setAttribute('r', 5);
            } else {
                dot.style.fill = 'white';
                dot.setAttribute('r', 4);
            }
        });
    }

    addSegmentClickHandlers() {
        const segments = this.containerCard.querySelectorAll('.segment');
        segments.forEach(dot => {
            dot.removeEventListener('click', this.boundHandleSegmentClick);
            this.boundHandleSegmentClick = this.handleSegmentClick.bind(this); // Привязываем метод к текущему контексту
            dot.addEventListener('click', this.boundHandleSegmentClick);
        });
    }

    addDotClickHandlers() {
        const dots = this.containerCard.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.removeEventListener('click', this.boundHandleDotClick);
            this.boundHandleDotClick = this.handleDotClick.bind(this); // Привязываем метод к текущему контексту
            dot.addEventListener('click', this.boundHandleDotClick);
        });
    }

    handleSegmentClick(event) {
        const segmentID = event.target.getAttribute('data-id');
        if (this.segment && this.segment.getAttribute('data-id') === segmentID) {
            return;
        }
        else {
            this.clearClass();
            this.addClass(event.target);
            this.updateTooltipSegment(segmentID);
            this.startSvodka(segmentID, 'segment')
        }

    }

    clearClass() {
        if (this.segment) {
            this.segment.classList.remove('selected_segment')
            this.segment.style.strokeWidth = '2.5';
            this.segment = null
        }
    }
    addClass(elem) {
        elem.classList.add('selected_segment')
        elem.style.strokeWidth = '4';
        this.segment = elem
    }
    handleDotClick(event) {
        this.clearClass()
        const dotId = event.target.getAttribute('data-id');
        const selectedDot = this.containerCard.querySelector('.dot.selected');
        if (selectedDot && selectedDot.getAttribute('data-id') === dotId) {
            this.highlightLastDate();
        } else {
            this.highlightDotById(dotId);
            const correspondingDateElement = this.bodyZamer.querySelector(`[rel='${dotId}']`);
            this.highlightElement(correspondingDateElement);
            this.updateTooltip(dotId); // Обновляем тултип
            this.renderChartById(dotId);
            this.renderTexContent(dotId)
            this.startSvodka(dotId)

        }
    }

    updateTooltipSegment(id) {
        // Находим индекс элемента с соответствующим id
        const segmentIndex = this.uniqueDataWithPrice.findIndex(item => item.id === Number(id));
        const segmentData = {
            prev: this.uniqueDataWithPrice[segmentIndex - 1],
            current: this.uniqueDataWithPrice[segmentIndex]
        };
        const tooltip = this.containerCard.querySelector('.tooltip_tochka');
        const data = this.uniqueDataWithPrice.find(d => d.id == id);
        if (data && tooltip) {
            tooltip.style.opacity = 1
            tooltip.style.top = '15px'
            tooltip.style.left = '195px'
            this.setTooltipText(tooltip.querySelector(".tooltip_element1"), "Стоимость пробега за 1 км:", `${segmentData.current.priceOneKMLine} руб.`, this.calculatePercentage(segmentData.current.priceOneKMLine, segmentData.prev.defaultPrice));
            this.setTooltipText(tooltip.querySelector(".tooltip_element2"), "Износ протектора за 1 км:", `${segmentData.current.protektorOneKMLine} мм`, this.calculatePercentage(segmentData.current.protektorOneKMLine, segmentData.prev.defaultProtektor));
        }
    }
    updateTooltip(id) {
        const tooltip = this.containerCard.querySelector('.tooltip_tochka');
        const data = this.uniqueDataWithPrice.find(d => d.id == id);
        if (data && tooltip) {
            tooltip.style.opacity = 1
            tooltip.style.top = '15px'
            tooltip.style.left = '195px'
            this.setTooltipText(tooltip.querySelector(".tooltip_element1"), "Стоимость пробега за 1 км:", `${data.priceOneKM} руб.`, this.calculatePercentage(data.priceOneKM, data.defaultPrice));
            this.setTooltipText(tooltip.querySelector(".tooltip_element2"), "Износ протектора за 1 км:", `${data.protektorOneKM} мм`, this.calculatePercentage(data.protektorOneKM, data.defaultProtektor));
        }
    }

    setTooltipText(element, title, value, percentage) {
        element.querySelector(".tooltip_element_title").textContent = title;
        element.querySelector(".tooltip_element_value").textContent = value;
        const znak = Number(percentage) > 0 ? '+' : '';
        const percentageElement = element.querySelector(".tooltip_element_value_otklonenie");
        percentageElement.textContent = `${znak}${percentage} %`;
        if (percentage > 0) {
            percentageElement.style.color = "red";
        } else if (percentage < 0) {
            percentageElement.style.color = "green";
        } else {
            percentageElement.style.color = "black";
        }
    }

    calculatePercentage(current, base) {
        return (((current - base) / base) * 100).toFixed(1);
    }
}