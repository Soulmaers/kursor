import { ContentGeneration } from './CreateContent.js'
import { Requests } from './Requests.js'
import { ValidationStatus } from './ValidationStatus.js'


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
        this.attributeValue = await Requests.getSettings(this.idx)
        console.log(this.attributeValue)
        this.addValueToDOMElements()
    }


    addValueToDOMElements() {
        this.updateOil()
        this.updateTrevaling()
        this.updateParking()
        this.updateStop()
        this.updateMoto()
        this.updateProstoy()
    }

    valid() {
        ValidationStatus.validationData([this.minDistanceProstoyValue, this.minDistanceValue, this.maxDistanceValue])
        ValidationStatus.validDistance([this.minMileageValue, this.maxMileageValue])
        ValidationStatus.validationMoreLittle(this.minDistanceValue, this.maxDistanceValue, this.mess, 'statusTime', 'keydown')
        ValidationStatus.validationMoreLittle(this.minMileageValue, this.maxMileageValue, this.mess, 'statusDistance', 'input')
        ValidationStatus.inputsCheck(this.inputsTime, this.mess, 'statusTime')
        ValidationStatus.inputsCheck(this.inputsDistance, this.mess, 'statusDistance')
        ValidationStatus.inputsOne(this.inputsProstoyTime)
        ValidationStatus.inputsOne(this.bodySettings[2].querySelector('#min_duration_parking'))
        ValidationStatus.inputsOne(this.bodySettings[3].querySelector('#min_duration_stop'))
        ValidationStatus.inputsOne(this.bodySettings[4].querySelector('#min_duration_moto'))
        ValidationStatus.inputsOne(this.bodySettings[0].querySelector('#min_diration_refill'))
        ValidationStatus.inputsOne(this.bodySettings[0].querySelector('#min_diration_drain'))
        ValidationStatus.inputsOne(this.bodySettings[0].querySelector('#min_value_refill'))
        ValidationStatus.inputsOne(this.bodySettings[0].querySelector('#min_value_drain'))
        if (this.angleSensor) ValidationStatus.inputsAngle(this.angleSensor)
    }
    updateProstoy() {
        const { minDuration } = this.attributeValue['Простои на холостом ходу'];

        this.minDistanceProstoyValue.value = minDuration ? minDuration : this.minDistanceProstoyValue.value
        /*  this.check([this.bodySettings[5].querySelector('#min_distance_prostoy')],
              [minDuration])*/

        const dat = document.querySelector('#datchik_ugla')
        const att = document.querySelector('#attachmentsSensor')
        if (dat) {
            const { angleSensorSettings } = this.attributeValue['Простои на холостом ходу'];
            const items = this.bodySettings[5].parentElement.querySelectorAll('.porog_value')
            console.log(angleSensorSettings)
            items[0].value = angleSensorSettings.minValue ? angleSensorSettings.minValue : null
            items[1].value = angleSensorSettings.maxValue ? angleSensorSettings.maxValue : null
            /* this.check([dat, dat], [angleSensorSettings.minValue, angleSensorSettings.maxValue])*/
        }
        if (att) {
            const { angleSensor } = this.attributeValue['Простои на холостом ходу'];
            const angleSensorElement = document.querySelector('#angleSensor')
            angleSensor ? angleSensorElement.checked = true : att.checked = true
        }
    }
    updateParking() {
        const { minDuration } = this.attributeValue['Стоянки'];
        const minParking = minDuration
        this.minDurationParking.value = minParking
    }
    updateStop() {
        const { minDuration } = this.attributeValue['Остановки'];
        const minStop = minDuration
        this.minDurationStop.value = minStop
    }
    updateMoto() {
        const { minDuration } = this.attributeValue['Моточасы'];
        const minMoto = minDuration
        this.minDurationMoto.value = minMoto
    }


    updateTrevaling() {
        const { duration, mileage } = this.attributeValue['Поездки'];

        this.minDistanceValue.value = duration.minDuration
        this.maxMileageValue.value = duration.maxDuration
        this.minMileageValue.value = mileage.minMileage
        this.maxMileageValue.value = mileage.maxMileage

        /* this.check(
             [this.bodySettings[1].querySelector('#min_distance'),
             this.bodySettings[1].querySelector('#max_distance'),
             this.bodySettings[1].querySelector('#min_mileage'),
             this.bodySettings[1].querySelector('#max_mileage')],
             [minDistance, maxDistance, minMileage, maxMileage]
         );*/
    }

    check(arrayDOM, arrayValue) {
        console.log(arrayDOM)
        console.log(arrayValue)
        arrayValue.forEach((e, index) => {
            if (e) {
                arrayDOM[index].checked = true
                arrayDOM[index].nextElementSibling.nextElementSibling.disabled = false
            }
        })
    }

    updateOil() {
        const { duration, volume } = this.attributeValue['Топливо'];
        this.timeRefillValue.value = duration.timeRefill;
        this.timeDrainValue.value = duration.timeDrain
        this.volumeRefillValue.value = volume.volumeRefill
        this.volumeDrainValue.value = volume.volumeDrain
    }
    findPerements() {
        this.bodySettings = this.container.querySelectorAll('.body_settings_content')
        this.inputsDistance = this.container.querySelectorAll('.input_distance')
        this.inputsTime = this.container.querySelectorAll('.input_time')
        this.angleSensor = this.bodySettings[5].querySelector('#datchik_ugla')
        this.inputsProstoyTime = this.bodySettings[5].querySelector('#min_distance_prostoy')
        this.minDistanceProstoyValue = this.bodySettings[5].querySelector('#min_distance_prostoy').nextElementSibling.nextElementSibling
        this.minDistanceValue = this.bodySettings[1].querySelector('#min_distance').nextElementSibling.nextElementSibling
        this.maxDistanceValue = this.bodySettings[1].querySelector('#max_distance').nextElementSibling.nextElementSibling
        this.minMileageValue = this.bodySettings[1].querySelector('#min_mileage').nextElementSibling.nextElementSibling
        this.maxMileageValue = this.bodySettings[1].querySelector('#max_mileage').nextElementSibling.nextElementSibling
        this.minDurationParking = this.bodySettings[2].querySelector('#min_duration_parking').nextElementSibling.nextElementSibling
        this.minDurationStop = this.bodySettings[3].querySelector('#min_duration_stop').nextElementSibling.nextElementSibling
        this.minDurationMoto = this.bodySettings[4].querySelector('#min_duration_moto').nextElementSibling.nextElementSibling
        this.timeRefillValue = this.bodySettings[0].querySelector('#min_diration_refill').nextElementSibling.nextElementSibling
        this.timeDrainValue = this.bodySettings[0].querySelector('#min_diration_drain').nextElementSibling.nextElementSibling
        this.volumeRefillValue = this.bodySettings[0].querySelector('#min_value_refill').nextElementSibling.nextElementSibling
        this.volumeDrainValue = this.bodySettings[0].querySelector('#min_value_drain').nextElementSibling.nextElementSibling
    }
}