import { CONFIG } from '../core/Config.js';

export class InlineDataFiller {
    // helper function
    static finder(targetElement, getValue) {
      const cleanValue = getValue.toLowerCase().replace(/[^a-z0-9]/g, ""); // Очищаем value
     
  
      const targetInput = hiddenInputs.find(item => item.dataset.id === targetElement.name); // Исправлено
      const matches = Object.keys(CONFIG.optionsId).find(key => key.toLowerCase().includes(cleanValue));
  
      const matchedValue = matches ? CONFIG.optionsId[matches] : null; // Исправлено
  
      return { targetInput, matchedValue };
    }
  
    /**
     * Заполняет элемент переданным значением.
     */
    static fill(triggerElement, value) {
      if (!triggerElement) {
        console.warn("Некорректные данные для fill.");
        console.log(triggerElement, value)
        return;
      }
      if (!value) {
        return;
      }
  
      if (triggerElement.tagName === "INPUT") {
        triggerElement.value = value;
      } else if (triggerElement.tagName === "SELECT") {
        const optionExists = Array.from(triggerElement.options).some(option => option.value.toLowerCase() === value.toLowerCase());
       
  
        if (optionExists) {
          triggerElement.value = value.toLowerCase();
        }
      } else if (triggerElement.tagName === "TEXTAREA") {
        triggerElement.value = value;
      }
    }
  
    /**
     * Обрабатывает `radio`-кнопки.
     */
    static handleRadioButton(radioElement, value) {
      
      const closestDiv = radioElement.closest("label")?.querySelector(".w-radio-input");
      
      const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, ""); // Очищаем value
      if (!closestDiv) {
        console.warn("Радио-кнопка не найдена.");
        return;
      }
  
      const isChecked = closestDiv.classList.contains("w--redirected-checked");
  
      if (radioElement.value === cleanValue && !isChecked) {
        radioElement.setAttribute("checked", "checked");
        closestDiv.classList.add("w--redirected-checked");
      }
    }
  
    /**
     * Обрабатывает `checkbox`.
     */
    static handleCheckbox(checkboxElement, inputElement, value) {
      const checkboxTrigger = checkboxElement.closest("label")?.querySelector(".discounted");
      if (checkboxTrigger && !checkboxElement.checked && value !== '') {
        checkboxTrigger.click();
        checkboxElement.setAttribute("checked", "checked");
      }
  
      if (inputElement) {
        inputElement.value = value || "";
      }
    }
  }
  
