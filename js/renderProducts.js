import formatPrice from './formatPrice.js';
import { addToStorage } from './localStorage.js';
import { renderCart } from './cart.js';

export default (products, template, targetEl) => {
	const fragment = document.createDocumentFragment();

	products.forEach(item => {
		const clone = template.cloneNode(true);
		const button = clone.querySelector('.product-list__button');

		clone.querySelector('.product-list__name').textContent = item.name;
		clone.querySelector('.product-list__price').textContent = formatPrice(item.price);
		clone.querySelector('.product-list__image').src = item.image;
		button.dataset.id = item.id;

		button.addEventListener('click', () => {
			addToStorage('cart', item);
			renderCart();
		});

		fragment.append(clone);
	});
	targetEl.append(fragment);
}