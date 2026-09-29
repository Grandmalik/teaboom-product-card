import { formatPrice } from '../helpers/price.js';
import { cart } from '../services/cart.js';
import { initQuantity } from './quantity.js';

/**
 * Блок «В корзине»: позиции с количеством, суммой и удалением, итог.
 * Строки создаются из <template> и обновляются точечно, чтобы не сбивать фокус
 * на счётчике, которым пользователь сейчас пользуется.
 * @param {HTMLElement} root — элемент с атрибутом data-cart-summary
 */
export function initCartSummary(root) {
  const list = root.querySelector('[data-cart-summary-list]');
  const template = root.querySelector('[data-cart-summary-template]');
  const totalCount = root.querySelector('[data-cart-summary-count]');
  const totalSum = root.querySelector('[data-cart-summary-sum]');
  const rows = new Map();

  function createRow({ sku }) {
    const row = template.content.firstElementChild.cloneNode(true);
    const quantity = initQuantity(row.querySelector('[data-quantity]'));

    row.querySelector('[data-quantity-input]').addEventListener('change', () => {
      cart.setQuantity(sku, quantity.value);
    });
    row.querySelector('[data-item-remove]').addEventListener('click', () => cart.remove(sku));

    return { row, quantity };
  }

  function renderRow({ row, quantity }, { name, price, quantity: count }) {
    row.querySelector('[data-item-name]').textContent = name;
    row.querySelector('[data-item-sum]').textContent = formatPrice(price * count);
    row.querySelector('[data-item-remove-label]').textContent = `Удалить ${name}`;
    row.querySelector('[data-quantity-input]').setAttribute('aria-label', `Количество ${name}, шт.`);
    quantity.value = count;
  }

  function render() {
    const items = cart.getItems();
    const { count, sum } = cart.getTotals();

    items.forEach((item, index) => {
      if (!rows.has(item.sku)) {
        rows.set(item.sku, createRow(item));
      }

      const entry = rows.get(item.sku);
      renderRow(entry, item);

      // Вставляем только если строка не на своём месте: перемещение узла сбросило бы фокус.
      if (list.children[index] !== entry.row) {
        list.insertBefore(entry.row, list.children[index] ?? null);
      }
    });

    rows.forEach((entry, sku) => {
      if (!cart.getQuantity(sku)) {
        entry.row.remove();
        rows.delete(sku);
      }
    });

    totalCount.textContent = count;
    totalSum.textContent = formatPrice(sum);
    root.hidden = items.length === 0;
  }

  // Enter в поле строки подтверждает количество, а не отправляет форму «В корзину».
  list.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('[data-quantity-input]')) {
      event.preventDefault();
      event.target.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  cart.addEventListener('change', render);
  render();
}
