

export class ContentGeneration {
    static storTypeObject() {
        const stor = [
            { type: 'Экскаватор', typeIndex: 10 },
            { type: 'Бульдозер', typeIndex: 10 },
            { type: 'Фронтальный погрузчик', typeIndex: 10 },
            { type: 'Экскаватор-погрузчик', typeIndex: 10 },
            { type: 'Трактор', typeIndex: 11 },
            { type: 'Каток', typeIndex: 11 },
            { type: 'Кран', typeIndex: 20 },
            { type: 'Манипулятор', typeIndex: 20 },
            { type: 'Газель', typeIndex: 30 },
            { type: 'Фургон', typeIndex: 30 },
            { type: 'Легковой автомобиль', typeIndex: 30 },
            { type: 'Фура', typeIndex: 30 },
            { type: 'Самосвал', typeIndex: 30 },
            { type: 'Бетономешалка', typeIndex: 40 },
            { type: 'Бензовоз', typeIndex: 40 },
            { type: 'Миксер', typeIndex: 40 },
            { type: 'ЖКХ', typeIndex: 50 },
            { type: 'Другое', typeIndex: 60 }

        ]

        return stor
    }
    static addButtonTypeBlock(type) {
        const buttons = ['Топливо', 'Поездки', 'Стоянки', 'Остановки', 'Моточасы', 'Простои на холостом ходу', 'Техническое обслуживание'].map(
            (e, index) =>
                `<div class="type_navi" rel="${e}" data-att="${index}">${e}<i class="fas fa-angle-down srows"></i></div><div class="body_settings_content">${ContentGeneration.createSet(index, type)}</div>`
        ).join('');
        return `
    <div class="navi_block">
        ${buttons}
    </div>`;
    }

    static createSet(index, type) {
        let html;
        switch (index) {
            case 0: html = ContentGeneration.renderOil()
                break;
            case 1: html = ContentGeneration.renderTraveling()
                break;
            case 2: html = ContentGeneration.renderParking()
                break;
            case 3: html = ContentGeneration.renderStop()
                break;
            case 4: html = ContentGeneration.renderMoto()
                break;
            case 5: html = ContentGeneration.renderProstoy(type)
                break;
            case 6:
                break;
        }

        return html
    }


    static renderOil() {
        return `
        <div class="card_set">
            <div class="distance">Длительность</div>
                <div class="checkbox_item">
                    <input class="input_duration" type="checkbox" id="min_diration_refill" >
                    <label class="label_check_set" for="min_diration_refill">Время заправки (чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>
                <div class="checkbox_item">
                    <input class="input_duration" type="checkbox" id="min_diration_drain">
                    <label class="label_check_set" for="min_diration_drain">Время слива (чч:мм:сс)</label>
                    <input class="value_set" value=24:00:00 disabled>
                </div>
        </div>
            <div class="card_set">
                <div class="distance">Объём топлива</div>
                <div class="checkbox_item">
                    <input class="input_volume" type="checkbox" id="min_value_refill">
                        <label class="label_check_set set_oil" for="min_value_refill">Мин. объём заправки, л.</label>
                        <input class="value_set set_mil" maxlength="6" value=0 disabled>
                </div>
                <div class="checkbox_item">
                    <input class="input_volume" type="checkbox" id="min_value_drain">
                        <label class="label_check_set set_oil" for="min_value_drain">Мин. объём слива, л.</label>
                        <input class="value_set set_mil" maxlength="6" value=0 disabled>
                </div>
            </div>
                `

    }


    static renderStop() {
        return ` <div class="card_set_prostoy">
     <div class="checkbox_item">
                    <input class="input_set" type="checkbox" id="min_duration_stop" >
                    <label class="label_check_set label_check_set_prostoy" for="min_duration_stop">Мин. длительность (чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>
              
                </div>`

    }
    static renderParking() {
        return ` <div class="card_set_prostoy">
     <div class="checkbox_item">
                    <input class="input_set" type="checkbox" id="min_duration_parking" >
                    <label class="label_check_set label_check_set_prostoy" for="min_duration_parking">Мин. длительность (чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>
              
                </div>`

    }
    static renderMoto() {
        return ` <div class="card_set_prostoy">
     <div class="checkbox_item">
                    <input class="input_set" type="checkbox" id="min_duration_moto" >
                    <label class="label_check_set label_check_set_prostoy" for="min_duration_moto">Мин. длительность (чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>
              
                </div>`

    }

    static renderProstoy(type) {
        console.log(type)
        let html;
        switch (type) {
            case '10':
            case '11': html = ` <div class="card_set_prostoy">
     <div class="checkbox_item">
                    <input class="input_set" type="checkbox" id="min_distance_prostoy" >
                    <label class="label_check_set label_check_set_prostoy" for="min_distance_prostoy">Мин. длительность простоя(чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>
                              </div>
                                <div class="checkbox_item">
                                      <input type="radio" id="angleSensor" name="angle" value="Датчик угла наклона">
            <label class="radio_sensor" for="angleSensor">Датчик угла наклона</label>
                     <input type="radio" id="attachmentsSensor" name="angle" value="Работа навесного оборудования">
            <label class="radio_sensor" for="attachmentsSensor">Работа навесного оборудования</label>
                                    </div>`
                break;
            case '30': html = ` <div class="card_set_prostoy">
     <div class="checkbox_item">
                    <input class="input_set" type="checkbox" id="min_distance_prostoy" >
                    <label class="label_check_set label_check_set_prostoy" for="min_distance_prostoy">Мин. длительность простоя(чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>
              
                </div>`
                break;
            case '20': html = ` 
      <div class="card_set_prostoy">
     <div class="checkbox_item">
                    <input class="input_set" type="checkbox" id="min_distance_prostoy" >
                    <label class="label_check_set label_check_set_prostoy" for="min_distance_prostoy">Мин. длительность простоя(чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>

                </div>
      <div class="card_set_prostoy datchik_min_max">
     <div class="checkbox_item">
                    <input type="checkbox" id="datchik_ugla" >
                    <label class="label_check_set_prostoy uniq_set_prostoy" for="datchik_ugla">Датчик угла наклона</label>
                 <div class="porog">min</div><input class="porog_value" disabled>
                      <div class="porog">max</div><input class="porog_value" disabled>
                </div>
                              </div>`
                break;

            default: html = ` <div class="card_set_prostoy">
     <div class="checkbox_item">
                    <input class="input_set" type="checkbox" id="min_distance_prostoy" >
                    <label class="label_check_set label_check_set_prostoy" for="min_distance_prostoy">Мин. длительность простоя(чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>
              
                </div>`

        }

        return html
    }

    static renderTraveling() {
        return `
    <div class="card_set">
    <div class="distance">Длительность</div>
    <div class="checkbox_item">
                    <input class="input_time" type="checkbox" id="min_distance" >
                    <label class="label_check_set" for="min_distance">Мин. длительность (чч:мм:сс)</label>
                    <input class="value_set" value=00:00:00 disabled>
                </div>
                <div class="checkbox_item">
                    <input class="input_time" type="checkbox" id="max_distance">
                    <label class="label_check_set" for="max_distance">Макс. длительность (чч:мм:сс)</label>
                    <input class="value_set" value=24:00:00 disabled>
                </div>
                </div>

                  <div class="card_set">
    <div class="distance">Пробег</div>
    <div class="checkbox_item">
                    <input class="input_distance" type="checkbox" id="min_mileage">
                    <label class="label_check_set set_mileage" for="min_mileage">Мин. пробег, км</label>
                    <input class="value_set set_mil"  maxlength="6" value=0 disabled>
                </div>
                <div class="checkbox_item">
                    <input class="input_distance" type="checkbox" id="max_mileage">
                    <label class="label_check_set set_mileage" for="max_mileage">Макс. пробег, км</label>
                    <input class="value_set set_mil"  maxlength="6" value=0 disabled>
                </div>
                </div>
                `
    }

}