export class DataProcessor {
    constructor() {}
  
    /**
     * 📌 Обрабатывает входящие данные (из localStorage или input)
     * @param {Object} rawData - Сырые данные (из localStorage или input)
     * @returns {Object} Обработанные данные
     */
    processData(rawData) {
      if (!rawData || typeof rawData !== "object") {
        console.warn("⚠️ Некорректные данные переданы в DataProcessor:", rawData);
        return {};
      }
  
      // Создаём объект для обработанных данных
      const processedData = { ...rawData };
  
      // 🔹 Обрабатываем числовые поля (price, discountedPrice)
      if (processedData.price) {
        processedData.price = this.cleanNumber(processedData.price);
      }
      if (processedData.discountedPrice) {
        processedData.discountedPrice = this.cleanNumber(processedData.discountedPrice);
      }
  
      // 🔹 Обрабатываем чекбоксы (true / false)
      if (processedData.discounted) {
        processedData.discounted = this.cleanBoolean(processedData.discounted);
      }
  
      // 🔹 Очищаем строки (удаляем лишние пробелы)
      ["name", "description", "currency", "repeats"].forEach((field) => {
        if (processedData[field]) {
          processedData[field] = this.cleanString(processedData[field]);
        }
      });
  
      console.log("✅ Обработанные данные:", processedData);
      return processedData;
    }
  
    /**
     * 📌 Удаляет лишние пробелы в строке
     */
    cleanString(value) {
      return typeof value === "string" ? value.trim() : value;
    }
  
    /**
     * 📌 Преобразует значение в число (если возможно)
     */
    cleanNumber(value) {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
  
    /**
     * 📌 Преобразует значение в `true` / `false`
     */
    cleanBoolean(value) {
      return value === "on" || value === true;
    }
  }
  