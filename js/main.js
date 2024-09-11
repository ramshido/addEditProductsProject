import { getProducts } from "./api.js";
import renderProducts from "./renderProducts.js";
import "./cart.js";

(async () => {
	const products = await getProducts('https://zsa-studio.ru/catalog.php');

	const template = document.querySelector('.product-list__template')
	.content.querySelector('.product-list__item');

	const list = document.querySelector('.product-list');

	renderProducts(products, template, list);
})();