import { CONFIG } from "../core/Config.js";

/**
 * UIMenuAnimation
 * ----------------------------------------------------------------------------
 * Управляет анимацией открытия/закрытия меню с дополнительными проверками.
 * Слушатели вешаются только на элементы, заданные через CONFIG.uiElements, 
 * и только если у них есть родительский элемент с атрибутом [data-id].
 */
export class UIMenuAnimation {
  /**
   * Инициализирует слушатели для меню.
   * @param {HTMLElement} root - Корневой элемент для поиска (по умолчанию document)
   */
  static async init(root = document) {
    console.log("[UIMenuAnimation] Инициализация анимаций меню");
    
    // Сбрасываем состояние всех меню сразу при инициализации
    UIMenuAnimation._resetAllMenus();
    
    // Слушатели для клика по триггерам меню (выбираем по селектору из CONFIG)
    const triggers = root.querySelectorAll(CONFIG.uiElements.menuTrigger);
    triggers.forEach((trigger) => {
      const parent = trigger.closest("[data-id]");
      if (!parent) {
        console.warn("[UIMenuAnimation] Триггер не имеет родительского элемента с [data-id]:", trigger);
        return;
      }
      trigger.addEventListener("click", (event) => {
        const menuContainer = event.target.closest("[data-id]");
        if (menuContainer) {
          UIMenuAnimation.toggle(menuContainer);
        } else {
          console.warn("[UIMenuAnimation] Не найден родитель с [data-id] для триггера:", event.target);
        }
      });
    });

    // Навешиваем hover-события на триггеры, чтобы управлять opacity у белых иконок.
    const hoverTriggers = root.querySelectorAll(CONFIG.uiElements.menuTrigger);
    hoverTriggers.forEach((trigger) => {
      const parent = trigger.closest("[data-id]");
      if (!parent) return;
      trigger.addEventListener("mouseenter", () => {
        const whiteIcon = parent.querySelector(".doted-btn_white");
        if (whiteIcon) whiteIcon.style.opacity = "1";
      });
      trigger.addEventListener("mouseleave", () => {
        const whiteIcon = parent.querySelector(".doted-btn_white");
        if (whiteIcon) {
          const menuWrapper = parent.querySelector(".service-option-menu");
          if (menuWrapper && getComputedStyle(menuWrapper).display === "flex") {
            whiteIcon.style.opacity = "1";
          } else {
            whiteIcon.style.opacity = "0";
          }
        }
      });
    });

    // Слушатели для блур-элементов — только те, что находятся внутри [data-id].
    const blurBgs = root.querySelectorAll("[data-id] .option-close-bg");
    blurBgs.forEach((blur) => {
      // При клике закрываем все меню.
      blur.addEventListener("click", () => {
        UIMenuAnimation._resetAllMenus();
        console.log("[UIMenuAnimation] Закрытие всех меню по клику на подложку");
      });
      // При наведении на блур тоже закрываем все меню.
      blur.addEventListener("mouseenter", () => {
        UIMenuAnimation._resetAllMenus();
        console.log("[UIMenuAnimation] Закрытие всех меню по наведению на подложку");
      });
    });
  }

  /**
   * Открывает меню: закрывает все открытые меню, затем открывает текущее.
   * @param {HTMLElement} menuContainer - Родительский элемент с [data-id]
   */
  static open(menuContainer) {
    UIMenuAnimation._resetAllMenus();
    const menuWrapper = menuContainer.querySelector(".service-option-menu");
    const doted = menuContainer.querySelector(".doted-btn");
    const white = menuContainer.querySelector(".doted-btn_white");
    const blurBg = menuContainer.querySelector(".option-close-bg");

    if (menuWrapper) {
      // Используем flex, чтобы меню корректно отображалось
      menuWrapper.style.display = "flex";
    }
    if (doted) {
      doted.style.opacity = "0";
    }
    if (white) {
      white.style.opacity = "1";
    }
    if (blurBg) {
      blurBg.style.display = "block";
    }

    console.log("[UIMenuAnimation] Открыто меню:", menuContainer.getAttribute("data-id"));
  }

  /**
   * Закрывает меню, сбрасывая inline-стили.
   * @param {HTMLElement} menuContainer - Родительский элемент с [data-id]
   */
  static close(menuContainer) {
    const menuWrapper = menuContainer.querySelector(".service-option-menu");
    const doted = menuContainer.querySelector(".doted-btn");
    const white = menuContainer.querySelector(".doted-btn_white");
    const blurBg = menuContainer.querySelector(".option-close-bg");

    if (menuWrapper) {
      menuWrapper.style.display = "none";
    }
    if (doted) {
      doted.style.opacity = "1";
    }
    if (white) {
      white.style.opacity = "0";
    }
    if (blurBg) {
      blurBg.style.display = "none";
    }

    console.log("[UIMenuAnimation] Закрыто меню:", menuContainer.getAttribute("data-id"));
  }

  /**
   * Переключает состояние меню: если открыто — закрывает, иначе — открывает.
   * @param {HTMLElement} menuContainer - Родительский элемент с [data-id]
   */
  static toggle(menuContainer) {
    const menuWrapper = menuContainer.querySelector(".service-option-menu");
    if (!menuWrapper) return;
    // Используем getComputedStyle для проверки реального состояния отображения.
    const isVisible = getComputedStyle(menuWrapper).display === "flex";
    if (isVisible) {
      UIMenuAnimation.close(menuContainer);
    } else {
      UIMenuAnimation.open(menuContainer);
    }
  }

  /**
   * Сбрасывает состояние всех меню на странице, скрывая меню, восстанавливая прозрачность и скрывая блур.
   */
  static _resetAllMenus() {
    const allMenus = document.querySelectorAll(".service-option-menu");
    const allDots = document.querySelectorAll(".doted-btn");
    const allWhites = document.querySelectorAll(".doted-btn_white");
    const allBlurBgs = document.querySelectorAll(".option-close-bg");

    allMenus.forEach((menu) => {
      menu.style.display = "none";
    });
    allDots.forEach((dot) => {
      dot.style.opacity = "1";
    });
    allWhites.forEach((white) => {
      white.style.opacity = "0";
    });
    allBlurBgs.forEach((bg) => {
      bg.style.display = "none";
    });
  }

  /**
   * Вешает слушатели на элементы блур (".option-close-bg"), которые находятся внутри родителя с [data-id],
   * чтобы при клике или наведении закрывать все меню.
   * @param {HTMLElement} root - Корневой элемент для поиска (по умолчанию document)
   */
  static closeAllMenusByBlurClick(root = document) {
    const blurBgs = root.querySelectorAll("[data-id] .option-close-bg");
    blurBgs.forEach((blur) => {
      blur.addEventListener("click", () => {
        UIMenuAnimation._resetAllMenus();
        console.log("[UIMenuAnimation] Закрытие всех меню по клику на подложку");
      });
      blur.addEventListener("mouseenter", () => {
        UIMenuAnimation._resetAllMenus();
        console.log("[UIMenuAnimation] Закрытие всех меню по наведению на подложку");
      });
    });
  }
}
