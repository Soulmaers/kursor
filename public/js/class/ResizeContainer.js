import { initCharts } from '../modules/spisokModules/class/AddListSpisok.js'


export class ResizeContainer {
    constructor(leftContainer, rightContainer, resizeHandle) {
        this.leftContainer = leftContainer;
        this.rightContainer = rightContainer;
        this.sliderBar = resizeHandle;
        this.currentX = 0;
        this.isResizing = false;

        this.sliderBar.addEventListener('mousedown', this.startResize.bind(this));
        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
        // window.addEventListener('resize', this.handleResize.bind(this));
    }
    startResize(event) {
        this.isResizing = true;
        this.currentX = event.clientX;
        this.sliderBar.style.userSelect = 'none';
    }
    resize(event) {
        if (!this.isResizing) return;

        const deltaX = event.clientX - this.currentX;
        const newWidth = this.leftContainer.offsetWidth + deltaX;

        if (newWidth < 330 || newWidth > 1200) {
            this.stopResize();
            return;
        }
        this.leftContainer.style.width = newWidth + 'px';
        this.rightContainer.style.width = `calc(100% - ${newWidth}px)`;
        this.currentX = event.clientX;
    }
    handleResize() {
        const newWidth = this.leftContainer.offsetWidth;
        console.log('ресайз')
        if (newWidth < 100) {
            this.leftContainer.style.width = '100px';
            this.rightContainer.style.width = `calc(100% - 100px)`;
        } else if (newWidth > 900) {
            this.leftContainer.style.width = '900px';
            this.rightContainer.style.width = `calc(100% - 900px)`;
        }
    }

    stopResize(event) {
        if (!this.isResizing) return; // добавляем проверку
        this.isResizing = false;
        this.sliderBar.style.removeProperty('user-select');
        console.log(initCharts)
        setTimeout(function () { initCharts.createChart(); }, 100);
    }
}
