import { UIManager } from "../ui/UIManager.js";
import { UIMenuManager } from "../ui/UIMenuManager.js";
import { CONFIG } from "../core/Config.js";
import { StorageManager } from "../utils/StorageManager.js";

export class FormHandler {
  constructor(widgetSync, uiInitializer) {
    this.widgetSync = widgetSync;
    this.uiInitializer = uiInitializer;
    this.uiManager = new UIManager();
    this.UiMenuManager = new UIMenuManager();
    this.libLink = CONFIG.currencySymbols;
    this.storage = new StorageManager("customFields").getData();
  }

  async currencySymbolsChecker(value) {
    console.log(value.length);
    const { default: currencySymbols } = await import(this.libLink);
    if (value !== "" && value.length === 3) {
      // Установить значение в найденный элемент (здесь пример с валютой USD)
      console.log(value, currencySymbols(`${value}`));
      return currencySymbols(`${value}`);
    } else {
      return value;
    }
  }

  /**
   * 📌 Обрабатывает изменение `input`, `select`, `textarea`
   */
  async handleInputChange(event) {
    const input = event.target;
    console.log(input.type, input.value);
    const fieldName = input.dataset.name;
    const value =
      input.type === "select-one" && input.value.length === 3
        ? await this.currencySymbolsChecker(input.value)
        : input.value;
    // if (!fieldName) return;
    console.log(fieldName, value);
    // 🔄 Передаём данные в WidgetDataSync
    this.widgetSync.updateWidgetFields(fieldName, value);
  }

  handleSelectChanged(event) {
    const select = event.target;
    const selectName = select.dataset.name;
    console.log(select, selectName);
  }
  /**
   * 📂 Обрабатывает загрузку картинки
   */
  handleImageUpload(event) {
    const inputName = event.target.name;
    const file = event.target.files[0]; // Получаем первый файл из списка
    console.log(inputName, file);
    this.widgetSync.updateFileUpload(inputName, file);
    console.log("📂 Файл загружен", file);
  }

  handleImageRemove(event) {
    const inputName = event.target.dataset.name || null;
    this.widgetSync.updateFileUpload(inputName, null);
    console.log("📂 Файл удален");
    console.log(inputName);
  }

  handleRadioButtonChange(event) {
    const input = event.target;
    const radioName = input.dataset.name;
    const radioValue = input.value;
    if (radioValue === "subscription" || radioValue === "onetime") {
      this.uiManager.changeModel(radioName, radioValue, "repeats");
    }
    if (radioValue === "multipleprices" || radioValue === "singleprice") {
      this.uiManager.changeModel(
        radioName,
        radioValue,
        "serviceBlockController"
      );
    }
  }

  handlerSubmitted(event) {
    const formId = event.target.closest("form").id;
    const form = document.querySelector(`#${formId}`); // Находим форму Webflow
    let pollingInterval; // Переменная для хранения интервала
    if (form) {
      console.log("Форма отправлена! Ждем ответ...");
      // Запускаем опрос вебхука каждые 3 секунды
      pollingInterval = setInterval(() => {
        fetch(`${CONFIG.webhooks.form}`)
          .then((response) => response.text())
          .then((data) => {
            console.log("Ответ вебхука:", data);
            if (data.includes("Accepted")) {
              // Если ответ содержит "Accepted"
              clearInterval(pollingInterval); // Останавливаем опрос
              console.log("Ответ получен! Перезагружаем страницу...");
              // location.reload(); // Перезагружаем страницу
            }
          })
          .catch((error) => {
            console.error("Ошибка при запросе вебхука:", error);
          });
      }, 3000); // Интервал 3 секунды
    }
  }

  handlerAddService(event) {
    this.uiManager.addServiceBlock();
  }

  /**
   * 🎯 Обработчик кнопок меню по атрибуту [option]
   */
  handleOptionClick(event) {
    const target = event.target;

    // Проверяем, есть ли атрибут option у элемента
    const action = target.getAttribute("option");
    if (!action) return;

    // Ищем родительский блок (например, service-wrapper)
    const parentBlock = target.closest(CONFIG.uiElements.serviceItem);
    if (!parentBlock) {
      console.warn("❌ Родительский блок не найден.");
      return;
    }

    const blockId = parentBlock.id;

    console.log("✅ Обнаружено действие:", {
      action,
      blockId,
      button: target,
      block: parentBlock,
    });

    // Дальнейшие действия зависят от действия
    switch (action) {
      case "up":
        this.UiMenuManager.changeOrder(parentBlock, -1);
        break;
      case "down":
        this.UiMenuManager.changeOrder(parentBlock, 1);
        break;
      case "delete":
        this.UiMenuManager.removeSingleServiceBlock(parentBlock);
        break;
      default:
        console.warn(`⚠️ Неизвестное действие: ${action}`);
    }
  }

  handleDiscountChange(event) {
    const inputElement = event.target;
    const inputName = inputElement.dataset.name.replace("-checkbox", "");
    const triggerElement = inputElement
      .closest("label")
      ?.querySelector(".discounted");
    const discountInput = document.querySelector(`[data-name="${inputName}"]`);
    if (!discountInput) {
      console.warn("Discount input not found");
      return;
    }

    if (inputElement.checked) {
      this.widgetSync.discountFieldsUI(
        inputName,
        inputElement.checked,
        discountInput
      );
    } else {
      discountInput.value = "";
      this.widgetSync.discountFieldsUI(
        inputName,
        inputElement.checked,
        discountInput
      );
    }
  }
}
