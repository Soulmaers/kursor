import { Requests } from "./RequestStaticMethods.js";
import { ContentGeneration } from './CreateContent.js'
import { Helpers } from './Helpers.js'
import { ControllSettingsReportsObject } from '../../settingsEventAttributesModules/class/ManagerAttributes.js'



export class ControllNaviEdit {
    constructor(container, obj, idw) {
        this.container = container
        this.obj = obj
        this.idx = idw
        this.buttons = this.container.querySelectorAll('.buttons_menu')
        this.bodyIndex = this.container.querySelector('.body_indexs');
        this.sostavIndex = this.container.querySelector('.sostav_indexs');
        this.historyStor = this.container.querySelector('.history_stor');
        this.footerIndex = this.container.querySelector('.footer_index');
        this.settingsStor = this.container.querySelector('.settings_stor');
        this.setParamsStor = this.container.querySelector('.set_params_stor');


        this.init()
    }


    init() {
        this.eventListener()
    }

    eventListener() {
        this.buttons.forEach(el => el.addEventListener('click', this.changeBody.bind(this, el)))
    }

    changeBody(element) {
        this.buttons.forEach(e => e.classList.remove('click_button_object'))
        element.classList.add('click_button_object')
        this.idButton = element.id
        if (this.idButton === 'configID') {
            this.configParams = this.container.querySelector('.config_params');
            [this.bodyIndex, this.historyStor, this.settingsStor].forEach(e => e.style.display = 'none')
            this.configParams.style.display = 'flex';
            this.footerIndex.style.display = 'flex';
        }
        else {
            if (this.idButton === 'objectID') {
                [this.bodyIndex, this.sostavIndex, this.footerIndex].forEach(e => e.style.display = 'flex')
                this.configParams ? this.configParams.style.display = 'none' : null
                this.historyStor.style.display = 'none';
                this.settingsStor ? this.settingsStor.style.display = 'none' : null

            }
            else if (this.idButton === 'settingsObject') {
                [this.bodyIndex, this.sostavIndex, this.historyStor].forEach(e => e.style.display = 'none')
                this.configParams ? this.configParams.style.display = 'none' : null
                this.settingsStor.style.display = 'flex';
                new ControllSettingsReportsObject(this.settingsStor, this.idx)
            }

            else {
                [this.bodyIndex, this.sostavIndex, this.footerIndex].forEach(e => e.style.display = 'none')
                this.configParams ? this.configParams.style.display = 'none' : null
                this.settingsStor ? this.settingsStor.style.display = 'none' : null
                this.historyStor.style.display = 'flex';
                this.geHistoryStor()
            }
        }
    }



    async geHistoryStor() {
        this.storData = await Requests.getHistoryStor(this.obj)
        this.storData.forEach(e => e.data = Helpers.convertUnixToDateTime(Number(e.data)))
        this.historyStor.innerHTML = ContentGeneration.addListStor(this.storData)
    }
}