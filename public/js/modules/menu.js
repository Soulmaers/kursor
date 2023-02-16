
import { navigator } from './navigator.js'
import { speed } from './speed.js'
import { viewList, viewOs } from './visual.js'
import { loadParamsView } from './paramsTyresView.js'

export function init() {
    wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
    wialon.core.Session.getInstance().loginToken("0f481b03d94e32db858c7bf2d8415204289C57FB5B35C22FC84E9F4ED84D5063558E1178", "", // try to login
        function (code) {
            if (code) {
                return;
            }

            zapros() //делаем запрос на wialon получаем объекты

        });
};

export function zapros() {
    const flags = 1 + 1024
    const prms = {
        "spec": {
            "itemsType": "avl_unit",
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    };

    const remote1 = wialon.core.Remote.getInstance();
    remote1.remoteCall('core/search_items', prms,
        function (code, result) {
            if (code) {
                console.log(wialon.core.Errors.getErrorText(code));
            }
            const arr1 = Object.values(result);
            const arrCar = arr1[5];
            console.log(arr1[5])
            navBarNameCar(arrCar); //отрисовываем меню с именами объектов
            //    navBarNameCarList(arrCar);

            arrCar.forEach(el => {
                //   el.nm.replace(/\s+/g, '')
                loadParamsViewList(el.nm) //запрос в базу с массивом имен машин за готовыми моделями
                // setInterval(loadParamsViewList, 6000, el.nm)
            })

            const nav = document.querySelectorAll('.car')
            const navlist = document.querySelectorAll('.carList')

            navigator(nav)
            // navigator(navlist)

            speed(arrCar)
            return arrCar
            //   geoloc(arrCar)
        });

}
export function navBarNameCar(arrCar) {
    const ul = document.createElement('ul')
    ul.classList.add('list_menu_center')
    arrCar.forEach(el => {
        const li = document.createElement('li')
        li.classList.add('list_item_menu')
        li.classList.add('car_item')
        const a = document.createElement('a')
        a.classList.add('link_menus')
        a.classList.add('car')
        a.innerHTML = `${el.nm}`;
        /*  if (el.nm == 'КранГаличанин Р858ОР178') {
              a.innerHTML = 'Кран 858'
          }*/
        ul.appendChild(li)
        li.appendChild(a)
    })
    const menu = document.querySelector('.menu')
    menu.appendChild(ul);


    const listName = document.querySelector('.list_name')
    console.log('работает')
    // const ul = document.createElement('ul')
    //ul.classList.add('list_menu_section')
    arrCar.forEach(el => {
        const li = document.createElement('li')
        li.classList.add('list_item_menu_section')
        li.classList.add('car_item')
        const a = document.createElement('a')
        a.classList.add('link_menu')
        a.classList.add('car')

        a.innerHTML = `${el.nm}`;
        /* if (el.nm == 'КранГаличанин Р858ОР178') {
             a.innerHTML = 'Кран 858'
         }*/
        listName.appendChild(li)
        li.appendChild(a)
    })
    //viewOs()

}



function loadParamsViewList(car) {
    console.log('запуск')
    // console.log(car)
    fetch('api/listModel', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ car }))
    })
        .then((res) => res.json())
        .then((res) => {
            const model = res
            console.log(model)
            fetch('api/listTyres', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify({ car }))
            })
                .then((res) => res.json())
                .then((res) => {
                    const models = res
                    fetch('api/wialonAll', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: (JSON.stringify({ car }))
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            const data = res
                            //  console.log(data)
                            //  console.log(models)
                            // console.log(model, models)
                            viewList(model, data.message, data.result, models.values)

                        })
                })

        })
}



