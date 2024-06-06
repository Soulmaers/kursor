
import { DraggableContainer } from '../../../class/Dragdown.js'
import { Sklad } from '../../skladModules/class/Sklad.js'


export class ControllTyres {
    constructor() {
        this.getDOM()
        this.clearText()
        this.initEventListener()
        this.instance = null
    }


    getDOM() {
        this.sensors = document.querySelector('.sensors')
        this.wrapperMap = document.querySelector('.wrapper_left')
        this.tiresLink = document.querySelectorAll('.tires_link_test')
        this.techInfo = document.querySelector('.techInfo')
        this.grafics = document.querySelector('.grafics')
        this.plug = document.querySelectorAll('.plug')
        this.tableTarir = document.querySelector('.tableTarir')
        this.idbaseTyres = document.querySelector('.idbaseTyres')
        this.wright = document.querySelector('.wrapper_right')
        this.widthWind = document.querySelector('body').offsetWidth;
    }

    clearText() {
        // this.idbaseTyres.textContent = ''
    }

    initEventListener() {
        this.tiresLink.forEach(el => el.addEventListener('click', this.operation.bind(this, el)))
    }


    hideElements() {
        this.techInfo.style.display = 'none';
        this.tableTarir.style.display = 'none';
        this.sensors.style.display = 'none';
        this.wrapperMap.style.display = this.widthWind >= 860 ? 'block' : 'none';
        this.grafics.style.display = 'none';
    }

    operation(element) {
        // Удаляем класс 'acto' с активного элемента, если таковой имеется
        const acto = document.querySelector('.acto');
        acto?.classList.remove('acto');

        this.hideElements(); // Скрываем элементы
        if (element.classList.contains('tiresActiv')) {
            element.classList.remove('tiresActiv');
            if (this.plug[1].classList.contains('activGraf')) {
                this.grafics.style.display = 'flex';
                this.wrapperMap.style.display = 'none';
            }
            return;
        }
        // Удаляем класс 'tiresActiv' с всех элементов
        this.tiresLink.forEach(e => e.classList.remove('tiresActiv'));
        // Активируем текущий элемент
        element.classList.add('tiresActiv');
        const checkAlt = document.getElementById('check_Title');
        if (checkAlt.checked) {
            this.sensors.style.display = 'flex';
            this.controllObo()
            this.close()


            new DraggableContainer(this.sensors);
            this.wright.style.zIndex = 2;
            document.querySelector('.popup-background').style.display = 'block';
        }
        // Отображаем техническую информацию
        this.techInfo.style.display = 'block';
        this.tableTarir.style.display = 'none'; // Дополнительное скрытие
        this.grafics.style.display = 'none'; // Дополнительное скрытие
        this.wrapperMap.style.display = 'none'
        new Sklad(element)
    }


    controllObo() {
        this.btnsens = document.querySelectorAll('.btnsens')
        this.titleSens = document.querySelector('.title_sens')
        this.obo = document.querySelector('.obo')
        this.btnsens.forEach(btn => {
            btn.addEventListener('click', () => {
                // Сначала удаляем класс 'actBTN' у всех кнопок
                this.btnsens.forEach(el => el.classList.remove('actBTN'));
                // Затем добавляем класс 'actBTN' только нажатой кнопке
                btn.classList.add('actBTN');
                // Показываем элементы, зависящие от активации кнопки
                this.obo.style.display = 'flex';
                this.titleSens.style.display = 'block';
            });
        });
    }

    close() {
        const closeIconConfig = document.querySelector('.closeIconConfig')
        closeIconConfig.addEventListener('click', () => {
            const tiresActivt = document.querySelector('.tiresActivt')
            tiresActivt ? tiresActivt.classList.remove('tiresActivt') : null
            const tiresActiv = document.querySelector('.tiresActiv')
            tiresActiv ? tiresActiv.classList.remove('tiresActiv') : null
            const acto = document.querySelector('.acto')
            acto ? acto.classList.remove('acto') : null
            document.querySelector('.actBTN') ? document.querySelector('.actBTN').classList.remove('actBTN') : null
            this.sensors.style.display = 'none'
            this.wright.style.zIndex = 0,
                document.querySelector('.popup-background').style.display = 'none'
        })
    }

}
