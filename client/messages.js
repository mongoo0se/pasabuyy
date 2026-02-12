// Start with empty conversations. Server will provide real data.
const conversationsData = [];

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
}

// Render messages
function renderMessages(messages) {
  const messagesContent = document.getElementById('messagesContent');
  const conversationData = conversationsData.find(c => c.id === currentConversationId);
  
  messagesContent.innerHTML = messages.map(msg => {
    if (msg.sender === 'user') {
      return `
        <div class="message-group sent">
          <div class="message-bubble">${msg.text}</div>
        </div>
      `;
    } else {
      return `
        <div class="message-group received">
          <img src="${conversationData.avatar}" alt="" class="message-avatar" />
          <div class="message-bubble">${msg.text}</div>
        </div>
      `;
    }
  }).join('');
  
  // Scroll to bottom
  setTimeout(() => {
    messagesContent.scrollTop = messagesContent.scrollHeight;
  }, 0);
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
  }, 1000);
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
  
  // No default selection when there are no conversations
  if (conversationsData.length > 0) {
    selectConversation(conversationsData[0].id);
  }
});
