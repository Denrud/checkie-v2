import { UIInitializer } from "./UIinitializer.js";
import { UITools } from "./UITools.js";
import { WidgetDataSync } from "../widget/WidgetDataSync.js";
import { DataCleaner } from "../utils/DataCleaner.js";

export class UIManager {
  constructor() {
    this.uiInitializer = new UIInitializer(); // Инициализируем элементы
    this.uiTools = new UITools();
    this.widgetUISync = new WidgetDataSync();
  }

  // меняет модель для типа оплат и формы подписки
  changeModel(elementName, elementValue, model) {
    console.log(
      `🔹 Клик по элементу: ${elementName} со значением: ${elementValue}`
    );

    // Получаем элемент, который был проинициализирован
    const targetElement = this.uiInitializer.getElement(model);

    if (!targetElement) {
      console.warn(`⚠️ Элемент "${model}" не найден среди инициализированных.`);
      return;
    }

    console.log("✅ Найден элемент:", targetElement);

    // Преобразуем в массив, если targetElement - не массив
    const elementsArray = Array.isArray(targetElement)
      ? targetElement
      : [targetElement];

    if (elementValue === "subscription") {
      if (elementsArray.length > 0) {
        elementsArray.forEach((item) => {
          this.uiTools.removeClass(item, "w-condition-invisible");

          // Проверяем, существует ли `widgetUISync` и метод `updateRepeatsUI`
          if (
            this.widgetUISync &&
            typeof this.widgetUISync.updateRepeatsUI === "function"
          ) {
            this.widgetUISync.updateRepeatsUI(true);
          } else {
            console.warn("⚠️ `widgetUISync.updateRepeatsUI` не найден.");
          }
        });
      } else {
        console.warn(
          "⚠️ Элементы `targetElement` не найдены для `subscription`."
        );
      }
    }

    if (elementValue === "onetime") {
      if (elementsArray.length > 0) {
        elementsArray.forEach((item) => {
          this.uiTools.addClass(item, "w-condition-invisible");
          // Проверяем, существует ли `widgetUISync` и метод `updateRepeatsUI`
          if (
            this.widgetUISync &&
            typeof this.widgetUISync.updateRepeatsUI === "function"
          ) {
            this.widgetUISync.updateRepeatsUI(false);
          } else {
            console.warn("⚠️ `widgetUISync.updateRepeatsUI` не найден.");
          }
        });
      } else {
        console.warn("⚠️ `onetime`: Нет доступных элементов.");
      }
    }

    if (elementValue === "multipleprices") {
      elementsArray.forEach((item) => {
        this.uiTools.removeClass(item, "w-condition-invisible");
      });
    }

    if (elementValue === "singleprice") {
      const serviceMessage = this.uiInitializer.getElement("supportMessage");
      const serviceBtn = this.uiInitializer.getElement("serviceBtn");
      elementsArray.forEach((item) => {
        this.uiTools.addClass(item, "w-condition-invisible");
        this.uiTools.addClass(serviceMessage, "hide");
        this.uiTools.removeClass(serviceBtn, "hide");
      });
      this.removeServiceBlocks();
    }
  }

  addServiceBlock() {
    const serviceBlocks = this.uiInitializer.getElement("serviceItem");
    const serviceMessage = this.uiInitializer.getElement("supportMessage");
    const serviceBtn = this.uiInitializer.getElement("serviceBtn");

    if (!serviceBlocks || serviceBlocks.length === 0) {
      console.warn("⚠️ Нет доступных сервисных блоков.");
      return;
    }

    // Фильтруем только скрытые блоки
    const hiddenBlocks = Array.from(serviceBlocks).filter((item) =>
      item.classList.contains("w-condition-invisible")
    );

    if (hiddenBlocks.length > 0) {
      // Показываем ОДИН скрытый блок за итерацию
      const blockToShow = hiddenBlocks[0]; // Берем первый найденный скрытый блок
      this.uiTools.removeClass(blockToShow, "w-condition-invisible");
      this.widgetUISync.widgetServiceBlocks(blockToShow);
      this.widgetUISync.updateRepeatsUI(true);
      console.log(`✅ Добавлен сервисный блок:`, blockToShow);
    } else {
      console.warn("⚠️ Все сервисные блоки уже видимы, нет скрытых блоков.");
      this.uiTools.removeClass(serviceMessage, "hide");
      this.uiTools.addClass(serviceBtn, "hide");
    }
  }

  removeServiceBlocks() {
    const serviceBlocks = this.uiInitializer.getElement("serviceItem");

    if (!serviceBlocks || serviceBlocks.length === 0) {
      console.warn("⚠️ Нет доступных сервисных блоков для удаления.");
      return;
    }

    const serviceArray = Array.isArray(serviceBlocks)
      ? Array.from(serviceBlocks)
      : [serviceBlocks];

    if (serviceArray.length > 1) {
      serviceArray.slice(1).forEach((block, index) => {
        // Находим все поля, которые надо обновить после очистки
        let inputs = block.querySelectorAll("[data-name]");
        let checkbox = block.querySelector("label > .discounted");

        // Фильтруем только те, у которых data-name содержит "service" или "price"
        let filteredInputs = Array.from(inputs).filter(
          (input) => /service|price/i.test(input.dataset.name) // Регистронезависимый поиск
        );

        // Очищаем поля внутри удаляемых блоков
        const cleaner = new DataCleaner({
          block: block,
          clickElement: checkbox, // Клик не нужен
        });

        cleaner.clearFields(); // Очистка полей

        // Принудительно обновляем виджет с пустыми значениями только для нужных полей
        filteredInputs.forEach((input) => {
          const fieldName = input.dataset.name;
          this.widgetUISync.updateWidgetFields(fieldName, ""); // Передаем пустую строку
        });

        // Скрываем блок
        this.uiTools.addClass(block, "w-condition-invisible");

        // Синхронизация с виджетом
        if (
          this.widgetUISync &&
          typeof this.widgetUISync.widgetServiceBlocks === "function"
        ) {
          this.widgetUISync.widgetServiceBlocks(block, true);
        } else {
          console.warn("⚠️ `widgetUISync.widgetServiceBlocks` не найден.");
        }
      });

      console.log(
        `✅ Удалены дополнительные сервисные блоки, остался только первый.`
      );
    } else {
      console.warn("⚠️ Нечего удалять, только один сервисный блок.");
    }
  }
}
