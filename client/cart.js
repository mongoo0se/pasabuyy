// Cart data structure (start empty — server will provide real data)
let cartData = { items: [] };

const DELIVERY_FEE = 50;
const TAX_RATE = 0.08;

// Group items by store
function groupItemsByStore() {
  const grouped = {};
  cartData.items.forEach(item => {
    if (!grouped[item.storeId]) {
      grouped[item.storeId] = {
        storeName: item.storeName,
        items: []
      };
    }
    grouped[item.storeId].items.push(item);
  });
  return grouped;
}

// Calculate subtotal
function calculateSubtotal() {
  return cartData.items.reduce((sum, item) => {
    if (item.selected) {
      return sum + (item.price * item.quantity);
    }
    return sum;
  }, 0);
}

// Calculate totals
function calculateTotals() {
  const subtotal = calculateSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + (cartData.items.some(item => item.selected) ? DELIVERY_FEE : 0) + tax;
  
  return {
    subtotal,
    deliveryFee: cartData.items.some(item => item.selected) ? DELIVERY_FEE : 0,
    tax,
    total
  };
}

// Update totals display
function updateTotals() {
  const totals = calculateTotals();
  document.getElementById('subtotal').textContent = '₱' + totals.subtotal.toFixed(2);
  document.getElementById('deliveryFee').textContent = '₱' + totals.deliveryFee.toFixed(2);
  document.getElementById('tax').textContent = '₱' + totals.tax.toFixed(2);
  document.getElementById('totalAmount').textContent = '₱' + totals.total.toFixed(2);
}

// Update checkout button state
function updateCheckoutButtonState() {
  const hasSelected = cartData.items.some(item => item.selected);
  document.getElementById('checkoutBtn').disabled = !hasSelected;
}

// Render cart items
function renderCart() {
  const grouped = groupItemsByStore();
  const container = document.getElementById('cartItemsContainer');
  
  if (cartData.items.length === 0) {
    document.getElementById('cartContent').style.display = 'none';
    document.getElementById('emptyCartState').style.display = 'block';
    return;
  }
  
  document.getElementById('cartContent').style.display = 'block';
  document.getElementById('emptyCartState').style.display = 'none';
  
  container.innerHTML = Object.keys(grouped).map(storeId => {
    const store = grouped[storeId];
    return `
      <div class="store-group">
        <div class="store-header">
          <h3>${store.storeName}</h3>
        </div>
        <div class="store-items">
          ${store.items.map(item => `
            <div class="cart-item">
              <input 
                type="checkbox" 
                class="item-checkbox"
                data-item-id="${item.id}"
                ${item.selected ? 'checked' : ''}
              />
              <div style="display: grid; grid-template-columns: 80px 1fr; gap: 12px; align-items: start;">
                <img src="${item.image}" alt="${item.productName}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;" />
                <div class="item-info">
                  <h4>${item.productName}</h4>
                  <p class="item-price">₱${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                <div class="quantity-control">
                  <button class="quantity-btn" data-item-id="${item.id}" data-action="decrease">−</button>
                  <div class="quantity-display">${item.quantity}</div>
                  <button class="quantity-btn" data-item-id="${item.id}" data-action="increase">+</button>
                </div>
                <div style="color: var(--text-dark); font-weight: 700;">
                  ₱${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  attachEventListeners();
  updateTotals();
}

// Attach event listeners
function attachEventListeners() {
  // Item checkbox listeners
  document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const itemId = parseInt(e.target.dataset.itemId);
      const item = cartData.items.find(i => i.id === itemId);
      if (item) {
        item.selected = e.target.checked;
        updateSelectAllCheckbox();
        updateTotals();
        updateCheckoutButtonState();
      }
    });
  });

  // Quantity buttons
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = parseInt(e.target.dataset.itemId);
      const action = e.target.dataset.action;
      const item = cartData.items.find(i => i.id === itemId);
      
      if (item) {
        if (action === 'increase') {
          item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
          item.quantity -= 1;
        } else if (action === 'decrease' && item.quantity === 1) {
          // Remove item
          cartData.items = cartData.items.filter(i => i.id !== itemId);
        }
        renderCart();
      }
    });
  });
}

// Select/Deselect all
document.getElementById('selectAllCheckbox').addEventListener('change', (e) => {
  const isChecked = e.target.checked;
  cartData.items.forEach(item => {
    item.selected = isChecked;
  });
  renderCart();
  updateCheckoutButtonState();
});

// Update select all checkbox state
function updateSelectAllCheckbox() {
  const allSelected = cartData.items.length > 0 && cartData.items.every(item => item.selected);
  const someSelected = cartData.items.some(item => item.selected);
  
  const checkbox = document.getElementById('selectAllCheckbox');
  checkbox.checked = allSelected;
  checkbox.indeterminate = someSelected && !allSelected;
}

// Checkout button
document.getElementById('checkoutBtn').addEventListener('click', () => {
  const selectedItems = cartData.items.filter(item => item.selected);
  if (selectedItems.length > 0) {
    // Client-side storage removed; integrate server-side checkout to pass selected items
    alert('Selected items will be sent to server for checkout.');
    window.location.href = 'checkout.html';
  }
});

// Initial render
renderCart();
