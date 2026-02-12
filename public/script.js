// Form submission
document.getElementById('guidanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    year: formData.get('year'),
    codingExp: formData.get('codingExp'),
    languages: formData.get('languages'),
    interest: formData.get('interest') // checkbox
  };

  const response = await fetch('/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const { suggestions } = await response.json();
  document.getElementById('suggestions').innerHTML = `<p>${suggestions}</p>`;
});

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  const output = document.getElementById('chatOutput');
  
  // Add user message with animation
  output.innerHTML += `<p>You: ${message}</p>`;
  
  // Clear input
  input.value = '';
  
  // Scroll to bottom
  output.scrollTop = output.scrollHeight;

  // Show typing indicator
  const typing = document.getElementById('typingIndicator');
  typing.style.display = 'flex';

  // Fake delay for "thinking" (you can make this random: 800–1800ms)
  setTimeout(() => {
    // Hide typing indicator
    typing.style.display = 'none';

    // Generate bot reply (your existing logic)
    let reply = 'Sorry, I don\'t understand.';
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('python')) {
      reply = 'Start with Python basics on freeCodeCamp or Codecademy. Great choice for beginners!';
    } else if (lowerMsg.includes('dsa') || lowerMsg.includes('algorithm')) {
      reply = 'Practice DSA on LeetCode, HackerRank, or GeeksforGeeks. Start with arrays and strings!';
    } else if (lowerMsg.includes('research') || lowerMsg.includes('paper')) {
      reply = 'Check trending topics on arXiv.org, Google Scholar, or IEEE Xplore.';
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      reply = 'Hey there! How can I help with your college journey today? 😊';
    }

    // Add bot message with animation
    output.innerHTML += `<p>Bot: ${reply}</p>`;

    // Scroll to bottom again
    output.scrollTop = output.scrollHeight;
  }, 1200); // 1.2 seconds delay – feels natural
}
function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  const output = document.getElementById('chatOutput');
  
  // Add user message with animation
  output.innerHTML += `<p>You: ${message}</p>`;
  
  // Clear input
  input.value = '';
  
  // Scroll to bottom
  output.scrollTop = output.scrollHeight;

  // Show typing indicator
  const typing = document.getElementById('typingIndicator');
  typing.style.display = 'flex';

  // Fake delay for "thinking" (you can make this random: 800–1800ms)
  setTimeout(() => {
    // Hide typing indicator
    typing.style.display = 'none';

    // Generate bot reply (your existing logic)
    let reply = 'Sorry, I don\'t understand.';
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('python')) {
      reply = 'Start with Python basics on freeCodeCamp or Codecademy. Great choice for beginners!';
    } else if (lowerMsg.includes('dsa') || lowerMsg.includes('algorithm')) {
      reply = 'Practice DSA on LeetCode, HackerRank, or GeeksforGeeks. Start with arrays and strings!';
    } else if (lowerMsg.includes('research') || lowerMsg.includes('paper')) {
      reply = 'Check trending topics on arXiv.org, Google Scholar, or IEEE Xplore.';
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      reply = 'Hey there! How can I help with your college journey today? 😊';
    }

    // Add bot message with animation
    output.innerHTML += `<p>Bot: ${reply}</p>`;

    // Scroll to bottom again
    output.scrollTop = output.scrollHeight;
  }, 1200); // 1.2 seconds delay – feels natural
}
// Theme Toggle Logic
const themeBtn = document.getElementById('themeBtn');
const htmlElement = document.documentElement; // <html> tag

// Function to set theme
function setTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Load saved theme or system preference
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }
}

// Toggle handler
themeBtn.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Run on page load
loadTheme();

// Optional: Listen for system theme change
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) { // only if user hasn't manually chosen
    setTheme(e.matches ? 'dark' : 'light');
  }
});
