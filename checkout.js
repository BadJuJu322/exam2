const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api';

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  const notificationsContainer = document.querySelector('.notifications');
  notificationsContainer.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
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
  const items = cartItems.map(item => item.id);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderData = {
    full_name: name,
    phone: phone,
    email: email,
    delivery_address: address,
    delivery_date: formatDate(deliveryDate),
    delivery_interval: deliveryTime,
    comment: comment,
    good_ids: items,
    subscribe: false
  };

  console.log('Данные для отправки:', orderData);

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
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Ответ от сервера:', data);
    if (data.id) {
      localStorage.removeItem('cart');
      showNotification('Заказ успешно оформлен', 'success');
      window.location.href = 'account.html';
    } else {
      showNotification('Ошибка при оформлении заказа', 'error');
    }
  })
  .catch(error => {
    console.error('Ошибка при оформлении заказа:', error);
    showNotification('Ошибка при оформлении заказа', 'error');
  });
}

document.getElementById('checkout-form').addEventListener('submit', checkoutOrder);
