import { StorageManager } from "../utils/StorageManager.js";
import { EventInitializer } from "../handlers/EventInitializer.js";
import { Widget } from "../widget/Widget.js";
import { UIInitializer } from "../ui/UIinitializer.js";
import { DragAndDrop } from "../utils/DragAndDrop.js";
import { SortableListBuilder } from "../utils/SortableListBuilder.js";
import { DomGroupRenderer } from "../utils/DomGroupRenderer.js";
import { SortableDragDrop } from "../utils/SortableDragDrop.js";

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
    console.log("Инициализация приложения...");
    await this.eventHelper.init(); // Запускаем обработку событий
    await this.widget.initWidget(); // Загружаем виджет
    await this.uiInitializer.initUiElements(); // инициализация ui elements
    await this.dragAndDrop.init(); 
    const methods = await this.paymentMethodsGrop.build(document, 'methods');
    await this.render(document, 'methods', methods); 
    await SortableDragDrop.init(document, 'methods');
  }
}
