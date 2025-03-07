import { SliderController } from '../../class/Slider.js'
import { CardServis } from './CardServis.js'


export class Servis {
    constructor(data) {
        this.data = data
        this.struktura = null
        this.onlineParams = null
        this.instance = null
        this.type = []
        this.bodyTable = document.querySelector('.body_servis')
        this.wrapper = document.querySelector('.wrapper_servis')
        this.icons = {
            'Экскаватор': `../../../image/exkavator.png`,
            'Кран': `../../../image/kran_icon.png`,
            'Бульдозер': `../../../image/Buldozer.png`,
            'Фронтальный погрузчик': `../../../image/frong-pogr.png`,
            'Газель': '../../../image/gasel.png',
            'Фургон': '../../../image/furgon.png',
            'Экскаватор-погрузчик': '../../../image/ex-pogr.png',
            'Трактор': '../../../image/traktor.png',
            'Фура': '../../../image/fura.png',
            'Легковушка': '../../../image/legk.png',
            'Самосвал': '../../../image/samosval.png',
            'Каток': '../../../image/katok.png',
            'Бетономешалка': '../../../image/beton.png',
            'Бензовоз': '../../../image/benzovoz.png',
            'ЖКХ': '../../../image/zkh.png',
            '-': '../../../image/tehnika.png'
        }
        this.init()
    }


    async init() {
        console.log(this.data)
        this.convertionIdArray()
        this.getData()
        await this.findTo()
        this.createRows()
        new SliderController(this.onlineParams)


    }

    async findTo() {
        const arrayId = this.data.flat().map(e => e[4]);
        const engineHours = this.struktura.map(e => e.engineHours);
        const array = arrayId.map((e, index) => ({ idw: e, engineHours: engineHours[index] }));
        await this.getTo(array);
    }

    async getTo(array) {
        const params = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ array })
        };
        try {
            const res = await fetch('/api/getToToBase ', params);
            const req = await res.json();
            // Обработка ответа и обновление this.struktura
            req.forEach(toData => {
                let structureItems = this.struktura.filter(item => item.idw === toData.idw);
                structureItems.map(structureItem => {
                    if (structureItem) {
                        structureItem.hoursDifference = toData.motoRemains
                        structureItem.nearestTo = toData.TOData.length !== 0 ? toData.TOData[0].nameTo : '-'

                    }
                });
            });
        } catch (error) {
            console.error("Failed to fetch TO data:", error);
        }
    }

    convertionIdArray() {
        this.struktura = this.data.flat().map(el => {
            const paramsMap = new Map(el[2].result.map(p => [p.params, p.value]));
            const engineHours = paramsMap.get('engine_hours') ? parseInt(paramsMap.get('engine_hours')) : '-'
            const idw = Number(el.object_id)//el[4]
            const marka = el.object_name//el[6].marka
            const model = el[6].model
            const vin = el[6].vin
            const face = el[6].face
            const number = el[6].number
            const gosnomer = el[6].gosnomer
            const type = el[6].typeObject ? el[6].typeObject : '-'
            this.type.push({ type: type, idw: idw })
            const company = el[7]
            return {
                idw: idw, object: [marka, model], vin: vin, company: company, contact: [face, number], gosnomer: gosnomer, engineHours: engineHours
            }
        })
    }

    createRows() {
        const rows_servis = this.bodyTable.querySelectorAll('.rows_servis')
        if (rows_servis) rows_servis.forEach(e => e.remove());
        this.bodyTable.style.width = this.wrapper.clientWidth - 15 + 'px'
        this.bodyTable.previousElementSibling.style.width = this.wrapper.clientWidth - 15 + 'px'
        this.struktura.forEach((el, index) => {
            delete el.idw
            const ul = document.createElement('div');
            ul.classList.add('rows_servis');
            ul.setAttribute('id', this.type[index].idw)
            this.bodyTable.appendChild(ul);
            const specialLi = document.createElement('div');
            specialLi.classList.add('special_first');
            specialLi.style.backgroundImage = `url(${this.icons[this.type[index].type]})`
            ul.appendChild(specialLi);

            for (let key in el) {
                const li = document.createElement('div');
                const classes = ['cel_servis', 'title_servis'];
                if (key !== 'engineHours' && key !== 'hoursDifference' && key !== 'nearestTo') classes.push('long');
                li.classList.add(...classes);
                ul.appendChild(li)
                // Проверяем тип значения и преобразуем его в строку
                let value = el[key];
                if (Array.isArray(value)) {
                    value = value.slice(0, 2).join(' ');
                }
                li.textContent = value || '-';
            }
            this.createRowsStata(3, ul)
            ul.addEventListener('click', () => {
                if (this.instance) this.instance.destroy(), this.instance = null;
                this.instance = new CardServis(this.data.flat()[index], el, this.wrapper)
            })
        })

    }

    createRowsStata(count, ul) {
        for (let i = 0; i < count; i++) {
            const li = document.createElement('div')
            li.classList.add('cel_servis')
            li.classList.add('title_servis')
            ul.appendChild(li)
            li.textContent = '-'
        }
    }
    getData() {
        const objCondition = {
            0: 'Стоянка',
            1: 'Движется',
            2: 'Остановка',
            3: 'Нет данных'
        }
        this.onlineParams = this.data.flat().map(el => {
            const params = el[2].result;
            const type = el[6].typeObject ? el[6].typeObject : '-'
            if (params.length === 0) return null; // Возвращаем null, если нет параметров
            const paramsMap = new Map(params.map(p => [p.params, p.value]));
            const lat = paramsMap.get('lat');
            const lon = paramsMap.get('lon');
            const speed = paramsMap.get('speed');
            const course = paramsMap.get('course');
            const engine = paramsMap.get('engine');
            const time = paramsMap.get('last_valid_time');

            let condition;
            if (speed && engine) {
                const num = (Number(speed) > 0 && Number(engine) === 1) ? 1
                    : (Number(speed) === 0 && Number(engine) === 1) ? 2
                        : (Number(speed) === 0 && Number(engine) === 0) ? 0 : 3;
                condition = objCondition[num]
            }
            // Возвращаем объект только если имеются все необходимые данные
            if (lat && lon && speed && course && time) {
                return {
                    idObject: el[4],
                    nameObject: el[0].message,
                    idGroup: el[8],
                    nameGroup: el[7],
                    geo: [lat, lon],
                    speed: speed,
                    course: course,
                    time: time,
                    condition: condition,
                    type: type
                };
            }
            return null;
        }).filter(e => e !== null);
    }

}