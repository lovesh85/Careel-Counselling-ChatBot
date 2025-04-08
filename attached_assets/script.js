document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainInterface = document.getElementById('mainInterface');
    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistory = document.getElementById('chatHistory');
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const assistantBtn = document.getElementById('assistantBtn');
    const quickOptions = document.querySelectorAll('.quick-option');

    // Show welcome screen initially
    startBtn.addEventListener('click', function() {
        welcomeScreen.style.display = 'none';
        mainInterface.style.display = 'flex';
        startNewChat();
    });

    // New chat button
    newChatBtn.addEventListener('click', startNewChat);
    
    // Virtual Assistant button
    assistantBtn.addEventListener('click', function() {
        window.location.href = 'virtual-assistant.html';
    });

    // Quick options click handler
    quickOptions.forEach(option => {
        option.addEventListener('click', function() {
            const text = this.textContent;
            handleUserQuery(text);
        });
    });

    function startNewChat() {
        chatContainer.innerHTML = '';
        userInput.value = '';
        addMessage('assistant', 'Hello there! I\'m SHIFRA, your career counseling assistant. How can I help you today?');
    }

    function addToChatHistory(title) {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.textContent = title;
        chatHistory.appendChild(chatItem);
        
        chatItem.addEventListener('click', function() {
            startNewChat();
            addMessage('user', title);
            addMessage('assistant', `This was our previous conversation about "${title}".`);
        });
    }

    function handleUserQuery(query) {
        addMessage('user', query);
        
        if (query.toLowerCase().includes("career after 12th") || 
            query.toLowerCase().includes("careers after 12th")) {
            setTimeout(() => {
                addMessage('assistant', `I'm analyzing your query about "${query}". Here's what I found...`);
                setTimeout(() => {
                    window.open('https://www.google.com/search?q=careers+after+12th', '_blank');
                }, 500);
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage('assistant', `I'm analyzing your query about "${query}". Here's what I found...`);
            }, 1000);
        }
        
        addToChatHistory(query.substring(0, 20) + (query.length > 20 ? '...' : ''));
    }

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            handleUserQuery(message);
            userInput.value = '';
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});