/**
 * Кнопка «В избранное»: переключатель с состоянием в aria-pressed.
 * Реальное избранное не подключается: состояние отдаётся наружу событием для интеграции.
 * @param {HTMLButtonElement} button — элемент с атрибутом data-favorite
 */
export function initFavoriteButton(button) {
  button.addEventListener('click', () => {
    const isFavorite = button.getAttribute('aria-pressed') !== 'true';

    button.setAttribute('aria-pressed', String(isFavorite));
    button.dispatchEvent(
      new CustomEvent('product:favorite-toggle', {
        bubbles: true,
        detail: { isFavorite },
      }),
    );
  });
}
