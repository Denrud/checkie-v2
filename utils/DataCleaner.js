export class DataCleaner {
  constructor(options) {
    this.block = options.block; // Блок, в котором будем очищать поля
    this.clickElement = options.clickElement; // Элемент, который нужно кликнуть после очистки
  }

  clearFields() {
    if (!this.block) {
      console.warn("⚠️ DataCleaner: `block` не передан или не найден.");
      return;
    }

    let inputs = this.block.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      input.value = "";
      if (input.type === "checkbox" || input.type === "radio") {
        const checkboxTrigger = input
          .closest("label")
          ?.querySelector(".discounted");
        if (checkboxTrigger && input.value === "") {
          input.checked ? checkboxTrigger.click() : "";
        }
      }
    });

    if (this.clickElement && !inputs) {
      console.log("🖱️ DataCleaner: клик по элементу после очистки.");
      this.clickElement.click();
    }
    console.log(`✅ DataCleaner: очищено ${inputs.length} полей.`);
  }
}
