/* ===================================
   RUNNER DASHBOARD STATE MANAGEMENT
   =================================== */

class DashboardState {
    constructor() {
        this.currentWindow = 'dashboard';
        this.runner = { ...RUNNER_PROFILE };
        this.availableOrders = [...AVAILABLE_ORDERS];
        this.filteredOrders = [...AVAILABLE_ORDERS];
        this.activeDelivery = null;
        this.hasActiveDelivery = false;
        this.orderFilters = {
            distance: '',
            payout: ''
        };
    }

    setCurrentWindow(windowName) {
        this.currentWindow = windowName;
    }

    setOrderFilters(distance, payout) {
        this.orderFilters.distance = distance;
        this.orderFilters.payout = payout;
        this.filterOrders();
    }

    filterOrders() {
        this.filteredOrders = this.availableOrders.filter(order => {
            let matches = true;

            if (this.orderFilters.distance) {
                const distance = order.distance;
                if (this.orderFilters.distance === 'short' && distance > 1) matches = false;
                if (this.orderFilters.distance === 'medium' && (distance < 1 || distance > 3)) matches = false;
                if (this.orderFilters.distance === 'long' && distance < 3) matches = false;
            }

            if (this.orderFilters.payout) {
                const payout = order.payout;
                if (this.orderFilters.payout === 'high' && payout < 5) matches = false;
                if (this.orderFilters.payout === 'medium' && (payout < 3 || payout >= 5)) matches = false;
                if (this.orderFilters.payout === 'low' && payout >= 3) matches = false;
            }

            return matches;
        });
    }

    acceptDelivery(orderId) {
        const order = this.availableOrders.find(o => o.id === orderId);
        if (order) {
            this.activeDelivery = {
                ...ACTIVE_DELIVERY,
                orderId: orderId
            };
            this.hasActiveDelivery = true;
            // Remove from available orders
            this.availableOrders = this.availableOrders.filter(o => o.id !== orderId);
            this.filterOrders();
        }
    }

    cancelDelivery() {
        if (this.activeDelivery) {
            // Add back to available orders
            this.availableOrders.push({
                id: this.activeDelivery.orderId,
                store: this.activeDelivery.store.name,
                pickup: this.activeDelivery.pickup.location,
                dropoff: this.activeDelivery.dropoff.location,
                distance: this.activeDelivery.distance,
                payout: this.activeDelivery.payout,
                estimatedTime: this.activeDelivery.eta,
                items: "Order items",
                customerRating: this.activeDelivery.customer.rating
            });
            this.activeDelivery = null;
            this.hasActiveDelivery = false;
            this.filterOrders();
        }
    }

    completeDelivery() {
        if (this.activeDelivery) {
            // Add to earnings
            this.runner.todayEarnings += this.activeDelivery.payout;
            this.runner.ordersCompletedToday += 1;
            this.activeDelivery = null;
            this.hasActiveDelivery = false;
        }
    }
}

// Global state instance
const state = new DashboardState();

/* ===================================
   INITIALIZATION
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupNavigationListeners();
    setupWindowListeners();
    setupFilterListeners();

    // Render initial window
    renderDashboard();
}

/* ===================================
   NAVIGATION SYSTEM
   =================================== */

function setupNavigationListeners() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const windowName = btn.dataset.window;
            switchWindow(windowName);
        });
    });

    // Profile button
    const profileBtn = document.querySelector('.profile-btn');
    profileBtn?.addEventListener('click', () => {
        alert(`Runner: ${state.runner.name}\nRating: ${state.runner.rating}⭐\nTotal Deliveries: ${state.runner.totalDeliveries}`);
    });
}

function switchWindow(windowName) {
    state.setCurrentWindow(windowName);

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-window="${windowName}"]`)?.classList.add('active');

    // Hide all windows
    document.querySelectorAll('.window').forEach(window => {
        window.classList.remove('active');
    });

    // Show selected window
    document.getElementById(windowName)?.classList.add('active');

    // Render window
    switch (windowName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'orders':
            renderOrdersWindow();
            break;
        case 'active':
            renderActiveWindow();
            break;
        case 'earnings':
            renderEarningsWindow();
            break;
    }
}

/* ===================================
   DASHBOARD WINDOW
   =================================== */

function renderDashboard() {
    // Update stats
    document.getElementById('todayEarnings').textContent = `$${state.runner.todayEarnings.toFixed(2)}`;
    document.getElementById('earningsDetail').textContent = `${state.runner.ordersCompletedToday} orders completed`;
    document.getElementById('ratingValue').textContent = state.runner.rating.toFixed(1);
    document.getElementById('ratingCount').textContent = `Based on ${state.runner.totalDeliveries} deliveries`;
    document.getElementById('ordersComplete').textContent = state.runner.ordersCompletedToday;
    document.getElementById('avgTime').textContent = '18 min';

    // Update active delivery summary
    if (state.hasActiveDelivery) {
        const delivery = state.activeDelivery;
        document.getElementById('fromStore').textContent = delivery.store.name;
        document.getElementById('toLocation').textContent = delivery.dropoff.location;
        document.getElementById('deliveryPayout').textContent = `$${delivery.payout.toFixed(2)}`;
        document.getElementById('deliveryETA').textContent = delivery.eta;
        document.getElementById('viewDeliveryBtn').addEventListener('click', () => switchWindow('active'));
    }

    // Render pending orders
    renderPendingOrders();
}

function renderPendingOrders() {
    const list = document.getElementById('pendingOrdersList');
    list.innerHTML = '';

    const pendingOrders = state.availableOrders.slice(0, 3);

    if (pendingOrders.length === 0) {
        list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--neutral-600);">No pending orders</p>';
        return;
    }

    pendingOrders.forEach(order => {
        const item = document.createElement('div');
        item.className = 'pending-order-item';
        item.innerHTML = `
            <div class="order-item-header">
                <span class="order-item-id">${order.id}</span>
                <span class="order-item-distance">${order.distance} km</span>
            </div>
            <div class="order-item-store">${order.store}</div>
            <div class="order-item-details">
                <span>📍 ${order.dropoff}</span>
                <span>⏱️ ~${order.estimatedTime} min</span>
            </div>
            <div class="order-item-footer">
                <span class="order-item-payout">$${order.payout.toFixed(2)}</span>
                <button class="order-item-accept" data-order-id="${order.id}">Accept</button>
            </div>
        `;

        item.querySelector('.order-item-accept').addEventListener('click', () => {
            acceptOrder(order.id);
        });

        list.appendChild(item);
    });
}

function acceptOrder(orderId) {
    state.acceptDelivery(orderId);
    switchWindow('active');
}

/* ===================================
   ORDERS WINDOW
   =================================== */

function setupFilterListeners() {
    const distanceSelect = document.getElementById('filterDistance');
    const payoutSelect = document.getElementById('filterPayout');

    distanceSelect?.addEventListener('change', () => {
        state.setOrderFilters(distanceSelect.value, payoutSelect.value);
        renderOrdersWindow();
    });

    payoutSelect?.addEventListener('change', () => {
        state.setOrderFilters(distanceSelect.value, payoutSelect.value);
        renderOrdersWindow();
    });
}

function renderOrdersWindow() {
    const grid = document.getElementById('ordersGrid');
    const emptyState = document.getElementById('ordersEmptyState');

    if (state.filteredOrders.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    grid.innerHTML = '';

    state.filteredOrders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <span class="order-card-badge">${order.distance} km</span>
            <h3 class="order-card-title">${order.store}</h3>
            <p class="order-card-details">
                <strong>To:</strong> ${order.dropoff}<br>
                <strong>Time:</strong> ~${order.estimatedTime} min<br>
                <strong>Items:</strong> ${order.items}
            </p>
            <div class="order-card-footer">
                <span class="order-card-amount">$${order.payout.toFixed(2)}</span>
                <button class="order-card-accept-btn" data-order-id="${order.id}">Accept</button>
            </div>
        `;

        card.querySelector('.order-card-accept-btn').addEventListener('click', () => {
            state.acceptDelivery(order.id);
            switchWindow('active');
        });

        grid.appendChild(card);
    });
}

/* ===================================
   ACTIVE DELIVERY WINDOW
   =================================== */

function setupWindowListeners() {
    // View Details button
    document.getElementById('viewDeliveryBtn')?.addEventListener('click', () => switchWindow('active'));
}

function renderActiveWindow() {
    const container = document.getElementById('activeDeliveryContainer');
    const emptyState = document.getElementById('activeEmptyState');

    if (!state.hasActiveDelivery || !state.activeDelivery) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    emptyState.classList.add('hidden');

    const delivery = state.activeDelivery;

    // Update header
    document.getElementById('activeOrderId').textContent = delivery.orderId;

    // Update pickup details
    document.getElementById('pickupStore').textContent = delivery.store.name;
    document.getElementById('pickupAddress').textContent = delivery.store.address;
    document.getElementById('pickupTime').textContent = `Estimated wait: ${delivery.pickup.estimatedWait}`;

    // Update dropoff details
    document.getElementById('dropoffLocation').textContent = delivery.dropoff.location;
    document.getElementById('dropoffDetails').textContent = delivery.dropoff.details;
    document.getElementById('dropoffTime').textContent = `Estimated delivery: ${delivery.dropoff.eta}`;

    // Update customer info
    document.getElementById('customerName').textContent = delivery.customer.name;
    document.getElementById('customerRating').textContent = `${delivery.customer.rating}⭐`;

    // Update order items
    renderOrderItems(delivery);

    // Update map controls
    document.getElementById('remainDistance').textContent = `${delivery.distance} km`;
    document.getElementById('remainETA').textContent = delivery.eta;
    document.getElementById('deliveryPayoutAmount').textContent = `$${delivery.payout.toFixed(2)}`;

    // Setup buttons
    setupActivityButtonListeners();
}

function renderOrderItems(delivery) {
    const list = document.getElementById('orderDetailsList');
    list.innerHTML = '';

    delivery.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'detail-row';
        row.innerHTML = `
            <span class="detail-name">${item.name}</span>
            <span class="detail-quantity">x${item.quantity}</span>
        `;
        list.appendChild(row);
    });
}

function setupActivityButtonListeners() {
    const arrivedBtn = document.getElementById('arrivedBtn');
    const getDirectionsBtn = document.getElementById('getDirectionsBtn');
    const cancelBtn = document.getElementById('cancelDeliveryBtn');
    const customerCallBtn = document.querySelector('.customer-actions .action-btn:first-child');
    const customerMsgBtn = document.querySelector('.customer-actions .action-btn:last-child');

    arrivedBtn?.addEventListener('click', () => {
        alert('✓ Marked as arrived! Customer will be notified.');
    });

    getDirectionsBtn?.addEventListener('click', () => {
        alert('Opening navigation to: ' + state.activeDelivery.dropoff.location);
    });

    cancelBtn?.addEventListener('click', () => {
        const confirmed = confirm('Are you sure you want to cancel this delivery?');
        if (confirmed) {
            state.cancelDelivery();
            switchWindow('dashboard');
            alert('Delivery cancelled and returned to available orders.');
        }
    });

    customerCallBtn?.addEventListener('click', () => {
        alert(`Calling ${state.activeDelivery.customer.name}...`);
    });

    customerMsgBtn?.addEventListener('click', () => {
        alert(`Messaging ${state.activeDelivery.customer.name}...`);
    });
}

/* ===================================
   EARNINGS WINDOW
   =================================== */

function renderEarningsWindow() {
    // Update summary cards
    document.getElementById('summaryToday').textContent = `$${state.runner.todayEarnings.toFixed(2)}`;
    document.getElementById('summaryWeek').textContent = `$${state.runner.weekEarnings.toFixed(2)}`;
    document.getElementById('summaryMonth').textContent = `$${state.runner.monthEarnings.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${state.runner.totalEarned.toFixed(2)}`;

    // Render breakdown table
    renderEarningsBreakdown();

    // Setup tab buttons
    setupEarningsTabs();
}

function renderEarningsBreakdown() {
    const tbody = document.getElementById('breakdownRows');
    tbody.innerHTML = '';

    EARNINGS_HISTORY.forEach(record => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <span class="col-date">${record.date}</span>
            <span class="col-orders">${record.orders} orders</span>
            <span class="col-earnings">$${record.earnings.toFixed(2)}</span>
            <span class="col-distance">${record.distance} km</span>
        `;
        tbody.appendChild(row);
    });
}

function setupEarningsTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // In a real app, update chart based on selected tab
        });
    });

    // Withdraw button
    document.getElementById('withdrawBtn')?.addEventListener('click', () => {
        alert(`Withdraw $${state.runner.todayEarnings.toFixed(2)}?\n\nYou can withdraw once per day. Processing takes 1-2 business days.`);
    });
}

/* ===================================
   KEYBOARD SHORTCUTS
   =================================== */

document.addEventListener('keydown', (e) => {
    // Alt + D for dashboard
    if (e.altKey && e.key === 'd') {
        switchWindow('dashboard');
    }
    // Alt + O for orders
    if (e.altKey && e.key === 'o') {
        switchWindow('orders');
    }
    // Alt + A for active
    if (e.altKey && e.key === 'a') {
        switchWindow('active');
    }
    // Alt + E for earnings
    if (e.altKey && e.key === 'e') {
        switchWindow('earnings');
    }
});

console.log('RunnerHub Dashboard Initialized ✓');
console.log('Shortcuts: Alt+D (Dashboard), Alt+O (Orders), Alt+A (Active), Alt+E (Earnings)');
