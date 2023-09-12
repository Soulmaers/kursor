import { geoloc } from '../modules/geo.js'
import { alarmFind } from '../modules/alarmStorage.js'
import { globalSelect } from '../modules/filtersList.js'

export class Flash {
    constructor(one, two, three, sec) {
        this.one = one,
            this.two = two,
            this.three = three
        this.sec = sec
        this.one.addEventListener('click', this.handleClickOne.bind(this))
        this.two.addEventListener('click', this.handleClickTwo.bind(this))
    }
    handleClickOne() {
        this.one.style.display = 'none'
        this.two.style.display = 'block'
        this.three.style.opacity = '0';
        this.three.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            this.three.style.display = 'none';
        }, 300);
        if (this.sec) {
            this.sec.style.width = '10px';
            this.sec.style.transition = 'width 0.3s ease-in-out';

        }
        const start = document.querySelector('.start')
        start.style.display === 'none' ? (geoloc()) : null

    }
    handleClickTwo() {
        this.two.style.display = 'none'
        this.one.style.display = 'block'
        this.three.style.opacity = '1';
        this.three.style.width = 550 + 'px'
        setTimeout(() => {
            this.three.style.display = 'flex';
        }, 300);
        this.three.style.transition = 'opacity 0.5s ease-in-out';

        if (this.sec) {
            this.sec.style.width = '35%';
            this.sec.style.transition = 'width 0.3s ease-in-out';
        }
        const start = document.querySelector('.start')
        start.style.display === 'none' ? (geoloc()) : null
    }
}



export class CloseBTN {
    constructor(elem1, elem2, elem3, elem4) {
        this.elem1 = elem1,
            this.elem2 = elem2
        this.elem3 = elem3
        this.elem4 = elem4
        this.handleClickOutside = this.handleClickOutside.bind(this)
        document.addEventListener('click', this.handleClickOutside)
    }

    handleClickOutside(event) {
        if (this.elem3) {
            const isClickedOnElem1 = this.elem1.contains(event.target);
            const isClickedOnElem2 = this.elem2.contains(event.target);
            const isClickedOnElem3 = this.elem3.contains(event.target);
            if (!isClickedOnElem1 && !isClickedOnElem2 && !isClickedOnElem3) {
                this.elem1.style.display = 'none';
                this.elem1.classList.remove('clickLog')
            }
        }
        if (this.elem4) {
            const isClickedOnElem1 = this.elem1.contains(event.target);
            const isClickedOnElem2 = this.elem2.contains(event.target);
            if (!isClickedOnElem1 && !isClickedOnElem2) {
                this.elem1.style.display = 'none';
                this.elem3.style.display = 'block';
                this.elem2.style.display = 'none'
                alarmFind()
                const mapss = document.getElementById('mapOil')
                if (mapss) {
                    mapss.remove();
                }
            }
        }
        else {
            const isClickedOnElem1 = this.elem1.contains(event.target);
            if (!isClickedOnElem1) {
                console.log('закрыли')
                this.elem1.style.display = 'none';
            }
        }

    }
}



export class ResizeContainer {
    constructor(leftContainer, rightContainer, resizeHandle) {
        this.leftContainer = leftContainer;
        this.rightContainer = rightContainer;
        this.resizeHandle = resizeHandle;
        this.isResizing = false;
        this.initialX = null;
        // Add event listeners
        this.resizeHandle.addEventListener('mousedown', this.startResize.bind(this));
        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
    }
    startResize(event) {
        event.preventDefault()
        this.isResizing = true;
        this.initialX = event.clientX;
        this.originalLeftContainerWidth = this.leftContainer.offsetWidth;
        this.originalRightContainerWidth = this.rightContainer.offsetWidth;
    }
    resize(event) {
        if (!this.isResizing) {
            return;
        }
        const dx = event.clientX - this.initialX;
        const minContainerWidth = 50; // Set the minimum width (pixels) for containers
        const newLeftWidth = this.originalLeftContainerWidth + dx;
        const newRightWidth = this.originalRightContainerWidth - dx;

        if (newLeftWidth < minContainerWidth || newRightWidth < minContainerWidth) {
            return;
        }
        this.resizeHandle.style.transform = `translateX(${dx}px)`;
    }
    stopResize(event) {
        if (!this.isResizing) {
            return;
        }
        const dx = event.clientX - this.initialX;
        const newLeftWidth = this.originalLeftContainerWidth + dx;
        const newRightWidth = this.originalRightContainerWidth - dx;
        this.leftContainer.style.width = `${newLeftWidth}px`;
        this.rightContainer.style.width = `${newRightWidth}px`;
        this.isResizing = false;
        this.initialX = null;
        this.resizeHandle.style.transform = 'translateX(0)';
    }
}
export class DivDraggable {
    constructor(container) {
        this.container = container;

        this.draggedHeader = null;
        this.attachListeners();
        this.elemArray = [];
        this.elemCelev = [];

    }

    attachListeners() {
        console.log('слушатели')
        this.headers = this.container.querySelectorAll('.viewIcon');
        this.headers.forEach((header) => {
            header.setAttribute('draggable', true);
            header.addEventListener('dragstart', this.handleDragStart.bind(this));
            header.addEventListener('dragover', this.handleDragOver.bind(this));
            header.addEventListener('drop', this.handleDrop.bind(this));

        });

    }
    handleDragStart(event) {
        console.log('раз два??')
        console.log(event.target)
        this.draggedHeader = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', this.draggedHeader.outerHTML);
        // Создаем временный контейнер для хранения всех элементов, включая дочерние
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(this.draggedHeader.cloneNode(true));
        console.log(tempContainer)
        // Сериализуем временный контейнер и передаем его данные
        event.dataTransfer.setData('text/html', tempContainer.innerHTML);

        const newCelChange = document.querySelectorAll('.newCelChange')
        newCelChange.forEach(el => {
            if (tempContainer.children[0].getAttribute('rel').split(' ')[1]) {
                if (el.getAttribute('rel').split(' ')[1] === tempContainer.children[0].getAttribute('rel').split(' ')[1]) {
                    this.elemArray.push(el)
                }
            }
            else {
                if (el.getAttribute('rel') === event.target.closest('.viewIcon').getAttribute('rel')) {
                    this.elemArray.push(el)
                }
            }
        })
    }
    handleDragOver(event) {
        event.preventDefault();
        event.target.classList.add('drag-over');
        event.dataTransfer.dropEffect = 'move';
    }
    handleDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');
        const data = event.dataTransfer.getData('text/html');
        console.log(data)
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = data;
        if (tempContainer.children[0] instanceof HTMLElement) {
            tempContainer.children[0].children[1].style.display = 'none'
            this.container.insertBefore(tempContainer.children[0], event.target.closest('.viewIcon'));
        }
        // Удаляем перетаскиваемый элемент
        const newCelChange = document.querySelectorAll('.newCelChange')
        newCelChange.forEach(el => {
            if (event.target.closest('.viewIcon').getAttribute('rel').split(' ')[1]) {
                if (el.getAttribute('rel').split(' ')[1] === event.target.closest('.viewIcon').getAttribute('rel').split(' ')[1]) {
                    this.elemCelev.push(el)
                }
            }
            else {
                if (el.getAttribute('rel') === event.target.closest('.viewIcon').getAttribute('rel')) {
                    this.elemCelev.push(el)
                }
            }
        })
        console.log(this.elemArray.length)
        console.log(this.elemCelev.length)
        this.elemCelev.forEach((e, index) => {
            e.parentElement.insertBefore(this.elemArray[index], e)
        })
        this.elemArray.length = 0
        this.elemCelev.length = 0

        this.draggedHeader.remove();
        // Заново присоединяем обработчик события dragstart
        /*  this.headers.forEach((header) => {
              header.removeEventListener('dragstart', this.handleDragStart.bind(this));
              header.removeEventListener('dragover', this.handleDragOver.bind(this));
              header.removeEventListener('drop', this.handleDrop.bind(this));
          });*/
        this.attachListeners()
        globalSelect()
    }
}