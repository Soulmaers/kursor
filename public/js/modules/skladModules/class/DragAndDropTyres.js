import { ContentGeneration } from '../html/content.js';
import { TyresService } from './TyresService.js';
import { Helpers } from './Helpers.js';
import { objColors } from '../html/stor.js';



export class DragAndDrop {
    constructor(parent, draggableSelector, droppableSelector, element, instance) {
        this.parent = parent;
        this.draggableSelector = draggableSelector;
        this.droppableSelector = droppableSelector;
        this.instanceSkladyres = instance;
        this.element = element;
        this.pop = document.querySelector('.popup-background');

        this.draggableElements = [...this.parent.querySelectorAll(draggableSelector)]
            .filter(e => e.querySelector('.status_tyres').getAttribute('flag') === 'true')
            .map(it => it);
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
        const rotationOne = dropzone.closest('.container_shema')
        const rotationTwo = this.drag.closest('.container_shema')

        this.id = dropzone.getAttribute('rel');
        this.idBitrix = dropzone.getAttribute('relid');
        this.sensor = dropzone.getAttribute('data-att');
        this.idDrag = this.drag.getAttribute('rel');
        this.idBitrixDrag = this.drag.getAttribute('relid');
        this.sensorDrag = this.drag.getAttribute('data-att');
        if ((dropzone.getAttribute('rel') === dataAtt) || (parentElement1 && parentElement2) || !this.drag.getAttribute('rel')) {
            return;
        }
        this.removeExistingModal();
        this.createModal(dropzone);
        rotationOne && rotationTwo ? this.setupModalHandlers(dataAtt, dropzone, 'flag') : this.setupModalHandlers(dataAtt, dropzone);
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

    setupModalHandlers(dataAtt, dropzone, flag) {
        const okButton = this.modal.querySelector('.ok_podtver');
        const cancelButton = this.modal.querySelector('.cancel_podtver');
        const actionSelect = this.modal.querySelector('#actionSelect');
        const comments = this.modal.querySelector('.comm');
        cancelButton.addEventListener('click', () => {
            this.closeModal();
        });

        okButton.addEventListener('click', async () => {
            if (dropzone.closest('.sklad_tyres')) {
                if (this.validateSelection(actionSelect)) {
                    this.removeChart(this.drag)
                    this.clearRelAttribute(dataAtt);
                    await this.selectionControlMethod(actionSelect.value, null, this.drag, comments.value);
                }
                else {
                    return
                }
            } else if (flag) {
                await this.handleFlagDrop(dropzone, flag);
            } else {
                const bool = await this.handleDefaultDrop(dropzone, actionSelect, comments);
                if (!bool) return
            }
            this.closeModal();
        });
    }

    async handleFlagDrop(dropzone, flag) {
        const id = dropzone.getAttribute('rel')
        if (id) {
            this.removeChart(dropzone)
            this.assignDataAttribute(this.idDrag, this.idBitrixDrag, dropzone);
            await this.updateStatusTyres(dropzone, this.sensor, flag);
            this.removeChart(this.drag)
            this.assignDataAttribute(this.id, this.idBitrix, this.drag);
            await this.updateStatusTyres(this.drag, this.sensorDrag, flag);

        } else {
            this.assignDataAttribute(this.idDrag, this.idBitrixDrag, dropzone);
            await this.updateStatusTyres(dropzone, this.sensorDrag, flag, 'rotate');
            this.updateBackgroundImage(dropzone);
            this.removeChart(this.drag)
            this.clearRelAttribute();

        }
        this.closeModal();
    }

    async handleDefaultDrop(dropzone, actionSelect, comments) {
        if (dropzone.getAttribute('rel')) {
            if (this.validateSelection(actionSelect)) {
                const id = dropzone.getAttribute('rel');
                this.removeChart(dropzone)
                await this.selectionControlMethod(actionSelect.value, id, dropzone, comments.value);
            }
            else {
                return false
            }
        } else {
            this.assignDataAttribute(this.idDrag, this.idBitrixDrag, dropzone);
            this.updateBackgroundImage(dropzone);
            await this.updateStatusTyres(dropzone, this.sensor);
        }
        this.closeModal();
    }

    async selectionControlMethod(selectedAction, id, dropzone, comments) {
        //  this.removeChart(dropzone)
        let uniqID;
        if (id) {
            uniqID = id
            this.assignDataAttribute(this.idDrag, this.idBitrixDrag, dropzone);
            this.updateBackgroundImage(dropzone);
            await this.updateStatusTyres(dropzone, this.sensorDrag);
        }
        else {
            uniqID = this.idDrag
        }
        const tyre = this.instanceSkladyres.allTyres.find(e => e.idw_tyres === uniqID);
        switch (selectedAction) {
            case '1':
                await this.updateStatusTyresSklad(uniqID, tyre, this.instanceSkladyres.modelCar, '1', dropzone, this.drag, comments);
                break;
            case '2':
                await this.updateStatusTyresSklad(uniqID, tyre, this.instanceSkladyres.modelCar, '2', dropzone, this.drag, comments);
                break;
            case '3':
                await this.updateStatusTyresSklad(uniqID, tyre, this.instanceSkladyres.modelCar, '3', dropzone, this.drag, comments);
                break;
            default:
                console.error('Неизвестное действие:', selectedAction);
                break;
        }
    }

    validateSelection(actionSelect) {
        if (actionSelect.value === "-") {
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
    removeChart(el) {
        const charts = el.closest('.container_na_osi').querySelectorAll('.progressBar2')
        const chart = [...charts].find(e => e.getAttribute('rel') === el.getAttribute('rel'))
        chart.remove()
    }
    clearRelAttribute() {
        this.drag.removeAttribute('rel');
        this.drag.removeAttribute('relId');
        this.drag.style.backgroundImage = 'none';
        this.drag.textContent = ''
    }


    async updateStatusTyres(element, sensor, flag, rotate) {
        const result = await TyresService.updateTyre(element, this.instanceSkladyres.modelCar, sensor, rotate);
        if (!flag) {
            this.instanceSkladyres.updateListTyres();
        }
    }

    async updateStatusTyresSklad(id, tyre, model, flagStatus, dropzone, drag, comments) {
        const result = await TyresService.updateTyreSklad(id, tyre, model, flagStatus, dropzone, drag, comments);
        this.instanceSkladyres.updateListTyres();
    }

    assignDataAttribute(id, idBitrix, elem) {
        if (id) {
            const data = this.instanceSkladyres.allTyres.find(e => e.idw_tyres === id)
            elem.textContent = data.ostatok
            elem.setAttribute('rel', id);
            elem.setAttribute('relid', idBitrix);
            elem.style.color = objColors[ContentGeneration.gener(Number(data.ostatok))]
            const side = elem.getAttribute('side')
            const progressBar = ContentGeneration.addContainerCharts(id)
            progressBar.setAttribute('rel', id)
            const discription = progressBar.querySelector('.discription_shina_wrap')
            if (side === 'left') {
                elem.closest('.osi_shema_car').previousElementSibling.appendChild(progressBar)
                discription.style.left = '-110%'
            }
            else {
                elem.closest('.osi_shema_car').nextElementSibling.appendChild(progressBar)
                discription.style.right = '-125%'
            }
            Helpers.addContent(discription, data)
            TyresService.renderChartById(data, progressBar)
        }
    }

    updateBackgroundImage(dropzone) {
        dropzone.style.backgroundImage = 'url("../../../../image/0000.png")';
    }
}


