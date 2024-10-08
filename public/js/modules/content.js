


export const storTitleList = {
    statusnew: 'Статус on/off',
    ingine: 'Зажигание',
    condition: 'Состояние',
    tagach: 'Давление в шинах тягача',
    pricep: 'Давление в шинах прицепа',
    oil: 'Топливо',
    pwr: 'Бортовое питание',
    sats: 'Спутники',
    type: 'Тип ТС',
    meliage: 'Пробег',
    lasttime: 'Актуальность данных'
}





export const formUpdate = `<div class="form-group">
<label>Логин</label>
<input type="text" class="form-control" name="username">
</div>
<div class="form-group">
<label>Пароль</label>
<input type="password" class="form-control" name="password">
</div>
<div class="form-group">
<label>Права доступа</label>
<select class="sel" id="select">
    <option class="opt" selected disabled>Укажите права доступа</option>
    <option class="opt" value="Пользователь" name="role">Пользователь</option>
    <option class="opt" value="Администратор" name="role">Администратор</option>
</select>
</div>
<div class="btnWrap">
<button class="btn-warning btn-lg">Добавить</button>
</div>`


export const cal2 = `  <div class="calendar">
                                    <input type="text" id="calen2" placeholder="Выберите диапазон дат">
                                    <div class="btn_speedStart">
                                        <button class="btm_formStart">Очистить</button>
                                        <button class="btm_formStart control">Выполнить</button>
                                    </div>
                                </div>`

export const cal3 = `  <div class="calendar">
                                    <input type="text" id="calen3" placeholder="Выберите диапазон дат">
                                    <div class="btn_speedStart">
                                        <button class="btm_formStart">Очистить</button>
                                        <button class="btm_formStart control">Выполнить</button>
                                    </div>
                                </div>`
export const text = `<div class=" osi">
        <div class="tires_spark">
            <div class="tires mod">
            </div>
            <div class="tires mod">
            </div>
        </div>
            <div class="tires_spark">
            <div class="tires mod">
            </div>
            <div class="tires mod">
            </div>
        </div>
    </div>`

export const textTest = `<div class=" osiTest">
        <div class="tires_spark_test">
            <div class="tiresTest mod">
            </div>
                  </div>
            <div class="tires_spark_test">
                      <div class="tiresTest mod">
            </div>
        </div>
    </div>`




export const filterEvent = ` <i class="fas fa-power-off filterEvent"></i>
<ul class="sortConditionType">
     <li class="item_type"><i class="fas fa-check graysEvent"></i>
         <p class="text_type">Предупреждение</p>
     </li>
     <li class="item_type"><i class="fas fa-check graysEvent"></i>
         <p class="text_type">Заправка</p>
     </li>
     <li class="item_type"><i class="fas fa-check graysEvent"></i>
         <p class="text_type">Слив</p>
     </li>
     <li class="item_type"><i class="fas fa-check graysEvent"></i>
         <p class="text_type">Простой</p>
     </li>
     <li class="item_type"><i class="fas fa-check graysEvent"></i>
         <p class="text_type">Тех. обслуживание</p>
     </li>
                   </ul>`


export const titleLogs = `<h3 class="trLogs">
                        <p class="tdLogs">Дата</p>
                                       <p class="tdLogs">Группа</p>
                        <p class="tdLogs">Объект</p>
                           <div class="tdLogs evnt">Событие  <i class="fas fa-power-off filterEvent"></i>
               <ul class="sortConditionTypeFilter">
        <li class="item_type"><i class="fas fa-check graysEvent"></i>
            <p class="text_types">Предупреждение</p>
        </li>
        <li class="item_type"><i class="fas fa-check graysEvent"></i>
            <p class="text_types">Заправка</p>
        </li>
        <li class="item_type"><i class="fas fa-check graysEvent"></i>
            <p class="text_types">Слив</p>
        </li>
        <li class="item_type"><i class="fas fa-check graysEvent"></i>
            <p class="text_types">Простой</p>
        </li>
         <li class="item_type"><i class="fas fa-check graysEvent"></i>
            <p class="text_types">Потеря связи</p>
        </li>
         <li class="item_type"><i class="fas fa-check graysEvent"></i>
            <p class="text_types">Состояние</p>
        </li>
        <li class="item_type"><i class="fas fa-check graysEvent"></i>
            <p class="text_types">Тех. обслуживание</p>
        </li>
    </ul>  </div>
        <p class="tdLogs">Содержание</p>
        <p class="tdLogs">Местоположение</p>
                     </h3>`


export const zamer = `  <div class="zamer">
                        <h3 class="titleZamer" id="zamer">Замер</h3>
                        <div class="wrapTarir"><input class="dut" placeholder="ДУТ"><input class="litr" placeholder="литры"></div>
                    </div>`

export const tr = `<h3 class="tr oneName">
                                                    <p class="td">Дата</p>
                                               <p class="td">Колесо</p>
                                                    <p class="td">P, бар</p>
                                                    <p class="td">t,°C</p>
                                                    <p class="td">Уведомления</p>
                                                </h3>`

export const twoTyres = ` 
    <div class="frontSpare">
        <div class="tiresProfil spareWill1"></div>
        <div class="tiresProfil spareWill12"></div>
        <div class="imgDivTires"><img class="img" src="./image/kol.png"></div>
           </div>`

export const forTyres = `
<div class="frontSpare sparka">
    <div class="tiresUp">
        <div class="tiresProfil spareWill1_1"></div>
        <div class="tiresProfil spareWill1_2"></div>
    </div>
    <div class="tiresDown">
        <div class="tiresProfil spareWill1_3"></div>
        <div class="tiresProfil spareWill1_4"></div>
    </div>
    <div class="imgDivTires"><img class="img" src="./image/kol.png"></div>
</div>`

export function generDav(el, arrBar) {
    let generatedValue;
    if (el >= Number(arrBar.dnmin) && el <= Number(arrBar.dnmax)) {
        generatedValue = 3;
    }
    if (el > Number(arrBar.knd) && el <= Number(arrBar.dnmin) || el > Number(arrBar.dnmax) && el <= Number(arrBar.kvd)) {
        generatedValue = 2;
    }
    if (el <= Number(arrBar.knd) || el >= Number(arrBar.kvd)) {
        generatedValue = 1;
    }
    return generatedValue;
};

export function generDavKran(el) {
    let generatedValue;
    if (el >= 6 && el <= 10) {
        generatedValue = 3;
    }
    else {
        generatedValue = 1;
    }
    return generatedValue;
};

export function generFront(el) {
    let generatedValue;
    if (el >= 8 && el <= 10) {
        generatedValue = 3;
    }
    if (el >= 7.5 && el < 8 || el > 10 && el <= 13) {
        generatedValue = 2;
    }
    if (el > -100 && el < 7.5 || el > 13) {
        generatedValue = 1;
    }
    return generatedValue;
};

export function generT(el) {
    let generatedValue;
    if (el > - 50 && el <= 70)
        generatedValue = 5;
    else {
        generatedValue = 1;
    }
    return generatedValue;
};

export const objColor = {
    1: '#FF0000',
    2: '#FFFF00',
    3: '#4af72f',//#009933',
    5: '#fff'
}
export const objColorFront = {
    1: '#FF0000',
    2: '#FFFF00',
    3: '#009933',//#009933',
    5: '#fff'
}

export function gener(el) {
    let generatedValue;
    if (el === 100) {
        generatedValue = 5;
    }
    if (el >= 80 && el < 100) {
        generatedValue = 4;
    }
    if (el >= 60 && el < 80) {
        generatedValue = 3;
    }
    if (el >= 40 && el < 60) {
        generatedValue = 2;
    }
    if (el < 40) {
        generatedValue = 1;
    }
    return generatedValue;
};

export const objColors = {
    5: 'rgba(5, 159, 16, 0.8)',//#009933',//зеленый
    4: 'rgba(5, 159, 16, 0.8)',//#009933', //зеленый
    3: 'rgba(200, 202, 8, 0.8)',//#FFFF00',//желтый
    2: 'rgba(205, 95, 5, 0.8)',//#FF6633',//оранж
    1: 'rgba(209, 3, 13, 0.8)'///'#FF0000'//красный
}

export const data = ["BFGoodrich", "Bridgestone", "Continental", "Cordiant", "Dunlop", "Nokian Tyres", "Gislaved", "Goodyear", "Hankook", "Kumho", "Michelin"];
export const dataIdTyres = ['01id', '02id', '03id', '04id'];



export const jobTSDetalisation = `    <div class="jobTSDetalisationGraf">
                        <div class="jobTSDetalisationDate todayTitle"></div>
                        <div class="jobTSDetalisationLine todayChart"></div>
                        <div class="jobTSDetalisationDate yestodayTitle"></div>
                        <div class="jobTSDetalisationLine yestodayChart"></div>
                        <div class="jobTSDetalisationDate weekTitle"></div>
                        <div class="jobTSDetalisationLine weekChart"></div>
                    </div>
                    <div class="jobTSDetalisationCharts_legenda">
                        <div class="legendaButton move">Движение</div>
                        <div class="legendaButton parking">Парковка</div>
                        <div class="legendaButton engineTS">Повернут ключ зажигания</div>
                        <div class="legendaButton jobHHTS">Работа на холостом ходу</div>
                        <div class="legendaButton notConnect">ТС не на связи</div>
                    </div>`
export const jobTS = `  <div class="jobTSDetalisationGraf">
<div class="chartJobTS">
                        <div class="jobTSDetalisationDate todayTitle">Сегодня</div>
                        <div class="jobTSDetalisationLine todayChart"></div>
                        </div>
                        <div class="chartJobTS">
                        <div class="jobTSDetalisationDate yestodayTitle">Вчера</div>
                        <div class="jobTSDetalisationLine yestodayChart"></div>
                                </div>
                        <div class="chartJobTS">
                        <div class="jobTSDetalisationDate weekTitle">Неделя</div>
                        <div class="jobTSDetalisationLine weekChart"></div>
                                </div>
                    </div>
                    <div class="jobTSDetalisationCharts_legenda">
                        <div class="legendaButton move">Движение</div>
                        <div class="legendaButton parking">Парковка</div>
                        <div class="legendaButton jobHHTS">Работа на холостом ходу</div>
                        <div class="legendaButton notConnect">ТС не на связи</div>
                    </div>`
export const oilTS = `  <div class="jobTSDetalisationGraf">
<div class="chartJobTS">
                        <div class="jobTSDetalisationDate todayTitle">Сегодня</div>
                        <div class="jobTSDetalisationLine todayChart"></div>
                        </div>
                        <div class="chartJobTS">
                        <div class="jobTSDetalisationDate yestodayTitle">Вчера</div>
                        <div class="jobTSDetalisationLine yestodayChart"></div>
                                </div>
                        <div class="chartJobTS">
                        <div class="jobTSDetalisationDate weekTitle">Неделя</div>
                        <div class="jobTSDetalisationLine weekChart"></div>
                                </div>
                    </div>
                    <div class="jobTSDetalisationCharts_legenda">
                        <div class="legendaButton move">Заправка</div>
                        <div class="legendaButton rashodTS">Израсходовано</div>
                        <div class="legendaButton jobHHTS">Слив топлива</div>
                                          </div>`

export const melageTS = `  <div class="jobTSDetalisationGraf">
<div class="chartJobTS">
                        <div class="jobTSDetalisationDate intervalTitle">Сегодня</div>
                        <div class="jobTSDetalisationLine intervalChart"></div>
                        </div></div>
                               <div class="jobTSDetalisationCharts_legenda">
                                                               </div>`