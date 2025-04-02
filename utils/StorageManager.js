import { CONFIG } from "../core/Config.js";

export class StorageManager {
  constructor(key) {
    this.key = key;
  }

  /**
   * 🔹 Получение данных из LocalStorage
   */
  getData() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * 🔹 Сохранение данных в LocalStorage
   */
  saveData(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  /**
   * 🔹 Очистка данных по ключу
   */
  clearData() {
    localStorage.removeItem(this.key);
  }

  /**
   * 🔹 Создание пустого хранилища для кастомных полей
   */
  createStorage() {
    localStorage.setItem(CONFIG.localStorageKeys.menuState, JSON.stringify({}));
  }

  /**
   * 🔹 Сохранение состояния меню (универсальный метод)
   */
  saveMenuState(state) {
    localStorage.setItem(CONFIG.localStorageKeys.menuState, JSON.stringify(state));
  }

  /**
   * 🔹 Получение состояния меню
   */
  getMenuState() {
    const state = localStorage.getItem(CONFIG.localStorageKeys.menuState);
    return state ? JSON.parse(state) : null;
  }

  /**
   * 🔹 Сохранение активного блока (`service-*`)
   */
  saveActiveBlock(blockId) {
    localStorage.setItem(CONFIG.localStorageKeys.activeBlock, JSON.stringify(blockId));
  }

  /**
   * 🔹 Получение активного блока (`service-*`)
   */
  getActiveBlock() {
    const blockId = localStorage.getItem(CONFIG.localStorageKeys.activeBlock);
    return blockId ? JSON.parse(blockId) : null;
  }

   // 🔹 Получение состояния сервисных блоков
   getServiceState() {
    return JSON.parse(localStorage.getItem("serviceBlockState") || "{}");
  }

  // 🔹 Сохранение состояния сервисных блоков
  saveServiceState(state) {
    localStorage.setItem("serviceBlockState", JSON.stringify(state));
  }
}
