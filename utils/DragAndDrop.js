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
      console.log(containers);
      if (!containers.length) {
        console.warn("⚠️ DragAndDrop: Контейнеры с data-dnd='true' не найдены.");
        return;
      }
  
      // Добавляем DnD для каждого контейнера
      containers.forEach((container) => {
        this.handleDragAndDrop(container);
      });
    }
  
    /**
     * 🚀 Обработка Drag and Drop
     * @param {HTMLElement} container - Контейнер с data-dnd="true"
     */
    handleDragAndDrop(container) {
      console.log(container);
        // 🎨 Добавляем класс при наведении файла
      const addDragOverClass = () => container.classList.add("drag-over");
  
      // 🎨 Удаляем класс при выходе из зоны
      const removeDragOverClass = () => container.classList.remove("drag-over");
  
      // 🟢 dragenter - Файл заходит в контейнер
      container.addEventListener("dragenter", (event) => {
        event.preventDefault();
        addDragOverClass();
      });
  
      // 🟢 dragover - Файл двигается внутри контейнера
      container.addEventListener("dragover", (event) => {
        event.preventDefault();
        addDragOverClass();
      });
  
      // 🟢 dragleave - Файл выходит за границы контейнера
      container.addEventListener("dragleave", (event) => {
        event.preventDefault();
        removeDragOverClass();
      });
  
      // 🟢 drop - Файл дропается в контейнер
      container.addEventListener("drop", (event) => {
        event.preventDefault();
        removeDragOverClass();
  
        const file = event.dataTransfer.files[0]; // Захватываем первый файл
        if (file) {
          console.log("📁 Файл захвачен:", file);
          this.handleFile(file); // Передаём файл в обработку
        }
      });
    }
  
    /**
     * 📦 Обработка файла
     * @param {File} file - Захваченный файл
     */
    handleFile(file) {
      console.log("🔍 Обработка файла:", file);
      // Здесь будет валидация и чтение файла на следующем этапе
    }
  }
  