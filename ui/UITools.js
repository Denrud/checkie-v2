export class UITools {
    constructor() {}

    addClass(element, className) {
        if (!element) {
            console.error("Элемент не найден!");
            return;
        }
        if (!element.classList.contains(className)) {
            element.classList.add(className);
        }
    }

    removeClass(element, className) {
        if (!element) {
            console.error("Элемент не найден!");
            return;
        }
        if (element.classList.contains(className)) {
            element.classList.remove(className);
        }
    }

    toggleClass(element, className) {
        if (!element) {
            console.error("Элемент не найден!");
            return;
        }
        element.classList.toggle(className);
    }
}
