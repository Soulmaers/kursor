
import { ViewModel } from './ViewModel.js'
import { ViewTyresValue } from './ViewTyresValue.js'
import { SetPressureOs } from './SetPressureOs.js'
import { Configurator } from './Configurator.js'
import { ControllTyres } from './ControllTyres.js'

export class SKDSHClass {
    constructor(data, idw) {
        [this.model, this.tyres, this.params, this.osi] = data
        this.id = idw
        this.pressureOsInstance = null
        this.configurator = null
        this.init()
    }


    init() {
        if (this.model.length !== 0) {
            new ViewModel(this.model) // класс отрисовывает саму модель СКДШ
            new ViewTyresValue(this.tyres, this.params, this.osi)// класс отрисовывает состояние давления и температуры на колесах
            new ControllTyres() //управление кликами на колеса
        }

        // Управление жизненным циклом SetPressureOs
        if (!SKDSHClass.pressureOsInstance) {
            SKDSHClass.pressureOsInstance = new SetPressureOs(this.id); // управление настройками оси
        } else {
            SKDSHClass.pressureOsInstance.reinitialize(this.id);
        }
        if (!SKDSHClass.configurator) {
            SKDSHClass.configurator = new Configurator(this.id); // управление настройками оси
        } else {
            SKDSHClass.configurator.reinitialize(this.id);
        }
    }
}