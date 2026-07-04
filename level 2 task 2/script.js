// DOM Elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clear-btn');

// Tasks state array
let tasks = JSON.parse(localStorage.getItem('vedatasks')) || [];
let currentFilter = 'all';

// Render Tasks helper
function renderTasks() {
    taskList.innerHTML = '';
    
    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-state';
        emptyMessage.innerHTML = `
            <i class="fa-solid fa-clipboard-list"></i>
            <p>No tasks found under this filter!</p>
        `;
        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Content elements
        const details = document.createElement('div');
        details.className = 'task-details';
        details.addEventListener('click', () => toggleTaskComplete(task.id));

        const checkbox = document.createElement('div');
        checkbox.className = 'task-checkbox';
        checkbox.innerHTML = '<i class="fa-solid fa-check"></i>';

        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        details.appendChild(checkbox);
        details.appendChild(textSpan);

        // Delete Action button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('aria-label', 'Delete Task');
        deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(details);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Add Task function
function addTask() {
    const text = todoInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveToLocalStorage();
    todoInput.value = '';
    renderTasks();
}

// Toggle Complete function
function toggleTaskComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveToLocalStorage();
    renderTasks();
}

// Delete Task function
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
}

// Clear Completed function
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveToLocalStorage();
    renderTasks();
}

// Save state helper
function saveToLocalStorage() {
    localStorage.setItem('vedatasks', JSON.stringify(tasks));
}

// Input listeners
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Filter button listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// Clear button listener
clearBtn.addEventListener('click', clearCompleted);

// Initial setup
renderTasks();
