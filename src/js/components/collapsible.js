const EXPANDED_CLASS = 'is-expanded';
const STATIC_CLASS = 'is-static';

/**
 * Сворачиваемый блок «Читать далее». Высота обрезки задаётся в CSS (--collapsible-height).
 * Если контент помещается целиком, кнопка скрывается, а блок не обрезается.
 * @param {HTMLElement} root — элемент с атрибутом data-collapsible
 */
export function initCollapsible(root) {
  const content = root.querySelector('[data-collapsible-content]');
  const toggle = root.querySelector('[data-collapsible-toggle]');
  const labels = {
    collapsed: toggle.textContent.trim(),
    expanded: toggle.dataset.labelExpanded,
  };

  // Сравниваем полную высоту контента с высотой обрезки: так проверка работает и в свёрнутом, и в раскрытом виде.
  function updateStatic() {
    const limit = parseFloat(getComputedStyle(root).getPropertyValue('--collapsible-height'));
    const fits = content.scrollHeight <= limit;

    root.classList.toggle(STATIC_CLASS, fits);
    toggle.hidden = fits;
  }

  function setExpanded(isExpanded) {
    root.classList.toggle(EXPANDED_CLASS, isExpanded);
    toggle.setAttribute('aria-expanded', String(isExpanded));
    toggle.textContent = isExpanded ? labels.expanded : labels.collapsed;

    // После сворачивания кнопка могла уехать за верх экрана — возвращаем её в поле зрения.
    if (!isExpanded) {
      toggle.scrollIntoView({ block: 'nearest' });
    }
  }

  toggle.addEventListener('click', () => setExpanded(!root.classList.contains(EXPANDED_CLASS)));

  updateStatic();
  // Высота текста меняется после загрузки шрифтов и при изменении ширины окна.
  document.fonts.ready.then(updateStatic);
  window.addEventListener('resize', updateStatic);
}
