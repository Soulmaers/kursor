import { objColor, generT, generDav } from './content.js'
import { reqProtectorBase } from './protector.js'
import { Tooltip } from '../class/Tooltip.js'
import { convert } from './helpersFunc.js'



export function alarmClear() {
    const alarmCheck = document.querySelectorAll('.alarmCheck')
    alarmCheck.forEach(e => {
        e.style.borderTopLeftRadius = 'none'
        e.style.border = 'none'
    })
}


