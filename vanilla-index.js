// ========== Configuration ==========
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// ========== State Management ==========
const AppState = {
  currentPage: 'home',
  categories: [],
  products: [],
  cart: [],
  config: {},
  businessHours: [],
  currentProduct: null,
  paymentMethods: [],
  deliveryMethods: [],

  loadCart() {
    const saved = localStorage.getItem('mm-cart');
    return saved ? JSON.parse(saved) : [];
  },

  saveCart() {
    localStorage.setItem('mm-cart', JSON.stringify(this.cart));
  },

  addToCart(product, quantity = 1) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
    this.saveCart();
    this.updateCartUI();
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  },

  updateCartUI() {
    const badge = document.querySelector('.cart-badge');
    const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.textContent = total;
  },

  getCartTotal() {
    return this.cart.reduce((sum, item) => {
      const price = parseFloat(item.precio) || 0;
      return sum + (price * item.quantity);
    }, 0);
  },
};

// ========== API Functions ==========
const API = {
  async fetch(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`[v0] Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  async getCategories() {
    return this.fetch('/categories');
  },

  async getProducts(categoryId = null) {
    const url = categoryId ? `/products?categoria=${categoryId}` : '/products';
    return this.fetch(url);
  },

  async getProduct(productId) {
    return this.fetch(`/products/${productId}`);
  },

  async getSiteConfig() {
    return this.fetch('/site-config');
  },

  async getBusinessHours() {
    return this.fetch('/business-hours');
  },

  async getPaymentMethods() {
    return this.fetch('/payment-methods');
  },

  async getDeliveryMethods() {
    return this.fetch('/delivery-methods');
  },

  async canOrder() {
    return this.fetch('/can-order');
  },
};

// ========== DOM Utilities ==========
const DOM = {
  render(selector, html) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = html;
  },

  append(selector, html) {
    const element = document.querySelector(selector);
    if (element) element.insertAdjacentHTML('beforeend', html);
  },

  on(selector, event, callback) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.addEventListener(event, callback));
  },

  navigateTo(page) {
    AppState.currentPage = page;
    renderPage();
  },
};

// ========== UI Components ==========
function createCategoryCard(category) {
  return `
    <div class="category-card" onclick="DOM.navigateTo('products-${category.id}')">
      <img src="${category.imagen || 'https://via.placeholder.com/150'}" alt="${category.nombre}">
      <div class="category-card-name">${category.nombre}</div>
    </div>
  `;
}

function createProductCard(product) {
  const originalPrice = product.descuento ? parseFloat(product.precio) / (1 - parseFloat(product.descuento) / 100) : null;
  return `
    <div class="product-card">
      <img src="${product.imagen || 'https://via.placeholder.com/200'}" alt="${product.nombre}" class="product-image" onclick="DOM.navigateTo('product-${product.id}')">
      <div class="product-info">
        <div class="product-name" onclick="DOM.navigateTo('product-${product.id}')">${product.nombre}</div>
        <div class="product-description">${product.descripcion || 'Sin descripción'}</div>
        <div class="product-price">
          ${originalPrice ? `<span class="price-original">$${originalPrice.toFixed(2)}</span>` : ''}
          <span class="price-current">$${parseFloat(product.precio).toFixed(2)}</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary" onclick="appAddToCart('${product.id}', '${product.nombre}', ${product.precio})">Agregar</button>
        </div>
      </div>
    </div>
  `;
}

// ========== Page Renderers ==========
async function renderHome() {
  const app = document.getElementById('app');
  
  try {
    const config = AppState.config;
    const categoryCardHtml = AppState.categories
      .filter(cat => cat.visible)
      .map(createCategoryCard)
      .join('');
    
    const featuredProducts = AppState.products.slice(0, 8);
    const productCardHtml = featuredProducts
      .map(createProductCard)
      .join('');

    let closedBanner = '';
    let promoAdditional = '';
    
    const canOrder = await API.canOrder().catch(() => ({ canOrder: true }));
    if (!canOrder.canOrder) {
      closedBanner = '<div class="closed-banner">⏰ Actualmente estamos cerrados. Consulta nuestros horarios.</div>';
    }

    if (config.banner_enabled_config) {
      promoAdditional = `<div class="promo-banner">${config.banner_enabled_config}</div>`;
    }

    app.innerHTML = `
      <div class="app-wrapper">
        ${renderHeader()}
        <div class="main-content">
          <div class="banner">
            <h1>Bienvenido a ${config.site_name || 'M&M Relojes'}</h1>
            <p>Encontrá los mejores relojes y accesorios</p>
          </div>
          ${closedBanner}
          ${promoAdditional}
          <h2 class="section-title">Categorías</h2>
          <div class="categories-grid">${categoryCardHtml}</div>
          <h2 class="section-title">Productos Destacados</h2>
          <div class="products-grid">${productCardHtml}</div>
        </div>
        ${renderFooter()}
      </div>
    `;
  } catch (error) {
    app.innerHTML = `
      <div class="app-wrapper">
        ${renderHeader()}
        <div class="main-content">
          <div class="alert alert-error">Error al cargar la tienda: ${error.message}</div>
        </div>
        ${renderFooter()}
      </div>
    `;
  }
}

async function renderProductsPage(categoryId) {
  const app = document.getElementById('app');
  
  try {
    const category = AppState.categories.find(c => c.id === categoryId);
    const categoryProducts = AppState.products.filter(p => p.categoria === categoryId && p.visible);

    const productCardHtml = categoryProducts
      .map(createProductCard)
      .join('');

    app.innerHTML = `
      <div class="app-wrapper">
        ${renderHeader()}
        <div class="main-content">
          <h1 class="section-title">${category ? category.nombre : 'Productos'}</h1>
          ${categoryProducts.length === 0 ? 
            '<div class="empty-state"><p>No hay productos en esta categoría</p></div>' : 
            `<div class="products-grid">${productCardHtml}</div>`
          }
        </div>
        ${renderFooter()}
      </div>
    `;
  } catch (error) {
    app.innerHTML = `<div class="alert alert-error">Error: ${error.message}</div>`;
  }
}

async function renderProductDetail(productId) {
  const app = document.getElementById('app');
  
  try {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) throw new Error('Producto no encontrado');

    const originalPrice = product.descuento ? parseFloat(product.precio) / (1 - parseFloat(product.descuento) / 100) : null;

    app.innerHTML = `
      <div class="app-wrapper">
        ${renderHeader()}
        <div class="main-content">
          <div class="product-detail">
            <div class="product-gallery">
              <div class="gallery-main">
                <img src="${product.imagen || 'https://via.placeholder.com/400'}" alt="${product.nombre}">
              </div>
            </div>
            <div class="product-details-info">
              <h1>${product.nombre}</h1>
              <p>${product.descripcion || 'Sin descripción'}</p>
              <div class="product-details-price">
                ${originalPrice ? `<span style="text-decoration: line-through; font-size: 18px; color: #999;">$${originalPrice.toFixed(2)}</span><br>` : ''}
                $${parseFloat(product.precio).toFixed(2)}
              </div>
              <div class="quantity-control">
                <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                <input type="number" id="quantity" class="quantity-input" value="1" min="1">
                <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
              </div>
              <button class="btn btn-primary" style="width: 100%; padding: 15px;" onclick="appAddToCart('${product.id}', '${product.nombre}', ${product.precio})">Agregar al Carrito</button>
              <button class="btn btn-secondary" style="width: 100%; padding: 15px; margin-top: 10px;" onclick="DOM.navigateTo('home')">Volver</button>
            </div>
          </div>
        </div>
        ${renderFooter()}
      </div>
    `;
  } catch (error) {
    app.innerHTML = `<div class="alert alert-error">Error: ${error.message}</div>`;
  }
}

async function renderCart() {
  const app = document.getElementById('app');
  
  if (AppState.cart.length === 0) {
    app.innerHTML = `
      <div class="app-wrapper">
        ${renderHeader()}
        <div class="main-content">
          <div class="empty-state">
            <h2>Tu carrito está vacío</h2>
            <button class="btn btn-primary" onclick="DOM.navigateTo('home')">Seguir Comprando</button>
          </div>
        </div>
        ${renderFooter()}
      </div>
    `;
    return;
  }

  const cartItemsHtml = AppState.cart.map(item => `
    <div class="cart-item">
      <img src="${item.imagen || 'https://via.placeholder.com/80'}" alt="${item.nombre}" class="cart-item-image">
      <div>
        <div class="cart-item-name">${item.nombre}</div>
        <div>Cantidad: ${item.quantity}</div>
      </div>
      <div class="cart-item-price">$${(parseFloat(item.precio) * item.quantity).toFixed(2)}</div>
      <button class="cart-remove" onclick="AppState.removeFromCart('${item.id}')">Eliminar</button>
    </div>
  `).join('');

  const total = AppState.getCartTotal();

  app.innerHTML = `
    <div class="app-wrapper">
      ${renderHeader()}
      <div class="main-content">
        <h1 class="section-title">Carrito de Compras</h1>
        <ul class="cart-items">${cartItemsHtml}</ul>
        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${total.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button class="btn btn-primary" style="flex: 1; padding: 15px;" onclick="DOM.navigateTo('checkout')">Finalizar Compra</button>
          <button class="btn btn-secondary" style="flex: 1; padding: 15px;" onclick="DOM.navigateTo('home')">Seguir Comprando</button>
        </div>
      </div>
      ${renderFooter()}
    </div>
  `;
}

async function renderCheckout() {
  const app = document.getElementById('app');
  const config = AppState.config;
  const whatsappUrl = config.contact_whatsapp || 'https://wa.me/5493512100007';

  const paymentOptions = AppState.paymentMethods.map(pm => `
    <div style="margin-bottom: 10px;">
      <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
        <input type="radio" name="payment" value="${pm.id}" required>
        <span>${pm.name}</span>
      </label>
    </div>
  `).join('');

  const deliveryOptions = AppState.deliveryMethods.map(dm => `
    <div class="delivery-option" onclick="selectDelivery('${dm.id}', this)">
      <input type="radio" name="delivery" value="${dm.id}" style="display: none;" ${dm.is_default ? 'checked' : ''}>
      <strong>${dm.name}</strong>
    </div>
  `).join('');

  const total = AppState.getCartTotal();

  app.innerHTML = `
    <div class="app-wrapper">
      ${renderHeader()}
      <div class="main-content checkout-container">
        <h1 class="section-title">Finalizar Pedido</h1>
        
        <div class="checkout-section">
          <h2>Resumen del Pedido</h2>
          ${AppState.cart.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <span>${item.nombre} x${item.quantity}</span>
              <span>$${(parseFloat(item.precio) * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div style="display: flex; justify-content: space-between; padding: 15px 0; font-size: 18px; font-weight: bold; color: #1e4b8e;">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>

        <form id="checkoutForm" onsubmit="submitCheckout(event)">
          <div class="checkout-section">
            <h2>Forma de Entrega</h2>
            <div>${deliveryOptions}</div>
            <div class="address-field" id="addressField">
              <div class="form-group">
                <label>Dirección de Entrega:</label>
                <textarea id="deliveryAddress" placeholder="Ingresa tu dirección completa" required></textarea>
              </div>
            </div>
          </div>

          <div class="checkout-section">
            <h2>Método de Pago</h2>
            ${paymentOptions}
          </div>

          <div class="checkout-section">
            <h2>Tus Datos</h2>
            <div class="form-group">
              <label>Nombre:</label>
              <input type="text" id="customerName" required>
            </div>
            <div class="form-group">
              <label>Teléfono:</label>
              <input type="tel" id="customerPhone" required>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 15px; font-size: 16px;">
            Pedir por WhatsApp
          </button>
          <button type="button" class="btn btn-secondary" style="width: 100%; padding: 15px; margin-top: 10px;" onclick="DOM.navigateTo('cart')">
            Volver al Carrito
          </button>
        </form>
      </div>
      ${renderFooter()}
    </div>
  `;
}

// ========== Header & Footer ==========
function renderHeader() {
  const config = AppState.config;
  const cartCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

  return `
    <header class="header">
      <a href="#" class="header-logo" onclick="DOM.navigateTo('home'); return false;">
        ${config.store_logo ? `<img src="${config.store_logo}" alt="Logo">` : ''}
        ${config.site_name || 'M&M Relojes'}
      </a>
      <div class="nav-menu">
        <a onclick="DOM.navigateTo('home')">Inicio</a>
        ${AppState.categories.filter(c => c.visible).map(c => 
          `<a onclick="DOM.navigateTo('products-${c.id}')">${c.nombre}</a>`
        ).join('')}
      </div>
      <div class="header-actions">
        <button class="cart-icon" onclick="DOM.navigateTo('cart')">
          🛒
          ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
        </button>
      </div>
    </header>
  `;
}

function renderFooter() {
  const config = AppState.config;

  return `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Sobre Nosotros</h3>
          <p>${config.site_name || 'M&M Relojes'}</p>
        </div>
        <div class="footer-section">
          <h3>Contacto</h3>
          <a href="tel:${config.contact_phone || '+5493512100007'}">Teléfono</a>
          <a href="${config.contact_whatsapp || 'https://wa.me/5493512100007'}">WhatsApp</a>
        </div>
        <div class="footer-section">
          <h3>Información</h3>
          <a onclick="DOM.navigateTo('info')">Información</a>
          <a onclick="DOM.navigateTo('hours')">Horarios</a>
          <a onclick="DOM.navigateTo('location')">Ubicación</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 ${config.site_name || 'M&M Relojes'}. Todos los derechos reservados.</p>
      </div>
    </footer>
  `;
}

// ========== Page Router ==========
async function renderPage() {
  const page = AppState.currentPage;

  try {
    if (page === 'home') {
      await renderHome();
    } else if (page.startsWith('products-')) {
      const categoryId = page.replace('products-', '');
      await renderProductsPage(categoryId);
    } else if (page.startsWith('product-')) {
      const productId = page.replace('product-', '');
      await renderProductDetail(productId);
    } else if (page === 'cart') {
      await renderCart();
    } else if (page === 'checkout') {
      await renderCheckout();
    } else {
      await renderHome();
    }
  } catch (error) {
    console.error('[v0] Error rendering page:', error);
    document.getElementById('app').innerHTML = `
      <div class="alert alert-error">Error al cargar la página: ${error.message}</div>
    `;
  }
}

// ========== Event Handlers ==========
function appAddToCart(productId, productName, price) {
  const quantity = document.getElementById('quantity') ? parseInt(document.getElementById('quantity').value) : 1;
  const product = AppState.products.find(p => p.id === productId);
  if (product) {
    for (let i = 0; i < quantity; i++) {
      AppState.addToCart(product);
    }
    showNotification(`${productName} agregado al carrito`);
  }
}

function changeQuantity(change) {
  const input = document.getElementById('quantity');
  if (input) {
    const newValue = Math.max(1, parseInt(input.value) + change);
    input.value = newValue;
  }
}

function selectDelivery(deliveryId, element) {
  document.querySelectorAll('.delivery-option').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
  document.querySelector(`input[name="delivery"][value="${deliveryId}"]`).checked = true;
  
  const addressField = document.getElementById('addressField');
  const addressInput = document.getElementById('deliveryAddress');
  
  const delivery = AppState.deliveryMethods.find(d => d.id.toString() === deliveryId);
  if (delivery && delivery.name.toLowerCase().includes('envío')) {
    addressField.classList.add('active');
    addressInput.required = true;
  } else {
    addressField.classList.remove('active');
    addressInput.required = false;
  }
}

function submitCheckout(event) {
  event.preventDefault();

  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const payment = document.querySelector('input[name="payment"]:checked')?.value;
  const delivery = document.querySelector('input[name="delivery"]:checked')?.value;
  const address = document.getElementById('deliveryAddress')?.value || '';

  if (!name || !phone || !payment || !delivery) {
    showNotification('Por favor completa todos los campos', 'error');
    return;
  }

  const message = AppState.cart.map(item => 
    `${item.nombre} x${item.quantity} - $${(parseFloat(item.precio) * item.quantity).toFixed(2)}`
  ).join('\n');

  const total = AppState.getCartTotal();
  
  const fullMessage = `Hola, deseo realizar el siguiente pedido:\n\n${message}\n\nTotal: $${total.toFixed(2)}\n\nDatos del cliente:\nNombre: ${name}\nTeléfono: ${phone}\nMétodo de pago: ${payment}\nForma de entrega: ${delivery}${address ? `\nDirección: ${address}` : ''}`;

  const config = AppState.config;
  const whatsappUrl = config.contact_whatsapp || 'https://wa.me/5493512100007';
  const encodedMessage = encodeURIComponent(fullMessage);

  window.open(`${whatsappUrl}?text=${encodedMessage}`, '_blank');
  
  AppState.cart = [];
  AppState.saveCart();
  showNotification('Pedido enviado. ¡Gracias por tu compra!', 'success');
  setTimeout(() => DOM.navigateTo('home'), 2000);
}

function showNotification(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
  alert.textContent = message;
  alert.style.position = 'fixed';
  alert.style.top = '20px';
  alert.style.right = '20px';
  alert.style.zIndex = '2000';
  alert.style.maxWidth = '300px';
  document.body.appendChild(alert);
  
  setTimeout(() => alert.remove(), 3000);
}

// ========== Initialization ==========
async function initApp() {
  try {
    // Load all data
    AppState.categories = await API.getCategories();
    AppState.products = await API.getProducts();
    AppState.config = await API.getSiteConfig();
    AppState.paymentMethods = await API.getPaymentMethods();
    AppState.deliveryMethods = await API.getDeliveryMethods();
    AppState.businessHours = await API.getBusinessHours();
    
    // Load cart
    AppState.cart = AppState.loadCart();
    AppState.updateCartUI();

    // Apply theme colors
    const colors = AppState.config;
    if (colors.color_primario) {
      document.documentElement.style.setProperty('--color-primario', colors.color_primario);
    }
    if (colors.color_secundario) {
      document.documentElement.style.setProperty('--color-secundario', colors.color_secundario);
    }
    if (colors.color_acento) {
      document.documentElement.style.setProperty('--color-acento', colors.color_acento);
    }

    // Render initial page
    await renderPage();
  } catch (error) {
    console.error('[v0] Error initializing app:', error);
    document.getElementById('app').innerHTML = `
      <div class="alert alert-error">Error al cargar la aplicación. Por favor recarga la página.</div>
    `;
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
