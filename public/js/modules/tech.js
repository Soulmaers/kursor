

export function tech() {
    const inputPSI = document.querySelector('.jobDav')
    const inputBar = document.querySelector('.bar')
    const techInfo = document.querySelector('.techInfo')
    techInfo.style.display = 'block'
    const probeg = document.querySelectorAll('.probeg')
    console.log(probeg)
    probeg.forEach(el => {
        el.addEventListener('input', () => {
            console.log(probeg[1].value)
            console.log(probeg[0].value)
            if (el = probeg[1]) {
                probeg[2].textContent = probeg[1].value - probeg[0].value
                console.log(probeg[2])
            }
        })
    })
    inputPSI.addEventListener('input', () => {
        inputBar.textContent = (inputPSI.value / 14.504).toFixed(1);
        //  localStorage.setItem(id, inputBar[index].textContent);
    })
}
