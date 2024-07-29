

export class CreateContent {


    static createHTML() {
        return `<div class="header_modal">
            <div class="navi_object">
                <p class="title_modales toogleModalNavi" rel="o">Объект</p>
                <p class="title_configurator" rel="config_params">Конфигуратор параметров</p>
                <div class="metaObject"></div>
            </div><i class="fas fa fa-times closes"></i>
        </div>
        <div class="body_modal">
            <div class="config_params">
                <div class="listStorMeta">
                    <div class="item_stor_title">
                        <div class="sensor_stor_name">Название датчика</div>
                        <div class="param_stor_name">Параметр</div>
                        <div class="param_meta_name">Входящий параметр</div>
                    </div>
                    <ul class="list_meta">
                    </ul>
                </div>
                <div class="listDataOldParams">
                    <div class="title_stor_meta">Выбрать параметр<div class="search_list_meta">
                            <i class="loop_find_meta fas fa-search"></i>
                            <input class="search_input_meta" placeholder="Поиск">
                        </div>
                    </div>
                    <ul class="list_old_data"></ul>
                </div>
            </div>
            <ul class="list_modal">
                <li class="item_modal">
                    <p class="property_modal">Имя объекта*</p><input rel="nameObject" class="field_modal"
                        placeholder="введите имя объекта">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Тип объекта</p><input rel="typeObject" class="field_modal"
                        placeholder="введите тип объекта">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Тип устройства*</p><input rel="typeDevice" class="field_modal"
                        placeholder="введите тип устройства">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Порт*</p><input rel="port" class="field_modal" placeholder="введите порт">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Адрес сервера*</p><input rel="adress" class="field_modal"
                        placeholder="введите адрес сервера">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Уникальный ID устройства*</p><input rel="imei" class="field_modal"
                        placeholder="введите ID устройства">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Телефонный номер</p><input rel="number" class="field_modal"
                        placeholder="введите телефонный номер">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Марка</p><input rel="marka" class="field_modal"
                        placeholder="введите марку объекта">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Модель</p><input rel="model" class="field_modal"
                        placeholder="введите модель объекта">
                </li>
                <li class="item_modal">
                    <p class="property_modal">VIN</p><input rel="vin" class="field_modal"
                        placeholder="введите win-номер объекта">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Гос. номер</p><input rel="gosnomer" class="field_modal"
                        placeholder="введите гос-номер объекта">
                </li>
                <li class="item_modal">
                    <p class="property_modal">ДУТ</p><input rel="dut" class="field_modal"
                        placeholder="введите тип датчика">
                </li>
                <li class="item_modal">
                    <p class="property_modal">Угол наклона</p><input rel="angle" class="field_modal"
                        placeholder="введите ип датчика">
                </li>
                <li class="item_modal">
                    <p class="property_modal">ID Bitrix</p><input rel="idBitrix" class="field_modal"
                        placeholder="введите id Bitrix">
                </li>
            </ul>
            <div class="footer_modal">
                <div class="validation_message"></div>
                <div class="button_modal">
                    <div class="btn_modal update_meta">Обновить</div>
                    <div class="btn_modal cancel">Отмена</div>
                    <div class="btn_modal ok_modal">Сохранить</div>
                </div>
            </div>
        </div>`
    }
}