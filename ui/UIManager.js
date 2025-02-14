import { StorageManager } from "../utils/StorageManager.js";

export class UIManager {
  constructor() {
    this.storage = new StorageManager("customFields");
  }

  changeBillingModel(elementName, elementValue) {
    const elements = document.querySelectorAll(".data-wrapper");
    console.log(data, elementName, elementValue);
  }

}
