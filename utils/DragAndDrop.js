export class DragAndDrop {
  constructor() {
    this.init();
  }

  /**
   * 🟢 Инициализация модуля
   */
  async init() {
    // Находим все контейнеры с data-dnd="true"
    const containers = document.querySelectorAll('[data-dnd="true"]');
    if (!containers.length) {
      console.warn("⚠️ DragAndDrop: Контейнеры с data-dnd='true' не найдены.");
    } else {
      // Добавляем DnD для каждого контейнера
      containers.forEach((container) => {
        this.handleDragAndDrop(container);
      });
    }

    // 📌 Находим все `input[type="file"]` на странице
    const fileInputs = document.querySelectorAll('input[type="file"]');

    if (!fileInputs.length) {
      console.warn("⚠️ Поля input[type='file'] не найдены.");
    } else {
      // Добавляем обработчик к каждому найденному input[type="file"]
      fileInputs.forEach((input) => {
        this.observeFileInput(input);
      });
    }
  }

  /**
 * 🚀 Обработка Drag and Drop (эмулируем выбор файла пользователем)
 * @param {HTMLElement} container - Контейнер с data-dnd="true"
 */
handleDragAndDrop(container) {
  const input = container.closest("[data-upload-wrapper]")?.querySelector('input[type="file"]');
  if (!input) return;

  // 🎨 Добавляем класс при наведении файла
  const addDragOverClass = () => container.classList.add("drag-over");

  // 🎨 Удаляем класс при выходе из зоны
  const removeDragOverClass = () => container.classList.remove("drag-over");

  container.addEventListener("dragenter", (event) => {
    event.preventDefault();
    addDragOverClass();
  });

  container.addEventListener("dragover", (event) => {
    event.preventDefault();
    addDragOverClass();
  });

  container.addEventListener("dragleave", (event) => {
    event.preventDefault();
    removeDragOverClass();
  });

  container.addEventListener("drop", (event) => {
    event.preventDefault();
    removeDragOverClass();

    const file = event.dataTransfer.files[0];
    if (!file) return;

    console.log("📁 Файл загружен через Drag & Drop:", file);

    // 🟢 Эмулируем выбор файла в input[type="file"]
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;

    // ✅ Вызываем событие `change`, чтобы Webflow обработал файл
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}


  /**
   * 🎯 Отслеживание загрузки файла через `change`
   * @param {HTMLInputElement} input - Поле загрузки файла
   */
  observeFileInput(input) {
    console.log("✅ Отслеживание input[type='file'] запущено:", input);

    input.addEventListener("change", (event) => {
      if (input.files.length > 0) {
        const file = input.files[0]; // Берём загруженный файл
        console.log("📂 Файл загружен через change:", file);

        this.handleFile(file, input); // Передаём файл в обработку
      }
    });
  }

  /**
   * 📦 Обработка файла
   * @param {File} file - Захваченный файл
   * @param {HTMLElement} source - Источник файла (input[type="file"] или DnD контейнер)
   */
  handleFile(file, source) {
    console.log("🔍 Обработка файла:", file, "Источник:", source);

    // Проверяем, является ли файл изображением
    if (!file.type.startsWith("image/")) {
      console.warn("⚠️ Загруженный файл не является изображением.");
      return;
    }

    // Создаём временный URL для отображения изображения
    const imageUrl = URL.createObjectURL(file);
    console.log("🔗 Ссылка на изображение:", imageUrl);

    // 🏷️ Ищем ближайший `data-upload-wrapper`, внутри которого есть `data-upload-target`
    const wrapper = source.closest("[data-upload-wrapper]");
    const img = wrapper?.querySelector("[data-upload-target]");

    if (img) {
      img.src = imageUrl; // Обновляем ссылку на изображение
    } else {
      console.warn("⚠️ Изображение с data-upload-target не найдено внутри data-upload-wrapper.");
    }
  }
}
