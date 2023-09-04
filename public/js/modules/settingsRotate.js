


const objViewContent = {
    set_one: 'account',
    set_two: 'listView',
    set_three: 'notification'
}


export function settingsRotate() {
    const navItem = document.querySelectorAll('.item_settings')
    navItem.forEach(el => {
        el.addEventListener('click', () => {
            navItem.forEach(e => {
                e.classList.remove('active_set')
            })
            el.classList.add('active_set')
        })

    })
}