import { Tooltip } from '../class/Tooltip.js'

export function tooltip() {
    const iconCard = document.querySelectorAll('.icon_card');
    iconCard.forEach(e => {
        new Tooltip(e, [e.getAttribute('rel')]);
    })
}
