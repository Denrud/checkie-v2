import { CONFIG } from "../core/Config.js";

export class UIInitializer {
  constructor() {
    this.elements = {}; // Хранилище для DOM-элементов
    this.initUiElements();
  }

 async initUiElements() {
    const selectors = CONFIG.uiElements; // Загружаем селекторы из конфига
    if (!selectors || typeof selectors !== "object") {
      console.error("Передан некорректный список селекторов!");
      return;
    }

    Object.keys(selectors).forEach((key) => {
      const elements = document.querySelectorAll(selectors[key]); // Получаем ВСЕ элементы с таким селектором

      if (elements.length === 0) {
        console.warn(`Элементы ${selectors[key]} (${key}) не найдены.`);
      }

      // Если найден один элемент – записываем его, если несколько – массив
      this.elements[key] =
        elements.length > 1 ? Array.from(elements) : elements[0];
    });

    // console.log("🔹 Инициализированы UI элементы:", this.elements);
  }

  getElement(name) {
    return this.elements[name] || null;
  }
}
