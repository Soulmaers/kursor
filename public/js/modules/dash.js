import { zapros, dann } from './menu.js'

export function getDash() {

    //  console.log(dann)
    dann.forEach(el => {
        const activePost = el.nm.replace(/\s+/g, '')

        //   console.log(act)
        fetch('api/tyresView', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ activePost }))
        })
            .then((res) => res.json())
            .then((res) => {
                const params = res
                //console.log(params)
                fetch('api/wialon', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: (JSON.stringify({ activePost }))
                })
                    .then((res) => res.json())
                    .then((res) => {
                        const data = res
                        //     console.log(data)

                        data.values.sort((prev, next) => {
                            if (prev.name < next.name) return -1;
                            if (prev.name < next.name) return 1;
                        })
                        dashAllSort(data.values, params.values, params.message)
                    })
            })
    })
}

const convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}

const arrAllArg = [];
const arrSmall = [];



function dashAllSort(arg, params, message) {

    const parametrs = convert(params)
    console.log(parametrs)
    console.log(arg)
    const alerts = [];
    const tiresLink = document.querySelectorAll('.tires_link')
    //const tiresLinkId = document.getElementById('.tires_link')
    //const active = document.querySelectorAll('.color')
    let activePost;



    arg.forEach((el) => {
        let parapmsPress;
        // parapmsPress = 
        let signal;
        let done;
        parametrs.forEach(item => {
            if (el.name == item.pressure && message === 'PressurePro933') {
                arrSmall.push((el.value * 0.069).toFixed(1))
            }
            else if (el.name == item.pressure) {
                arrSmall.push(el.value)
            }
        })
    })
    arrAllArg.push(arrSmall)
    console.log(arrAllArg)
}
