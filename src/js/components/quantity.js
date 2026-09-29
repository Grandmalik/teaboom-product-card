/**
 * Счётчик количества: кнопки «−»/«+», стрелки ↑/↓ и ручной ввод.
 * Значение всегда в пределах data-min…data-max у поля. Любое изменение
 * сообщается обычным событием 'change' на поле ввода (всплывает).
 * @param {HTMLElement} root — элемент с атрибутом data-quantity
 * @returns {{ value: number }} — текущее значение, можно и присвоить
 */
export function initQuantity(root) {
  const input = root.querySelector('[data-quantity-input]');
  const decrease = root.querySelector('[data-quantity-step="-1"]');
  const increase = root.querySelector('[data-quantity-step="1"]');
  const min = Number(input.dataset.min);
  const max = Number(input.dataset.max);

  function clamp(value) {
    const number = Number.parseInt(value, 10);

    return Number.isNaN(number) ? min : Math.min(Math.max(number, min), max);
  }

  // aria-disabled вместо disabled: кнопка остаётся в фокусе, когда упирается в границу.
  function setValue(value, { notify = false } = {}) {
    input.value = clamp(value);
    decrease.setAttribute('aria-disabled', String(Number(input.value) <= min));
    increase.setAttribute('aria-disabled', String(Number(input.value) >= max));

    if (notify) {
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function step(delta) {
    const next = clamp(Number(input.value) + delta);

    if (next !== Number(input.value)) {
      setValue(next, { notify: true });
    }
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-quantity-step]');

    if (button) {
      step(Number(button.dataset.quantityStep));
    }
  });

  input.addEventListener('keydown', (event) => {
    const deltas = { ArrowUp: 1, ArrowDown: -1 };

    if (event.key in deltas) {
      event.preventDefault();
      step(deltas[event.key]);
    }
  });

  // Только цифры при вводе, границы — при подтверждении значения.
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '');
  });
  input.addEventListener('change', () => setValue(input.value));

  setValue(input.value);

  return {
    get value() {
      return Number(input.value);
    },
    set value(value) {
      setValue(value);
    },
  };
}
