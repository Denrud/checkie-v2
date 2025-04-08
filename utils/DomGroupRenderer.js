import { CONFIG } from "../core/Config.js";

export class DomGroupRenderer {
  /**
   * Рендерит DOM-блоки в группы на основе списка ID
   * @param {HTMLElement} root - Корневой элемент (обычно document)
   * @param {string} mirrorGroupName - Название группы (data-mirror-group)
   * @param {Map<string, string[]>} groupMap - Карта групп: groupName → [id1, id2, ...]
   */
  static async render(root = document, mirrorGroupName, groupMap) {
    console.group(`[DomGroupRenderer] Рендеринг группы "${mirrorGroupName}"`);

    const mirrorSelector = `[${CONFIG.ATTR.MIRROR_CONTAINER}="${mirrorGroupName}"]`;
    const mirrorEl = root.querySelector(mirrorSelector);

    if (!mirrorEl) {
      console.warn(`[DomGroupRenderer] ❌ Mirror не найден: ${mirrorSelector}`);
      console.groupEnd();
      return;
    }

    // Собираем оригиналы по ID
    const allMap = new Map();
    mirrorEl.querySelectorAll(`[${CONFIG.ATTR.ITEM_ID}]`).forEach((el) => {
      const id = el.getAttribute(CONFIG.ATTR.ITEM_ID);
      if (id) allMap.set(id, el.cloneNode(true));
    });

    // Проходим по каждой группе (main, other, disable и т.п.)
    for (const [groupName, idList] of groupMap.entries()) {
      const groupSelector = `[${CONFIG.ATTR.GROUP_BLOCK}="${groupName}"][${CONFIG.ATTR.GROUP_REF}="${mirrorGroupName}"]`;
      const groupEl = root.querySelector(groupSelector);

      if (!groupEl) {
        console.warn(`⚠️ Группа "${groupName}" не найдена`);
        continue;
      }

      // Удаляем старый контент, но не трогаем source и input
      Array.from(groupEl.children).forEach((child) => {
        if (
          child.hasAttribute(CONFIG.ATTR.GROUP_SOURCE) ||
          child.hasAttribute(CONFIG.ATTR.INPUT_SYNC)
        )
          return;
        child.remove();
      });

      // Добавляем элементы по списку
      for (const id of idList) {
        const item = allMap.get(id);
        if (item) groupEl.appendChild(item.cloneNode(true));
      }

      // Обновляем input[data-sync]
      const input = groupEl.querySelector(`[${CONFIG.ATTR.INPUT_SYNC}]`);
      if (input) {
        input.value = idList.join(",");
        console.log(`💾 Обновлён input [${groupName}]:`, input.value);
      }
    }

    console.log(`✅ Группы успешно отрисованы`);

    console.groupEnd();
  }
}
