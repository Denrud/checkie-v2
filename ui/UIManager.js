import { UIInitializer } from "./UIinitializer.js";
import { UITools } from "./UITools.js";
import { WidgetDataSync } from "../widget/WidgetDataSync.js";
import { DataCleaner } from "../utils/DataCleaner.js";
import { CONFIG } from "../core/Config.js";

export class UIManager {
  constructor() {
    this.uiInitializer = new UIInitializer();
    this.uiTools = new UITools();
    this.widgetUISync = new WidgetDataSync();
  }

  /**
   * 🔼 Добавляет по одному блоку на основе состояния в localStorage
   */
  addServiceBlock() {
    const lockKey = "serviceBlockAddingLock";

    if (localStorage.getItem(lockKey) === "true") {
      console.warn("⛔ Добавление уже выполняется. Ждём завершения.");
      return;
    }

    // Устанавливаем лок-флаг
    localStorage.setItem(lockKey, "true");

    const serviceBlocks = this.uiInitializer.getElement("serviceItem");
    const serviceMessage = this.uiInitializer.getElement("supportMessage");
    const serviceBtn = this.uiInitializer.getElement("serviceBtn");

    if (!serviceBlocks || serviceBlocks.length === 0) {
      console.warn("⚠️ Нет доступных сервисных блоков.");
      localStorage.removeItem(lockKey);
      return;
    }

    const state = JSON.parse(localStorage.getItem("serviceBlockState") || "{}");
    const serviceArray = Array.isArray(serviceBlocks)
      ? Array.from(serviceBlocks)
      : [serviceBlocks];

    const hiddenBlock = serviceArray.find((block) => {
      const id = block.id;
      return state[id] && state[id].visible === false;
    });

    if (!hiddenBlock) {
      console.warn("⚠️ Нет скрытых блоков для добавления.");
      this.uiTools.removeClass(serviceMessage, "hide");
      this.uiTools.addClass(serviceBtn, "hide");
      localStorage.removeItem(lockKey);
      return;
    }

    const id = hiddenBlock.id;
    const currentOrder = Object.values(state).filter((s) => s.visible).length;

    this.uiTools.removeClass(hiddenBlock, "w-condition-invisible");
    hiddenBlock.style.order = currentOrder;

    state[id].visible = true;
    state[id].order = currentOrder;

    localStorage.setItem("serviceBlockState", JSON.stringify(state));

    this.widgetUISync.widgetServiceBlocks(hiddenBlock);
    this.widgetUISync.updateRepeatsUI(true);

    console.log(`✅ Добавлен блок ${id} с порядком ${currentOrder}`);

    // Сбрасываем флаг через 100ms
    setTimeout(() => {
      localStorage.removeItem(lockKey);
    }, 100);
  }

  /**
   * 🔁 Очистка и скрытие всех блоков, кроме первого
   */
  removeServiceBlocks() {
    const serviceBlocks = this.uiInitializer.getElement("serviceItem");

    if (!serviceBlocks || serviceBlocks.length === 0) {
      console.warn("⚠️ Нет доступных сервисных блоков для удаления.");
      return;
    }

    const serviceArray = Array.isArray(serviceBlocks)
      ? Array.from(serviceBlocks)
      : [serviceBlocks];

    const updatedState = {};

    serviceArray.forEach((block, index) => {
      const id = block.id || `service-${index + 1}`;

      if (index === 0) {
        block.style.order = 0;
        updatedState[id] = { visible: true, order: 0 };
        return;
      }

      const inputs = block.querySelectorAll("[data-name]");
      const checkbox = block.querySelector("label > .discounted");

      const filteredInputs = Array.from(inputs).filter((input) =>
        /service|price/i.test(input.dataset.name)
      );

      const cleaner = new DataCleaner({
        block: block,
        clickElement: checkbox,
      });

      cleaner.clearFields();

      filteredInputs.forEach((input) => {
        const fieldName = input.dataset.name;
        this.widgetUISync.updateWidgetFields(fieldName, "");
      });

      this.uiTools.addClass(block, "w-condition-invisible");
      block.style.order = index;

      if (
        this.widgetUISync &&
        typeof this.widgetUISync.widgetServiceBlocks === "function"
      ) {
        this.widgetUISync.widgetServiceBlocks(block, true);
      }

      updatedState[id] = { visible: false, order: index };
    });

    localStorage.setItem("serviceBlockState", JSON.stringify(updatedState));
    console.log("🧹 Блоки сброшены и скрыты (кроме первого):", updatedState);
    // 🧩 Новая строка — обновление порядка в виджете
    if (
      this.widgetUISync &&
      typeof this.widgetUISync.syncOrderFromStorage === "function"
    ) {
      this.widgetUISync.syncOrderFromStorage();
    }
  }

  /**
   * 🔄 Модель: подписка, разовая, множественные цены
   */
  changeModel(elementName, elementValue, model) {
    console.log(
      `🔹 Клик по элементу: ${elementName} со значением: ${elementValue}`
    );

    const targetElement = this.uiInitializer.getElement(model);
    if (!targetElement) {
      console.warn(`⚠️ Элемент "${model}" не найден среди инициализированных.`);
      return;
    }

    const elementsArray = Array.isArray(targetElement)
      ? targetElement
      : [targetElement];

    const serviceMessage = this.uiInitializer.getElement("supportMessage");
    const serviceBtn = this.uiInitializer.getElement("serviceBtn");
    

    if (elementValue === "subscription") {
      elementsArray.forEach((item) => {
        this.uiTools.removeClass(item, "w-condition-invisible");
        this.widgetUISync?.updateRepeatsUI?.(true);
      });
    }

    if (elementValue === "onetime") {
      elementsArray.forEach((item) => {
        this.uiTools.addClass(item, "w-condition-invisible");
        this.widgetUISync?.updateRepeatsUI?.(false);
      });
    }

    if (elementValue === "multipleprices") {
      elementsArray.forEach((item) => {
        this.uiTools.removeClass(item, "w-condition-invisible");
      });
    
      this.toggleOptionMenu(true);
    }
    
    if (elementValue === "singleprice") {
      elementsArray.forEach((item) => {
        this.uiTools.addClass(item, "w-condition-invisible");
        this.uiTools.addClass(serviceMessage, "hide");
        this.uiTools.removeClass(serviceBtn, "hide");
      });
    
      this.toggleOptionMenu(false);
      this.removeServiceBlocks();
    }
    
  }

  toggleOptionMenu(visible = true) {
    const rawMenus = this.uiInitializer.getElement("optionWrapper");
  
    const menus = Array.isArray(rawMenus) ? rawMenus : [rawMenus];
    const wrapperClass = CONFIG.uiElements.serviceItem;
  
    menus.forEach((menu) => {
      const parent = menu.closest(wrapperClass);
  
      if (!parent) {
        console.warn("⚠️ Меню опций не находится в .service-wrapper");
        return;
      }
  
      if (visible) {
        this.uiTools.removeClass(menu, "hide");
      } else {
        this.uiTools.addClass(menu, "hide");
      }
    });
  }
  
}
