const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api';

/**
 * Функция для вывода уведомлений
 */
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  const notificationsContainer = document.querySelector('.notifications');
  if (notificationsContainer) {
    notificationsContainer.appendChild(notification);
  } else {
    // Если на странице нет контейнера для нотификаций,
    // можно добавить его динамически
    const newContainer = document.createElement('div');
    newContainer.className = 'notifications';
    document.body.appendChild(newContainer);
    newContainer.appendChild(notification);
  }

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Функция для форматирования даты в формат DD.MM.YYYY
 * Если ваш сервер ожидает YYYY-MM-DD, замените на соответствующий формат.
 */
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return ${year}-${month}-${day}; // Формат YYYY-MM-DD
}

// ==========================
//  Методы получения данных (GET)
// ==========================

/**
 * Получить список товаров
 * @param {number} [page=1] - номер страницы
 * @param {number} [perPage=10] - кол-во товаров на странице
 * @param {string} [query=''] - строка поиска
 * @returns {Promise<Array>} - массив товаров
 */
function getGoods(page = 1, perPage = 10, query = '') {
  const url = `${API_URL}/goods?api_key=${API_KEY}&page=${page}&per_page=${perPage}&query=${encodeURIComponent(query)}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',         // ВАЖНО: Указываем, что ждем JSON-ответ
      'Authorization': `Bearer ${API_KEY}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

/**
 * Получить данные конкретного товара по ID
 * @param {number|string} goodId
 * @returns {Promise<Object>}
 */
function getGood(goodId) {
  const url = `${API_URL}/goods/${goodId}?api_key=${API_KEY}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

/**
 * Получить варианты автодополнения поискового запроса
 * @param {string} query - часть поискового запроса
 * @returns {Promise<Array<string>>}
 */
function getAutocomplete(query) {
  const url = `${API_URL}/autocomplete?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

/**
 * Получить список заказов
 * @returns {Promise<Array>}
 */
function getOrders() {
  const url = `${API_URL}/orders?api_key=${API_KEY}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

/**
 * Получить данные конкретного заказа
 * @param {number|string} orderId
 * @returns {Promise<Object>}
 */
function getOrder(orderId) {
  const url = `${API_URL}/orders/${orderId}?api_key=${API_KEY}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

// ==========================
//  Методы создания/редактирования/удаления заказов (POST/PUT/DELETE)
// ==========================

/**
 * Создание заказа (общий метод).
 * Если у вас уже есть checkoutOrder, можно использовать эту функцию
 * для переиспользования.
 * @param {Object} orderData - объект с данными заказа
 * @returns {Promise<Object>} - созданный заказ
 */
function createOrder(orderData) {
  const url = `${API_URL}/orders?api_key=${API_KEY}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

/**
 * Редактирование заказа (PUT)
 * @param {number|string} orderId
 * @param {Object} updatedData - обновлённые данные (частичные или полные)
 * @returns {Promise<Object>} - изменённый заказ
 */
function updateOrder(orderId, updatedData) {
  const url = `${API_URL}/orders/${orderId}?api_key=${API_KEY}`;

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(updatedData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

/**
 * Удаление заказа (DELETE)
 * @param {number|string} orderId
 * @returns {Promise<Object>} - ответ сервера (например, удалённый заказ)
 */
function deleteOrder(orderId) {
  const url = `${API_URL}/orders/${orderId}?api_key=${API_KEY}`;

  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return response.json();
  });
}

// ==========================
//  Оформление заказа (checkoutOrder) - ваша изначальная логика
// ==========================

/**
 * Обработчик отправки формы
 * Оформляет заказ, используя данные из формы
 */
function checkoutOrder(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const deliveryDate = document.getElementById('delivery-date').value;
  const deliveryTime = document.getElementById('delivery-time').value;
  const comment = document.getElementById('comment').value;

  // Получаем товары из "корзины" (если таковая реализована)
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const items = cartItems.map(item => item.id);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Формируем объект данных для заказа
  const orderData = {
    full_name: name,
    phone: phone,
    email: email,
    delivery_address: address,
    delivery_date: formatDate(deliveryDate), // формат DD.MM.YYYY (проверьте, что сервер принимает такой)
    delivery_interval: deliveryTime,         // убедитесь, что сервер ожидает именно "delivery_interval"
    comment: comment,
    good_ids: items,
    subscribe: false
  };

  console.log('Данные для отправки:', orderData);

  // Отправка POST-запроса (создание заказа) через createOrder (или напрямую)
  createOrder(orderData)
    .then(data => {
      console.log('Ответ от сервера:', data);
      if (data.id) {
        // Если сервер возвращает ID созданного заказа, считаем, что успех
        localStorage.removeItem('cart');
        showNotification('Заказ успешно оформлен', 'success');
        // Переадресуем, например, в личный кабинет
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

// Вешаем обработчик на форму (если такой элемент есть на странице)
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', checkoutOrder);
}
