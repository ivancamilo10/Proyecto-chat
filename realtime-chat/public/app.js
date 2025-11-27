const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const joinBtn = document.getElementById('joinBtn');

let username = null;

joinBtn.addEventListener('click', () => {
  const value = usernameInput.value.trim();
  if (!value) {
    usernameInput.focus();
    return;
  }
  username = value;
  socket.emit('join', username);
  joinBtn.disabled = true;
  usernameInput.disabled = true;
  joinBtn.textContent = 'Dentro del chat';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!username) {
    usernameInput.focus();
    return;
  }
  if (input.value.trim()) {
    socket.emit('chat-message', input.value.trim());
    input.value = '';
  }
});

socket.on('chat-message', (data) => {
  const { username: sender, message, time } = data;
  const isMe = sender === username;
  const li = document.createElement('li');
  li.classList.add('message', isMe ? 'me' : 'other');

  li.innerHTML = `
    <div class="meta">
      <span class="username">${sender}</span>
      <span class="time">${time}</span>
    </div>
    <div class="text">${escapeHtml(message)}</div>
  `;

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('system-message', (msg) => {
  const li = document.createElement('li');
  li.classList.add('system-message');
  li.textContent = msg;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
