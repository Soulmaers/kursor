

export const storStatistika = [
    { name: 'Группа объектов', checked: true, disabled: true },
    { name: 'Объект', checked: true, disabled: true },
    { name: 'Начало интервала', checked: true, disabled: true },
    { name: 'Конец интервала', checked: true, disabled: true },
    { name: 'Пробег', checked: true },
    { name: 'Потрачено по ДУТ', checked: true },
    { name: 'Средний расход по ДУТ на 100 км', checked: true },
    { name: 'Средний расход по ДУТ в м/ч', checked: true },
    { name: 'Начальный уровень топлива', checked: true },
    { name: 'Конечный уровень топлива', checked: true },
    { name: 'Объем топливного бака', checked: true },
    { name: 'Моточасы', checked: true },
    { name: 'Всего заправлено', checked: true },
    { name: 'Всего слито', checked: true },
    { name: 'Количество заправок', checked: true },
    { name: 'Количество сливов', checked: true }]

export const storComponentOil = [
    { name: 'Дата и время', checked: true },
    { name: 'Местоположение', checked: true },
    { name: 'Начальный уровень топлива', checked: true },
    { name: 'Конечный уровень топлива', checked: true },
    { name: 'Всего заправлено', checked: true },
    { name: 'Всего слито', checked: true },
    { name: 'Объём бака', checked: true },
    { name: 'До MAX уровня', checked: true }
]
export const storComponentRuns = [
    { name: 'Дата', checked: true },
    { name: 'Километраж', checked: true },
    { name: 'Время в движении', checked: true },
    { name: 'Потрачено по ДУТ', checked: true },
    { name: 'Средний расход л/100км', checked: true },
    { name: 'Поездки (количество)', checked: false },
    { name: 'Стоянки (количество)', checked: false },
    { name: 'Остановки (количество)', checked: false },
    { name: 'Простои на ХХ (количество)', checked: false },
    { name: 'Кол-во нарушений (количество)', checked: false },
    { name: 'Итоговая информация', checked: true },
]

export const storComponentTravel = [
    { name: 'Начало', checked: true },
    { name: 'Начальное положение', checked: true },
    { name: 'Конец', checked: true },
    { name: 'Конечное положение', checked: true },
    { name: 'Длительность', checked: true },
    { name: 'Пробег', checked: true },
    { name: 'Средняя скорость', checked: true },
    { name: 'Максимальная скорость', checked: true }
]

export const storComponentMoto = [
    { name: 'Начало', checked: true },
    { name: 'Начальное положение', checked: true },
    { name: 'Конец', checked: true },
    { name: 'Конечное положение', checked: true },
    { name: 'Моточасы', checked: true },
    { name: 'Пробег', checked: true },
    { name: 'Средние обороты двигателя', checked: true },
    { name: 'Максимальные обороты двигателя', checked: true },
    { name: 'Потрачено по ДУТ', checked: true },
    { name: 'Средний расход по ДУТ на 100 км', checked: true },
    { name: 'Начальный уровень топлива', checked: true },
    { name: 'Конечный уровень топлива', checked: true }
]

export const storComponentProstoy = [
    { name: 'Начало', checked: true },
    { name: 'Начальное положение', checked: true },
    { name: 'Конец', checked: true },
    { name: 'Конечное положение', checked: true },
    { name: 'Моточасы', checked: true }
    // { name: 'Потрачено по ДУТ', checked: false },
    //{ name: 'Средний расход по ДУТ в моточасах', checked: false },
    // { name: 'Начальный уровень топлива', checked: false },
    // { name: 'Конечный уровень топлива', checked: false }
]

export const storComponentTO = [
    { name: 'Интервал техобслуживания', checked: true },
    { name: 'Состояние', checked: true },
    { name: 'Состояние по пробегу', checked: true },
    { name: 'Состояние по моточасам', checked: true },
    { name: 'Периодичность', checked: true }
]

export const storComponentParkings = [
    { name: 'Начало', checked: true },
    { name: 'Длительность', checked: true },
    { name: 'Положение', checked: true }
]

export const storComponentStops = [
    { name: 'Начало', checked: true },
    { name: 'Длительность', checked: true },
    { name: 'Положение', checked: true }
]

export const storComponentSKDSHComp = [
    { name: 'Колесо', checked: true },
    { name: 'Ожидание', checked: true },
    { name: 'Низкое', checked: true },
    { name: 'Ниже нормы', checked: true },
    { name: 'Нормальное', checked: true },
    { name: 'Выше нормы', checked: true },
    { name: 'Высокое', checked: true },
    { name: 'Всего', checked: true },
    { name: 'Минимальное давление в БАР', checked: true },
    { name: 'Максимальное давление в БАР', checked: true },
    { name: 'Среднее давление в БАР', checked: true }
]


export const storComponentSKDSHGraf = [
    { name: 'Колесо', checked: true, disabled: true },
    { name: 'Ожидание', checked: true },
    { name: 'Низкое', checked: true },
    { name: 'Ниже нормы', checked: true },
    { name: 'Нормальное', checked: true },
    { name: 'Выше нормы', checked: true },
    { name: 'Высокое', checked: true },
    { name: 'Всего', checked: true },
    { name: 'Минимум', checked: true },
    { name: 'Максимум', checked: true },
    { name: 'Среднее', checked: true }
]

export const storComponentOilGraf = [
    { name: 'Дата и время', checked: true, disabled: true }, // Заблокировано
    { name: 'Обработанные значения', checked: true, disabled: true }, // Заблокировано
    { name: 'Исходные значения', checked: true, disabled: false },
    { name: 'Движение', checked: true, disabled: false },
    { name: 'Работа двигателя', checked: true, disabled: false }
];
export const storComponentMotoGraf = [
    { name: 'Двигатель заведён', checked: true, disabled: true }, // Заблокировано
    { name: 'Техника в работе', checked: true, disabled: true }, // Заблокировано

];
export const stor = [
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



