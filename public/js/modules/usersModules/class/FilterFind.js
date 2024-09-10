

export class FilterFind {
    constructor(index, container) {
        this.index = index
        this.container = container
        this.selectIndexFilter = container.querySelector('.select_index_filter')
        this.findInput = container.querySelector('.find_input')
        this.button = container.querySelectorAll('.button_setting')[1]
        this.init()
    }

    init() {
        this.addEventListeners()
        this.updateSelection()
    }

    updateSelection() {
        this.selectedOption = this.selectIndexFilter.value
        this.updateFilteredCells()
    }

    addEventListeners() {
        this.selectIndexFilter.addEventListener('change', this.updateSelection.bind(this))
        this.button.addEventListener('click', this.sortRows.bind(this))
        this.findInput.addEventListener('input', this.updateInputValue.bind(this))
    }

    updateInputValue() {
        this.value = this.findInput.value.toLowerCase();

    }
    updateFilteredCells() {
        const cell = this.container.querySelectorAll('.click_property')
        this.filteredCells = [...cell].filter(e => e.getAttribute('index') === this.selectedOption)


    }

    sortRows() {
        if (!this.selectedOption) return; // Если не выбран фильтр, ничего не делаем
        if (this.value.trim() === '') {
            // Если значение инпута пустое, показать все строки
            this.showAllRows();
        } else {
            // Иначе фильтровать по значению инпута
            this.filterCells();
        }
    }

    showAllRows() {
        this.filteredCells.forEach(cell => {
            const parent = cell.parentElement;
            parent.style.display = ''; // Показываем все строки
        });
    }

    filterCells() {
        this.filteredCells.forEach(cell => {
            const parent = cell.parentElement;
            const cellText = cell.textContent.toLowerCase(); // Преобразование текста в нижний регистр
            if (cellText.includes(this.value)) {
                parent.style.display = '';
            } else {
                parent.style.display = 'none';
            }
        });
    }
}