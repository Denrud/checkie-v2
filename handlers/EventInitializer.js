import { EventManager } from "./EventManager.js";
import { FormHandler } from "./FormHandler.js";
import { WidgetDataSync } from "../widget/WidgetDataSync.js";
import { WidgetManager } from "../widget/WidgetManager.js";
import { StorageManager } from "../utils/StorageManager.js";
import { CONFIG } from "../core/Config.js";

export class EventInitializer {
  constructor() {
    this.eventManager = new EventManager();
    this.widgetManager = new WidgetManager();
    this.widgetSync = new WidgetDataSync(this.widgetManager);
    this.formHandler = new FormHandler(this.widgetSync);
    this.storage = new StorageManager(CONFIG.localStorageKeys.menuState);
  }

  /**
   * Добавляет обработчики событий
   */
  async init() {
    this.eventManager.addEvent("input[type='text'], input[type='number'], textarea", "input", (event) => {
      this.formHandler.handleInputChange(event);
    });

    this.eventManager.addEvent("select", "change", (event) => {
      this.formHandler.handleInputChange(event);
    });

    this.eventManager.addEvent("input[type='radio']", "change", (event) => {
      this.formHandler.handleRadioButtonChange(event);
    });

    this.eventManager.addEvent('input[type="file"]', "change", (event) => {
      this.formHandler.handleImageUpload(event);
    });

    this.eventManager.addEvent("form", "submit", (event) => {
      this.formHandler.handlerSubmitted(event);
    });

    // ✅ ОСТАВЛЯЕМ ТОЛЬКО ОДИН ОБРАБОТЧИК
    this.eventManager.addEvent(CONFIG.uiElements.serviceBtn, "click", (event) => {
      this.formHandler.handlerAddService(event);
    });

    this.eventManager.addEvent(CONFIG.uiElements.supportMessage, "click", (event) => {
      this.formHandler.handleSupportMessage(event);
    });

    this.eventManager.addEvent(CONFIG.uiElements.repeats, "change", (event) => {
      this.formHandler.handleDiscountChange(event);
    });

    this.eventManager.addEvent("[option]", "click", (event) => {
      this.formHandler.handleOptionClick(event);
    });
  

    console.log("✅ Слушатели событий инициализированы!");
  }

}
