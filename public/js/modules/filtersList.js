

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
    const titleList = document.querySelectorAll('.viewIcon')
    titleList.forEach(item => {
        if (item.children[0].style.color === 'gray') {
            console.log(item.children[0])
            dubleSelectOn(item.children[1].children[1])
        }
    })
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
    event.target.children[1].style.display = 'flex'

}
const selectionOff = (event) => {
    event.target.children[1].style.display = 'none'
    event.target.children[1].children[1].style.display === 'block' ? event.target.children[0].style.color = 'gray' : null
}



export function globalSelect() {
    const titleList = document.querySelectorAll('.viewIcon')
    const sortIcon = document.querySelector('.iconsort')
    const element = document.querySelector('.conditionSort');
    const sortCondition = document.querySelector('.sortCondition')
    const grays = document.querySelectorAll('.grays')
    element.addEventListener('mouseenter', () => {
        element.style.width = '70px'
        sortIcon.style.display = 'block'
        let hasToogleIcon = false;

        grays.forEach(e => {
            if (e.classList.contains('toogleIcon')) {
                hasToogleIcon = true;
            }
        });
        hasToogleIcon ? sortIcon.style.color = 'rgba(6, 28, 71, 1)' : sortIcon.style.color = 'gray'

    })
    sortCondition.addEventListener('mouseleave', () => {
        sortCondition.style.display = 'none'
        sortIcon.classList.remove('cluch')
        sortIcon.style.color = 'gray'
    })
    element.addEventListener('mouseleave', () => {
        sortIcon.style.display = 'none'
        element.style.width = '40px'
        sortIcon.classList.contains('cluch') ? sortCondition.style.display = 'flex' : sortCondition.style.display = 'none'
        //    sortIcon.style.color = 'gray'
    })
    sortIcon.addEventListener('click', () => {
        console.log('кликнул')
        element.style.position = 'relative'
        sortIcon.classList.toggle('cluch')
        sortIcon.classList.contains('cluch') ? (sortCondition.style.display = 'flex') :
            (sortCondition.style.display = 'none')
    })

    grays.forEach(el => {
        el.addEventListener('click', filterCondition)
    })
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
        list.forEach(e => e.style.display = 'none')
        Array.from(newCelChange).forEach(e => {
            if (e.getAttribute('rel') === targetElement.parentNode.parentNode.getAttribute('rel')) {
                if (e.children[0]) {
                    let relAttr = targetElement.getAttribute('rel');
                    let childRelAttr = e.children[0].getAttribute('rel');

                    if (relAttr === childRelAttr) {
                        e.closest('.listItem').style.display = 'flex';
                        const titleList = document.querySelectorAll('.viewIcon')
                        titleList.forEach(item => {
                            if (item.children[0].style.color === 'gray') {
                                console.log(item.children[0])
                                dubleSelectOn(item.children[1].children[1])
                            }
                        })
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
        console.log(targetElement.closest('.viewIcon').children[0].nextElementSibling.children[1])
        targetElement.closest('.viewIcon').children[0].nextElementSibling.children[1].style.display !== 'none' ? targetElement.closest('.viewIcon').children[0].style.color = 'gray' :
            targetElement.closest('.viewIcon').children[0].style.color = 'rgba(6, 28, 71, 1)'
        const list = document.querySelectorAll('.listItem')
        list.forEach(e => e.style.display = 'flex')
        const titleList = document.querySelectorAll('.viewIcon')
        titleList.forEach(item => {
            if (item.children[0].style.color === 'gray') {
                console.log(item.children[0])
                dubleSelectOn(item.children[1].children[1])
            }
        })
    }

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
        draggable()
        globalSelect()
    }

}