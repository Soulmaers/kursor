import { objColor, generT, generDav } from './content.js'
import { reqProtectorBase } from './protector.js'
import { Tooltip } from '../class/Tooltip.js'
import { convert } from './helpersFunc.js'



//создаем список под параметры
export function liCreate() {
    const obo = document.querySelector('.obo')
    const count = 250;
    for (let i = 0; i < count; i++) {
        let li = document.createElement('li');
        li.className = "msg";
        obo.append(li);
    }
}
export function view(arg) {
    const msg = document.querySelectorAll('.msg')
    arg.forEach((el, index) => {
        msg[index].textContent = `${el.params}:${el.value !== null ? el.value : '-'}`
    })
}
export function viewConfigurator(arg, params, osi) {
    const role = document.querySelector('.role').getAttribute('rel')
    const active = document.querySelector('.color')
    if (params) {
        const parametrs = convert(params)
        const tiresLink = document.querySelectorAll('.tires_link_test')
        let engine = arg.find(element => element.params === 'engine');
        engine = engine ? engine.value : 0
        parametrs.forEach(item => {
            const pressure = arg.find(element => element.params === item.pressure);
            const temp = arg.find(element => element.params === item.temp);
            const element = osi.find(element => element.idOs === item.osNumber);
            const tireLink = Array.from(tiresLink).find(e => e.id == item.tyresdiv);
            if (pressure && tireLink) {
                //   const done = active.id === '26702383' ? parseFloat((pressure.value / 10).toFixed(1)) : pressure.value !== null ? parseFloat(pressure.value) : '-';
                const done = pressure.value !== null ? parseFloat(pressure.value) : '-';
                const signal = element ? objColor[generDav(done, element)] : null;
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
                    const colorStyleTemp = engine === '0' ? 'lightgray' : temp.status === 'false' ? '#000' : objColor[generT(parseFloat(temp.value))];
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

function getHoursDiff(startDate, nowDate) {
    var diff = nowDate - startDate;
    let dayS;
    let hourS;
    const minutes = Math.floor(diff / 60)
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const day = days % 60;
    const hour = hours % 24;
    const minut = minutes % 60;
    day === 0 ? dayS = '' : dayS = days + 'д ';
    hour === 0 ? hourS = '' : hourS = hour + 'ч ';
    const mess = `${dayS} ${hourS} ${minut} мин`
    return mess;
}

export function alarmClear() {
    const alarmCheck = document.querySelectorAll('.alarmCheck')
    alarmCheck.forEach(e => {
        e.style.borderTopLeftRadius = 'none'
        e.style.border = 'none'
    })
}


