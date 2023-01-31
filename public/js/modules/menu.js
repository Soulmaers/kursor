
import { navigator } from './navigator.js'
import { speed } from './speed.js'
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
            navigator()
            speed(arrCar)
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
        a.classList.add('link_menu')
        a.classList.add('car')
        a.innerHTML = `${el.nm}`;
        ul.appendChild(li)
        li.appendChild(a)
    })
    const menu = document.querySelector('.menu')
    menu.appendChild(ul);
    // navigator(); //запускаем  условия по клику на кнопку меню
}




