import { StorageManager } from "../utils/StorageManager.js";
import { EventInitializer } from "../handlers/EventInitializer.js";
import { Widget } from "../widget/Widget.js";
import { UIInitializer } from "../ui/UIinitializer.js";
import { DragAndDrop } from "../utils/DragAndDrop.js";
import { SortableListBuilder } from "../utils/SortableListBuilder.js";
import { DomGroupRenderer } from "../utils/DomGroupRenderer.js";
import { SortableDragDrop } from "../utils/SortableDragDrop.js";
import { UIMenuAnimation } from "../ui/UIMenuAnimation.js";
import { UIMenuOptions } from "../ui/UIMenuOptions.js";

export class App {
  constructor() {
    this.storage = new StorageManager();
    this.eventHelper = new EventInitializer();
    this.widget = new Widget();
    this.uiInitializer = new UIInitializer();
    this.dragAndDrop = new DragAndDrop();
    this.paymentMethodsGrop = SortableListBuilder;
    this.render = DomGroupRenderer.render;
  }

  async initialize() {
    try {
      console.group("🚀 [App] Инициализация приложения...");
  
      await this.eventHelper.init(); // Запускаем обработку событий
      await this.widget.initWidget(); // Загружаем виджет
      await this.uiInitializer.initUiElements(); // Инициализация UI элементов
      await this.dragAndDrop.init(); // DnD инициализация
  
      const methods = await this.paymentMethodsGrop.build(document, 'methods');
      await this.render(document, 'methods', methods); 
  
      await SortableDragDrop.init(document, 'methods'); // Инициализация сортируемого DnD
      UIMenuAnimation.init(); // Анимация меню
      UIMenuOptions.init();   // Логика опций меню
  
      console.log("✅ [App] Инициализация завершена!");
      console.groupEnd();
    } catch (error) {
      console.error("❌ [App] Ошибка при инициализации:", error);
      console.groupEnd();
    }
  }
  
}
