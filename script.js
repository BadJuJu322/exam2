const API_KEY = '712cc49a-8b72-4632-9bcb-23d4d9bdbc9c';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api';

let currentPage = 1;
let allProducts = [];
let displayedProducts = [];
const productsPerPage = 10;

// Загрузка товаров
function loadProducts() {
  const url = `${API_URL}/goods?api_key=${API_KEY}`;

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
    console.log('Данные от сервера:', data);
    allProducts = data;
    displayCategories();
    applyFilters();
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
    showNotification('Ошибка при загрузке товаров', 'error');
  });
}

// Отображение категорий
function displayCategories() {
  const categoryList = document.getElementById('category-list');
  const categories = [...new Set(allProducts.map(product => product.main_category))];

  categoryList.innerHTML = categories.map(category => `
    <li>
      <label>
        <input type="checkbox" value="${category}"> ${category}
      </label>
    </li>
  `).join('');
}

// Отображение товаров
function displayProducts(products) {
  const productGrid = document.getElementById('product-grid');
  if (!products || products.length === 0) {
    productGrid.innerHTML = '<p>Нет товаров для отображения.</p>';
    return;
  }

  productGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image_url}" alt="${product.name}">
      <h3>${product.name}</h3>
      <div class="rating">${product.rating.toFixed(1)} ★★★★☆</div>
      <div class="price">
        <span class="discounted">${product.discount_price || product.actual_price} ₽</span>
        ${product.discount_price ? `
          <span class="original">${product.actual_price} ₽</span>
          <span class="discount">-${Math.round((1 - product.discount_price / product.actual_price) * 100)}%</span>
        ` : ''}
      </div>
      <button class="add-to-cart" data-id="${product.id}">Добавить</button>
    </div>
  `).join('');

  // Обработчики для кнопок "Добавить"
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => addToCart(button.dataset.id));
  });
}

// Добавление товара в корзину
function addToCart(productId) {
  const product = allProducts.find(p => p.id == productId);
  if (!product) {
    showNotification('Товар не найден', 'error');
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cart.find(item => item.id == productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.discount_price || product.actual_price, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showNotification('Товар добавлен в корзину', 'success');
}

// Фильтрация и сортировка
function applyFilters() {
  const selectedCategories = Array.from(document.querySelectorAll('#category-list input:checked')).map(checkbox => checkbox.value);
  const minPrice = parseFloat(document.getElementById('price-min').value) || 0;
  const maxPrice = parseFloat(document.getElementById('price-max').value) || Infinity;
  const discountOnly = document.getElementById('discount-only').checked;
  const sortOrder = document.getElementById('sort-select').value;

  let filteredProducts = allProducts.filter(product => {
    const price = product.discount_price || product.actual_price;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.main_category);
    const matchesPrice = price >= minPrice && price <= maxPrice;
    const matchesDiscount = !discountOnly || product.discount_price !== null;
    return matchesCategory && matchesPrice && matchesDiscount;
  });

  switch (sortOrder) {
    case 'price-asc':
      filteredProducts.sort((a, b) => (a.discount_price || a.actual_price) - (b.discount_price || b.actual_price));
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => (b.discount_price || b.actual_price) - (a.discount_price || a.actual_price));
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  displayedProducts = filteredProducts.slice(0, currentPage * productsPerPage);
  displayProducts(displayedProducts);

  const loadMoreButton = document.getElementById('load-more');
  if (filteredProducts.length > displayedProducts.length) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
}

// Загрузка следующей страницы
function loadMoreProducts() {
  currentPage += 1;
  applyFilters();
}

// Уведомления
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

// Инициализация
document.getElementById('apply-filters').addEventListener('click', applyFilters);
document.getElementById('load-more').addEventListener('click', loadMoreProducts);
document.getElementById('sort-select').addEventListener('change', applyFilters);
loadProducts();