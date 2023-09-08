


console.log('test')


const selection = (event) => {
    console.log(event.target.nextElementSibling)
    event.target.nextElementSibling.style.display = 'block'
}


export function globalSelect() {
    const titleList = document.querySelector('.fa-truck-pickup')
    titleList.addEventListener('click', selection)
}
