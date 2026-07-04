// DOM Elements
const todoInput = document.getElementById('todo-input');
const todoPriority = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clear-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Tasks state array
let tasks = JSON.parse(localStorage.getItem('vedatasks')) || [];
let currentFilter = 'all';

// Update Progress stats
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${completed}/${total} Tasks (${percentage}%)`;
}

// Render Tasks helper
function renderTasks() {
    taskList.innerHTML = '';
    
    // Sort tasks: High priority first, then Medium, then Low
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const sortedTasks = [...tasks].sort((a, b) => {
        // Uncompleted tasks first
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return priorityWeight[b.priority || 'medium'] - priorityWeight[a.priority || 'medium'];
    });

    // Filter tasks
    const filteredTasks = sortedTasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    updateProgress();

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

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Content details container
        const details = document.createElement('div');
        details.className = 'task-details';

        const checkbox = document.createElement('div');
        checkbox.className = 'task-checkbox';
        checkbox.innerHTML = '<i class="fa-solid fa-check"></i>';
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
        });

        // Priority Badge element
        const priorityBadge = document.createElement('span');
        priorityBadge.className = `priority-tag ${task.priority || 'medium'}`;
        priorityBadge.textContent = (task.priority || 'medium').toUpperCase();

        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        
        // Inline Edit interaction on double click
        textSpan.addEventListener('dblclick', () => startEditTask(task.id, textSpan, li));

        details.appendChild(checkbox);
        details.appendChild(priorityBadge);
        details.appendChild(textSpan);

        // Action panel container
        const actionPanel = document.createElement('div');
        actionPanel.className = 'action-panel';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.setAttribute('aria-label', 'Edit Task');
        editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
        editBtn.addEventListener('click', () => startEditTask(task.id, textSpan, li));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('aria-label', 'Delete Task');
        deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actionPanel.appendChild(editBtn);
        actionPanel.appendChild(deleteBtn);

        li.appendChild(details);
        li.appendChild(actionPanel);
        taskList.appendChild(li);
    });
}

// Start editing task inline
function startEditTask(id, textSpan, li) {
    if (li.classList.contains('editing')) return;
    li.classList.add('editing');
    
    const currentText = textSpan.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-task-input';
    input.value = currentText;
    
    // Replace text element with input field
    textSpan.replaceWith(input);
    input.focus();
    
    // Save on Enter or Blur
    function saveEdit() {
        const newText = input.value.trim();
        if (newText) {
            updateTaskText(id, newText);
        } else {
            renderTasks();
        }
    }

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEdit();
    });
    input.addEventListener('blur', saveEdit);
}

// Update Task Text helper
function updateTaskText(id, newText) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, text: newText };
        }
        return task;
    });
    saveToLocalStorage();
    renderTasks();
}

// Add Task function
function addTask() {
    const text = todoInput.value.trim();
    const priority = todoPriority.value;
    if (!text) return;

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        priority: priority
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
