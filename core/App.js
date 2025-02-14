import { StorageManager } from "../utils/StorageManager.js";
import { EventInitializer } from "../handlers/EventInitializer.js";
import { Widget } from "../widget/Widget.js";

export class App {
  constructor() {
    this.storage = new StorageManager();
    this.eventHelper = new EventInitializer();
    this.widget = new Widget();
  }

  async initialize() {
    console.log("Инициализация приложения...");
    //Формируем localStorage, если данных нет
    this.storage.createStorage();
    this.eventHelper.init(); // Запускаем обработку событий
    this.widget.initWidget(); // Загружаем виджет
  }
}
