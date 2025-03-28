const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api';

let selectedOrderId = null;
document.addEventListener('DOMContentLoaded', () => {
  // Обработчик для кнопки просмотра
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('view-button')) {
      const orderId = e.target.dataset.id;
      try {
        const order = await fetchOrderDetails(orderId);
        showOrderDetailsModal(order);
      } catch (error) {
        showNotification('Ошибка загрузки данных', 'error');
      }
    }
  });
});

// Функция для отображения деталей заказа
function showOrderDetailsModal(order) {
  const modalContent = `
    <p><strong>Имя:</strong> ${order.full_name}</p>
    <p><strong>Телефон:</strong> ${order.phone}</p>
    <p><strong>Адрес:</strong> ${order.delivery_address}</p>
    <p><strong>Дата доставки:</strong> ${order.delivery_date}</p>
    <p><strong>Комментарий:</strong> ${order.comment || 'Нет'}</p>
  `;
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3>Детали заказа #${order.id}</h3>
      ${modalContent}
    </div>
  `;
  
  modal.querySelector('.close').addEventListener('click', () => modal.remove());
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Обновите функцию displayOrders
function displayOrders(orders) {
  const tbody = document.querySelector('#orders-table tbody');
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${new Date(order.created_at).toLocaleDateString()}</td>
      <td>${order.good_ids?.join(', ') || 'Нет данных'}</td>
      <td>${order.total || 0} ₽</td>
      <td>${order.delivery_date} ${order.delivery_interval}</td>
      <td class="actions">
        <button class="view-button" data-id="${order.id}">Просмотр</button>
        <button class="edit-button" data-id="${order.id}">Редактировать</button>
        <button class="delete-button" data-id="${order.id}">Удалить</button>
      </td>
    </tr>
  `).join('');
}

// Модальные окна
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const closeButtons = document.querySelectorAll('.close');
const cancelButtons = document.querySelectorAll('.cancel-button');

// Обработчики закрытия модалок
closeButtons.forEach(btn => btn.addEventListener('click', closeModals));
cancelButtons.forEach(btn => btn.addEventListener('click', closeModals));
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) closeModals();
});

function closeModals() {
  editModal.style.display = 'none';
  deleteModal.style.display = 'none';
}

// Загрузка заказов
function loadOrders() {
  fetch(`${API_URL}/orders?api_key=${API_KEY}`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  })
  .then(response => {
    if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
    return response.json();
  })
  .then(data => displayOrders(data))
  .catch(error => {
    showNotification('Ошибка загрузки заказов', 'error');
    console.error(error);
  });
}

// Отображение заказов
function displayOrders(orders) {
  const tbody = document.querySelector('#orders-table tbody');
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>${order.id}</td>
      <td>${new Date(order.created_at).toLocaleDateString()}</td>
      <td>${order.good_ids.join(', ')}</td>
      <td>${order.total || 0} ₽</td>
      <td>${order.delivery_date} ${order.delivery_interval}</td>
      <td class="actions">
        <button class="view-button" data-id="${order.id}">Просмотр</button>
        <button class="edit-button" data-id="${order.id}">Редактировать</button>
        <button class="delete-button" data-id="${order.id}">Удалить</button>
      </td>
    </tr>
  `).join('');
}

// Обработчики кнопок
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('edit-button')) {
    selectedOrderId = e.target.dataset.id;
    loadOrderData(selectedOrderId);
    editModal.style.display = 'block';
  }
  
  if (e.target.classList.contains('delete-button')) {
    selectedOrderId = e.target.dataset.id;
    deleteModal.style.display = 'block';
  }
});

// Загрузка данных для редактирования
async function loadOrderData(orderId) {
  try {
    const order = await fetch(`${API_URL}/orders/${orderId}?api_key=${API_KEY}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    }).then(r => r.json());

    document.getElementById('edit-name').value = order.full_name;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-address').value = order.delivery_address;
    document.getElementById('edit-date').value = order.delivery_date.split('T')[0];
    document.getElementById('edit-time').value = order.delivery_interval;
    document.getElementById('edit-comment').value = order.comment || '';
  } catch (error) {
    showNotification('Ошибка загрузки данных', 'error');
  }
}

// Сохранение изменений
document.getElementById('edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const updatedData = {
    full_name: document.getElementById('edit-name').value,
    phone: document.getElementById('edit-phone').value,
    email: document.getElementById('edit-email').value,
    delivery_address: document.getElementById('edit-address').value,
    delivery_date: document.getElementById('edit-date').value,
    delivery_interval: document.getElementById('edit-time').value,
    comment: document.getElementById('edit-comment').value
  };

  try {
    await fetch(`${API_URL}/orders/${selectedOrderId}?api_key=${API_KEY}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(updatedData)
    });
    showNotification('Заказ обновлен', 'success');
    loadOrders();
    closeModals();
  } catch (error) {
    showNotification('Ошибка обновления', 'error');
  }
});

// Удаление заказа
document.querySelector('.confirm-delete').addEventListener('click', async () => {
  try {
    await fetch(`${API_URL}/orders/${selectedOrderId}?api_key=${API_KEY}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    showNotification('Заказ удален', 'success');
    loadOrders();
    closeModals();
  } catch (error) {
    showNotification('Ошибка удаления', 'error');
  }
});

// Уведомления
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  const container = document.querySelector('.notifications');
  container.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Инициализация
loadOrders();
