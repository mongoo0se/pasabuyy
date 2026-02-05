// Payment methods data
let paymentMethods = [
  {
    id: 1,
    type: 'credit-card',
    name: 'Visa',
    cardNumber: '4532 •••• •••• 1234',
    fullNumber: '4532123456789012',
    holder: 'John Doe',
    expiry: '12/25'
  },
  {
    id: 2,
    type: 'credit-card',
    name: 'Mastercard',
    cardNumber: '5425 •••• •••• 5678',
    fullNumber: '5425234567890123',
    holder: 'John Doe',
    expiry: '08/26'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = btn.dataset.tab;
      switchTab(tabName);
    });
  });

  // Avatar upload
  document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
    document.getElementById('avatarInput').click();
  });

  document.getElementById('avatarInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatarDisplay = document.getElementById('profileAvatarDisplay');
        avatarDisplay.innerHTML = `<img src="${event.target.result}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // Personal Info Save
  document.getElementById('savePersonalBtn').addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;

    if (!fullName || !email) {
      alert('Please fill in all required fields');
      return;
    }

    // Update header name
    document.querySelector('.profile-name').textContent = fullName;
    document.querySelector('.profile-email').textContent = email;

    // Show success message
    showSuccessMessage('personalSuccessMsg');
  });

  // Payment method rendering
  renderPaymentCards();
  renderPaymentMethodOptions();

  // Payment Method Modal
  const paymentModal = document.getElementById('paymentModal');
  const paymentModalClose = document.getElementById('paymentModalClose');
  const paymentModalClose2 = document.getElementById('paymentModalClose2');

  paymentModalClose.addEventListener('click', () => {
    paymentModal.classList.remove('show');
  });

  paymentModalClose2.addEventListener('click', () => {
    paymentModal.classList.remove('show');
  });

  document.getElementById('addCardBtn').addEventListener('click', () => {
    const cardholderName = document.getElementById('cardholderName').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      alert('Please fill in all fields');
      return;
    }

    // Add new payment method
    paymentMethods.push({
      id: paymentMethods.length + 1,
      type: 'credit-card',
      name: 'Card',
      cardNumber: cardNumber.slice(-4).padStart(16, '•'),
      fullNumber: cardNumber,
      holder: cardholderName,
      expiry: expiryDate
    });

    // Clear form
    document.getElementById('cardholderName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('cvv').value = '';

    // Close modal
    paymentModal.classList.remove('show');

    // Re-render cards
    renderPaymentCards();

    // Show success message
    showSuccessMessage('paymentSuccessMsg');
  });

  // Card number formatting
  document.getElementById('cardNumber').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = formattedValue;
  });

  // Expiry date formatting
  document.getElementById('expiryDate').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
  });

  // Change password
  document.getElementById('changePasswordBtn').addEventListener('click', () => {
    const currentPassword = document.querySelectorAll('input[type="password"]')[0].value;
    const newPassword = document.querySelectorAll('input[type="password"]')[1].value;
    const confirmPassword = document.querySelectorAll('input[type="password"]')[2].value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Reset form
    resetSecurityForm();

    // Show success message
    showSuccessMessage('securitySuccessMsg');
  });

  // Wallet setup buttons
  document.getElementById('addGCashBtn').addEventListener('click', () => {
    alert('Opening GCash linking flow...\nIn a real app, this would open GCash\'s authentication.');
    showSuccessMessage('walletSuccessMsg');
  });

  document.getElementById('addApplePayBtn').addEventListener('click', () => {
    alert('Opening Apple Pay setup...\nIn a real app, this would initiate Apple Pay authentication.');
    showSuccessMessage('walletSuccessMsg');
  });
});

function switchTab(tabName) {
  // Update active tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Update active content section
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  document.querySelector(`[data-section="${tabName}"]`).classList.add('active');
}

function renderPaymentCards() {
  const container = document.getElementById('paymentCardsContainer');

  if (paymentMethods.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1;">No payment methods added yet</p>';
    return;
  }

  container.innerHTML = paymentMethods.map(method => `
    <div class="payment-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">
          <div class="payment-card-type">${method.type === 'credit-card' ? '💳 Credit Card' : '💰 Debit Card'}</div>
          <div class="payment-card-number">${method.cardNumber}</div>
          <div class="payment-card-details">
            <div class="payment-card-holder">${method.holder}</div>
            <div class="payment-card-expiry">${method.expiry}</div>
          </div>
        </div>
      </div>
      <button class="payment-card-delete" onclick="deletePaymentMethod(${method.id})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');
}

function renderPaymentMethodOptions() {
  const container = document.getElementById('paymentMethodOptions');

  const options = [
    { id: 'credit-card', name: 'Credit Card', icon: 'fa-credit-card' },
    { id: 'debit-card', name: 'Debit Card', icon: 'fa-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'fa-paypal' },
    { id: 'gcash', name: 'GCash', icon: 'fa-wallet' }
  ];

  container.innerHTML = options.map(option => `
    <div class="payment-method-option" onclick="openPaymentModal('${option.name}')">
      <div class="payment-method-icon"><i class="fa-brands ${option.icon}"></i></div>
      <p class="payment-method-name">${option.name}</p>
    </div>
  `).join('');
}

function openPaymentModal(paymentType) {
  const modal = document.getElementById('paymentModal');
  const title = document.getElementById('paymentModalTitle');
  title.textContent = `Add ${paymentType}`;
  modal.classList.add('show');
}

function deletePaymentMethod(methodId) {
  if (confirm('Are you sure you want to delete this payment method?')) {
    paymentMethods = paymentMethods.filter(m => m.id !== methodId);
    renderPaymentCards();
  }
}

function resetPersonalForm() {
  document.getElementById('fullName').value = 'John Doe';
  document.getElementById('email').value = 'john@example.com';
  document.getElementById('phone').value = '+63 912 345 6789';
  document.getElementById('dob').value = '1995-05-15';
  document.getElementById('gender').value = 'male';
  document.getElementById('department').value = 'College of IT';
  document.getElementById('course').value = 'Computer Science';
  document.getElementById('section').value = '1A';
  document.getElementById('address').value = '123 Main St, Barangay, City';
}

function resetSecurityForm() {
  document.querySelectorAll('input[type="password"]').forEach(input => {
    input.value = '';
  });
}

function showSuccessMessage(elementId) {
  const element = document.getElementById(elementId);
  element.classList.add('show');
  setTimeout(() => {
    element.classList.remove('show');
  }, 3000);
}
