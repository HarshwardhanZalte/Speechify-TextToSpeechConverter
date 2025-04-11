document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Store email in localStorage to display on tool page
    localStorage.setItem('userEmail', email);
    
    // For demo purposes, redirect to tool page
    window.location.href = 'tool.html';
});