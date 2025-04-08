
export const CONFIG = {
  webhooks: {
    form: "https://hook.eu2.make.com/pcsgu2py6livbb3ehyr8epzijpruoa45",
  },

  uiElements: {
    servicesWrapper: ".user-services-wrapper", // Главный контейнер всех сервисов
    serviceItem: ".service-wrapper", // Обертка каждого сервиса (service-1, service-2...)
    serviceDivider: "service-divider", // Разделитель
    repeats: ".subscribe-field", // Поля подписки
    serviceBlockController: "#addServiceBlock", // Кнопка добавления блока сервиса
    supportMessage: ".support-message", // Сообщения поддержки
    serviceBtn: ".btn-add-more-service", // Кнопка "Добавить сервис"
    

    // 🔹 Новые селекторы для кнопок и меню
    btnTrigger: ".btn-trigger", // Кнопка открытия меню
    optionWrapper: ".option-wrapper", // Обертка кнопок управления
    moveUpBtn: ".move-up", // Кнопка перемещения вверх
    moveDownBtn: ".move-down", // Кнопка перемещения вниз
    menuTrigger: "[data-menu-trigger]",
    menuOption: "[data-menu-option]",
    optionItem: "[data-id]", 
  },

  localStorageKeys: {
    menuState: "menuState", // Ключ для хранения порядка блоков
    activeBlock: "activeBlock", // Ключ для хранения ID активного блока
  },

  serviceDefaultData: [
    { id: "servicename", data: "Product Name" },
    { id: "servicedescription", data: "Product Description" },
    { id: "price", data: "0" },
    { id: "pagetitle", data: "set-store-name" },
  ],

  ATTR: {
    MIRROR_CONTAINER: 'data-mirror-group',   // Обертка источника с элементами (mirror)
    ITEM_ID: 'data-id',                      // Атрибут уникального ID каждого элемента
    GROUP_BLOCK: 'data-group',               // Название группы (main, other и т.д.)
    GROUP_REF: 'data-mirror',                // Ссылка на mirror-группу
    GROUP_SOURCE: 'data-group-source',       // Скрытый блок с изначальным списком из базы
    GROUP_VARIANT: 'data-variant',           // Количество элементов в main (если дефолт)
    INPUT_SYNC: 'data-sync',                 // Скрытый input для синхронизации (value)
  },

  currencySymbols: "https://esm.run/currency-symbols",
};
