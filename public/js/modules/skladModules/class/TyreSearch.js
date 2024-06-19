import { Helpers } from './Helpers.js'
export class TyreSearch {
    constructor(tyreModels, fields) {
        this.tyreModels = tyreModels;
        this.fields = fields;
        this.selection = {};
        this.inputElements = {};
        this.globalArrayDatas = {};
        this.init();
    }

    init() {
        console.log(this.tyreModels)
        this.fields.forEach(field => {
            const inputElement = document.getElementById(field);
            if (inputElement) {
                this.inputElements[field] = inputElement;
                this.globalArrayDatas[field] = this.getUniqueValues(this.tyreModels, field);
                inputElement.addEventListener('input', (event) => this.onElementInput(event, field));
                inputElement.addEventListener('focus', () => this.createList(field, this.globalArrayDatas[field]));
            }
        });

        document.addEventListener('click', (event) => {
            this.fields.forEach(field => {
                if (!this.inputElements[field].contains(event.target)) {
                    this.removeList(field);
                }
            });
        });
    }

    getUniqueValues(array, key) {
        return [...new Set(array.map(item => item[key]))];
    }

    onElementInput(event, field) {
        Helpers.validatonPunctuation(event.target)
        const inputElement = this.inputElements[field];
        const value = inputElement.value.toLowerCase();
        this.selection[field] = value;

        const filteredModels = this.filterBySelection(this.tyreModels, this.selection);

        this.fields.forEach(innerField => {
            const innerInputElement = this.inputElements[innerField];
            if (innerField !== field) {
                this.globalArrayDatas[innerField] = this.getUniqueValues(filteredModels, innerField);
                this.updateAutocomplete(innerInputElement, this.globalArrayDatas[innerField]);
            }
        });

        const filteredValues = this.globalArrayDatas[field].filter(item => item.toLowerCase().includes(value));
        this.removeList(field);
        this.createList(field, filteredValues);
    }

    filterBySelection(array, selection) {
        return array.filter(item => {
            return Object.keys(selection).every(key => {
                if (!selection[key]) return true;
                return item[key].toLowerCase().includes(selection[key]);
            });
        });
    }

    createList(field, data) {
        this.removeList(field);
        const listContainer = document.createElement('div');
        listContainer.className = 'autocomplete-list';
        data.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'autocomplete-item';
            listItem.textContent = item;
            listItem.addEventListener('click', () => {
                this.inputElements[field].value = item;
                this.selection[field] = item;
                this.removeList(field);
                this.onElementInput({ target: this.inputElements[field] }, field);
            });
            listContainer.appendChild(listItem);
        });
        this.inputElements[field].parentNode.appendChild(listContainer);
    }

    updateAutocomplete(inputElement, sourceArray) {
        // No additional logic needed here since we handle it in createList method
    }

    removeList(field) {
        const listContainer = this.inputElements[field].parentNode.querySelector('.autocomplete-list');
        if (listContainer) {
            listContainer.remove();
        }
    }
}