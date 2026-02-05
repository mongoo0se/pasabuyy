

// Runner Profile
const RUNNER_PROFILE = {
    id: "runner-001",
    name: "Alex Johnson",
    avatar: "👨‍🚴",
    rating: 4.9,
    totalDeliveries: 342,
    onTimeRate: 98,
    acceptanceRate: 92,
    todayEarnings: 62.50,
    ordersCompletedToday: 12,
    weekEarnings: 182.50,
    monthEarnings: 1245.75,
    totalEarned: 12847.00
};


const AVAILABLE_ORDERS = [
    {
        id: "ORD-2024-1001",
        store: "Pizza Palace",
        pickup: "123 Main St",
        dropoff: "456 Oak Ave, Apt 305",
        distance: 2.5,
        payout: 5.50,
        estimatedTime: 18,
        items: "Large Margherita Pizza × 1",
        customerRating: 4.8
    },
    {
        id: "ORD-2024-1002",
        store: "Sushi Paradise",
        pickup: "789 Park Ave",
        dropoff: "321 Elm St",
        distance: 1.8,
        payout: 4.75,
        estimatedTime: 15,
        items: "Sushi Platter × 1, Miso Soup × 2",
        customerRating: 4.9
    },
    {
        id: "ORD-2024-1003",
        store: "Burger House",
        pickup: "550 Commerce Drive",
        dropoff: "700 Valley Rd",
        distance: 3.2,
        payout: 6.25,
        estimatedTime: 22,
        items: "Deluxe Burgers × 2, Fries × 2",
        customerRating: 4.7
    },
    {
        id: "ORD-2024-1004",
        store: "Taco Fiesta",
        pickup: "200 Sunset Blvd",
        dropoff: "900 Mountain View",
        distance: 0.8,
        payout: 3.50,
        estimatedTime: 12,
        items: "Taco Combo × 3",
        customerRating: 4.6
    },
    {
        id: "ORD-2024-1005",
        store: "Noodle Express",
        pickup: "400 Garden Lane",
        dropoff: "150 River St",
        distance: 2.2,
        payout: 4.50,
        estimatedTime: 16,
        items: "Pho × 2, Spring Rolls × 1",
        customerRating: 4.8
    },
    {
        id: "ORD-2024-1006",
        store: "Salad Bar",
        pickup: "600 Oak St",
        dropoff: "250 Maple Ave",
        distance: 1.5,
        payout: 3.75,
        estimatedTime: 14,
        items: "Custom Salad × 1, Dressing × 1",
        customerRating: 4.5
    }
];

// Active Delivery
const ACTIVE_DELIVERY = {
    orderId: "#ORD-2024-5847",
    store: {
        name: "Pizza Palace",
        address: "123 Main St, Downtown"
    },
    pickup: {
        location: "Pizza Palace",
        address: "123 Main St, Downtown",
        estimatedWait: "5 minutes"
    },
    dropoff: {
        location: "456 Oak Ave",
        details: "Apt 305, Building B",
        eta: "18 minutes"
    },
    customer: {
        name: "John Doe",
        rating: 4.8,
        avatar: "👨‍💼"
    },
    items: [
        { name: "Margherita Pizza (Large)", quantity: 1 },
        { name: "Garlic Knots", quantity: 1 },
        { name: "Caesar Salad", quantity: 1 }
    ],
    payout: 5.50,
    distance: 2.5,
    eta: "12 min"
};

// Earnings History
const EARNINGS_HISTORY = [
    { date: "Feb 5", orders: 12, earnings: 62.50, distance: 24.3 },
    { date: "Feb 4", orders: 11, earnings: 58.25, distance: 22.1 },
    { date: "Feb 3", orders: 14, earnings: 71.50, distance: 28.5 },
    { date: "Feb 2", orders: 10, earnings: 48.75, distance: 19.2 },
    { date: "Feb 1", orders: 13, earnings: 65.50, distance: 25.8 }
];

// Pending Orders (for dashboard preview)
const PENDING_ORDERS = [
    {
        id: "ORD-2024-7001",
        store: "Pizza Palace",
        distance: 1.2,
        payout: 4.25,
        eta: "12 min"
    },
    {
        id: "ORD-2024-7002",
        store: "Burger House",
        distance: 2.1,
        payout: 5.75,
        eta: "18 min"
    },
    {
        id: "ORD-2024-7003",
        store: "Sushi Paradise",
        distance: 0.9,
        payout: 3.50,
        eta: "10 min"
    }
];
