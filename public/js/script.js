const detaly = document.querySelector('.detaly');

detaly.addEventListener('click', detalyFn)
function detalyFn(e) {
    e.preventDefault();
    detalisation = document.querySelector('.detalisation');
    wrapperLeft = document.querySelector('.wrapper_left');
    wrapperRigth = document.querySelector('.wrapper_right');
    detalisation.style.display = 'flex';
    wrapperLeft.style.display = 'none';
    wrapperRigth.style.display = 'none';

}



/*
function zapros() {
    console.log('запрос')
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
            arr1 = Object.values(result);
            const arrCar = arr1[5];
            console.log(arrCar)
            navBarNameCar(arrCar);
        });

}

function navBarNameCar(arrCar) {
    console.log(arrCar)
    const ul = document.createElement('ul')
    console.log(ul)
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
    document.body.appendChild(ul);

}*/
