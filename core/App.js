import { StorageManager } from "../utils/StorageManager.js";
import { EventInitializer } from "../handlers/EventInitializer.js";
import { Widget } from "../widget/Widget.js";
import { UIInitializer } from "../ui/UIinitializer.js";


export class App {
  constructor() {
    this.storage = new StorageManager();
    this.eventHelper = new EventInitializer();
    this.widget = new Widget();
    this.uiInitializer = new UIInitializer();
  }

  async initialize() {
    console.log("Инициализация приложения...");
    await this.eventHelper.init(); // Запускаем обработку событий
    await this.widget.initWidget(); // Загружаем виджет
    await this.uiInitializer.initUiElements(); // инициализация ui elements
    
  }
}
