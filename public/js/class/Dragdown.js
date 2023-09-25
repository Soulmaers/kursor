
console.log('дроп')

export class DraggableContainer {
    constructor(element) {
        //  this.container = element.parentElement;
        this.elem = element
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
        this.elem.addEventListener('mousedown', this.dragStart);
        window.addEventListener('mouseup', this.dragEnd);
        window.addEventListener('mousemove', this.drag);
    }
    dragStart(event) {
        if (event.button === 0) { // проверяем, что зажата левая кнопка мыши
            this.initialX = event.clientX - this.xOffset;
            this.initialY = event.clientY - this.yOffset;
            if (event.target === this.elem) {
                this.isDragging = true;
            }
        }
    }
    dragEnd(event) {
        this.initialX = this.currentX;
        this.initialY = this.currentY;
        this.elem.style.opacity = 1
        this.isDragging = false;
    }
    drag(event) {
        if (this.isDragging) {
            event.preventDefault();
            this.currentX = event.clientX - this.initialX;
            this.currentY = event.clientY - this.initialY;
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            this.elem.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
            this.elem.style.opacity = 0.8
        }
    }
    destroy() {
        // удаляем обработчики событий
        this.elem.removeEventListener('mousedown', this.dragStart);
        window.removeEventListener('mouseup', this.dragEnd);
        window.removeEventListener('mousemove', this.drag);
    }
}
