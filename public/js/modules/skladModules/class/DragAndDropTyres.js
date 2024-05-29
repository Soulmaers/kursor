import { ContentGeneration } from '../html/content.js';
import { TyresService } from './TyresService.js';

export class DragAndDrop {
    constructor(parent, draggableSelector, droppableSelector, element, instance) {
        this.parent = parent;
        this.draggableSelector = draggableSelector;
        this.droppableSelector = droppableSelector;
        this.instanceSkladyres = instance;
        this.element = element;
        this.pop = document.querySelector('.popup-background');

        this.draggableElements = this.parent.querySelectorAll(draggableSelector);
        this.droppableElements = document.querySelectorAll(droppableSelector);
        this.drag = null
        // Привязка методов
        this.boundOnDragStart = this.onDragStart.bind(this);
        this.boundOnDragOver = this.onDragOver.bind(this);
        this.boundOnDrop = this.onDrop.bind(this);

        this.init();
    }

    init() {
        this.draggableElements.forEach(element => {
            if (element !== this.parent) {
                element.setAttribute('draggable', true);
                element.addEventListener('dragstart', this.boundOnDragStart);
            }
        });

        this.droppableElements.forEach(element => {
            if (element !== this.parent) {
                element.setAttribute('draggable', true); // Делаем элементы droppableSelector также перетягиваемыми
                element.addEventListener('dragstart', this.boundOnDragStart);
                element.addEventListener('dragover', this.boundOnDragOver);
                element.addEventListener('drop', this.boundOnDrop);
            }
        });

        // Также делаем parent элемент местом для сброса
        this.parent.addEventListener('dragover', this.boundOnDragOver);
        this.parent.addEventListener('drop', this.boundOnDrop);
    }

    removeEventListeners() {
        this.draggableElements.forEach(element => {
            element.removeAttribute('draggable');
            element.removeEventListener('dragstart', this.boundOnDragStart);
        });

        this.droppableElements.forEach(element => {
            element.removeEventListener('dragstart', this.boundOnDragStart);
            element.removeEventListener('dragover', this.boundOnDragOver);
            element.removeEventListener('drop', this.boundOnDrop);
        });

        // Удаляем обработчики событий у parent
        this.parent.removeEventListener('dragover', this.boundOnDragOver);
        this.parent.removeEventListener('drop', this.boundOnDrop);
    }

    onDragStart(event) {
        this.drag = event.target
        event.dataTransfer.setData('data-att', event.target.getAttribute('rel'));
        event.dataTransfer.setData('classList', event.target.classList.toString());
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDrop(event) {
        event.preventDefault();
        const dataAtt = event.dataTransfer.getData('data-att');
        const dropzone = event.target
        const parentElement1 = dropzone.closest('.sklad_tyres')
        const parentElement2 = this.drag.closest('.sklad_tyres')
        if (dropzone.getAttribute('rel') === dataAtt || parentElement1 && parentElement2 || !this.drag.getAttribute('rel')) {
            return;
        }
        this.removeExistingModal();
        this.createModal(dropzone);
        this.setupModalHandlers(dataAtt, dropzone);
    }

    removeExistingModal() {
        const existingModal = document.querySelector('.modal_podtver');
        if (existingModal) {
            existingModal.remove();
        }
    }

    createModal(dropzone) {
        this.element.insertAdjacentHTML('beforeend', ContentGeneration.modalValidation(dropzone, this.drag));
        this.modal = this.element.querySelector('.modal_podtver');
        if (!this.modal) {
            console.error('Не удалось найти элемент .modal_podtver');
            return;
        }
        this.pop.style.display = 'block';
    }

    setupModalHandlers(dataAtt, dropzone) {
        const okButton = this.modal.querySelector('.ok_podtver');
        const cancelButton = this.modal.querySelector('.cancel_podtver');
        const actionSelect = this.modal.querySelector('#actionSelect');

        cancelButton.addEventListener('click', () => {
            this.closeModal();
        });
        okButton.addEventListener('click', async () => {
            if (dropzone.closest('.sklad_tyres')) {
                if (this.validateSelection(actionSelect)) {
                    this.clearRelAttribute(dataAtt)
                    await this.selectionControlMethod(actionSelect.value, dataAtt, null, dropzone);
                }
            }
            else {
                if (dropzone.getAttribute('rel')) {
                    if (this.validateSelection(actionSelect)) {
                        const id = dropzone.getAttribute('rel');
                        await this.selectionControlMethod(actionSelect.value, dataAtt, id, dropzone);
                    }
                }
                else {
                    this.assignDataAttribute(dataAtt, dropzone);
                    this.updateBackgroundImage(dropzone);
                    await this.updateStatusTyres(dropzone);
                }
            }
            this.closeModal();
        })
    }

    async selectionControlMethod(selectedAction, dataAtt, id, dropzone) {
        let uniqID;
        if (id) {
            uniqID = id
            this.assignDataAttribute(dataAtt, dropzone);
            this.updateBackgroundImage(dropzone);
            await this.updateStatusTyres(dropzone);
        }
        else {
            uniqID = dataAtt
        }
        const tyre = this.instanceSkladyres.allTyres.find(e => e.idw_tyres === uniqID);
        switch (selectedAction) {
            case '1':
                await this.updateStatusTyresSklad(uniqID, tyre, this.instanceSkladyres.modelCar, '1');
                break;
            case '4':
                await this.updateStatusTyresSklad(uniqID, tyre, this.instanceSkladyres.modelCar, '1');
                break;
            case '2':
                await this.updateStatusTyresSklad(uniqID, tyre, this.instanceSkladyres.modelCar, '2');
                break;
            case '3':
                await this.updateStatusTyresSklad(uniqID, tyre, this.instanceSkladyres.modelCar, '3');
                break;
            default:
                console.error('Неизвестное действие:', selectedAction);
                break;
        }
    }

    validateSelection(actionSelect) {
        if (actionSelect.value === "") {
            actionSelect.classList.add('invalid');
            return false;
        } else {
            actionSelect.classList.remove('invalid');
            return true;
        }
    }

    closeModal() {
        this.pop.style.display = 'none';
        this.modal.remove();
    }
    clearRelAttribute() {
        this.drag.removeAttribute('rel');
        this.drag.style.backgroundImage = 'none';
    }

    async updateStatusTyres(dropzone, flag) {
        const result = await TyresService.updateTyre(dropzone, this.instanceSkladyres.modelCar);
        if (!flag) {
            this.instanceSkladyres.updateListTyres();
        }
    }

    async updateStatusTyresSklad(id, tyre, model, flagStatus) {
        const result = await TyresService.updateTyreSklad(id, tyre, model, flagStatus);
        this.instanceSkladyres.updateListTyres();
    }

    assignDataAttribute(dataAtt, dropzone) {
        if (dataAtt) {
            dropzone.setAttribute('rel', dataAtt);
        }
    }

    updateBackgroundImage(dropzone) {
        dropzone.style.backgroundImage = 'url("../../../../image/0000.png")';
    }
}



/*
export class DragAndDropConsole {
    constructor(parent, draggableSelector, instance) {
        this.draggableSelector = draggableSelector;
        this.draggableElements = this.draggableElements = [...document.querySelectorAll(draggableSelector)].filter(e => e.getAttribute('rel')).map(it => it);
        this.droppableElement = parent
        this.instanceSkladyres = instance;
        this.init();
    }

    init() {
        this.draggableElements.forEach(element => {
            element.setAttribute('draggable', true);
            element.addEventListener('dragstart', this.onDragStart.bind(this));
        });
        this.droppableElement.addEventListener('dragover', this.onDragOver.bind(this));
        this.droppableElement.addEventListener('drop', this.onDrop.bind(this));

    }

    removeEventListeners() {
        this.droppableElement.removeAttribute('draggable');
        this.droppableElement.removeEventListener('dragstart', this.onDragStart.bind(this));
        this.droppableElement.removeEventListener('dragover', this.onDragOver.bind(this));
        this.droppableElement.removeEventListener('drop', this.onDrop.bind(this));
    }

    onDragStart(event) {
        console.log(event)
        event.dataTransfer.setData('data-att', event.target.getAttribute('rel'));
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDrop(event) {
        event.preventDefault();
        const dataAtt = event.dataTransfer.getData('data-att');
        // Стираем атрибут rel и делаем фон прозрачным
        this.clearRelAttribute(dataAtt);
    }
    async updateStatusTyres(dropzone, tyres, model) {
        const id = dropzone.getAttribute('rel')
        const result = await TyresService.updateTyreSklad(id, tyres, model, '1');
        this.instanceSkladyres.updateListTyres();
    }
    clearRelAttribute(dataAtt) {
        const tyres = this.instanceSkladyres.allTyres.find(e => e.idw_tyres === dataAtt)
        this.draggableElements.forEach(element => {
            if (element.getAttribute('rel') === dataAtt) {
                this.updateStatusTyres(element, tyres, this.instanceSkladyres.modelCar)
                element.removeAttribute('rel');
                element.style.backgroundImage = 'none';

            }
        });
    }
}*/