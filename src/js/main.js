import { initCartSummary } from './components/cart-summary.js';
import { initCollapsible } from './components/collapsible.js';
import { initFavoriteButton } from './components/favorite-button.js';
import { initLightbox } from './components/lightbox.js';
import { initProductCard } from './components/product-card.js';
import { initTabs } from './components/tabs.js';

document.querySelectorAll('[data-product]').forEach(initProductCard);
document.querySelectorAll('[data-cart-summary]').forEach(initCartSummary);
document.querySelectorAll('[data-lightbox]').forEach(initLightbox);
document.querySelectorAll('[data-favorite]').forEach(initFavoriteButton);
document.querySelectorAll('[data-tabs]').forEach(initTabs);
document.querySelectorAll('[data-collapsible]').forEach(initCollapsible);
