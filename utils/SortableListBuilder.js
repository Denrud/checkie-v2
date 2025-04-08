import { CONFIG } from '../core/Config.js';

export class SortableListBuilder {
  /**
   * Асинхронно формирует структуру групп сортировки
   * @param {HTMLElement} root - Корень поиска (документ или контейнер)
   * @param {string} mirrorGroupName - Имя группы (значение data-mirror-group)
   * @returns {Promise<Map<string, string[]>>} - Карта групп: groupName → [id1, id2, ...]
   */
  static async build(root = document, mirrorGroupName) {
    console.group(`[SortableListBuilder] Старт инициализации группы "${mirrorGroupName}"`);

    const mirrorSelector = `[${CONFIG.ATTR.MIRROR_CONTAINER}="${mirrorGroupName}"]`;
    const mirrorEl = root.querySelector(mirrorSelector);

    if (!mirrorEl) {
      console.warn(`[SortableListBuilder] ❌ Mirror не найден по селектору: ${mirrorSelector}`);
      console.groupEnd();
      return new Map();
    }

    const allItems = Array.from(mirrorEl.querySelectorAll(`[${CONFIG.ATTR.ITEM_ID}]`))
      .map((el) => el.getAttribute(CONFIG.ATTR.ITEM_ID))
      .filter(Boolean);

    console.log(`✅ Найдено ${allItems.length} элементов с data-id:`, allItems);

    const groupBlocks = Array.from(
      root.querySelectorAll(`[${CONFIG.ATTR.GROUP_BLOCK}][${CONFIG.ATTR.GROUP_REF}="${mirrorGroupName}"]`)
    );

    if (groupBlocks.length === 0) {
      console.warn(`[SortableListBuilder] ⚠️ Группы для mirror "${mirrorGroupName}" не найдены`);
    } else {
      console.log(`📦 Найдено ${groupBlocks.length} групп:`, groupBlocks.map(el => el.getAttribute(CONFIG.ATTR.GROUP_BLOCK)));
    }

    const result = new Map();

    for (const groupEl of groupBlocks) {
      const groupName = groupEl.getAttribute(CONFIG.ATTR.GROUP_BLOCK);
      const source = groupEl.querySelector(`[${CONFIG.ATTR.GROUP_SOURCE}]`);
      let list = [];

      if (source && source.textContent.trim() !== '') {
        list = source.textContent
          .split(',')
          .map((id) => id.trim())
          .filter((id) => allItems.includes(id));
        console.log(`📥 Группа "${groupName}" загрузила значения из базы:`, list);
      }

      result.set(groupName, list);
    }

    const mainBlock = groupBlocks.find(
      (el) => el.getAttribute(CONFIG.ATTR.GROUP_BLOCK) === 'main'
    );

    if (mainBlock && result.get('main')?.length === 0) {
      const variantAttr = mainBlock.getAttribute(CONFIG.ATTR.GROUP_VARIANT) || '3';
      const count = parseInt(variantAttr, 10) || 3;

      const usedIds = Array.from(result.values()).flat();
      const available = allItems.filter((id) => !usedIds.includes(id));

      result.set('main', available.slice(0, count));
      result.set('other', available.slice(count));

      console.log(`🟩 Группа "main" сформирована по умолчанию (${count} элементов):`, result.get('main'));
      console.log(`🟦 Остаток попал в "other":`, result.get('other'));
    } else {
      const used = Array.from(result.values()).flat();
      const unused = allItems.filter((id) => !used.includes(id));

      if (!result.has('other')) result.set('other', []);
      result.set('other', [...result.get('other'), ...unused]);

      console.log(`🔄 "other" дополнена неиспользованными элементами:`, result.get('other'));
    }

    console.log(`✅ Финальная карта групп:`, result);
    console.groupEnd();

    return result;
  }
}
