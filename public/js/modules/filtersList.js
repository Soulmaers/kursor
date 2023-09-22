import { storTitleList } from './content.js'
import { Tooltip } from '../class/Tooltip.js'
import { saveCheckListToBase } from './settingsRotate.js'
const selectOn = (event) => {
    event.target.style.display = 'none'
    event.target.nextElementSibling.style.display = 'block'
    const newCelChange = document.querySelectorAll('.newCelChange')
    newCelChange.forEach(el => {
        if (event.target.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
            if (el.getAttribute('rel').split(' ')[1] === event.target.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'none'
                }
            }
        }
        else {
            if (el.getAttribute('rel') === event.target.parentNode.parentNode.getAttribute('rel')) {
                console.log(el.children.length)
                if (el.children.length === 0) {
                    el.textContent === '-' ? el.closest('.listItem').style.display = 'none' : null
                }
                else {
                    if (!el.children[0].classList.contains('toogleIcon') || el.textContent === '-') {
                        el.closest('.listItem').style.display = 'none'
                    }

                }
            }
        }
    })
    checkZero();
}

const selectOff = (event) => {
    event.target.style.display = 'none'
    event.target.previousElementSibling.style.display = 'block'
    event.target.parentNode.previousElementSibling.style.color = 'rgba(6, 28, 71, 1)'
    const newCelChange = document.querySelectorAll('.newCelChange')
    newCelChange.forEach(el => {
        if (event.target.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
            if (el.getAttribute('rel').split(' ')[1] === event.target.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'flex'
                }
            }
        }
        else {
            if (el.getAttribute('rel') === event.target.parentNode.parentNode.getAttribute('rel')) {
                if (el.children.length === 0) {
                    el.textContent === '-' ? el.closest('.listItem').style.display = 'flex' : null
                } else {
                    if (!el.children[0].classList.contains('toogleIcon') || el.textContent === '-') {
                        el.closest('.listItem').style.display = 'flex'
                    }

                }
            }
        }
    })
    const titleModal = document.querySelectorAll('.titleModal')
    titleModal.forEach(e => {
        e.style.display === 'none' ? e.style.display = 'flex' : null;
    });
    // 
    check()
    filterType()
    //  checkCond()

    const grays = document.querySelectorAll('.grays')
    let act = false
    grays.forEach(e => {
        if (e.classList.contains('toogleIcon')) {
            act = true
        }
    })
    act ? grays.parentElement.previousElementSibling.previousElementSibling.style.color = 'gray' : null

}

function checkCond() {
    const grays = document.querySelectorAll('.grays')
    grays.forEach(e => {
        if (e.classList.contains('toogleIcon')) {
            filterCondition(null, e)
        }
    })
}
const dubleSelectOn = (elem) => {
    const newCelChange = document.querySelectorAll('.newCelChange')
    newCelChange.forEach(el => {
        if (elem.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
            if (el.getAttribute('rel').split(' ')[1] === elem.parentNode.parentNode.getAttribute('rel').split(' ')[1]) {
                if (el.children.length === 0) {
                    el.closest('.listItem').style.display = 'none'
                }
            }
        }
        else {
            if (el.getAttribute('rel') === elem.parentNode.parentNode.getAttribute('rel')) {
                if (el.children.length === 0) {
                    el.textContent === '-' ? el.closest('.listItem').style.display = 'none' : null
                }
                else {
                    if (!el.children[0].classList.contains('toogleIcon') || el.textContent === '-') {
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
    console.log(event)
    event.target.children[1].style.display = 'flex'
}
const selectionOff = (event) => {
    event.target.children[1].style.display = 'none'
    event.target.children[1].children[1].style.display === 'block' ? event.target.children[0].style.color = 'gray' : null
    const sortIcon = document.querySelector('.iconsort')
    console.log(sortIcon.previousElementSibling.previousElementSibling)
    sortIcon.previousElementSibling.children[1].style.display === 'block' ? sortIcon.previousElementSibling.previousElementSibling.style.color = 'gray' :
        sortIcon.previousElementSibling.previousElementSibling.style.color = 'rgba(6, 28, 71, 1)'
}

export function globalSelect() {
    const titleList = document.querySelectorAll('.viewIcon')
    conditionFilter()
    typeFilter()
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
function filterCondition(event, clickedElement) {
    console.log('работаем конд?')
    const targetElement = clickedElement || event.target;
    const grays = document.querySelectorAll('.grays');
    grays.forEach(e => {
        if (e !== targetElement) {
            e.classList.remove('toogleIcon')
        }
    });
    !clickedElement ? (targetElement.classList.toggle('toogleIcon'), targetElement.closest('.viewIcon').children[0].style.color = 'gray') : null
    if (targetElement.classList.contains('toogleIcon')) {
        const newCelChange = document.querySelectorAll('.newCelChange')
        const list = document.querySelectorAll('.listItem')
        //  list.forEach(e => e.style.display = 'none')
        Array.from(newCelChange).forEach(e => {
            if (e.getAttribute('rel') === targetElement.parentNode.parentNode.getAttribute('rel')) {
                if (e.children[0]) {
                    let relAttr = targetElement.getAttribute('rel');
                    let childRelAttr = e.children[0].getAttribute('rel');
                    if (relAttr === childRelAttr) {
                        e.closest('.listItem').style.display = 'flex';
                        check()
                        filterType()
                        checkZero()
                    } else {
                        e.closest('.listItem').style.display = 'none';
                    }
                }
                else {
                    e.closest('.listItem').style.display = 'none'
                }
            }
        })
    } else {
        targetElement.closest('.viewIcon').children[0].nextElementSibling.children[1].style.display !== 'none' ? targetElement.closest('.viewIcon').children[0].style.color = 'gray' :
            targetElement.closest('.viewIcon').children[0].style.color = 'rgba(6, 28, 71, 1)'
        const list = document.querySelectorAll('.listItem')
        list.forEach(e => e.style.display = 'flex')
        check()
    }
    checkZero()
    const element = document.querySelector('.conditionSort');
    const sortIcon = document.querySelector('.iconsort')
    let hasToogleIcon = false;
    grays.forEach(e => {
        if (e.classList.contains('toogleIcon')) {
            hasToogleIcon = true;
        }
    });
    hasToogleIcon ? (element.children[0].style.color = 'gray', sortIcon.style.color = 'gray') : (filterType(), element.children[0].style.color = 'rgba(6, 28, 71, 1)', sortIcon.style.color = 'rgba(6, 28, 71, 1)')
    //   
    checkZero()
}

function check() {
    const titleList = document.querySelectorAll('.viewIcon')
    titleList.forEach(item => {
        if (item.children[0].style.color === 'gray') {
            dubleSelectOn(item.children[1].children[1])
        }
    })
}
function filterType() {
    console.log('флитре')
    const grays = document.querySelectorAll('.graysType');
    const list = document.querySelectorAll('.listItem');
    const gray = document.querySelectorAll('.grays')
    let bool = false;
    let icon;
    gray.forEach(e => {
        if (e.classList.contains('toogleIcon')) {
            bool = true
            icon = e
        }
    })
    list.forEach(e => e.style.display = 'none')
    console.log(icon)
    const arrayIconsElements = []
    grays.forEach(i => {
        if (i.classList.contains('toogleIcon')) {
            i.closest('.viewIcon').children[0].style.color = 'gray'
            i.style.color = 'rgba(6, 28, 71, 1)'
            if (!bool) {
                list.forEach(it => {
                    Array.from(it.children).forEach(e => {
                        if (e.getAttribute('rel') === i.closest('.viewIcon').getAttribute('rel')) {
                            if (e.textContent === i.nextElementSibling.textContent) {
                                arrayIconsElements.push(e.closest('.listItem'))
                            }
                        }
                    })
                })
            }
            else {
                console.log('не бул')
                list.forEach(it => {
                    let firstCondition = false;
                    let secondCondition = false;
                    Array.from(it.children).forEach(e => {
                        if (e.getAttribute('rel') === i.closest('.viewIcon').getAttribute('rel') && e.textContent === i.nextElementSibling.textContent) {
                            firstCondition = true;
                        }
                        if (e.children[0] && e.children[0].getAttribute('rel') === icon.getAttribute('rel')) {
                            secondCondition = true;
                        }
                    });

                    if (firstCondition && secondCondition) {
                        arrayIconsElements.push(it);
                    }
                    console.log(firstCondition, secondCondition, it)
                });
            }
        }
        else {
            console.log('тутуже?')
            i.style.color = 'gray'

        }
    })
    console.log(arrayIconsElements)
    arrayIconsElements.forEach(el => el.style.display = 'flex')
    const element = document.querySelector('.sortType');
    const sortIcon = document.querySelector('.iconsortType')


    let hasToogleIcon = false;
    grays.forEach(e => {
        if (e.classList.contains('toogleIcon')) {
            hasToogleIcon = true;
        }
    });
    if (hasToogleIcon) {
        element.children[0].style.color = 'gray', sortIcon.style.color = 'gray'
    }
    else {
        if (bool) {
            list.forEach(et => Array.from(et.children).forEach(e => {
                if (e.children[0] && e.children[0].getAttribute('rel') === icon.getAttribute('rel')) {
                    et.style.display = 'flex'
                }
            }))
        }
        else {
            element.children[0].style.color = 'rgba(6, 28, 71, 1)', sortIcon.style.color = 'rgba(6, 28, 71, 1)'
            list.forEach(et => et.style.display = 'flex')
        }
    }
    check(),
        checkZero()
}
function checkZero() {
    const titleModal = document.querySelectorAll('.titleModal')
    titleModal.forEach(e => {
        const visibleChildren = Array.from(e.nextElementSibling.children).filter(it => it.style.display !== 'none');
        if (visibleChildren.length === 0) {
            e.style.display = 'none';
        }
        else {
            e.style.display = 'flex';
        }
    });
}
function typeFilter() {
    const sortIcon = document.querySelector('.iconsortType')
    const element = document.querySelector('.sortType');
    const sortCondition = document.querySelector('.sortConditionType')
    element.addEventListener('mouseenter', () => {
        element.style.width = '80px'
        sortIcon.style.display = 'block'

    })
    sortCondition.addEventListener('mouseleave', () => {
        sortCondition.style.display = 'none'
        //   sortIcon.classList.remove('cluch')
    })
    sortIcon.addEventListener('click', () => {
        console.log('кликнул')
        element.style.position = 'relative'
        sortCondition.style.display = 'flex'
    })

    element.addEventListener('mouseleave', () => {
        sortIcon.style.display = 'none'
        element.style.width = '70px'


    })
    const grays = document.querySelectorAll('.graysType')
    grays.forEach(el => {
        el.addEventListener('click', () => {
            el.classList.toggle('toogleIcon')
            filterType()
        })
    })

}
function conditionFilter() {
    const sortIcon = document.querySelector('.iconsort')
    const element = document.querySelector('.conditionSort');
    const sortCondition = document.querySelector('.sortCondition')
    const grays = document.querySelectorAll('.grays')
    element.addEventListener('mouseenter', () => {
        element.style.width = '70px'
        sortIcon.style.display = 'block'
    })
    sortCondition.addEventListener('mouseleave', () => {
        sortCondition.style.display = 'none'
        // sortIcon.classList.remove('cluch')
    })
    element.addEventListener('mouseleave', () => {
        sortIcon.style.display = 'none'
        element.style.width = '40px'
        // sortCondition.style.display = 'none'
        let hasToogleIcon = false;
        grays.forEach(e => {
            if (e.classList.contains('toogleIcon')) {
                hasToogleIcon = true;
            }
        });
        hasToogleIcon ? (element.children[0].style.color = 'gray', sortIcon.style.color = 'gray') : (element.children[0].style.color = 'rgba(6, 28, 71, 1)', sortIcon.style.color = 'rgba(6, 28, 71, 1)')
    })
    sortIcon.addEventListener('click', () => {
        console.log('кликнул')
        element.style.position = 'relative'
        sortCondition.style.display = 'flex'
    })
    grays.forEach(el => {
        el.addEventListener('click', filterCondition)
    })
}




export function draggable() {
    const elem = document.querySelector('.list_att')
    const elemArray = [];
    const elemCelev = [];
    let dragged;
    Array.from(elem.children).forEach(el => {
        // console.log(el)
        el.setAttribute('draggable', true);
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('drop', handleDrop);
    })



    function handleDragStart(event) {
        if (elemArray.length !== 0) {
            elemArray.length = 0
        }
        console.log('раз два??')
        dragged = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', dragged.outerHTML);
        // Создаем временный контейнер для хранения всех элементов, включая дочерние
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(dragged.cloneNode(true));
        console.log(tempContainer)
        // Сериализуем временный контейнер и передаем его данные
        event.dataTransfer.setData('text/html', tempContainer.innerHTML);

        const newCelChange = document.querySelectorAll('.newCelChange')
        newCelChange.forEach(el => {
            if (tempContainer.children[0].getAttribute('rel').split(' ')[1]) {
                if (el.getAttribute('rel').split(' ')[1] === tempContainer.children[0].getAttribute('rel').split(' ')[1]) {
                    elemArray.push(el)
                }
            }
            else {
                if (el.getAttribute('rel') === event.target.closest('.viewIcon').getAttribute('rel')) {
                    elemArray.push(el)
                }
            }
        })
    }
    function handleDragOver(event) {
        event.preventDefault();
        event.target.classList.add('drag-over');
        event.dataTransfer.dropEffect = 'move';
    }
    function handleDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');
        const data = event.dataTransfer.getData('text/html');
        console.log(data)
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = data;

        tempContainer.children[0].children[1].style.display = 'none'
        const container = document.querySelector('.list_att')
        elem.insertBefore(tempContainer.children[0], event.target.closest('.viewIcon'));
        // Удаляем перетаскиваемый элемент
        const newCelChange = document.querySelectorAll('.newCelChange')
        newCelChange.forEach(el => {
            if (event.target.closest('.viewIcon').getAttribute('rel').split(' ')[1]) {
                if (el.getAttribute('rel').split(' ')[1] === event.target.closest('.viewIcon').getAttribute('rel').split(' ')[1]) {
                    elemCelev.push(el)
                }
            }
            else {
                if (el.getAttribute('rel') === event.target.closest('.viewIcon').getAttribute('rel')) {
                    elemCelev.push(el)
                }
            }
        })
        console.log(elemArray.length)
        console.log(elemCelev.length)
        elemCelev.forEach((e, index) => {
            e.parentElement.insertBefore(elemArray[index], e)
        })
        elemArray.length = 0
        elemCelev.length = 0
        dragged.remove();
        Array.from(elem.children).forEach((el) => {
            el.removeEventListener('dragstart', handleDragStart);
            el.removeEventListener('dragover', handleDragOver);
            el.removeEventListener('drop', handleDrop);
        });
        // attachListeners()

        const viewIcon = document.querySelectorAll('.viewIcon')
        const arrayIndexTitleList = []
        viewIcon.forEach((e, index) => {
            const relValues = e.getAttribute('rel').split(' ');
            const lastRel = relValues[relValues.length - 1];
            console.log(lastRel)
            arrayIndexTitleList.push({ rel: lastRel, index: index })
            new Tooltip(e, [storTitleList[lastRel]]);
        });
        console.log(arrayIndexTitleList)
        saveCheckListToBase(1)
        draggable()
        globalSelect()

    }

}