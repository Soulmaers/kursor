
import { reqModalBar, viewBar } from './requests.js'


export function modalOs() {
    const modalCenterOs = document.querySelector('.modalCenterOs')
    const modalClear = document.querySelector('.modalClear')
    const btnModal = document.querySelector('.btnModal')
    const centerOs = document.querySelectorAll('.centerOs')



    centerOs.forEach(e => {
        e.addEventListener('click', () => {
            if (e.classList.contains('centerOsActiv')) {
                e.classList.remove('centerOsActiv')
                modalCenterOs.style.display = 'none'
                return
            }
            centerOs.forEach(e => {
                e.classList.remove('centerOsActiv')
            });

            e.classList.add('centerOsActiv')
            modalCenterOs.style.display = 'block'
            const modalInput = document.querySelectorAll('.modalInput')
            modalInput.forEach(i => {
                i.value = ''
            })
            const centerOsActiv = document.querySelector('.centerOsActiv')
            const modalNumberOs = document.querySelector('.modalNumberOs')
            const modalTitle = document.querySelector('.modalTitle')


            if (e.classList.contains('pricep')) {
                modalNumberOs.textContent = centerOsActiv.id + '-' + 'Прицеп'
            }
            else {
                modalNumberOs.textContent = centerOsActiv.id + '-' + 'Тягач'
            }
            modalTitle.style.display = 'flex'
            viewBar(centerOsActiv.id);
        })

    })
    modalClear.addEventListener('click', () => {
        modalCenterOs.style.display = 'none'
    })
    btnModal.addEventListener('click', modalBar)
}


function modalBar() {
    const centerOsActiv = document.querySelector('.centerOsActiv')
    console.log(centerOsActiv.id)


    const modalText = document.querySelectorAll('.modalText')
    console.log(modalText)
    const arrNameCol = [];
    modalText.forEach(el => {
        arrNameCol.push(el.id)
    })


    reqModalBar(arrNameCol, centerOsActiv.id);
    viewBar(centerOsActiv.id);
}

