import { UITools } from "../ui/UITools.js";
import { CONFIG } from "../core/Config.js";
import { StorageManager } from "../utils/StorageManager.js";

export class WidgetDataSync {
  constructor() {
    this.uiTools = new UITools();
    this.defaultData = CONFIG.serviceDefaultData;
    this.cache = {}; // Кэширование найденных элементов
    this.localStorage = new StorageManager();
  }

  /**
   * 🔍 Поиск элементов с кэшированием
   */
  finder(fieldName) {
    console.log(fieldName);
    if (fieldName != '[widget-data-id="page-title"]') {
      if (this.cache[fieldName]) {
        this.log(`⚡️ Используем кэш для ${fieldName}`);
        return this.cache[fieldName];
      }

      const iframeDoc = this.getIframeDoc();

      if (!iframeDoc) {
        this.log("❌ `iframeDoc` отсутствует. Обновление невозможно.", "error");
        return;
      }

      const widgetFields = Array.from(iframeDoc.querySelectorAll(fieldName));

      if (widgetFields.length === 0) {
        this.log(`⚠️ Поля с ${fieldName} не найдены.`, "warn");
        return;
      }

      this.cache[fieldName] = widgetFields;
      return widgetFields;
    } else {
      const doc = Array.from(document.querySelectorAll(fieldName));
      if (!doc) {
        this.log(`⚠️ Поля с ${fieldName} не найдены.`, "warn");
        return;
      }

      return doc;
    }
  }

  /**
   * 📦 Получает `iframeDoc` из `iframe`
   */
  getIframeDoc() {
    const iFrame = document.querySelector("iframe");
    if (!iFrame) {
      this.log("❌ `iframe` не найден.", "error");
      return null;
    }
    if (!iFrame.contentDocument && !iFrame.contentWindow.document) {
      this.log("⚠️ `iframe` не загружен. Подождите загрузки.", "warn");
      return null;
    }
    return iFrame.contentDocument || iFrame.contentWindow.document;
  }

  /**
   * 🎨 Получает дефолтные данные для поля
   */
  getDefaultFieldData(name) {
    const clearName = name.replace(/[^a-zA-Zа-яА-ЯёЁ]/gi, "");
    const match = this.defaultData.find((item) => item.id === clearName);
    this.log(`🔍 Ищем default data для: ${clearName}`);
    this.log(this.defaultData);

    return match ? match.data : "";
  }

  /**
   * 🔄 Обновляет данные в Webflow-виджете
   */
  updateWidgetFields(fieldName, value) {
    console.log(fieldName, value);
    const widgetFields = this.finder(`[widget-data-id="${fieldName}"]`);

    if (!widgetFields || widgetFields.length === 0) {
      this.log(
        `⚠️ Поля виджета не найдены для fieldName: ${fieldName}`,
        "warn"
      );
      return;
    }

    widgetFields.forEach((field) => {
      if (value) {
        if (!field.classList.contains("w-condition-invisible")) {
          field.textContent = value;
          this.log(`✅ Виджет обновлён: ${fieldName} → ${value}`);
        }
      } else {
        const defaultData = this.getDefaultFieldData(fieldName);
        field.textContent = defaultData;
        this.log(`🆗 Установлено значение по умолчанию для ${fieldName}`);
      }
    });
  }

  /**
   * 📸 Обрабатывает загрузку изображений
   */
  updateFileUpload(inputName, file) {
    const widgetFields = this.finder(`[widget-data-id="${inputName}"]`);

    if (!widgetFields || widgetFields.length === 0) {
      this.log(`⚠️ Поля с widget-data-id="${inputName}" не найдены.`, "warn");
      return;
    }

    if (!file) {
      widgetFields.forEach((field) => {
        const img = field.querySelector("img");
        if (img) {
          img.src = "";
          this.log(`🗑️ Изображение удалено из ${inputName}.`);
        }
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      widgetFields.forEach((field) => {
        const img = field.querySelector("img");
        if (img) {
          img.src = imageUrl;
          this.log(`✅ Изображение обновлено в ${inputName}!`);
        }
      });
    };
    reader.readAsDataURL(file);
  }

  /**
   * 🔁 Обновляет элементы с повторяющимися данными
   */
  updateRepeatsUI(state) {
    const widgetFields = this.finder(`[widget-field-id]`);

    if (!widgetFields || widgetFields.length === 0) {
      this.log(`⚠️ Поля с widget-field-id не найдены.`, "warn");
      return;
    }

    widgetFields.forEach((field) => {
      if (state) {
        this.uiTools.removeClass(field, "w-condition-invisible");
      } else {
        this.uiTools.addClass(field, "w-condition-invisible");
      }
    });
  }

  /**
   * 🎨 Обновляет состояние блоков услуг
   */
  widgetServiceBlocks(element, hide = false) {
    if (!element || !element.id) {
      this.log("⚠️ Элемент не передан или не имеет `id`.", "warn");
      return;
    }

    const widgetServiceBlocks = this.finder(`[data-id="${element.id}"]`);

    if (!widgetServiceBlocks || widgetServiceBlocks.length === 0) {
      this.log(`⚠️ Не найдено элементов для id=${element.id}`, "warn");
      return;
    }

    widgetServiceBlocks.forEach((block) => {
      if (hide) {
        this.uiTools.addClass(block, "w-condition-invisible");
      } else {
        this.uiTools.removeClass(block, "w-condition-invisible");
      }
    });

    this.log(`✅ обновлено для id=${element.id}, hide=${hide}`);
  }

  /**
   * 🔢 Обновление скидок и отображение
   */
  discountFieldsUI(name, state, dicountInput) {
    const widgetFields = this.finder(`[widget-data-id="${name}"]`);
    const discountContainer = this.finder(`[data-id="${name}-container"]`)[0];

    if (!widgetFields || widgetFields.length === 0) {
      this.log(`⚠️ Поля с widget-data-id="${name}" не найдены.`, "warn");
      return;
    }
    if (!discountContainer) {
      this.log(`⚠️ Контейнер не найден.`, "warn");
      return;
    }

    if (state) {
      this.uiTools.removeClass(discountContainer, "w-condition-invisible");
    } else {
      this.uiTools.addClass(discountContainer, "w-condition-invisible");
      widgetFields.forEach((field) => (field.textContent = 0));
    }
  }

  /**
   * 📝 Логирование для отладки
   */
  log(message, type = "info") {
    const styles = {
      info: "color: #00aaff",
      warn: "color: #ffaa00",
      error: "color: #ff0000",
    };
    console.log(`%c${message}`, styles[type] || styles.info);
  }

  /**
   * 🔁 Синхронизирует порядок блоков в виджете на основе serviceBlockState
   */
  /**
   * 🔄 Синхронизация порядка блоков из localStorage в iframe
   */
  syncOrderFromStorage() {
    const rawState = localStorage.getItem("serviceBlockState");
    if (!rawState) {
      this.log("⚠️ serviceBlockState отсутствует.", "warn");
      return;
    }

    let state;
    try {
      state = JSON.parse(rawState);
    } catch (e) {
      this.log("❌ Ошибка при парсинге serviceBlockState", "error");
      return;
    }

    // Присваиваем дефолтные order если нет значения
    const blockIds = Object.keys(state);
    blockIds.forEach((blockId, i) => {
      if (typeof state[blockId].order !== "number") {
        state[blockId].order = i;
      }
    });

    // Устанавливаем порядок во фрейме
    blockIds.forEach((blockId) => {
      const order = state[blockId].order;

      const widgetBlocks = this.finder(`[data-id="${blockId}"]`);
      if (!widgetBlocks || widgetBlocks.length === 0) {
        this.log(`⚠️ Виджет-блок ${blockId} не найден`, "warn");
        return;
      }

      widgetBlocks.forEach((block) => {
        block.style.order = order;
        this.log(`🔁 Установлен порядок ${order} для ${blockId}`);
      });
    });

    // Сохраняем обновлённое состояние обратно
    localStorage.setItem("serviceBlockState", JSON.stringify(state));
  }
}
