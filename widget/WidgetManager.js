export class WidgetManager {
  constructor() {
      this.iframe = null;
  }

  /**
   * 🔄 Загружает виджет в `iframe`
   */
  loadWidget(widgetLink, previewWidget) {
      if (!widgetLink || !previewWidget) {
          console.warn("⚠️ Не найдены контейнер виджета или ссылка.");
          return;
      }

    //   console.log("🚀 Загружаем виджет:", widgetLink);

      const iFrame = document.createElement("iframe");
      iFrame.src = widgetLink;
      iFrame.width = "100%";
      iFrame.height = "100%";
      iFrame.style.border = "none";

      previewWidget.innerHTML = "";
      previewWidget.appendChild(iFrame);

      this.iframe = iFrame;

      iFrame.addEventListener("load", () => {
          console.log("✅ Виджет загружен!");
      });
  }
}
