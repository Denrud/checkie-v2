export class DataCleaner {
    constructor(options) {
        this.block = options.block; // Блок, в котором будем очищать поля
        this.clickElement = options.clickElement; // Элемент, который нужно кликнуть после очистки
    }

    clearFields() {
        let inputs = this.block.querySelectorAll('input, textarea, select');
        for (let input of inputs) {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        }
        
        if (this.clickElement) {
            this.clickElement.click();
        }
    }
}
