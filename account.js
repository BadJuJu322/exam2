const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api';

// Функция для загрузки заказов
function loadOrders() {
  const url = `${API_URL}/orders?api_key=${API_KEY}`;

  fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Заказы от сервера:', data); // Логируем заказы
    displayOrders(data);
  })
  .catch(error => {
    console.error('Ошибка при загрузке заказов:', error);
    showNotification('Ошибка при загрузке заказов', 'error');
  });
}

// Функция для отображения заказов
function displayOrders(orders) {
  const ordersTable = document.getElementById('orders-table').getElementsByTagName('tbody')[0];
  ordersTable.innerHTML = orders.map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${new Date(order.created_at).toLocaleDateString()}</td>
      <td>${order.good_ids.join(', ')}</td>
      <td>${order.total} ₽</td>
      <td>${order.delivery_date} ${order.delivery_interval}</td>
      <td class="actions">
        <button class="view-button" data-id="${order.id}">Просмотр</button>
        <button class="edit-button" data-id="${order.id}">Редактировать</button>
        <button class="delete-button" data-id="${order.id}">Удалить</button>
      </td>
    </tr>
  `).join('');
}

// Инициализация
loadOrders();