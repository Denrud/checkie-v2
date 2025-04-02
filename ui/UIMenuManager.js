import { CONFIG } from "../core/Config.js";
import { StorageManager } from "../utils/StorageManager.js";
import { DataCleaner } from "../utils/DataCleaner.js";
import { UIInitializer } from "./UIinitializer.js";
import { UITools } from "./UITools.js";
import { WidgetDataSync } from "../widget/WidgetDataSync.js";


export class UIMenuManager {
  constructor() {
    this.widgetSync = new WidgetDataSync();
    this.uiInitializer = new UIInitializer();
    this.uiTools = new UITools();
    this.storage = new StorageManager(CONFIG.localStorageKeys.menuState);
  }

  applySavedMenuState() {
    const serviceState = this.storage.getServiceState();
    const orderState = this.storage.getData();
    if (!serviceState || !orderState) return;
  
    const visibleBlocks = Object.entries(serviceState)
      .filter(([_, info]) => info.visible)
      .sort((a, b) => (orderState[a[0]] ?? 0) - (orderState[b[0]] ?? 0));
  
    visibleBlocks.forEach(([parentId], index) => {
      const parentBlock = document.getElementById(parentId);
      if (parentBlock) {
        parentBlock.style.order = index;
        this.updateMenuState(parentId, index);
      }
    });
  
    // 🧩 Новая строка — обновление порядка в виджете
    if (
      this.widgetSync &&
      typeof this.widgetSync.syncOrderFromStorage === "function"
    ) {
      this.widgetSync.syncOrderFromStorage();
    }
  }
  
  changeOrder(parentBlock, direction) {
    if (!parentBlock) return;
  
    const blocks = Array.from(
      document.querySelectorAll(CONFIG.uiElements.serviceItem)
    ).filter((el) => !el.classList.contains("w-condition-invisible"));
  
    const ordered = blocks
      .map((el) => ({
        el,
        order: parseInt(el.style.order, 10) || 0,
      }))
      .sort((a, b) => a.order - b.order);
  
    const index = ordered.findIndex((b) => b.el === parentBlock);
    const targetIndex = index + direction;
  
    if (targetIndex < 0 || targetIndex >= ordered.length) {
      console.warn("🚫 Невозможно сдвинуть блок дальше.");
      return;
    }
  
    // Обмен порядками
    const current = ordered[index];
    const target = ordered[targetIndex];
  
    const tempOrder = current.order;
    current.order = target.order;
    target.order = tempOrder;
  
    current.el.style.order = current.order;
    target.el.style.order = target.order;
  
    this.updateMenuState(current.el.id, current.order);
    this.updateMenuState(target.el.id, target.order);
  
    console.log(`🔄 Поменяли местами блоки ${current.el.id} ↔ ${target.el.id}`);
  
    // 🧩 Новая строка — обновление порядка в виджете
    if (
      this.widgetSync &&
      typeof this.widgetSync.syncOrderFromStorage === "function"
    ) {
      this.widgetSync.syncOrderFromStorage();
    }
  }
  
  

  updateMenuState(parentId, order) {
    const savedState = this.storage.getData() || {};
    savedState[parentId] = order;
    this.storage.saveData(savedState);

    const serviceState = this.storage.getServiceState();
    if (serviceState[parentId]) {
      serviceState[parentId].order = order;
      this.storage.saveServiceState(serviceState);
    }
  }
  removeSingleServiceBlock(block) {
    if (!block) {
      console.warn("❌ Блок для удаления не передан.");
      return;
    }
  
    const allBlocks = this.uiInitializer.getElement("serviceItem");
    const serviceArray = Array.isArray(allBlocks) ? Array.from(allBlocks) : [allBlocks];
  
    const id = block.id;
  
    const order = parseInt(block.style.order, 10);
    if (order === 0) {
      console.warn("⚠️ Блок с порядком 0 не может быть скрыт.");
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
      if (
        this.widgetSync &&
        typeof this.widgetSync.updateWidgetFields === "function"
      ) {
        this.widgetSync.updateWidgetFields(fieldName, "");
      }
    });
  
    this.uiTools.addClass(block, "w-condition-invisible");
    block.style.order = "";
  
    const updatedState = JSON.parse(localStorage.getItem("serviceBlockState") || "{}");
    if (updatedState[id]) {
      updatedState[id].visible = false;
      updatedState[id].order = null;
      localStorage.setItem("serviceBlockState", JSON.stringify(updatedState));
    }
  
    if (
      this.widgetSync &&
      typeof this.widgetSync.widgetServiceBlocks === "function"
    ) {
      this.widgetSync.widgetServiceBlocks(block, true);
    }
  
    console.log(`🧹 Сервисный блок ${id} сброшен и скрыт.`);
  }
  
  
}
