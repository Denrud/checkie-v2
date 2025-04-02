import { CONFIG } from "../core/Config.js";

export class UIInitializer {
  constructor() {
    this.elements = {}; // Хранилище для DOM-элементов
    this.initUiElements();
  }

  async initUiElements() {
    const selectors = CONFIG.uiElements;
    if (!selectors || typeof selectors !== "object") {
      console.error("❌ Передан некорректный список селекторов!");
      return;
    }

    Object.keys(selectors).forEach((key) => {
      const elements = document.querySelectorAll(selectors[key]);

      if (elements.length === 0) {
        console.warn(`⚠️ Элементы ${selectors[key]} (${key}) не найдены.`);
      }

      this.elements[key] =
        elements.length > 1 ? Array.from(elements) : elements[0];
    });

    console.log("🔹 Инициализированы UI элементы:", this.elements);

    // 🟢 После инициализации — создаём хранилище состояния
    this.initServiceBlockState();
  }

  getElement(name) {
    if (!(name in this.elements)) {
      console.warn(`⚠️ Элемент "${name}" не был инициализирован через initUiElements().`);
      return null;
    }

    const el = this.elements[name];
    if (!el || (Array.isArray(el) && el.length === 0)) {
      console.warn(`⚠️ Элемент "${name}" пустой или не найден в DOM.`);
    }

    return el;
  }

  /**
   * 🧠 Сохраняем состояние сервисных блоков в localStorage
   */
  initServiceBlockState() {
    const serviceBlocks = this.getElement("serviceItem");
    if (!serviceBlocks || serviceBlocks.length === 0) return;

    const serviceArray = Array.isArray(serviceBlocks)
      ? Array.from(serviceBlocks)
      : [serviceBlocks];

    const state = {};
    serviceArray.forEach((block, index) => {
      const id = block.id || `service-${index + 1}`;
      const isVisible = !block.classList.contains("w-condition-invisible");

      block.style.order = index;

      state[id] = {
        visible: isVisible,
        order: index
      };
    });

    localStorage.setItem("serviceBlockState", JSON.stringify(state));
    console.log("📦 Стартовое состояние блоков сохранено в UIInitializer:", state);
  }
}
