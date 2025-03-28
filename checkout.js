const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api';

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  const container = document.querySelector('.notifications') || document.createElement('div');
  container.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Формат даты: YYYY-MM-DD
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.startsWith('7');
}

function checkoutOrder(e) {
  e.preventDefault();

  // Сбор данных
  const name = document.getElementById('name').value.trim();
  const rawPhone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const deliveryDate = document.getElementById('delivery-date').value;
  const deliveryTime = document.getElementById('delivery-time').value;
  const comment = document.getElementById('comment').value.trim();
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  // Валидация
  if (!name) {
    showNotification('Укажите имя', 'error');
    return;
  }

  if (!validatePhone(rawPhone)) {
    showNotification('Некорректный номер телефона (пример: 79991234567)', 'error');
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    showNotification('Некорректный email', 'error');
    return;
  }

  if (address.length < 5) {
    showNotification('Адрес должен содержать не менее 5 символов', 'error');
    return;
  }

  if (cartItems.length === 0) {
    showNotification('Добавьте товары в корзину', 'error');
    return;
  }

  // Форматирование телефона
  const phone = `+7${rawPhone.replace(/\D/g, '').slice(1)}`;

  // Подготовка данных
  const orderData = {
    full_name: name,
    phone,
    email,
    delivery_address: address,
    delivery_date: formatDate(deliveryDate),
    delivery_interval: deliveryTime,
    comment: comment || null,
    good_ids: cartItems.map(item => item.id),
    subscribe: 0 // Число вместо boolean
  };

  // Отправка запроса
  createOrder(orderData)
    .then(data => {
      if (data.id) {
        localStorage.removeItem('cart');
        showNotification('Заказ успешно оформлен!', 'success');
        window.location.href = 'account.html';
      }
    })
    .catch(err => {
      console.error('Ошибка:', err);
      showNotification(`Ошибка: ${err.message}`, 'error');
    });
}

function createOrder(orderData) {
  return fetch(`${API_URL}/orders?api_key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.error || JSON.stringify(err));
      });
    }
    return response.json();
  });
}

// Инициализация
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', checkoutOrder);
}
