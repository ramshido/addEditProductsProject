export const getProducts = async (url) => {
	const response = await fetch(url);
	return await response.json();
};

export const createOrder = async (url, data) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	return await response.json();

};
// {success: false}
// {success: true}
// если пришел неверный массив
// {success: error}

