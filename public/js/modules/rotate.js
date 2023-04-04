import { convert } from './visual.js'
import { saveDouble } from './saveBaseId.js'



export function rotate() {
    const configs = document.querySelector('.configs')
    const arrayTyres = [];
    const tiresLink = document.querySelectorAll('.tires_link')
    tiresLink.forEach(el => {
        el.addEventListener('click', () => {
            const id = document.querySelector('.idbaseTyres').textContent
            //  //    el.classList.add('rotates')
            setTimeout(console.log, 1000, id)
            console.log(id)
            arrayTyres.push(el)
            arrayTyres.forEach(el => {
                el.classList.remove('rotates')
            })
            if (arrayTyres.length > 0 && configs.classList.contains('conf')) {
                arrayTyres[arrayTyres.length - 1].classList.add('rotates')
                arrayTyres[arrayTyres.length - 2].classList.add('rotates')
                console.log(arrayTyres)
                // const rotates = document.querySelectorAll('.rotates')
                //  console.log(rotates)
            }

        })
    })
}

export function zbor(rotates) {
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    const messaga = document.querySelector('.messageId')
    const relArr = [];
    rotates.length < 2 ? (messaga.textContent = 'Выберите второе колесо!', messaga.style.color = 'red', setTimeout(() => messaga.textContent = '', 3000)) : null
    rotates.forEach(el => {
        relArr.push(el.rel)
        el.rel === '' ? (messaga.textContent = 'Нет колеса для ротации!', messaga.style.color = 'red', setTimeout(() => messaga.textContent = '', 3000)) : null
    })

    console.log(relArr)
    const allArray1 = [];
    const allArray2 = [];
    let val1;
    let val2;
    allArray1.push(rotates[0].id)
    allArray2.push(rotates[1].id)
    allArray1.push(rotates[0].closest('.osi').children[1].id)
    allArray2.push(rotates[1].closest('.osi').children[1].id)

    rotates[0].closest('.osi').children[1].classList.contains('pricep') ? val1 = 'Прицеп' : val1 = 'Тягач'
    rotates[1].closest('.osi').children[1].classList.contains('pricep') ? val2 = 'Прицеп' : val2 = 'Тягач'
    allArray1.push(val1)
    allArray2.push(val2)
    console.log(allArray1, allArray2)
    updateRotate(relArr, allArray1, allArray2, activePost)
}


async function updateRotate(relArr, allArray1, allArray2, activePost) {

    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ relArr, allArray1, allArray2, activePost }))

    }
    const res = await fetch('/api/rotate', param)
    const response = await res.json()
    const rez = convert(response.result)
    console.log(rez)


    const resulta = Object.values(rez.reduce(
        (acc, val) => {
            acc[val.identificator] = Object.assign(acc[val.identificator] ?? {}, val);
            return acc;
        },
        {}
    ));
    let idTyres = resulta[0].idTyres
    let numberOs = resulta[0].numberOs
    let typeOs = resulta[0].typeOs
    resulta[0].idTyres = resulta[1].idTyres
    resulta[1].idTyres = idTyres
    resulta[0].numberOs = resulta[1].numberOs
    resulta[1].numberOs = numberOs
    resulta[0].typeOs = resulta[1].typeOs
    resulta[1].typeOs = typeOs


    resulta[0].dataAdd = createDate()
    resulta[1].dataAdd = createDate()
    console.log(resulta)
    resulta.forEach(el => {
        delete el.id
        console.log(el)
        saveDouble(el)
    })
}



export function createDate() {

    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;

    return today

}