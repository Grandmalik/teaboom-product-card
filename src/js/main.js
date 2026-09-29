import { initFavoriteButton } from './components/favorite-button.js';
import { initLightbox } from './components/lightbox.js';
import { initProductCard } from './components/product-card.js';

document.querySelectorAll('[data-product]').forEach(initProductCard);
document.querySelectorAll('[data-lightbox]').forEach(initLightbox);
document.querySelectorAll('[data-favorite]').forEach(initFavoriteButton);
