import { GetUpdateStruktura } from '../../../GetUpdateStruktura.js'


export class SetModel {
    constructor(select, sensors, id) {
        this.selectType = select
        this.sensors = sensors
        this.id = id
        //  this.init()
    }


    async init() {
        const wrapRight = document.querySelector('.wrapper_right')
        wrapRight.style.zIndex = 0,
            document.querySelector('.popup-background').style.display = 'none'
        const arrModel = [];
        const arrTyres = [];
        this.active = document.querySelector('.color')
        const idw = this.id
        this.activePost = this.active.getAttribute('name')
        const osi = wrapRight.querySelectorAll('.osiTest')
        const linkTyres = wrapRight.querySelectorAll('.tires_link_test')
        const go = wrapRight.querySelector('.gosNumber')
        const go1 = wrapRight.querySelector('.gosNumber1')
        const goCar = wrapRight.querySelector('.gosNumberCar')
        const goCar1 = wrapRight.querySelector('.gosNumberCar1')
        let index = 0;
        let indexTyres = 0;
        osi.forEach(el => {
            index++
            el.children[1].setAttribute('id', `${index}`)
            arrModel.push(this.fnsortTest(el))
        })
        linkTyres.forEach(el => {
            indexTyres++
            el.setAttribute('id', `${indexTyres}`)
            arrTyres.push(this.fnsortTyresTest(el))
        })

        await this.changeBase(arrModel, go, go1, goCar, goCar1)
        await this.postTyres(arrTyres);
        await GetUpdateStruktura.zaprosData()
        this.sensors.style.display = 'none';
    }

    fnsortTest(el) {
        const numberOs = parseFloat(el.children[1].id)
        let typeOs;
        let sparka;
        el.children[1].classList.contains('pricepT') ? typeOs = 'Прицеп' : typeOs = 'Тягач'
        const spark = el.querySelector('.sparkCheck')
        if (spark) {
            spark.checked ? sparka = 4 : sparka = 2
        }
        else {
            sparka = 2
        }
        return [numberOs, typeOs, sparka]
    }
    fnsortTyresTest(el) {
        const numOs = el.closest('.osiTest').children[1].id
        const idw = el.id
        const relD = el.children[0].getAttribute('rel')
        const relT = el.children[1].getAttribute('rel')
        return [idw, relD, relT, numOs]
    }

    async postTyres(tyres) {

        const activePost = this.activePost
        const idw = this.id
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tyres, activePost, idw })
        }
        const results = await fetch('/api/tyres', params)
        const res = await results.json()
        console.log(res)
    }

    async reqDelete(idw) {

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idw }),
        }
        const res = await fetch('/api/delete', params)
        const result = await res.json()


        const containerAlt = document.querySelector('.containerAlt')
        if (containerAlt) {
            containerAlt.remove();
        }
        return result
    }
    //конфигуратор оси
    async changeBase(massModel, go, go1, goCar, goCar1) {
        const activePost = this.activePost
        const idw = this.id
        console.log(idw)
        massModel.length !== 0 ? massModel : massModel.push(['-', '-', '-'])
        await this.reqDelete(idw);
        let gosp;
        let frontGosp;
        let gosp1;
        let frontGosp1;
        go ? gosp = go.value : gosp = ''
        goCar ? frontGosp = goCar.value : frontGosp = ''
        go1 ? gosp1 = go1.value : gosp1 = ''
        goCar1 ? frontGosp1 = goCar1.value : frontGosp1 = ''
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ massModel, idw, activePost, gosp, gosp1, frontGosp, frontGosp1 }))
        }
        const res = await fetch('/api/updateModel', param)
        const response = await res.json()
        console.log(response)
        const modalCenterOs = document.querySelector('.modalCenterOs')
        modalCenterOs.style.display = 'none'
        const checkAlt = document.getElementById('check_Title')
        checkAlt.checked = false
    }


    async barDelete(idw) {
        const modalCenterOs = document.querySelector('.modalCenterOs')
        modalCenterOs.style.display = 'none'
        const complete = await fetch('/api/barDelete', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idw }),
        })
        const result = await complete.json()
        console.log(result)
    }

    async paramsDelete(idw) {
        fetch('/api/paramsDelete', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idw }),
        })
            .then((res) => res.json())
            .then((res) => console.log(res))
        const tyresD = document.querySelectorAll('.tiresD')
        const tyresT = document.querySelectorAll('.tiresT')
        tyresD.forEach(e => {
            e.textContent = ''
            e.style.background = '#fff'
        })
        tyresT.forEach(e => {
            e.textContent = ''
            e.style.background = '#fff'
        })
    }
}
