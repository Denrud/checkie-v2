import { EventManager } from "./EventManager.js";
import { FormHandler } from "./FormHandler.js";
import { WidgetSync } from "../widget/WidgetSync.js";
import { WidgetManager } from "../widget/WidgetManager.js";

export class EventInitializer {
  constructor() {
    this.eventManager = new EventManager();
    
    // 🟢 Создаём WidgetManager и WidgetSync
    this.widgetManager = new WidgetManager();
    this.widgetSync = new WidgetSync(this.widgetManager);
    
    // 🟢 Передаём WidgetSync в FormHandler
    this.formHandler = new FormHandler(this.widgetSync);
  }

  /**
   * Добавляет обработчики событий
   */
  init() {
    this.eventManager.addEvent("input[type='text'], input[type='number'], textarea", "input", (event) => {
      this.formHandler.handleInputChange(event);
    });

    this.eventManager.addEvent("select", 'change', (event) => {
        this.formHandler.handleSelectChanged(event);
    });

    this.eventManager.addEvent("input[type='radio']", "change", (event) => {
        this.formHandler.handleRadioButtonChange(event)
    });

    this.eventManager.addEvent('input[type="file"]', "change", (event) => {
        this.formHandler.FileUpload(event);
    });

    console.log("✅ Слушатели событий инициализированы!");
  }
}
