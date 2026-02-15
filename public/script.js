// ==================== AUTH & TOKEN MANAGEMENT ====================

const API_BASE = '/api/auth';
let currentToken = null;
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  checkAuthStatus();
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
});

// Check if user is logged in
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    currentToken = token;
    currentUser = JSON.parse(user);
    showMainContent();
  } else {
    showAuthSection();
  }
}

// Auth Section Toggle
function showAuthSection() {
  const authSection = document.getElementById('authSection');
  const guidanceSection = document.getElementById('guidanceSection');
  if (authSection) authSection.style.display = 'block';
  if (guidanceSection) guidanceSection.style.display = 'none';
}

function showMainContent() {
  const authSection = document.getElementById('authSection');
  const guidanceSection = document.getElementById('guidanceSection');
  if (authSection) authSection.style.display = 'none';
  if (guidanceSection) guidanceSection.style.display = 'block';
}

// Login Function
async function login() {
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      alert(`Login failed: ${data.error}`);
      return;
    }

    currentToken = data.token;
    currentUser = data.user;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    showMainContent();
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
  } catch (error) {
    alert('Login error: ' + error.message);
  }
}

// Register Function
async function register() {
  const email = document.getElementById('regEmail')?.value;
  const password = document.getElementById('regPassword')?.value;
  const year = document.getElementById('regYear')?.value;
  const languages = document.getElementById('regLanguages')?.value;

  if (!email || !password || !year) {
    alert('Please fill in all required fields');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, year, languages })
    });

    const data = await response.json();
    
    if (!response.ok) {
      alert(`Registration failed: ${data.error}`);
      return;
    }

    currentToken = data.token;
    currentUser = data.user;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    showMainContent();
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regLanguages').value = '';
  } catch (error) {
    alert('Registration error: ' + error.message);
  }
}

// Logout Function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentToken = null;
  currentUser = null;
  showAuthSection();
}

// Toggle between login and register
function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
}

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

// ==================== GUIDANCE & LEARNING PATH ====================

// Guidance Form submission
const guidanceForm = document.getElementById('guidanceForm');
if (guidanceForm) {
  guidanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const year = document.getElementById('guidanceForm').elements['year']?.value;
    const codingExp = document.getElementById('guidanceForm').elements['codingExp']?.value;
    
    try {
      const response = await fetch(`${API_BASE}/resources?year=${year}&interests=${codingExp}`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      const resources = await response.json();
      
      let suggestionsHTML = '<h3>Recommended Resources:</h3><ul>';
      resources.forEach(r => {
        suggestionsHTML += `<li><a href="${r.url}" target="_blank">${r.title}</a> (${r.type})</li>`;
      });
      suggestionsHTML += '</ul>';
      
      document.getElementById('suggestions').innerHTML = suggestionsHTML;
    } catch (error) {
      alert('Error fetching resources: ' + error.message);
    }
  });
}

// ==================== CHATBOT ====================

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  const output = document.getElementById('chatOutput');
  
  // Add user message
  const userMsg = document.createElement('p');
  userMsg.textContent = 'You: ' + message;
  userMsg.style.marginBottom = '10px';
  output.appendChild(userMsg);
  
  // Clear input
  input.value = '';
  
  // Scroll to bottom
  output.scrollTop = output.scrollHeight;

  // Show typing indicator
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.style.display = 'flex';

  // Simulate thinking
  setTimeout(() => {
    if (typing) typing.style.display = 'none';

    let reply = 'Sorry, I don\'t understand that. Try asking about Python, DSA, research, or just say hi!';
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('python')) {
      reply = 'Start with Python basics on freeCodeCamp or Codecademy. Great choice for beginners!';
    } else if (lowerMsg.includes('dsa') || lowerMsg.includes('algorithm')) {
      reply = 'Practice DSA on LeetCode, HackerRank, or GeeksforGeeks. Start with arrays and strings!';
    } else if (lowerMsg.includes('research') || lowerMsg.includes('paper')) {
      reply = 'Check trending topics on arXiv.org, Google Scholar, or IEEE Xplore.';
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      reply = 'Hey there! 👋 How can I help with your college journey today?';
    } else if (lowerMsg.includes('branch') || lowerMsg.includes('course')) {
      reply = 'Check our Branches page for info on BTech, BBA, BCA, BSc, and more!';
    } else if (lowerMsg.includes('resource') || lowerMsg.includes('learn')) {
      reply = 'I can recommend personalized learning resources based on your year and interests. Ask about specific topics!';
    }

    const botMsg = document.createElement('p');
    botMsg.textContent = 'Bot: ' + reply;
    botMsg.style.marginBottom = '10px';
    output.appendChild(botMsg);

    output.scrollTop = output.scrollHeight;
  }, 1200);
}

// ==================== THEME TOGGLE ====================

const htmlElement = document.documentElement;

function setTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }
}

function toggleTheme() {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// Listen for system theme change
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// ==================== PDF EXPORT ====================

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('My Learning Path', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`User: ${currentUser?.email}`, 20, 35);
  doc.text(`Year: ${currentUser?.year}`, 20, 45);
  doc.text(`Level: ${currentUser?.codingExp}`, 20, 55);
  
  if (currentUser?.learningPath && currentUser.learningPath.length > 0) {
    doc.text('Learning Path:', 20, 70);
    let yPosition = 80;
    currentUser.learningPath.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.topic} - ${item.status}`, 25, yPosition);
      yPosition += 10;
    });
  }
  
  doc.save('learning-path.pdf');
}
