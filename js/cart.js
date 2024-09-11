import formatPrice from "./formatPrice.js";
import { addToStorage, getStorage, removeFromStorage } from "./localStorage.js";
import { createOrder } from "./api.js";

const orderBtn = document.querySelector('#order-btn');

orderBtn.addEventListener('click', async () => {
	const data = getStorage('cart');

	const getUniqueObjectsWithCount = (arr) => {
		return arr.reduce((acc, obj) => {
			const found = acc.find(item => item.id === obj.id);
			if (found) {
				found.count += 1;
			} else {
				acc.push({ id: obj.id, count: 1 });
			}
			return acc;
		}, []);
	};

	const uniqueData = getUniqueObjectsWithCount(data);

	try {
		const response = await createOrder('https://zsa-studio.ru/order.php', uniqueData);
		console.log(response); // Проверка, что возвращает сервер
		
		if (response.success === true) {
			console.log('Order successfully created!');
		} else if (response.success === false) {
			console.log('Order creation failed.');
		} else {
			console.log(`Error: ${response.success}`);
		}
	} catch (error) {
		console.error('Error creating order:', error);
	}
});

export const renderCart = () => {
	const data = (getStorage('cart'));

	if (!data?.length) return;

	const countsData = data.reduce((acc, curr) => {
		const id = curr.id;
		if (acc[id]) {
			acc[id]++;
		} else {
			acc[id] = 1;
		}
		return acc;
	}, {});

	const uniqueData = [...new Set(data.map(JSON.stringify))].map(JSON.parse).sort((a, b) => a.id - b.id);

	const targetEl = document.querySelector('.product-cart__list');
	const template = document.querySelector('.product-cart__template').content.querySelector('.product-cart__item');
	const fragment = document.createDocumentFragment();

	targetEl.innerHTML = '';

	uniqueData.forEach(product => {
		const clone = template.cloneNode(true);

		clone.querySelector('.product-cart__input').value = countsData[product.id];
		clone.querySelector('.product-cart__image').src = product.image;
		clone.querySelector('.product-cart__name').textContent = product.name;
		clone.querySelector('.product-cart__price').template = formatPrice(product.price);

		const clickOnBtnOfMinusPlus = (storageEvent, storageEventValue, operator) => {

			const inputEl = clone.querySelector('.product-cart__input');
			const totalEl = document.querySelector('.product-cart__total span');
			const totalPriceEl = document.querySelector('.product-cart__total-price');

			let inputValue = +inputEl.value;
			let totalValue = +totalEl.textContent;
			let totalPriceValue = +totalPriceEl.textContent.replace(/\D/g, '');

			const adjustment = (operator === '+') ? 1 : (operator === '-') ? -1 : null;
			if (!adjustment) return;
			const priceChange = adjustment * product.price;

			if ((inputEl.value = inputValue + adjustment) < 0) {
				inputEl.value = 0;
				return;
			} else inputEl.value = inputValue + adjustment;

			totalEl.textContent = totalValue + adjustment;
			totalPriceEl.textContent = formatPrice(totalPriceValue + priceChange);

			storageEvent('cart', storageEventValue);
		};

		clone.querySelector('.product-cart__button--minus').addEventListener('click', () => {
			clickOnBtnOfMinusPlus(removeFromStorage, product.id, '-');
		});

		clone.querySelector('.product-cart__button--plus').addEventListener('click', () => {
			clickOnBtnOfMinusPlus(addToStorage, product, '+');
		});

		fragment.append(clone);
	});

	targetEl.append(fragment);

	const totalEl = document.querySelector('.product-cart__total span');
	totalEl.textContent = data.length;

	const totalPriceEl = document.querySelector('.product-cart__total-price');
	totalPriceEl.textContent = formatPrice(data.reduce((acc, curr) => acc + Number(curr.price), 0))


	// const totalEl = document.querySelector('.product-cart__btn');


};

renderCart();
