const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c'
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api'

function showNotification(message, type) {
  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  notification.textContent = message
  const container = document.querySelector('.notifications')
  if (container) {
    container.appendChild(notification)
  } else {
    const newContainer = document.createElement('div')
    newContainer.className = 'notifications'
    document.body.appendChild(newContainer)
    newContainer.appendChild(notification)
  }
  setTimeout(() => {
    notification.remove()
  }, 5000)
}

function formatDate(date) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${year}.${month}.${day}`
}

function getGoods(page = 1, perPage = 10, query = '') {
  const url = `${API_URL}/goods?api_key=${API_KEY}&page=${page}&per_page=${perPage}&query=${encodeURIComponent(query)}`
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }).then(r => {
    if (!r.ok) throw new Error(`Ошибка HTTP: ${r.status}`)
    return r.json()
  })
}

function getGood(goodId) {
  const url = `${API_URL}/goods/${goodId}?api_key=${API_KEY}`
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }).then(r => {
    if (!r.ok) throw new Error(`Ошибка HTTP: ${r.status}`)
    return r.json()
  })
}

function getAutocomplete(query) {
  const url = `${API_URL}/autocomplete?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }).then(r => {
    if (!r.ok) throw new Error(`Ошибка HTTP: ${r.status}`)
    return r.json()
  })
}

function getOrders() {
  const url = `${API_URL}/orders?api_key=${API_KEY}`
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }).then(r => {
    if (!r.ok) throw new Error(`Ошибка HTTP: ${r.status}`)
    return r.json()
  })
}

function getOrder(orderId) {
  const url = `${API_URL}/orders/${orderId}?api_key=${API_KEY}`
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }).then(r => {
    if (!r.ok) throw new Error(`Ошибка HTTP: ${r.status}`)
    return r.json()
  })
}

function createOrder(orderData) {
  const url = `${API_URL}/orders?api_key=${API_KEY}`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify(orderData)
  }).then(r => {
    if (!r.ok) throw new Error(`Ошибка HTTP: ${r.status}`)
    return r.json()
  })
}

function updateOrder(orderId, updatedData) {
  const url = `${API_URL}/orders/${orderId}?api_key=${API_KEY}`
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify(updatedData)
  }).then(r => {
    if (!r.ok) throw new Error(`Ошибка HTTP: ${r.status}`)
    return r.json()
  })
}

function deleteOrder(orderId) {
  const url = `${API_URL}/orders/${orderId}?api_key=${API_KEY}`
  return fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }).then(r => {
    if (!r.ok) throw new Error(`Ошибка HTTP: ${r.status}`)
    return r.json()
  })
}

function checkoutOrder(e) {
  e.preventDefault()
  const name = document.getElementById('name').value
  const phone = document.getElementById('phone').value
  const email = document.getElementById('email').value
  const address = document.getElementById('address').value
  const deliveryDate = document.getElementById('delivery-date').value
  const deliveryTime = document.getElementById('delivery-time').value
  const comment = document.getElementById('comment').value
  const cartItems = JSON.parse(localStorage.getItem('cart')) || []
  const items = cartItems.map(i => i.id)
  const orderData = {
    full_name: name,
    phone,
    email,
    delivery_address: address,
    delivery_date: formatDate(deliveryDate),
    delivery_interval: deliveryTime,
    comment,
    good_ids: items,
    subscribe: false
  }
  console.log(JSON.stringify(orderData))
  createOrder(orderData).then(data => {
    console.log(JSON.stringify(data))
    if (data.id) {
      localStorage.removeItem('cart')
      showNotification('Заказ успешно оформлен', 'success')
      window.location.href = 'account.html'
    } else {
      showNotification('Ошибка при оформлении заказа', 'error')
    }
  }).catch(err => {
    console.error(err)
    showNotification('Ошибка при оформлении заказа', 'error')
  })
}

const checkoutForm = document.getElementById('checkout-form')
if (checkoutForm) {
  checkoutForm.addEventListener('submit', checkoutOrder)
}
