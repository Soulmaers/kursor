
export class AlarmControll {
    constructor(nav) {
        this.list = nav
        this.mainAlarm = document.querySelector('.mainAlarm')
        this.alarmStorage = document.querySelector('.alarmStorage')
        this.mainAlarm.addEventListener('click', this.toggleCheck.bind(this))

    }


    toggleCheck() {
        this.mainAlarm.classList.toggle('check_alarm')

        if (this.mainAlarm.classList.contains('check_alarm')) {
            this.alarmStorage.style.display = 'block';
            // new DraggableContainer(alarmStorage)

            /*  document.addEventListener('click', function (event) {
                  const targetElement = event.target;
                  const map = document.getElementById('mapOil');
                  const wrapMap = document.querySelector('.wrapMap')
                  if (wrapMap && !wrapMap.contains(targetElement)) {
                      console.log('удаляем карту?')
                      wrapMap.remove();
                  }
              });
              new CloseBTN(alarmStorage, minus, plus, 'alarm')*/
        }
        else {
            this.alarmStorage.style.display = 'none';
        }
    }

}