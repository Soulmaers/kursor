import { convert, getHoursDiff } from '../../helpersFunc.js'
import { Tooltip } from '../../../class/Tooltip.js'

export class ViewTyresValue {
    constructor(tyres, params, osi) {
        this.tyres = tyres
        this.params = params
        this.osi = osi
        this.objColor = {
            1: '#FF0000',
            2: '#FFFF00',
            3: '#4af72f',//#009933',
            5: '#fff'
        }
        this.intervalId = null; // Свойство для хранения идентификатора интервала
        this.init()
    }

    init() {
        if (this.intervalId) {
            clearInterval(this.intervalId); // Очистка предыдущего интервала, если он существует
        }
        this.intervalId = setInterval(() => this.getParams(), 110000); // Сохранение идентификатора нового интервала
        this.viewValueTyres();
    }

    clearInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }


    generDav(el, arrBar) {
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
    generT(el) {
        let generatedValue;
        if (el > - 50 && el <= 70)
            generatedValue = 5;
        else {
            generatedValue = 1;
        }
        return generatedValue;
    };
    viewValueTyres() {
        const role = document.querySelector('.role').getAttribute('rel')
        const btnShina = document.querySelectorAll('.modals')
        if (btnShina[1].classList.contains('active') === true) {
            return
        }
        if (this.tyres) {
            const parametrs = convert(this.tyres)
            const tiresLink = document.querySelectorAll('.tires_link_test')
            let engine = this.params.find(element => element.params === 'engine');
            engine = engine ? engine.value : 0
            parametrs.forEach(item => {
                const pressure = this.params.find(element => element.params === item.pressure);
                const temp = this.params.find(element => element.params === item.temp);
                const element = this.osi.find(element => element.idOs === item.osNumber);
                const tireLink = Array.from(tiresLink).find(e => e.id == item.tyresdiv);
                if (pressure && tireLink) {
                    //   const done = active.id === '26702383' ? parseFloat((pressure.value / 10).toFixed(1)) : pressure.value !== null ? parseFloat(pressure.value) : '-';
                    const done = pressure.value !== null ? parseFloat(pressure.value) : '-';
                    const signal = element ? this.objColor[this.generDav(done, element)] : null;
                    tireLink.children[0].style.position = 'relative';
                    tireLink.children[0].style.border = 'none';
                    tireLink.children[0].style.borderRadius = '30% 30% 0 0';
                    tireLink.children[0].innerHTML = `${done}\n<div class="span_bar">Bar</div>`;
                    tireLink.children[0].setAttribute('rel', `${item.pressure}`);
                    const spanBar = tireLink.querySelector('.span_bar');
                    spanBar.style.position = 'absolute';
                    spanBar.style.bottom = 0;

                    const backgroundStyle = engine === '0' ? 'none' : pressure.status === 'false' ? 'lightgray' : 'none'
                    const colorStyle = engine === '0' ? 'lightgray' : pressure.status === 'false' ? '#000' : signal
                    const borderStyle = signal === '#FF0000' ? `1px solid ${signal}` : '1px solid #fff';

                    tireLink.children[0].style.background = backgroundStyle;
                    tireLink.children[0].style.color = colorStyle;
                    tireLink.parentElement.style.border = borderStyle;

                    if (signal === '#FF0000') {
                        tireLink.parentElement.style.borderRadius = '15px';
                    }
                    if (temp) {
                        const backgroundStyleTemp = engine === '0' ? 'none' : temp.status === 'false' ? 'lightgray' : 'none'
                        const colorStyleTemp = engine === '0' ? 'lightgray' : temp.status === 'false' ? '#000' : this.objColor[this.generT(parseFloat(temp.value))];
                        tireLink.children[1].style.background = backgroundStyleTemp;
                        tireLink.children[1].style.color = colorStyleTemp;
                        tireLink.children[1].style.borderRadius = ' 0 0 30% 30%';
                        switch (temp.value) {
                            case '-128':
                            case '-50':
                            case '-51':
                                tireLink.children[1].style.color = 'red';
                                tireLink.children[1].textContent = 'err';
                                break;
                            case null:
                                tireLink.children[1].textContent = '-' + '°C';
                                tireLink.children[1].setAttribute('rel', `${item.temp}`);
                                break;
                            default:
                                tireLink.children[1].textContent = temp.value + '°C';
                                tireLink.children[1].setAttribute('rel', `${item.temp}`);
                        }
                        const nowTime = new Date();
                        const nowDate = Math.floor(nowTime.getTime() / 1000);
                        const timeStor = pressure.data ? getHoursDiff(parseInt(pressure.data), nowDate) : '-'
                        if (role === 'Администратор') {
                            new Tooltip(tireLink, [pressure.sens + '(' + pressure.params + ')', temp.sens + '(' + temp.params + ')', 'Актуальность данных:' + timeStor]);
                        }
                        else {
                            new Tooltip(tireLink, [pressure.sens, pressure.temp, 'Актуальность данных:' + timeStor]);
                        }
                    }
                }

            })

        }

    }

    async getParams() {
        const idw = document.querySelector('.color').id
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const datas = await fetch('/api/getSens', param)
        this.params = await datas.json()
        this.params.sort((prev, next) => {
            if (prev.name < next.name) return -1;
            if (prev.name < next.name) return 1;
        })
        // this.createParamsRows()
        this.viewValueTyres()

    }
}