


const objViewContent = {
    set_one: 'account',
    set_two: 'listView',
    set_three: 'notification'
}


export function settingsRotate() {
    const navItem = document.querySelectorAll('.item_settings')
    const contentSet = document.querySelectorAll('.content_set')
    navItem.forEach(el => {
        el.addEventListener('click', () => {
            navItem.forEach(e => {
                e.classList.remove('active_set')
            })
            contentSet.forEach(e => {
                e.style.display = 'none'
            })
            el.classList.add('active_set')
            const navClick = document.querySelector(`.${objViewContent[el.getAttribute('rel')]}`)
            navClick.style.display = 'flex'
        })

    })
}