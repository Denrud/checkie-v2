import { CONFIG } from '../core/Config.js';

export class SortableDragDrop {
  /**
   * Инициализация drag-n-drop для всех групп, связанных с mirror
   * @param {HTMLElement} root - Корень поиска (document или контейнер)
   * @param {string} mirrorGroupName - Имя группы, например 'skills'
   */
  static async init(root = document, mirrorGroupName) {
    console.group(`[SortableDragDrop] Инициализация DnD для "${mirrorGroupName}"`);

    const groupSelector = `[${CONFIG.ATTR.GROUP_BLOCK}][${CONFIG.ATTR.GROUP_REF}="${mirrorGroupName}"]`;
    const groupEls = Array.from(root.querySelectorAll(groupSelector));

    if (groupEls.length === 0) {
      console.warn(`[SortableDragDrop] ⚠️ Группы не найдены: ${groupSelector}`);
      console.groupEnd();
      return;
    }

    groupEls.forEach(group => this._enableDnDForGroup(group));
    console.groupEnd();
  }

  /**
   * Подключает dnd-события к элементам в группе
   * @param {HTMLElement} groupEl
   */
  static _enableDnDForGroup(groupEl) {
    const items = Array.from(groupEl.querySelectorAll(`[${CONFIG.ATTR.ITEM_ID}]`));
    const input = groupEl.querySelector(`[${CONFIG.ATTR.INPUT_SYNC}]`);
    const groupName = groupEl.getAttribute(CONFIG.ATTR.GROUP_BLOCK);

    if (!input) {
      console.warn(`[SortableDragDrop] ❗ input[data-sync] не найден в группе "${groupName}"`);
      return;
    }

    let dragSrc = null;

    items.forEach(item => {
      item.setAttribute('draggable', true);

      item.addEventListener('dragstart', (e) => {
        dragSrc = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        item.classList.add('over');
      });

      item.addEventListener('dragleave', () => {
        item.classList.remove('over');
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.classList.remove('over');
      
        if (dragSrc && dragSrc !== item) {
          const parent = item.parentNode;
          const children = Array.from(parent.children).filter(el => el.hasAttribute(CONFIG.ATTR.ITEM_ID));
      
          const srcIndex = children.indexOf(dragSrc);
          const targetIndex = children.indexOf(item);
      
          // 🐞 Отладка: куда именно перетаскиваем
          const sourceId = dragSrc.getAttribute(CONFIG.ATTR.ITEM_ID);
          const targetId = item.getAttribute(CONFIG.ATTR.ITEM_ID);
          console.log(`[DnD] Перемещаем "${sourceId}" → "${targetId}"`);
      
          if (srcIndex < targetIndex) {
            parent.insertBefore(dragSrc, item.nextSibling);
          } else {
            parent.insertBefore(dragSrc, item);
          }
      
          // Обновляем порядок в input
          const newOrder = Array.from(parent.querySelectorAll(`[${CONFIG.ATTR.ITEM_ID}]`))
            .map(el => el.getAttribute(CONFIG.ATTR.ITEM_ID))
            .filter(Boolean);
      
          input.value = newOrder.join(',');
          console.log(`↕️ Порядок в группе "${groupName}" обновлён:`, input.value);
        }
      });
      

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        groupEl.querySelectorAll('.over').forEach(el => el.classList.remove('over'));
      });
    });

    console.log(`✅ DnD включён для группы "${groupName}"`);
  }
}
