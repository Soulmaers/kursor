
import { DraggableContainer } from '../../../class/Dragdown.js'
import { CloseBTN } from '../../../class/Flash.js'
export class AlarmControll {
    constructor(nav) {
        this.list = nav
        this.mainAlarm = document.querySelector('.mainAlarm')
        this.alarmStorage = document.querySelector('.alarmStorage')
        this.wrapMap = document.querySelector('.wrapMap')
        this.mainAlarm.addEventListener('click', this.toggleCheck.bind(this))

    }


    toggleCheck(event) {
        this.mainAlarm.classList.toggle('check_alarm')
        if (this.mainAlarm.classList.contains('check_alarm')) {
            this.alarmStorage.style.display = 'block';
            new DraggableContainer(this.alarmStorage)
            event.stopPropagation();

            document.addEventListener('click', function (event) {
                const targetElement = event.target;
                if (this.wrapMap && !this.wrapMap.contains(targetElement)) {
                    this.wrapMap.remove();
                }
            });
            new CloseBTN(this.alarmStorage, this.mainAlarm)
        }
        else {
            this.alarmStorage.style.display = 'none';
        }
    }

}