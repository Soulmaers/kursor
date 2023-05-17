import { Tooltip } from '../class/Tooltip.js'



export function tooltip() {
    const iconCard = document.querySelectorAll('.icon_card');
    // console.log(iconCard[7].getAttribute('rel'))
    iconCard.forEach(e => {
        new Tooltip(e, [e.getAttribute('rel')]);
    })

}
