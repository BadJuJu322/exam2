// Отображение товаров в корзине
function displayCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');

  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p>Корзина пуста. Перейдите в каталог, чтобы добавить товары.</p>';
    totalPriceElement.textContent = '0 ₽';
    return;
  }

  cartItems.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.image_url}" alt="${item.name}">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p class="price">${item.price} ₽</p>
        <p>Количество: ${item.quantity}</p>
      </div>
      <button class="remove-button" onclick="removeFromCart(${index})">Удалить</button>
    `;
    cartItemsContainer.appendChild(cartItem);
    totalPrice += item.price * item.quantity;
  });

  totalPriceElement.textContent = `${totalPrice} ₽`;
}

// Удаление товара из корзины
function removeFromCart(index) {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  displayCartItems();
}

// Инициализация
displayCartItems();
