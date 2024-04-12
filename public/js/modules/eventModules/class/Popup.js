
export class Popup {
    constructor(data, login, arrayIdGroups) {
        this.data = data
        this.login = login
        this.arrayIdGroups = arrayIdGroups

        this.init()
    }

    createPopup(array) {
        const arr = Object.values(array[0]);
        console.log(arr)
        const body = document.getElementsByTagName('body')[0]
        const pop = document.createElement('div')
        pop.classList.add('popup')
        body.prepend(pop)
        const popH = document.createElement('div')
        popH.classList.add('popH')
        const popupHead = document.createElement('div')
        popupHead.classList.add('popup-header')
        popupHead.textContent = arr[0]
        arr.shift()
        pop.appendChild(popH)
        popH.appendChild(popupHead)
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
        popupClose.innerHTML = `<i class="fas fa fa-times "></i>`
        popH.appendChild(popupClose)
        const popup = document.querySelector('.popup');
        popup.style.display = "block";
        const popy = document.querySelector('.popup-background')
        popy.style.display = 'block'

        popup.classList.add('open');
        const closeButton = document.querySelector('.popup-close');
        closeButton.addEventListener('click', function () {
            popup.remove();
            popy.style.display = 'none'
        });
        setTimeout(function () {
            popup.remove();
            popy.style.display = 'none'
        }, 10000);

    }

    async init() {
        const prms = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: this.login })
        };

        const res = await fetch('/api/viewEvent', prms);
        const result = await res.json();

        // Фильтрация результата по наличию событий
        if (result.itog && result.itog.length !== 0) {
            const viewObj = this.prepareViewObject(result.itog[0]);

            // Обработка каждого элемента данных
            this.data.forEach(el => {
                const content = JSON.parse(el.content);
                const event = content[0].event;
                const formattedDate = this.formatDate(new Date(Number(el.time) * 1000));
                const mess = this.createMessage(el, event, content, formattedDate);

                // Показываем попап если событие совпадает с требуемым
                if (viewObj.alert.includes(event)) this.createPopup(mess);
            });
        } else {
            console.log('нет данных');
        }
    }

    prepareViewObject(viewObj) {
        delete viewObj.login;
        delete viewObj.id;

        for (let key in viewObj) {
            viewObj[key] = JSON.parse(viewObj[key]).map(el =>
                ['Давление', 'Температура'].includes(el) ? 'Предупреждение' : el
            );
        }
        return viewObj;
    }

    createMessage(el, event, content, formattedDate) {
        const baseMess = { event: event, group: `Компания: ${el.groups}`, name: `Объект: ${el.name}` };
        switch (event) {
            case 'Заправка':
            case 'Слив':
                return [{ ...baseMess, litrazh: `${content[0].litrazh}`, time: `Время ${event === 'Заправка' ? 'заправки' : 'слива'}: ${formattedDate}` }];
            case 'Простой':
                return [{ ...baseMess, time: `${content[0].time}`, alarm: `${content[0].alarm}` }];
            case 'Предупреждение':
                return [{ ...baseMess, group: `Компания: ${this.getGroupById(el.idw)}`, time: `${content[0].time}`, tyres: `${content[0].tyres}`, param: `${content[0].param}`, alarm: `${content[0].alarm}` }];
            case 'Потеря связи':
                return [{ ...baseMess, lasttime: `${content[0].lasttime}` }];
            default:
                return [baseMess];
        }
    }

    formatDate(time) {
        const day = time.getDate();
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const year = time.getFullYear();
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    getGroupById(id) {
        // Проверка, является ли пользователь 'Курсором'
        if (this.login === 'Курсор') {
            return 'demo';
        }
        // Ищем группу по id объекта
        const groupEntry = this.arrayIdGroups.find(([groupId]) => groupId === id);
        return groupEntry ? groupEntry[1] : 'не определено';
    }
}


