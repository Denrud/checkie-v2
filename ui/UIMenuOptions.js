import { CONFIG } from "../core/Config.js";

/**
 * UIMenuOptions
 * ----------------------------------------------------------------------------
 * Управление действиями элементов: main, other, disable, active.
 * После перемещения – синхронизация значений инпутов группы.
 */
export class UIMenuOptions {
  /**
   * Инициализация слушателей для опций меню.
   * @param {HTMLElement} root - Корневой элемент (по умолчанию document)
   */
  static init(root = document) {
    console.log("[UIMenuOptions] Инициализация обработки опций меню");
    const options = root.querySelectorAll(CONFIG.uiElements.menuOption);
    options.forEach(option => {
      option.addEventListener("click", (event) => {
        UIMenuOptions.handleOption(event);
      });
    });
  }

  /**
   * Обрабатывает клик по кнопке опции.
   * Использует атрибут "option-name" для определения действия.
   * @param {Event} event - Событие клика
   */
  static handleOption(event) {
    const target = event.target;
    const action = target.getAttribute("option-name");
    if (!action) return;

    // Используем селектор из CONFIG для нахождения обёртки элемента.
    const parentBlock = target.closest(CONFIG.uiElements.optionItem);
    if (!parentBlock) {
      console.warn("[UIMenuOptions] Родительский блок не найден.");
      return;
    }

    switch (action) {
      case "main":
        UIMenuOptions.moveToMain(parentBlock);
        break;
      case "other":
        UIMenuOptions.moveToOther(parentBlock);
        break;
      case "disable":
        UIMenuOptions.moveToDisable(parentBlock);
        break;
      case "active":
        UIMenuOptions.moveToActive(parentBlock);
        break;
      default:
        console.warn(`[UIMenuOptions] Неизвестное действие: ${action}`);
    }
  }

  /**
   * Перемещает элемент в группу "main".
   * Если в "main" превышен лимит (data-variant), последний элемент перемещается в "other".
   * @param {HTMLElement} element - Элемент, который перемещаем (с data-id)
   */
  static moveToMain(element) {
    const main = document.querySelector('[data-group="main"]');
    const other = document.querySelector('[data-group="other"]');
    if (!main || !other) return;

    const variant = parseInt(main.getAttribute(CONFIG.ATTR.GROUP_VARIANT)) || 3;
    if (element.parentNode === main) return;

    main.appendChild(element);
    console.log("[UIMenuOptions] Перемещён в main");

    const items = Array.from(main.querySelectorAll(`[${CONFIG.ATTR.ITEM_ID}]`));
    if (items.length > variant) {
      const removed = items[items.length - 1];
      other.appendChild(removed);
      console.log("[UIMenuOptions] Переполнение: вынесен в other", removed.getAttribute(CONFIG.ATTR.ITEM_ID));
    }
    UIMenuOptions.syncAllInputs();
  }

  /**
   * Перемещает элемент в группу "other".
   * @param {HTMLElement} element - Элемент, который перемещаем.
   */
  static moveToOther(element) {
    const other = document.querySelector('[data-group="other"]');
    if (!other) return;

    other.appendChild(element);
    console.log("[UIMenuOptions] Перемещён в other");
    UIMenuOptions.syncAllInputs();
  }

  /**
   * Перемещает элемент в группу "disable".
   * @param {HTMLElement} element - Элемент, который перемещаем.
   */
  static moveToDisable(element) {
    const disable = document.querySelector('[data-group="disable"]');
    if (!disable) return;

    disable.appendChild(element);
    console.log("[UIMenuOptions] Перемещён в disable");
    UIMenuOptions.syncAllInputs();
  }

  /**
   * Активирует элемент: перемещает его из disable в other.
   * @param {HTMLElement} element - Элемент, который перемещаем.
   */
  static moveToActive(element) {
    const other = document.querySelector('[data-group="other"]');
    if (!other) return;

    other.appendChild(element);
    console.log("[UIMenuOptions] Активирован (в other)");
    UIMenuOptions.syncAllInputs();
  }

  /**
   * Синхронизирует скрытый input внутри группы.
   * Проверяет, соответствует ли текущее значение инпута списку id элементов,
   * и перезаписывает его, если обнаружены различия.
   * @param {HTMLElement} groupEl - Элемент группы (с data-group)
   */
  static syncInput(groupEl) {
    const input = groupEl.querySelector(`[${CONFIG.ATTR.INPUT_SYNC}]`);
    if (!input) return;

    const ids = Array.from(groupEl.querySelectorAll(`[${CONFIG.ATTR.ITEM_ID}]`)).map(el =>
      el.getAttribute(CONFIG.ATTR.ITEM_ID)
    );
    const newValue = ids.join(",");
    if (input.value !== newValue) {
      input.value = newValue;
      console.log(`[UIMenuOptions] Синхронизация input [${groupEl.getAttribute("data-group")}]:`, newValue);
    }
  }

  /**
   * Проходит по всем группам (элементам с data-group) и вызывает синхронизацию их input.
   */
  static syncAllInputs() {
    const groups = document.querySelectorAll("[data-group]");
    groups.forEach(groupEl => {
      UIMenuOptions.syncInput(groupEl);
    });
  }
}
