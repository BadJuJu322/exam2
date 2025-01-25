const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api';

function showNotification(message, type) {
  let notificationsContainer = document.querySelector('.notifications');
  
  if (!notificationsContainer) {
    notificationsContainer = document.createElement('div');
    notificationsContainer.className = 'notifications';
    document.body.prepend(notificationsContainer);
  }

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  notificationsContainer.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function checkoutOrder(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const deliveryDate = document.getElementById('delivery-date').value;
  const deliveryTime = document.getElementById('delivery-time').value;
  const comment = document.getElementById('comment').value;

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const items = cartItems.map(item => parseInt(item.id)); // Числа вместо строк
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderData = {
    full_name: name,
    phone: phone,
    email: email,
    delivery_address: address,
    delivery_date: formatDate(deliveryDate), // Исправленный формат
    delivery_interval: deliveryTime,
    comment: comment,
    good_ids: items,
    subscribe: false
  };

  console.log('Отправляемые данные:', orderData);

  const url = `${API_URL}/orders?api_key=${API_KEY}`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(errData => {
        throw new Error(`Ошибка ${response.status}: ${JSON.stringify(errData)}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Ответ сервера:', data);
    if (data.id) {
      localStorage.removeItem('cart');
      showNotification('✅ Заказ успешно оформлен', 'success');
      setTimeout(() => window.location.href = 'account.html', 1500);
    }
  })
  .catch(error => {
    console.error('Ошибка:', error);
    showNotification(`❌ Ошибка: ${error.message}`, 'error');
  });
}

document.getElementById('checkout-form').addEventListener('submit', checkoutOrder);
