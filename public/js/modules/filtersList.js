


console.log('test')




const selectOn = (event) => {
    event.target.style.display = 'none'
    event.target.nextElementSibling.style.display = 'block'
    const newCelChange = document.querySelectorAll('.newCelChange')
    newCelChange.forEach(el => {
        if (event.target.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
            if (el.getAttribute('rel') === event.target.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'none'
                }
            }
        }
        else {
            if (el.getAttribute('rel') === event.target.parentNode.parentNode.getAttribute('rel')) {
                console.log(el.children.length)
                if (el.children.length === 0) {
                    el.textContent === 'no' ? el.closest('.listItem').style.display = 'none' : null
                }
                else {
                    if (!el.children[0].classList.contains('toogleIcon') || el.textContent === 'no') {
                        el.closest('.listItem').style.display = 'none'
                    }

                }
            }
        }
    })
    const titleModal = document.querySelectorAll('.titleModal')
    titleModal.forEach(e => {
        const visibleChildren = Array.from(e.nextElementSibling.children).filter(it => it.style.display !== 'none');
        if (visibleChildren.length === 0) {
            e.style.display = 'none';
        }
    });
}



const selectOff = (event) => {

    console.log(event.target)
    event.target.style.display = 'none'
    event.target.previousElementSibling.style.display = 'block'
    event.target.parentNode.previousElementSibling.style.border = 'none'
    const newCelChange = document.querySelectorAll('.newCelChange')
    newCelChange.forEach(el => {
        if (event.target.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
            if (el.getAttribute('rel') === event.target.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'flex'
                }
            }
        }
        else {
            if (el.getAttribute('rel') === event.target.parentNode.parentNode.getAttribute('rel')) {
                if (el.children.length === 0) {
                    el.textContent === 'no' ? el.closest('.listItem').style.display = 'flex' : null
                } else {
                    if (!el.children[0].classList.contains('toogleIcon') || el.textContent === 'no') {
                        el.closest('.listItem').style.display = 'flex'
                    }

                }
            }
        }
    })
    const titleModal = document.querySelectorAll('.titleModal')
    titleModal.forEach(e => {
        console.log(e)
        e.style.display === 'none' ? e.style.display = 'flex' : null;
    });
    const titleList = document.querySelectorAll('.viewIcon')
    titleList.forEach(item => {
        if (item.children[0].style.border) {
            console.log(item.children)
            //  dubleSelectOn(item.children[1].children[1])
        }
    })

}

const dubleSelectOn = (event) => {
    console.log(event)
    //  event.style.display = 'none'
    // event.nextElementSibling.style.display = 'block'
    const newCelChange = document.querySelectorAll('.newCelChange')
    newCelChange.forEach(el => {
        if (event.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
            if (el.getAttribute('rel') === event.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'none'
                }
            }
        }
        else {
            if (el.getAttribute('rel') === event.parentNode.parentNode.getAttribute('rel')) {
                if (el.children.length === 0) {
                    el.textContent === 'no' ? el.closest('.listItem').style.display = 'none' : null
                }
                else {
                    if (!el.children[0].classList.contains('toogleIcon') || el.textContent === 'no') {
                        el.closest('.listItem').style.display = 'none'
                    }

                }
            }
        }
    })
    const titleModal = document.querySelectorAll('.titleModal')
    titleModal.forEach(e => {
        const visibleChildren = Array.from(e.nextElementSibling.children).filter(it => it.style.display !== 'none');
        if (visibleChildren.length === 0) {
            e.style.display = 'none';
        }
    });
}





const selection = (event) => {
    event.target.children[1].style.display = 'flex'

}
const selectionOff = (event) => {
    event.target.children[1].style.display = 'none'
    event.target.children[1].children[1].style.display === 'block' ? event.target.children[0].style.border = '1px solid rgba(6, 28, 71, 1)' : null
}

export function globalSelect() {
    // const titleList = document.querySelector('.fa-truck-pickup')
    const titleList = document.querySelectorAll('.viewIcon')
    titleList.forEach(item => {
        item.addEventListener('mouseenter', selection)
        item.addEventListener('mouseleave', selectionOff)
        if (item.children[1]) {
            const tOff = item.children[1].children[0]
            const tOn = item.children[1].children[1]
            tOff.addEventListener('click', selectOn)
            tOn.addEventListener('click', selectOff)
        }

    })


}
