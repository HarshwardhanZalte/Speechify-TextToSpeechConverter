// DOM Elements
const textArea = document.getElementById('text-to-speech');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');
const downloadBtn = document.getElementById('download-btn');
const speedControl = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const logoutBtn = document.querySelector('.logout-btn');
const charCount = document.getElementById('char-count');
const userEmail = document.getElementById('user-email');
const profileIcon = document.getElementById('profile-icon');

const synth = window.speechSynthesis;
let utterance = null;

const savedEmail = localStorage.getItem('userEmail');
if (savedEmail) {
    userEmail.textContent = savedEmail;
    // Set profile icon with first letter of email
    if (savedEmail && savedEmail.length > 0) {
        profileIcon.innerHTML = savedEmail.charAt(0).toUpperCase();
    }
}

textArea.addEventListener('input', updateCharCount);

function updateCharCount() {
    const count = textArea.value.length;
    charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
}

speedControl.addEventListener('input', () => {
    speedValue.textContent = `${speedControl.value}x`;
});

playBtn.addEventListener('click', () => {
    if (textArea.value.trim() === '') {
        alert('Please enter some text to convert to speech');
        return;
    }
    
    // Stop any ongoing speech
    synth.cancel();
    
    // Create a new utterance
    utterance = new SpeechSynthesisUtterance(textArea.value);
    
    // Set rate (speed)
    utterance.rate = parseFloat(speedControl.value);
    
    // Speak the utterance
    synth.speak(utterance);
    
    // Save to history
    saveToHistory(textArea.value);
});

// Pause button click handler
pauseBtn.addEventListener('click', () => {
    if (synth.speaking) {
        synth.pause();
    }
});

// Stop button click handler
stopBtn.addEventListener('click', () => {
    synth.cancel();
});

// Clear button click handler
clearBtn.addEventListener('click', () => {
    textArea.value = '';
    updateCharCount();
});

// Download button click handler (simulated)
downloadBtn.addEventListener('click', () => {
    if (textArea.value.trim() === '') {
        alert('This is under development then how can you download? gaadha hai bsdk tu.....');
        return;
    }
    
    alert('In a real app, this would generate and download an audio file');
});

// Logout button click handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
});

// Save to history function
function saveToHistory(text) {
    if (text.trim() === '') return;
    
    let history = JSON.parse(localStorage.getItem('speechHistory') || '[]');
    history.unshift({
        text: text,
        timestamp: new Date().toISOString(),
        speed: speedControl.value
    });
    
    // Limit to 50 history items
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    localStorage.setItem('speechHistory', JSON.stringify(history));
}

updateCharCount();