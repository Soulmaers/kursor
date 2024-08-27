

export class IntarfaceBase {
    constructor(container, index, settingWrap, buttons, login, prava, creator, creators) {
        this.container = container;
        this.index = index;
        this.settingWrap = settingWrap;
        this.buttons = buttons;
        this.login = login;
        this.prava = prava;
        this.creator = creator;
        this.creators = creators;
        this.table = this.settingWrap.querySelector('.table_data_info');
        this.pop = document.querySelector('.popup-background');
        this.init();
    }
    async init() {
        this.createTable();
        this.buttons[0].addEventListener('click', this.handleButtonClick.bind(this));
    }


    handleButtonClick() {
        // полиформизм
    }

    modalActivity(pop, flex, num) {
        this.modal.style.display = `${flex}`;
        pop.style.zIndex = num;
    }


    closeModal() {
        const close = this.modal.querySelector('.close_modal_window');
        close.addEventListener('click', this.modalActivity.bind(this, this.pop, 'none', 1));
    }

    async validationAndPackObject() {
        // полиформизм
    }

    async createTable() {
        // полиформизм
    }
}