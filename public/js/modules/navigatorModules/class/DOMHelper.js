
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

    static createListItems(containerSelector, count, className, params) {
        const container = document.querySelector(containerSelector);

        params.forEach((el, index) => {
            const li = document.createElement('li');
            li.className = className;
            li.textContent = `${el.params}:${el.value !== null ? el.value : '-'}`
            container.append(li);
        })
    }

}