// DOM Elements
const historyList = document.getElementById('history-list');
const logoutBtn = document.querySelector('.logout-btn');
const userEmail = document.getElementById('user-email');
const profileIcon = document.getElementById('profile-icon');
const clearAllBtn = document.getElementById('clear-all-btn');

// Speech Synthesis
const synth = window.speechSynthesis;

// Set user email from localStorage
const savedEmail = localStorage.getItem('userEmail');
if (savedEmail) {
    userEmail.textContent = savedEmail;
    // Set profile icon with first letter of email
    if (savedEmail && savedEmail.length > 0) {
        profileIcon.innerHTML = savedEmail.charAt(0).toUpperCase();
    }
}

// Load history from localStorage
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('speechHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <li class="empty-history">
                <i class="fas fa-comment-slash"></i>
                <h3>No conversion history yet</h3>
                <p>Your text-to-speech conversions will appear here</p>
            </li>
        `;
        return;
    }
    
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('li');
        historyItem.className = 'history-item';
        
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleString();
        
        historyItem.innerHTML = `
            <div class="history-meta">
                <span>${formattedDate}</span>
                <span>Speed: ${item.speed}x</span>
            </div>
            <div class="history-text">${item.text}</div>
            <div class="history-actions">
                <button class="history-btn btn-play" data-index="${index}">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="history-btn btn-delete" data-index="${index}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-play').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const history = JSON.parse(localStorage.getItem('speechHistory') || '[]');
            const item = history[index];
            
            if (item) {
                synth.cancel();
                const utterance = new SpeechSynthesisUtterance(item.text);
                utterance.rate = parseFloat(item.speed);
                synth.speak(utterance);
            }
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            let history = JSON.parse(localStorage.getItem('speechHistory') || '[]');
            
            if (index >= 0 && index < history.length) {
                history.splice(index, 1);
                localStorage.setItem('speechHistory', JSON.stringify(history));
                loadHistory();
            }
        });
    });
}

// Clear all history
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all history?')) {
        localStorage.removeItem('speechHistory');
        loadHistory();
    }
});

// Logout button click handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
});

// Load history when page loads
loadHistory();