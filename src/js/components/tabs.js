const TAB_SELECTOR = '[role="tab"]';

/**
 * Вкладки по паттерну WAI-ARIA Tabs. Начальное состояние задано в разметке
 * (aria-selected у вкладки, is-active у панели), поэтому при загрузке ничего не перестраивается.
 * Клавиатура: стрелки влево/вправо переключают вкладки, Home/End — первая/последняя.
 * Ссылка вида <a href="#id-панели"> в любом месте страницы открывает нужную вкладку,
 * адрес с таким якорем открывает её сразу при загрузке.
 * @param {HTMLElement} root — элемент с атрибутом data-tabs
 */
export function initTabs(root) {
  const tabs = [...root.querySelectorAll(TAB_SELECTOR)];

  function getTabByPanelId(panelId) {
    return tabs.find((tab) => tab.getAttribute('aria-controls') === panelId);
  }

  function select(selectedTab) {
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      const panel = root.querySelector(`#${tab.getAttribute('aria-controls')}`);

      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      panel.classList.toggle('is-active', isSelected);
    });
  }

  function getTabByKey(key, index) {
    const keyMap = {
      ArrowRight: tabs[(index + 1) % tabs.length],
      ArrowLeft: tabs[(index - 1 + tabs.length) % tabs.length],
      Home: tabs[0],
      End: tabs[tabs.length - 1],
    };

    return keyMap[key];
  }

  root.addEventListener('click', (event) => {
    const tab = event.target.closest(TAB_SELECTOR);

    if (tab) {
      select(tab);
    }
  });

  root.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(event.target);
    const nextTab = index === -1 ? null : getTabByKey(event.key, index);

    if (nextTab) {
      event.preventDefault();
      select(nextTab);
      nextTab.focus();
    }
  });

  // Вкладка открывается до прокрутки к якорю, поэтому браузер прокручивает уже к видимой панели.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    const tab = link && getTabByPanelId(link.hash.slice(1));

    if (tab) {
      select(tab);
    }
  });

  const initialTab = getTabByPanelId(window.location.hash.slice(1));

  if (initialTab) {
    select(initialTab);
  }
}
