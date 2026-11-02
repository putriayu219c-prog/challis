// --- Data State ---
let coins = parseInt(localStorage.getItem('coins')) || 0;
let userInventory = JSON.parse(localStorage.getItem('inventory')) || [];
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Data Barang Toko
const shopItems = [
    { id: 1, name: 'Tanaman Sukulen', price: 25, icon: '🪴' },
    { id: 2, name: 'Lampu Neon', price: 50, icon: '💡' },
    { id: 3, name: 'Kucing Tidur', price: 75, icon: '🐱' },
    { id: 4, name: 'Poster Retro', price: 40, icon: '🖼️' },
    { id: 5, name: 'Pemutar Musik', price: 60, icon: '📻' },
    { id: 6, name: 'Secangkir Kopi', price: 15, icon: '☕' }
];

// --- Inisialisasi DOM Elements ---
const coinDisplay = document.getElementById('coin-count');
const roomDecorations = document.getElementById('room-decorations');
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const shopBtn = document.getElementById('shop-btn');
const closeShopBtn = document.getElementById('close-shop-btn');
const shopModal = document.getElementById('shop-modal');
const shopItemsContainer = document.getElementById('shop-items');

// --- Fungsi Update & Storage ---
function updateCoins(amount) {
    coins += amount;
    localStorage.setItem('coins', coins);
    coinDisplay.textContent = coins;
}

function saveState() {
    localStorage.setItem('inventory', JSON.stringify(userInventory));
    localStorage.setItem('todos', JSON.stringify(todos));
}

// --- Render Aplikasi ---
function renderRoom() {
    roomDecorations.innerHTML = '';
    if (userInventory.length === 0) {
        roomDecorations.innerHTML = '<p class="placeholder-text">Kamar masih kosong. Selesaikan sesi fokus untuk membeli dekorasi!</p>';
        return;
    }

    userInventory.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item-card';
        itemEl.innerHTML = `${item.icon} <span>${item.name}</span>`;
        roomDecorations.appendChild(itemEl);
    });
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${todo.text}</span>
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
        `;
        todoList.appendChild(li);
    });
}

function renderShop() {
    shopItemsContainer.innerHTML = '';
    shopItems.forEach(item => {
        const isBought = userInventory.some(owned => owned.id === item.id);
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        card.innerHTML = `
            <div class="icon">${item.icon}</div>
            <h4>${item.name}</h4>
            <div class="price">💰 ${item.price} Poin</div>
            <button class="btn btn-primary" ${isBought ? 'disabled' : ''} onclick="buyItem(${item.id})">
                ${isBought ? 'Dimiliki' : 'Beli'}
            </button>
        `;
        shopItemsContainer.appendChild(card);
    });
}

// --- Logika Pomodoro Timer ---
let timer;
let timeLeft = 25 * 60; // 25 Menit
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timer);
        startBtn.textContent = 'Mulai';
        isRunning = false;
    } else {
        isRunning = true;
        startBtn.textContent = 'Jeda';
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                startBtn.textContent = 'Mulai';
                timeLeft = 25 * 60;
                updateTimerDisplay();
                updateCoins(20); // Hadiah 20 poin saat timer selesai
                alert('Selamat! Sesi fokus selesai. Anda mendapatkan +20 Poin 💰');
            }
        }, 1000);
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Mulai';
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// --- Logika To-Do List ---
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        todoInput.value = '';
        saveState();
        renderTodos();
    }
});

window.toggleTodo = function(index) {
    todos[index].completed = !todos[index].completed;
    if (todos[index].completed) {
        updateCoins(5); // Hadiah 5 poin setiap menyelesaikan tugas
    }
    saveState();
    renderTodos();
};

// --- Logika Toko ---
window.buyItem = function(id) {
    const item = shopItems.find(i => i.id === id);
    if (item && coins >= item.price) {
        updateCoins(-item.price);
        userInventory.push(item);
        saveState();
        renderRoom();
        renderShop();
    } else {
        alert('Poin Anda tidak cukup!');
    }
};

shopBtn.addEventListener('click', () => shopModal.style.display = 'flex');
closeShopBtn.addEventListener('click', () => shopModal.style.display = 'none');

// --- Inisialisasi Awal ---
coinDisplay.textContent = coins;
updateTimerDisplay();
renderRoom();
renderTodos();
renderShop();
