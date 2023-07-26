


export async function modalView(zapravka, name, group) {
    console.log(zapravka)
    console.log(zapravka[0], name, group)
    const litrazh = zapravka[0][1][0] - zapravka[0][0][0]
    const geo = zapravka[0][0][2]
    const time = zapravka[0][0][1]
    const lastTime = zapravka[0][1][1]
    const nowTime = new Date()
    const diffInSeconds = (nowTime.getTime() - lastTime.getTime()) / 1000;
    const day = time.getDate();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const year = time.getFullYear();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    const lat = geo[0];
    const lon = geo[1];
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ru`;
    const mestnost = await fetch(url)
    const location = await mestnost.json()
    const address = location.address;
    const adres = [];
    adres.push(address.amenity);
    adres.push(address.road);
    adres.push(address.municipality);
    adres.push(address.county);
    adres.push(address.city);
    adres.push(address.state);
    adres.push(address.country);
    const res = adres.filter(val => val !== undefined).join(', ');
    diffInSeconds > 60 ? createPopup([{ event: `Заправка`, group: `Компания: ${group}`, name: `Объект: ${name}`, litrazh: `Запралено: ${litrazh} л.`, time: `Время: ${formattedDate}`, res: `Местоположение: ${res}` }]) : console.log('ждем условия')
}


let count = 0;
function createPopup(array) {
    const arr = Object.values(array[0]);
    const body = document.getElementsByTagName('body')[0]
    console.log(body)
    if (count === 1) {
        const pop = document.createElement('div')
        pop.classList.add('popup')
        pop.style.top = 50 + '%'
        body.prepend(pop)
        const popupHead = document.createElement('div')
        popupHead.classList.add('popup-header')
        popupHead.textContent = arr[0]
        arr.shift()
        pop.appendChild(popupHead)
        const popupContent = document.createElement('div')
        popupContent.classList.add('popup-content')
        pop.appendChild(popupContent)
        for (let i = 0; i < arr.length; i++) {
            const item = document.createElement('div');
            item.classList.add('body_content');
            item.textContent = arr[i];
            popupContent.appendChild(item); // Добавляем каждый элемент в родительский элемент
        }
        const popupClose = document.createElement('div')
        popupClose.classList.add('popup-close')
        popupClose.textContent = 'X'
        pop.appendChild(popupClose)
        const popup = document.querySelector('.popup');
        popup.style.display = "block";
        popup.classList.add('open');
        //  body.style.background = 'lightGray'
        count++
        const closeButton = document.querySelector('.popup-close');
        closeButton.addEventListener('click', function () {
            popup.remove();
        });
        setTimeout(function () {
            popup.remove();
            //   popup.style.display = "none";
        }, 20000);

    }
    else {
        const pop = document.createElement('div')
        pop.classList.add('popup')
        body.prepend(pop)
        const popupHead = document.createElement('div')
        popupHead.classList.add('popup-header')
        popupHead.textContent = arr[0]
        arr.shift()
        pop.appendChild(popupHead)
        const popupContent = document.createElement('div')
        popupContent.classList.add('popup-content')
        pop.appendChild(popupContent)
        for (let i = 0; i < arr.length; i++) {
            const item = document.createElement('div');
            item.classList.add('body_content');
            item.textContent = arr[i];
            popupContent.appendChild(item); // Добавляем каждый элемент в родительский элемент
        }
        const popupClose = document.createElement('div')
        popupClose.classList.add('popup-close')
        popupClose.textContent = 'X'
        pop.appendChild(popupClose)
        const popup = document.querySelector('.popup');
        popup.style.display = "block";
        popup.classList.add('open');
        count++
        const closeButton = document.querySelector('.popup-close');
        closeButton.addEventListener('click', function () {
            popup.remove();
        });
        setTimeout(function () {
            popup.remove();
            //   popup.style.display = "none";
        }, 20000);
    }

}