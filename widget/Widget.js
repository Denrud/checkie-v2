import { WidgetManager } from "./WidgetManager.js";

export class Widget {
  constructor() {
    this.widgetManager = new WidgetManager();
    this.previewWidget = document.querySelector(".preview-embed");
    this.widgetLink = document.querySelector("#widgetLink")?.getAttribute("href");
  }

  /**
   * Запускает загрузку виджета
   */
  loadWidget() {
    this.widgetManager.loadWidget(this.widgetLink, this.previewWidget, (iframeDoc) => {
      console.log("📄 `iframe` полностью загружен!", iframeDoc);
      // Здесь можно что-то сделать с `iframeDoc`
    });
  }

  /**
   * Инициализирует виджет при загрузке страницы
   */
  initWidget() {
    window.addEventListener("DOMContentLoaded", () => {
      console.log("🔄 Инициализация виджета...");
      this.loadWidget();
    });
  }
}
