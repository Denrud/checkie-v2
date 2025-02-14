export class StorageManager {
    constructor(key) {
      this.key = key;
    }
  
    getData() {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : null;
    }
  
    saveData(data) {
      localStorage.setItem(this.key, JSON.stringify(data));
    }
  
    clearData() {
      localStorage.removeItem(this.key);
    }

    createStorage() {
      localStorage.setItem('customFields', JSON.stringify());
    }
  }
  