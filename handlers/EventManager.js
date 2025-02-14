export class EventManager {
  constructor() {
    this.events = new Map(); // Храним события по ключу `eventType + selector`
  }

  /**
   * Добавляет делегированный обработчик событий (без дублирования)
   * @param {string} selector - CSS-селектор элемента
   * @param {string} eventType - Тип события (например, "click", "change")
   * @param {Function} callback - Функция-обработчик
   */
  addEvent(selector, eventType, callback) {
    const eventKey = `${eventType}:${selector}`;

    if (this.events.has(eventKey)) {
      console.warn(`⚠️ Обработчик для "${eventKey}" уже существует.`);
      return;
    }

    const handler = (event) => {
      if (event.target.matches(selector)) {
        callback(event);
      }
    };

    document.addEventListener(eventType, handler);
    this.events.set(eventKey, handler); // Сохраняем обработчик
  }

  /**
   * Удаляет все зарегистрированные события
   */
  removeAllEvents() {
    this.events.forEach((handler, eventKey) => {
      const [eventType, selector] = eventKey.split(":");
      document.removeEventListener(eventType, handler);
    });

    this.events.clear();
  }
}
