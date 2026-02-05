// Payment methods
const paymentMethods = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: 'fa-money-bill'
  },
  {
    id: 'gcash',
    name: 'GCash',
    description: 'Fast and secure mobile payment',
    icon: 'fa-mobile'
  },
  {
    id: 'credit-card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard accepted',
    icon: 'fa-credit-card'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Secure online payment',
    icon: 'fa-paypal'
  }
];

let selectedPaymentMethod = 'cod';
let checkoutData = null;

// Load checkout data from cart
function loadCheckoutData() {
  const data = sessionStorage.getItem('checkoutItems');
  if (data) {
    checkoutData = JSON.parse(data);
    renderOrderSummary();
  } else {
    // Fallback to cart page if no data
    window.location.href = 'cart.html';
  }
}

// Render order summary receipt
function renderOrderSummary() {
  const itemsContainer = document.getElementById('orderItemsReceipt');
  
  const itemsHTML = checkoutData.items.map(item => `
    <div class="receipt-item">
      <span class="receipt-item-name">${item.productName}</span>
      <span class="receipt-item-qty">x${item.quantity}</span>
      <span class="receipt-item-price">₱${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  itemsContainer.innerHTML = itemsHTML;

  // Update totals
  document.getElementById('receiptSubtotal').textContent = '₱' + checkoutData.totals.subtotal.toFixed(2);
  document.getElementById('receiptDeliveryFee').textContent = '₱' + checkoutData.totals.deliveryFee.toFixed(2);
  document.getElementById('receiptTax').textContent = '₱' + checkoutData.totals.tax.toFixed(2);
  document.getElementById('receiptTotal').textContent = '₱' + checkoutData.totals.total.toFixed(2);
}

// Render payment methods
function renderPaymentMethods() {
  const container = document.getElementById('paymentMethods');
  
  container.innerHTML = paymentMethods.map(method => `
    <label class="payment-method ${method.id === selectedPaymentMethod ? 'active' : ''}">
      <input 
        type="radio" 
        name="paymentMethod" 
        value="${method.id}" 
        ${method.id === selectedPaymentMethod ? 'checked' : ''}
      />
      <div class="payment-icon">
        <i class="fa-solid ${method.icon}"></i>
      </div>
      <div class="payment-info">
        <h4>${method.name}</h4>
        <p>${method.description}</p>
      </div>
    </label>
  `).join('');

  // Add event listeners
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedPaymentMethod = e.target.value;
      // Update active state
      document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
      });
      e.target.closest('.payment-method').classList.add('active');
    });
  });
}

// Delivery option handling
document.addEventListener('DOMContentLoaded', () => {
  // Delivery options
  document.querySelectorAll('[data-delivery]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-delivery]').forEach(b => b.classList.remove('active'));
      e.target.closest('[data-delivery]').classList.add('active');
    });
  });

  // Final checkout
  document.getElementById('finalCheckoutBtn').addEventListener('click', () => {
    // Validate form
    const fullName = document.querySelector('input[placeholder*="full name"]').value;
    const phone = document.querySelector('input[placeholder*="phone"]').value;
    const address = document.querySelector('input[placeholder*="address"]').value;

    if (!fullName || !phone || !address) {
      alert('Please fill in all required fields');
      return;
    }

    // Show success message
    alert('Order placed successfully! Payment method: ' + selectedPaymentMethod);
    
    // Clear cart data and redirect to dashboard
    sessionStorage.removeItem('checkoutItems');
    window.location.href = 'clientDashboard.html';
  });

  // Load data
  loadCheckoutData();
  renderPaymentMethods();
});
