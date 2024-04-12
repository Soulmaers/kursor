
export class DOMHelper {
    static deleteClasses(...tags) {
        tags.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.remove(selector.substring(1));
            });
        });
    }

    static deleteElements(...tags) {
        tags.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });
    }

    static hideElements(selectors, value) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.display = value;
            });
        });
    }

    static clearTextContent(...selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.textContent = '';
            });
        });
    }

    static createListItems(containerSelector, count, className) {
        const container = document.querySelector(containerSelector);
        for (let i = 0; i < count; i++) {
            const li = document.createElement('li');
            li.className = className;
            container.append(li);
        }
    }

}