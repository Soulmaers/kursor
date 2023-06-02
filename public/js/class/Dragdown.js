
console.log('дроп')

export class DraggableContainer {
    constructor(element) {
        this.container = element;
        this.isDragging = false;
        this.initialX = 0;
        this.initialY = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        // привязываем контекст класса для обработчиков событий
        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.drag = this.drag.bind(this);
        // добавляем обработчики событий
        this.container.addEventListener('mousedown', this.dragStart);
        this.container.addEventListener('mouseup', this.dragEnd);
        this.container.addEventListener('mousemove', this.drag);

    }
    dragStart(event) {
        if (event.button === 0) { // проверяем, что зажата левая кнопка мыши
            this.initialX = event.clientX - this.xOffset;
            this.initialY = event.clientY - this.yOffset;
            if (event.target === this.container) {
                this.isDragging = true;
            }
        }
    }
    dragEnd(event) {
        this.initialX = this.currentX;
        this.initialY = this.currentY;

        this.isDragging = false;
    }
    drag(event) {
        if (this.isDragging) {
            event.preventDefault();
            this.currentX = event.clientX - this.initialX;
            this.currentY = event.clientY - this.initialY;
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            this.container.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
        }
    }
    destroy() {
        // удаляем обработчики событий
        this.container.removeEventListener('mousedown', this.dragStart);
        this.container.removeEventListener('mouseup', this.dragEnd);
        this.container.removeEventListener('mousemove', this.drag);
    }
}
/*
const body = document.querySelector('.wrapperFull')
const test = document.createElement('div')
test.classList.add('testt')
test.style.width = '100px'
test.style.height = '100px'
test.style.border = '1px solid green'
body.appendChild(test)
new DraggableContainer(test);*/