

export function sortAll() {
    console.log('сортировка')
    const sortVN = document.querySelectorAll('.filterVN')
    sortVN.forEach(el => {
        el.addEventListener('click', () => {
            el.style.display = 'none';
            el.previousElementSibling.style.display = 'block'
            const arr = [];
            Array.from(el.parentNode.nextElementSibling.children).forEach(el => {
                arr.push(el)
            })
            arr.forEach(it => {
                el.parentNode.nextElementSibling.prepend(it)
            })
        })
    })

    const sortV = document.querySelectorAll('.filterV')
    sortV.forEach(el => {
        el.addEventListener('click', () => {
            el.style.display = 'none';
            el.nextElementSibling.style.display = 'block'
            const arr = [];
            Array.from(el.parentNode.nextElementSibling.children).forEach(el => {
                arr.push(el)
            })
            arr.forEach(it => {
                el.parentNode.nextElementSibling.prepend(it)
            })
        })
    })


}