/**
 * Глобальные хелперы для работы с ценами.
 */

// Копейки показываются, только если они есть: 326,40 ₽, но 1 432 ₽ (без ,00).
// Форматтер сам округляет до копеек, поэтому погрешность float (0.1 + 0.2) не видна.
const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 2,
  trailingZeroDisplay: 'stripIfInteger',
});

/**
 * Форматирует цену в рублях.
 * @example formatPrice(326.4) // "326,40 ₽"
 * @example formatPrice(1432)  // "1 432 ₽"
 */
export function formatPrice(value) {
  return priceFormatter.format(value);
}

/** Есть ли скидка: старая цена задана и больше актуальной. */
export function hasDiscount(price, oldPrice) {
  return Number.isFinite(oldPrice) && oldPrice > price;
}

/** Процент скидки, округлённый до целого. */
export function getDiscountPercent(price, oldPrice) {
  return Math.round((1 - price / oldPrice) * 100);
}

/** Цена за указанное количество граммов (по умолчанию за 100 г). */
export function getUnitPrice(price, weight, unit = 100) {
  return (price / weight) * unit;
}
