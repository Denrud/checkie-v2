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
    containers.forEach((container) => {
      this.handleDragAndDrop(container);
    });

    // 📌 Находим все `input[type="file"]` на странице
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      this.observeFileInput(input);
    });
  }

  /**
   * 🚀 Обработка Drag and Drop (эмулируем выбор файла пользователем)
   * @param {HTMLElement} container - Контейнер с data-dnd="true"
   */
  handleDragAndDrop(container) {
    const input = container.closest("[data-upload-wrapper]")?.querySelector('input[type="file"]');
    if (!input) return;

    container.addEventListener("dragenter", (event) => {
      event.preventDefault();
      container.classList.add("drag-over");
    });

    container.addEventListener("dragover", (event) => {
      event.preventDefault();
      container.classList.add("drag-over");
    });

    container.addEventListener("dragleave", (event) => {
      event.preventDefault();
      container.classList.remove("drag-over");
    });

    container.addEventListener("drop", (event) => {
      event.preventDefault();
      container.classList.remove("drag-over");

      const file = event.dataTransfer.files[0];
      if (!file) return;

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
    input.addEventListener("change", () => {
      if (input.files.length > 0) {
        this.handleFile(input.files[0], input);
      }
    });
  }

  /**
   * 🎯 Переключение отображения превью изображения и названия файла
   * @param {HTMLElement} wrapper - Родительский контейнер [data-upload-wrapper]
   * @param {boolean} isImage - `true`, если загружен файл изображения, иначе `false`
   */
  toggleFilePreview(wrapper, isImage) {
    const imageWrapper = wrapper.querySelector(".upload-image_wrapper");
    const fileNameWrapper = wrapper.querySelector(".file-name");

    if (!imageWrapper || !fileNameWrapper) return;

    if (isImage) {
      imageWrapper.classList.remove("hide");
      fileNameWrapper.classList.add("hide");
    } else {
      imageWrapper.classList.add("hide");
      fileNameWrapper.classList.remove("hide");
    }
  }

  /**
   * 📦 Обработка файла
   * @param {File} file - Захваченный файл
   * @param {HTMLElement} source - Источник файла (input[type="file"] или DnD контейнер)
   */
  handleFile(file, source) {
    const wrapper = source.closest("[data-upload-wrapper]");
    if (!wrapper) return;

    const isImage = file.type.startsWith("image/");
    if (isImage) {
      const imageUrl = URL.createObjectURL(file);
      const img = wrapper.querySelector("[data-upload-target]");
      if (img) {
        img.src = imageUrl;
      }
    }

    // 🟢 Переключаем стили отображения
    this.toggleFilePreview(wrapper, isImage);
  }
}
