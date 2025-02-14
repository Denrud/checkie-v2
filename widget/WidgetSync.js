export class WidgetSync {
  finder(fieldName) {
    const iframeDoc = this.getIframeDoc();

    if (!iframeDoc) {
      console.error("❌ `iframeDoc` отсутствует. Обновление невозможно.");
      return;
    }

    const widgetFields = Array.from(
      iframeDoc.querySelectorAll(`[widget-data-id="${fieldName}"]`)
    );

    if (widgetFields.length === 0) {
      console.warn(`⚠️ Поля с widget-data-id="${fieldName}" не найдены.`);
      return;
    }
    return widgetFields;
  }

  /**
   * 📦 Получает `iframeDoc` из `iframe`
   */
  getIframeDoc() {
    const iFrame = document.querySelector("iframe");
    if (!iFrame) {
      console.error("❌ `iframe` не найден.");
      return null;
    }
    return iFrame.contentDocument || iFrame.contentWindow.document || null;
  }
  /**
   * 🔄 Обновляет данные в Webflow-виджете
   */
  updateWidget(fieldName, value) {
    const widgetFields = this.finder(fieldName);
    // 🔥 Обновляем текстовые поля
    widgetFields.forEach((field) => {
      field.textContent = value;
      console.log(`✅ Виджет обновлён: ${fieldName} → ${value}`);
    });
  }

  /**
   * 📸 Обрабатывает загрузку изображений и обновляет `img` в виджете
   */
  updateFileUpload(inputName, file) {
    const widgetFields = this.finder(inputName);

    if (!file) {
      console.warn("⚠️ Файл не выбран.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result; // Ссылка на изображение (data URL)
      widgetFields.forEach((field) => {
        let img = field.querySelector("img");
        if (img) {
          img.src = imageUrl; // Устанавливаем ссылку как src для изображения
          console.log(`✅ Изображение обновлено!`);
        } else {
          console.warn(`⚠️ В поле ${field} не найден тег <img>.`);
        }
      });
    };

    reader.readAsDataURL(file); // Читаем файл как data URL
  }
}
