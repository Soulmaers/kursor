import { Tooltip } from '../class/Tooltip.js'

export async function tooltip() {
    const role = document.querySelectorAll('.log')[0].textContent
    const idw = document.querySelector('.color').id
    console.log(idw)
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ idw }))
    }
    const parFind = await fetch('/api/iconFind', params)
    const paramssyFind = await parFind.json()

    const iconCard = document.querySelectorAll('.icon_card');
    console.log(paramssyFind)
    iconCard.forEach(e => {
        let findFlag = false;
        paramssyFind.result.forEach(it => {
            if (e.id === it.icons) {
                findFlag = true;
                console.log(role)
                if (role === 'Администратор') {
                    new Tooltip(e, [e.getAttribute('rel'), it.params]);
                }
                else {
                    new Tooltip(e, [e.getAttribute('rel')]);
                }
            }
        });
        if (!findFlag) {
            new Tooltip(e, [e.getAttribute('rel')]);
        }
    });

}
