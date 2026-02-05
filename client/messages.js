// Sample conversations data
const conversationsData = [
  {
    id: 1,
    name: 'Bes Burger House',
    type: 'store',
    avatar: 'https://images.unsplash.com/photo-1604908176997-4315a9d8e7d9?w=100&h=100&fit=crop',
    status: 'Usually responds quickly',
    messages: [
      { id: 1, sender: 'store', text: 'Hello! Welcome to Bes Burger House', timestamp: '10:00 AM' },
      { id: 2, sender: 'user', text: 'Hi! Can I check your menu?', timestamp: '10:05 AM' },
      { id: 3, sender: 'store', text: 'Of course! Here\'s our menu link...', timestamp: '10:06 AM' },
      { id: 4, sender: 'user', text: 'Thanks! I\'ll order soon', timestamp: '10:10 AM' },
      { id: 5, sender: 'store', text: 'Great! Looking forward to your order', timestamp: '10:11 AM' }
    ]
  },
  {
    id: 2,
    name: 'John Martinez',
    type: 'rider',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    status: 'Online',
    messages: [
      { id: 1, sender: 'user', text: 'Are you available for delivery?', timestamp: '09:30 AM' },
      { id: 2, sender: 'rider', text: 'Yes, I\'m available now!', timestamp: '09:35 AM' },
      { id: 3, sender: 'user', text: 'Great! I have a delivery from Pa-Buy Kitchen', timestamp: '09:40 AM' },
      { id: 4, sender: 'rider', text: 'I\'m on my way! ETA 15 mins', timestamp: '09:45 AM' }
    ]
  },
  {
    id: 3,
    name: 'Pa-Buy Kitchen',
    type: 'store',
    avatar: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=100&h=100&fit=crop',
    status: 'Last seen 2 hours ago',
    messages: [
      { id: 1, sender: 'user', text: 'I received my order. Thank you!', timestamp: '08:00 AM' },
      { id: 2, sender: 'store', text: 'You\'re welcome! Please rate us if you liked the food', timestamp: '08:05 AM' }
    ]
  },
  {
    id: 4,
    name: 'Teal Cup Cafe',
    type: 'store',
    avatar: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=100&h=100&fit=crop',
    status: 'Online',
    messages: [
      { id: 1, sender: 'user', text: 'Hi, I\'d like to place an order', timestamp: '11:00 AM' },
      { id: 2, sender: 'store', text: 'Sure! What would you like to order?', timestamp: '11:05 AM' }
    ]
  },
  {
    id: 5,
    name: 'Sarah Chen',
    type: 'rider',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    status: 'Offline',
    messages: [
      { id: 1, sender: 'user', text: 'Thanks for the fast delivery!', timestamp: 'Yesterday' },
      { id: 2, sender: 'rider', text: 'Happy to help! See you next time', timestamp: 'Yesterday' }
    ]
  }
];

let currentConversationId = null;

// Render conversations list
function renderConversations() {
  const conversationsList = document.getElementById('conversationsList');
  
  conversationsList.innerHTML = conversationsData.map(conv => {
    const lastMessage = conv.messages[conv.messages.length - 1];
    const isUnread = Math.random() > 0.7; // Simulate some unread messages
    
    return `
      <div class="conversation-item ${currentConversationId === conv.id ? 'active' : ''}" data-conversation-id="${conv.id}">
        <img src="${conv.avatar}" alt="${conv.name}" class="conversation-avatar" />
        <div class="conversation-info">
          <p class="conversation-name">${conv.name}</p>
          <p class="conversation-preview ${isUnread ? 'unread' : ''}">
            ${lastMessage.sender === 'user' ? 'You: ' : ''}${lastMessage.text}
          </p>
        </div>
        ${isUnread ? '<div class="unread-badge">3</div>' : ''}
      </div>
    `;
  }).join('');

  // Add event listeners
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.addEventListener('click', () => {
      const conversationId = parseInt(item.dataset.conversationId);
      selectConversation(conversationId);
    });
  });
}

// Select a conversation
function selectConversation(conversationId) {
  currentConversationId = conversationId;
  
  // Update active state
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-conversation-id="${conversationId}"]`).classList.add('active');
  
  // Get conversation data
  const conversation = conversationsData.find(c => c.id === conversationId);
  
  // Show chat content
  document.getElementById('emptyChatState').style.display = 'none';
  document.getElementById('chatContent').style.display = 'flex';
  
  // Update header
  document.getElementById('chatHeaderAvatar').src = conversation.avatar;
  document.getElementById('chatHeaderName').textContent = conversation.name;
  document.getElementById('chatHeaderStatus').textContent = conversation.status;
  
  // Render messages
  renderMessages(conversation.messages);
  
  // Scroll to bottom
  setTimeout(() => {
    const messagesContent = document.getElementById('messagesContent');
    messagesContent.scrollTop = messagesContent.scrollHeight;
  }, 0);
}

// Render messages
function renderMessages(messages) {
  const messagesContent = document.getElementById('messagesContent');
  
  messagesContent.innerHTML = messages.map(msg => `
    <div class="message-group ${msg.sender === 'user' ? 'sent' : 'received'}">
      ${msg.sender === 'user' ? '' : '<img src="' + conversationsData.find(c => c.id === currentConversationId).avatar + '" alt="" class="message-avatar" />'}
      <div class="message-bubble">${msg.text}</div>
      ${msg.sender === 'user' ? '<img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="" class="message-avatar" />' : ''}
    </div>
  `).join('');
}

// Send message
function sendMessage() {
  const input = document.getElementById('messageInput');
  const messageText = input.value.trim();
  
  if (messageText === '') return;
  
  // Get current conversation
  const conversation = conversationsData.find(c => c.id === currentConversationId);
  
  // Add message to conversation
  conversation.messages.push({
    id: conversation.messages.length + 1,
    sender: 'user',
    text: messageText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  
  // Clear input
  input.value = '';
  
  // Re-render messages
  renderMessages(conversation.messages);
  
  // Simulate response
  setTimeout(() => {
    const responses = {
      'store': 'Thanks for your message! We\'ll get back to you shortly.',
      'rider': 'Got it! I\'ll keep you updated.',
      'user': 'Thank you for contacting us!'
    };
    
    const response = responses[conversation.type] || 'Thanks for your message!';
    
    conversation.messages.push({
      id: conversation.messages.length + 1,
      sender: conversation.type,
      text: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    renderMessages(conversation.messages);
    
    // Scroll to bottom
    const messagesContent = document.getElementById('messagesContent');
    messagesContent.scrollTop = messagesContent.scrollHeight;
  }, 1000);
  
  // Scroll to bottom
  const messagesContent = document.getElementById('messagesContent');
  messagesContent.scrollTop = messagesContent.scrollHeight;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderConversations();
  
  // Send button
  document.getElementById('sendBtn').addEventListener('click', sendMessage);
  
  // Enter key to send
  document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Search conversations
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const conversationItems = document.querySelectorAll('.conversation-item');
    
    conversationItems.forEach(item => {
      const name = item.querySelector('.conversation-name').textContent.toLowerCase();
      if (name.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
  
  // Select first conversation by default
  if (conversationsData.length > 0) {
    selectConversation(conversationsData[0].id);
  }
});
