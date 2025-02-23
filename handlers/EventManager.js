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
      // Работаем с классами (навешиваем обработчик на каждый элемент)
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`⚠️ Элементы с классом "${selector}" не найдены.`);
        return;
      }

      handler = (event) => callback(event);
      elements.forEach((el) => el.addEventListener(eventType, handler));
    } 
    else {
      // Обычный делегированный обработчик для селектора
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
      else if (selector.startsWith(".")) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => el.removeEventListener(eventType, handler));
      } 
      else {
        document.removeEventListener(eventType, handler);
      }
    });

    this.events.clear();
  }
}
