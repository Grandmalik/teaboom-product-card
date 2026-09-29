/**
 * Лайтбокс на нативном <dialog>. Открывается кнопками с data-lightbox-open="<id диалога>".
 * Esc, удержание фокуса внутри и возврат фокуса на кнопку браузер обеспечивает сам.
 * @param {HTMLDialogElement} dialog — элемент с атрибутом data-lightbox
 */
export function initLightbox(dialog) {
  const triggers = document.querySelectorAll(`[data-lightbox-open="${dialog.id}"]`);

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => dialog.showModal());
  });

  // Закрываем по кнопке, по клику на подложку и по клику на само фото.
  dialog.addEventListener('click', () => dialog.close());
}
