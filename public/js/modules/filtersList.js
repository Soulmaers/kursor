


console.log('test')




const selectOn = (event) => {
    event.target.style.display = 'none'
    event.target.nextElementSibling.style.display = 'block'
    const newCelChange = document.querySelectorAll('.newCelChange')
    const countRel = event.target.parentNode.attributes.length
    newCelChange.forEach(el => {
        if (countRel > 1) {
            if (el.getAttribute('rel') === event.target.parentNode.getAttribute('rel').split(' ')[1]) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'none'
                }
            }
        }
        else {
            if (el.getAttribute('rel') === event.target.parentNode.getAttribute('rel')) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'none'
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
    event.target.style.display = 'none'
    event.target.previousElementSibling.style.display = 'block'
    const newCelChange = document.querySelectorAll('.newCelChange')
    const countRel = event.target.parentNode.attributes.length
    newCelChange.forEach(el => {
        if (countRel > 1) {
            if (el.getAttribute('rel') === event.target.parentNode.getAttribute('rel').split(' ')[1]) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'flex'
                }
            }
        }
        else {
            if (el.getAttribute('rel') === event.target.parentNode.getAttribute('rel')) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'flex'
                }
            }
        }
    })
    const titleModal = document.querySelectorAll('.titleModal')
    titleModal.forEach(e => {
        e.style.display === 'none?' ? e.style.display = 'flex' : null;
    });
}

const selection = (event) => {
    event.target.children[1].style.display = 'flex'

}
const selectionOff = (event) => {
    event.target.children[1].style.display = 'none'
}

export function globalSelect() {
    // const titleList = document.querySelector('.fa-truck-pickup')
    const titleList = document.querySelector('.list_item2')
    titleList.addEventListener('mouseenter', selection)
    titleList.addEventListener('mouseleave', selectionOff)
    const tOff = document.querySelector('.tOff')
    tOff.addEventListener('click', selectOn)
    const tOn = document.querySelector('.tOn')
    tOn.addEventListener('click', selectOff)

}
