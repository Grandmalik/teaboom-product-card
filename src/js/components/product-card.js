import { formatPrice, getDiscountPercent, getUnitPrice, hasDiscount } from '../helpers/price.js';
import { cart } from '../services/cart.js';
import { initQuantity } from './quantity.js';

const ADDED_STATE_DURATION = 2000;
const UNIT_WEIGHT = 100;

const SELECTORS = {
  form: '[data-product-form]',
  variant: 'input[name="variant"]',
  variantBadge: '[data-variant-badge]',
  variantBadgeCount: '[data-variant-badge-count]',
  quantity: '[data-quantity]',
  cartButton: '[data-add-to-cart]',
  cartLabel: '[data-add-to-cart-label]',
  cartIcon: '[data-add-to-cart-icon]',
};

/** Элементы, которые перерисовываются при смене фасовки (их может быть несколько). */
const FIELD_SELECTORS = {
  sku: '[data-product-sku]',
  price: '[data-product-price]',
  oldPrice: '[data-product-old-price]',
  discount: '[data-product-discount]',
  unitPrice: '[data-product-unit-price]',
  discountOnly: '[data-discount-only]',
  unitPriceOnly: '[data-unit-price-only]',
};

/** Собирает данные фасовки из data-атрибутов radio-кнопки. */
function readVariant(input) {
  return {
    sku: input.value,
    name: `${input.dataset.weight} г`,
    weight: Number(input.dataset.weight),
    price: Number(input.dataset.price),
    oldPrice: Number(input.dataset.oldPrice),
  };
}

function setText(elements, text) {
  elements.forEach((element) => {
    element.textContent = text;
  });
}

function setHidden(elements, isHidden) {
  elements.forEach((element) => {
    element.hidden = isHidden;
  });
}

/** Скрывает элементы, сохраняя их место в раскладке, чтобы соседние блоки не прыгали. */
function setInvisible(elements, isInvisible) {
  elements.forEach((element) => {
    element.classList.toggle('is-invisible', isInvisible);
  });
}

/**
 * Карточка товара: переключение фасовки, добавление в корзину нужного количества
 * и отметки на фасовках, сколько штук каждой уже в корзине.
 * @param {HTMLElement} root — элемент с атрибутом data-product
 */
export function initProductCard(root) {
  const form = root.querySelector(SELECTORS.form);

  if (!form) {
    return;
  }

  const refs = Object.fromEntries(
    Object.entries(FIELD_SELECTORS).map(([key, selector]) => [key, root.querySelectorAll(selector)]),
  );
  const variantInputs = form.querySelectorAll(SELECTORS.variant);
  const quantity = initQuantity(form.querySelector(SELECTORS.quantity));
  const cartButton = form.querySelector(SELECTORS.cartButton);
  const cartLabel = cartButton.querySelector(SELECTORS.cartLabel);
  const cartIcon = cartButton.querySelector(SELECTORS.cartIcon);
  const defaultCartLabel = cartLabel.textContent;
  let addedStateTimer;

  function getSelectedVariant() {
    return readVariant(form.querySelector(`${SELECTORS.variant}:checked`));
  }

  function render({ sku, weight, price, oldPrice }) {
    const isDiscounted = hasDiscount(price, oldPrice);
    const showUnitPrice = weight > UNIT_WEIGHT;

    setText(refs.sku, sku);
    setText(refs.price, formatPrice(price));

    setHidden(refs.discountOnly, !isDiscounted);
    if (isDiscounted) {
      setText(refs.oldPrice, formatPrice(oldPrice));
      setText(refs.discount, `−${getDiscountPercent(price, oldPrice)}%`);
    }

    setInvisible(refs.unitPriceOnly, !showUnitPrice);
    if (showUnitPrice) {
      setText(refs.unitPrice, formatPrice(getUnitPrice(price, weight, UNIT_WEIGHT)));
    }
  }

  function renderCartBadges() {
    variantInputs.forEach((input) => {
      const badge = input.parentElement.querySelector(SELECTORS.variantBadge);
      const count = cart.getQuantity(input.value);

      badge.hidden = count === 0;
      badge.querySelector(SELECTORS.variantBadgeCount).textContent = count;
    });
  }

  function setAddedState(isAdded) {
    cartButton.classList.toggle('is-added', isAdded);
    cartLabel.textContent = isAdded ? 'Добавлено' : defaultCartLabel;
    cartIcon.setAttribute('href', isAdded ? '#icon-check' : '#icon-cart');
  }

  function handleVariantChange(event) {
    if (event.target.matches(SELECTORS.variant)) {
      clearTimeout(addedStateTimer);
      setAddedState(false);
      render(readVariant(event.target));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    cart.add(getSelectedVariant(), quantity.value);
    quantity.value = 1;

    setAddedState(true);
    clearTimeout(addedStateTimer);
    addedStateTimer = setTimeout(() => setAddedState(false), ADDED_STATE_DURATION);
  }

  form.addEventListener('change', handleVariantChange);
  form.addEventListener('submit', handleSubmit);
  cart.addEventListener('change', renderCartBadges);

  // Синхронизируем интерфейс с выбранной фасовкой (браузер может восстановить выбор после «Назад»).
  render(getSelectedVariant());
  renderCartBadges();
}
