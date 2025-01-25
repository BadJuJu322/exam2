const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api';

// Функция для уведомлений
function showNotification(message, type) {
  const notificationsContainer = document.querySelector('.notifications') || createNotificationContainer();
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notificationsContainer.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

function createNotificationContainer() {
  const container = document.createElement('div');
  container.className = 'notifications';
  document.body.prepend(container);
  return container;
}

// Форматирование даты в dd.mm.yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Проверка обязательных полей
function validateForm() {
  const requiredFields = ['name', 'phone', 'email', 'address', 'delivery-date', 'delivery-time'];
  return requiredFields.every(field => 
    document.getElementById(field).value.trim() !== ''
  );
}

// Отправка заказа
async function checkoutOrder(event) {
  event.preventDefault();

  if (!validateForm()) {
    showNotification('Заполните все обязательные поля!', 'error');
    return;
  }

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  if (cartItems.length === 0) {
    showNotification('Корзина пуста!', 'error');
    return;
  }

  const orderData = {
    full_name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    delivery_address: document.getElementById('address').value.trim(),
    delivery_date: formatDate(document.getElementById('delivery-date').value),
    delivery_interval: document.getElementById('delivery-time').value,
    comment: document.getElementById('comment').value.trim(),
    good_ids: cartItems.map(item => parseInt(item.id)), // Числовые ID
    subscribe: false
  };

  try {
    const response = await fetch(`${API_URL}/orders?api_key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP Error ${response.status}`);
    }

    localStorage.removeItem('cart');
    showNotification('Заказ успешно оформлен!', 'success');
    setTimeout(() => window.location.href = 'account.html', 1500);

  } catch (error) {
    console.error('Ошибка:', error);
    showNotification(`Ошибка: ${error.message}`, 'error');
  }
}

// Инициализация
document.getElementById('checkout-form').addEventListener('submit', checkoutOrder);
