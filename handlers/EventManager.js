export class EventManager {
  constructor() {
    this.events = new Map(); // Храним события по ключу `eventType + selector`
  }

  /**
   * Добавляет обработчик событий для ID, классов и селекторов
   * @param {string} selector - ID, класс или CSS-селектор
   * @param {string} eventType - Тип события (например, "click", "change")
   * @param {Function} callback - Функция-обработчик
   */
  addEvent(selector, eventType, callback) {
    const eventKey = `${eventType}:${selector}`;

    if (this.events.has(eventKey)) {
      console.warn(`⚠️ Обработчик для "${eventKey}" уже существует.`);
      return;
    }

    let handler;

    if (selector.startsWith("#")) {
      // Работаем с ID (навешиваем обработчик напрямую)
      const element = document.getElementById(selector.slice(1));
      if (!element) {
        console.warn(`⚠️ Элемент с ID "${selector}" не найден.`);
        return;
      }

      handler = (event) => callback(event);
      element.addEventListener(eventType, handler);
    } 
    else if (selector.startsWith(".")) {
      // Используем делегирование событий для динамических элементов
      handler = (event) => {
        const target = event.target.closest(selector);
        if (target) {
          callback(event);
        }
      };

      document.addEventListener(eventType, handler);
    } 
    else {
      // Работаем с тегами или сложными селекторами
      handler = (event) => {
        if (event.target.matches(selector)) {
          callback(event);
        }
      };
      document.addEventListener(eventType, handler);
    }

    this.events.set(eventKey, handler);
  }

  /**
   * Удаляет обработчик события для указанного селектора
   * @param {string} selector - ID, класс или CSS-селектор
   * @param {string} eventType - Тип события (например, "click", "change")
   */
  removeEvent(selector, eventType) {
    const eventKey = `${eventType}:${selector}`;

    if (!this.events.has(eventKey)) {
      console.warn(`⚠️ Обработчик для "${eventKey}" не найден.`);
      return;
    }

    const handler = this.events.get(eventKey);

    if (selector.startsWith("#")) {
      const element = document.getElementById(selector.slice(1));
      if (element) {
        element.removeEventListener(eventType, handler);
      }
    } 
    else {
      document.removeEventListener(eventType, handler);
    }

    this.events.delete(eventKey);
  }

  /**
   * Удаляет все зарегистрированные события
   */
  removeAllEvents() {
    this.events.forEach((handler, eventKey) => {
      const [eventType, selector] = eventKey.split(":");

      if (selector.startsWith("#")) {
        const element = document.getElementById(selector.slice(1));
        if (element) {
          element.removeEventListener(eventType, handler);
        }
      } 
      else {
        document.removeEventListener(eventType, handler);
      }
    });

    this.events.clear();
  }
}
