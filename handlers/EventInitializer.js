import { EventManager } from "./EventManager.js";
import { FormHandler } from "./FormHandler.js";
import { WidgetDataSync } from "../widget/WidgetDataSync.js";
import { WidgetManager } from "../widget/WidgetManager.js";

export class EventInitializer {
  constructor() {
    this.eventManager = new EventManager();
    
    // 🟢 Создаём WidgetManager и WidgetDataSync
    this.widgetManager = new WidgetManager();
    this.widgetSync = new WidgetDataSync(this.widgetManager);
    
    // 🟢 Передаём WidgetDataSync в FormHandler
    this.formHandler = new FormHandler(this.widgetSync);
  }

  /**
   * Добавляет обработчики событий
   */
  async init() {
    this.eventManager.addEvent("input[type='text'], input[type='number'], textarea", "input", (event) => {
      this.formHandler.handleInputChange(event);
    });

    this.eventManager.addEvent("select", 'change', (event) => {
        this.formHandler.handleInputChange(event);
    });

    this.eventManager.addEvent("input[type='radio']", "change", (event) => {
        this.formHandler.handleRadioButtonChange(event)
    });

    this.eventManager.addEvent('input[type="file"]', "change", (event) => {
        this.formHandler.handleImageUpload(event);
    });

    this.eventManager.addEvent("form", "submit", (event) => {
      this.formHandler.handlerSubmitted(event);
    }); 

    this.eventManager.addEvent('#addServiceBtn', 'click', (event) => {
      this.formHandler.handlerAddService(event);
    })

    this.eventManager.addEvent('.remove-image', 'click', (event) => {
      this.formHandler.handleImageRemove(event);
    })

    this.eventManager.addEvent("input[type='checkbox']", "change", (event) => {
      this.formHandler.handleDiscountChange(event);
    })

    console.log("✅ Слушатели событий инициализированы!");
  }
}
