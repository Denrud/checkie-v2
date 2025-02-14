import { UIManager } from '../ui/UIManager.js';

export class FormHandler {
    constructor(widgetSync) {
      this.widgetSync = widgetSync;
      this.uiManager = new UIManager()
    }
  
    /**
     * 📌 Обрабатывает изменение `input`, `select`, `textarea`
     */
    handleInputChange(event) {
      const input = event.target;
      const fieldName = input.dataset.name;
      const value = input.type === "checkbox" ? input.checked : input.value;
  
      if (!fieldName) return;
  
      console.log(`📡 Обновление поля ${fieldName} → ${value}`);
  
      // 🔄 Передаём данные в WidgetSync
      this.widgetSync.updateWidget(fieldName, value);
    }
  
    /**
     * 📂 Обрабатывает загрузку файлов
     */
    FileUpload(event) {
        const inputName = event.target.name;
        const file = event.target.files[0]; // Получаем первый файл из списка
        console.log(inputName, file)
        this.widgetSync.updateFileUpload(inputName,file);
        console.log("📂 Файл загружен", file);
    }

    handleRadioButtonChange(event) {
        const input = event.target;
        const radioName = input.dataset.name;
        const radioValue = input.value;
        console.log(radioName, radioValue);
        this.uiManager.initializeElements(radioName, radioValue);
    }

    handleSelectChanged(event) {
        const select = event.target;
        const selectName = select.dataset.name;
        console.log(select, selectName);

    }
  }
  