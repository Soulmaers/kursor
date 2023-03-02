



export function modalOs(){
const modalCenterOs=document.querySelector('.modalCenterOs')
const modalClear=document.querySelector('.modalClear')
const centerOs=document.querySelectorAll('.centerOs')

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
      //  tech()//отображаем тех.характеристики+логика формул+забираем нужные данные в базу.
    })
})
modalClear.addEventListener('click',()=>{
    modalCenterOs.style.display = 'none'
})
}