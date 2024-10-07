import { ContentGeneration } from './CreateContent.js'
import { Requests } from './RequestStaticMethods.js'
import { Validation } from './Validation.js'
export class ControllSettingsReportsObject {
    constructor(container, idw) {
        console.log(container)
        this.container = container
        this.idx = idw
        console.log(document.querySelector('.stor_type_index'))
        this.typeIndex = document.querySelector('.stor_type_index').getAttribute('rel')
        this.mess = this.container.parentElement.querySelector('.valid_message')
        this.init()
    }



    init() {
        this.addContentSettingsReport()
        this.caseElements()
        this.flexNone()
        this.addEventListeners()
    }

    caseElements() {
        this.buttons = this.container.querySelectorAll('.type_navi');

    }

    flexNone() {
        this.buttons.forEach((e) => e.nextElementSibling.classList.add('flex_none'));
    }
    addEventListeners() {
        this.buttons.forEach(button => {
            //   console.log(button)
            button.addEventListener('click', () => {
                console.log('клик!?')
                this.controllStows(button);
            });
        });
    }

    controllStows(button) {
        const currentContainer = button.nextElementSibling;
        this.buttons.forEach(btn => {
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

    async addContentSettingsReport() {
        this.container.innerHTML = ContentGeneration.addButtonTypeBlock(this.typeIndex)
        this.findPerements()
        this.valid()


        await this.getRenderSetValue()
    }

    async getRenderSetValue() {
        this.setReports = await Requests.getReportsAttribute(this.idx)
        if (this.setReports.length !== 0) {
            this.attributeValue = JSON.parse(this.setReports[0].jsonsetAttribute)
            this.addValueToDOMElements()
        }
    }

    addValueToDOMElements() {
        this.updateTrevaling()
        this.updateProstoy()
    }

    valid() {
        Validation.validationData([this.minDistanceProstoyValue, this.minDistanceValue, this.maxDistanceValue])
        Validation.validDistance([this.minMileageValue, this.maxMileageValue])
        Validation.validationMoreLittle(this.minDistanceValue, this.maxDistanceValue, this.mess, 'statusTime', 'keydown')
        Validation.validationMoreLittle(this.minMileageValue, this.maxMileageValue, this.mess, 'statusDistance', 'input')
        Validation.inputsCheck(this.inputsTime, this.mess, 'statusTime')
        Validation.inputsCheck(this.inputsDistance, this.mess, 'statusDistance')
        Validation.inputsOne(this.inputsProstoyTime)
    }
    updateProstoy() {
        this.minDistanceProstoyValue.value = this.attributeValue['Простои на холостом ходу'].longTime !== '' ? this.attributeValue['Простои на холостом ходу'].longTime : this.minDistanceProstoyValue.value
        this.check([this.bodySettings[5].querySelector('#min_distance_prostoy')],
            [this.attributeValue['Простои на холостом ходу'].longTime])
        const dat = document.querySelector('#datchik_ugla')
        if (dat) {
            const items = this.bodySettings[5].parentElement.querySelectorAll('.porog_value')
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
        this.check([this.bodySettings[1].querySelector('#min_distance'), this.bodySettings[1].querySelector('#max_distance'),
        this.bodySettings[1].querySelector('#min_mileage'), this.bodySettings[1].querySelector('#max_mileage')],
            [this.attributeValue['Поездки'].distance[0], this.attributeValue['Поездки'].distance[1],
            this.attributeValue['Поездки'].mileageSet[0], this.attributeValue['Поездки'].mileageSet[1]])
    }

    check(arrayDOM, arrayValue) {
        arrayValue.forEach((e, index) => {
            if (e !== '') {
                arrayDOM[index].checked = true
                arrayDOM[index].nextElementSibling.nextElementSibling.disabled = false
            }
        })
    }

    findPerements() {
        this.bodySettings = this.container.querySelectorAll('.body_settings_content')
        this.inputsDistance = this.container.querySelectorAll('.input_distance')
        this.inputsTime = this.container.querySelectorAll('.input_time')
        this.inputsProstoyTime = this.bodySettings[5].querySelector('#min_distance_prostoy')
        this.minDistanceProstoyValue = this.bodySettings[5].querySelector('#min_distance_prostoy').nextElementSibling.nextElementSibling
        this.minDistanceValue = this.bodySettings[1].querySelector('#min_distance').nextElementSibling.nextElementSibling
        this.maxDistanceValue = this.bodySettings[1].querySelector('#max_distance').nextElementSibling.nextElementSibling
        this.minMileageValue = this.bodySettings[1].querySelector('#min_mileage').nextElementSibling.nextElementSibling
        this.maxMileageValue = this.bodySettings[1].querySelector('#max_mileage').nextElementSibling.nextElementSibling
    }
}