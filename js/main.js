const products = [
  {
    id: 'brake-pads',
    name: 'Тормозные колодки',
    category: 'Тормозная система',
    price: 2500,
    image: 'images/kolodki.webp',
    description: 'Комплект передних тормозных колодок для популярных легковых автомобилей.'
  },
  {
    id: 'oil-filter',
    name: 'Масляный фильтр',
    category: 'Фильтры',
    price: 700,
    image: 'images/masl_filtr.webp',
    description: 'Фильтр для защиты двигателя от загрязнений и продления срока службы масла.'
  },
  {
    id: 'air-filter',
    name: 'Воздушный фильтр',
    category: 'Фильтры',
    price: 950,
    image: 'images/air-filtr.webp',
    description: 'Воздушный фильтр для стабильной работы двигателя и снижения расхода топлива.'
  },
  {
    id: 'shock-absorber',
    name: 'Амортизатор',
    category: 'Подвеска',
    price: 4900,
    image: 'images/amoriki.webp',
    description: 'Передний или задний амортизатор для комфортной и безопасной езды.'
  },
  {
    id: 'spark-plugs',
    name: 'Свечи зажигания',
    category: 'Двигатель',
    price: 1200,
    image: 'images/svechi.webp',
    description: 'Комплект свечей зажигания для стабильного запуска двигателя.'
  },
  {
    id: 'battery',
    name: 'Аккумулятор 60 А·ч',
    category: 'Электрика',
    price: 7200,
    image: 'images/carbattery.webp',
    description: 'Надёжный аккумулятор для городского режима и поездок на дальние расстояния.'
  },
  {
    id: 'wipers',
    name: 'Щётки стеклоочистителя',
    category: 'Кузов и стекло',
    price: 1100,
    image: 'images/schetki.webp',
    description: 'Комплект щёток для чистого обзора в дождь и снег.'
  },
  {
    id: 'engine-oil',
    name: 'Моторное масло 5W-30',
    category: 'Масла и жидкости',
    price: 3200,
    image: 'images/motor-maslo.webp',
    description: 'Синтетическое моторное масло для бензиновых и дизельных двигателей.'
  }
];

const formatPrice = (value) => `${value.toLocaleString('ru-RU')} ₽`;

const getCart = () => JSON.parse(localStorage.getItem('autoparts_cart') || '[]');
const saveCart = (cart) => localStorage.setItem('autoparts_cart', JSON.stringify(cart));

function updateCartCount() {
  const countElement = document.querySelector('[data-cart-count]');
  if (!countElement) return;
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  countElement.textContent = count;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  alert('Товар добавлен в корзину');
}

function renderProducts(list = products) {
  const catalog = document.querySelector('[data-catalog]');
  if (!catalog) return;

  catalog.innerHTML = list.map((product) => `
    <article class="product-card">
      <div class="product-image"><img src="${product.image}" alt="${product.name}"></div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">${formatPrice(product.price)}</div>
      <div class="product-actions">
        <a class="btn secondary" href="product.html?id=${product.id}">Подробнее</a>
        <button class="btn" type="button" onclick="addToCart('${product.id}')">В корзину</button>
      </div>
    </article>
  `).join('');
}

function setupCatalogFilters() {
  const search = document.querySelector('[data-search]');
  const category = document.querySelector('[data-category]');
  if (!search || !category) return;

  const apply = () => {
    const query = search.value.trim().toLowerCase();
    const selectedCategory = category.value;

    const filtered = products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });

    renderProducts(filtered);
  };

  search.addEventListener('input', apply);
  category.addEventListener('change', apply);
}

function renderProductDetail() {
  const productBox = document.querySelector('[data-product-detail]');
  if (!productBox) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || 'brake-pads';
  const product = products.find((item) => item.id === productId) || products[0];

  document.title = `${product.name} — AutoParts`;
  productBox.innerHTML = `
    <div class="big-product-image"><img src="${product.image}" alt="${product.name}"></div>
    <div class="product-info">
      <div class="breadcrumbs"><a href="catalog.html">Каталог</a> / ${product.category}</div>
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <div class="product-price">${formatPrice(product.price)}</div>
      <ul>
        <li>Подбор по VIN-коду автомобиля</li>
        <li>Есть оригинальные варианты и аналоги</li>
        <li>Самовывоз или доставка по городу</li>
        <li>Консультация перед покупкой</li>
      </ul>
      <div class="actions">
        <button class="btn" type="button" onclick="addToCart('${product.id}')">Добавить в корзину</button>
        <a class="btn secondary" href="contacts.html">Задать вопрос</a>
      </div>
    </div>
  `;
}

function changeQty(productId, delta) {
  let cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function clearCart() {
  saveCart([]);
  renderCart();
  updateCartCount();
}

function renderCart() {
  const cartBox = document.querySelector('[data-cart]');
  if (!cartBox) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartBox.innerHTML = `
      <p>Корзина пока пустая. Добавьте товары из каталога.</p>
      <a class="btn" href="catalog.html">Перейти в каталог</a>
    `;
    return;
  }

  let total = 0;

  const rows = cart.map((item) => {
    const product = products.find((productItem) => productItem.id === item.id);
    if (!product) return '';
    const sum = product.price * item.qty;
    total += sum;

    return `
      <div class="cart-row">
      <div class="cart-item-left">
      <div class="cart-item-image">
      <img src="${product.image}" alt="${product.name}">
      </div>
          <strong>${product.name}</strong><br>
          <small>${product.category} · ${formatPrice(product.price)} за шт.</small>
        </div>
        <div class="qty">
          <button type="button" onclick="changeQty('${product.id}', -1)">−</button>
          <strong>${item.qty}</strong>
          <button type="button" onclick="changeQty('${product.id}', 1)">+</button>
        </div>
        <button class="remove-btn" type="button" onclick="removeFromCart('${product.id}')">Удалить</button>
      </div>
    `;
  }).join('');

  cartBox.innerHTML = `
    ${rows}
    <div class="cart-total">
      <span>Итого:</span>
      <span>${formatPrice(total)}</span>
    </div>
    <div class="actions" style="margin-top: 18px;">
      <a class="btn" href="contacts.html">Оформить заявку</a>
      <button class="btn secondary" type="button" onclick="clearCart()">Очистить корзину</button>
    </div>
  `;
}

function setupForms() {
  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Заявка отправлена! В реальном сайте здесь подключается сервер или CRM.');
      form.reset();
    });
  });
}

function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach((link) => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProducts();
  setupCatalogFilters();
  renderProductDetail();
  renderCart();
  setupForms();
  setActiveNav();
});
