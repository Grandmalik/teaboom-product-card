/** Максимум штук одной фасовки — совпадает с data-max у счётчиков в разметке. */
export const MAX_QUANTITY = 99;

/**
 * Корзина в памяти страницы. Реальная корзина не подключается: этот модуль — единая точка
 * интеграции. Чтобы подключить бэкенд, достаточно заменить методы запросами к API,
 * компоненты работают только через этот интерфейс и событие 'change'.
 */
class Cart extends EventTarget {
  #items = new Map();

  /** Добавляет товар; если он уже в корзине, количество суммируется. */
  add({ sku, name, price }, quantity) {
    const current = this.getQuantity(sku);

    this.#items.set(sku, { sku, name, price, quantity: Math.min(current + quantity, MAX_QUANTITY) });
    this.#notify();
  }

  setQuantity(sku, quantity) {
    const item = this.#items.get(sku);

    if (item) {
      this.#items.set(sku, { ...item, quantity: Math.min(quantity, MAX_QUANTITY) });
      this.#notify();
    }
  }

  remove(sku) {
    if (this.#items.delete(sku)) {
      this.#notify();
    }
  }

  getQuantity(sku) {
    return this.#items.get(sku)?.quantity ?? 0;
  }

  /** Позиции в порядке добавления. */
  getItems() {
    return [...this.#items.values()];
  }

  getTotals() {
    return this.getItems().reduce(
      (totals, { price, quantity }) => ({
        count: totals.count + quantity,
        sum: totals.sum + price * quantity,
      }),
      { count: 0, sum: 0 },
    );
  }

  #notify() {
    this.dispatchEvent(new Event('change'));
  }
}

export const cart = new Cart();
