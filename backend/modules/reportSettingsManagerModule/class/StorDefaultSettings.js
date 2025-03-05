


class StorDefaultSettings {

    static settings = {
        'Топливо': null,
        'Поездки': null,
        'Стоянки': null,
        'Остановки': null,
        'Моточасы': null,
        'Простои на холостом ходу': null,
        'Техническое обслуживание': null
    }

    static controllTypeIndexContent(typeIndex) {

        switch (typeIndex) {
            case 10:
            case 11: StorDefaultSettings.index10()
                break;
            case 20: StorDefaultSettings.index20()
                break;
            case 30: StorDefaultSettings.index30()
                break;
            default: StorDefaultSettings.index30()
                break;

        }
        return StorDefaultSettings.settings
    }



    static index10() {
        StorDefaultSettings.settings = {
            'Топливо': {
                duration: {
                    timeRefill: '00:05:00',
                    timeDrain: '00:05:00'
                },
                volume: {
                    volumeRefill: 20,
                    volumeDrain: 20
                }
            },
            'Поездки': {
                duration:
                {
                    minDuration: '00:10:00',
                    maxDuration: null
                },
                mileage: {
                    minMileage: 1,
                    maxMileage: null
                },
                speed: {
                    maxSpeed: 96,
                    flag: false,
                    timeExcess: 60,
                    flagTimeExcess: false
                }
            },
            'Стоянки': { minDuration: '00:10:00' },
            'Остановки': { minDuration: '00:05:00' },
            'Моточасы': { minDuration: '00:05:00' },
            'Простои на холостом ходу': {
                minDuration: '00:20:00',
                angleSensor: true,
                attachmentsSensor: false
            },
            'Техническое обслуживание': null
        }
    }

    static index20() {
        StorDefaultSettings.settings = {
            'Топливо': {
                duration: {
                    timeRefill: '00:05:00',
                    timeDrain: '00:05:00'
                },
                volume: {
                    volumeRefill: 20,
                    volumeDrain: 20
                }
            },
            'Поездки': {
                duration:
                {
                    minDuration: '00:10:00',
                    maxDuration: null
                },
                mileage: {
                    minMileage: 1,
                    maxMileage: null
                }
            },
            'Стоянки': { minDuration: '00:10:00' },
            'Остановки': { minDuration: '00:05:00' },
            'Моточасы': { minDuration: '00:05:00' },
            'Простои на холостом ходу': {
                minDuration: '00:20:00',
                angleSensorSettings: { minValue: 10, maxValue: null }
            },
            'Техническое обслуживание': null
        }
    }

    static index30() {
        StorDefaultSettings.settings = {
            'Топливо': {
                duration: {
                    timeRefill: '00:05:00',
                    timeDrain: '00:05:00'
                },
                volume: {
                    volumeRefill: 20,
                    volumeDrain: 20
                }
            },
            'Поездки': {
                duration:
                {
                    minDuration: '00:10:00',
                    maxDuration: null
                },
                mileage: {
                    minMileage: 1,
                    maxMileage: null
                }
            },
            'Стоянки': { minDuration: '00:10:00' },
            'Остановки': { minDuration: '00:05:00' },
            'Моточасы': { minDuration: '00:05:00' },
            'Простои на холостом ходу': {
                minDuration: '00:20:00'
            },
            'Техническое обслуживание': null
        }
    }
}



module.exports = { StorDefaultSettings }