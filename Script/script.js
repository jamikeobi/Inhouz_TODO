// Initial Setup
let tasks = [];
let currentPage = 1;
const itemsPerPage = 5;

// Toggle between Todo Creation Page and Dashboard Page
function showCreateTaskPage() {
    document.getElementById('todo-creation-page').style.display = 'block';
    document.getElementById('dashboard-page').style.display = 'none';
}

function showDashboardPage() {
    document.getElementById('todo-creation-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'block';
    renderTasks();
}

// Add Event Listener to Executed By Self Checkbox
document.getElementById('executed-by-self').addEventListener('change', (e) => {
    const assignToSection = document.getElementById('assign-to-section');
    assignToSection.style.display = e.target.checked ? 'none' : 'block';
});

// Create Task Functionality
document.getElementById('create-task').addEventListener('click', () => {
    const taskName = document.getElementById('task-name').value;
    const taskDesc = document.getElementById('task-desc').value;
    const executedBySelf = document.getElementById('executed-by-self').checked;
    const assignedTo = document.getElementById('assign-to').value;
    const status = executedBySelf ? 'In Progress' : 'Pending Request';

    const task = {
        id: Date.now(),
        name: taskName,
        description: taskDesc,
        executedBySelf,
        assignedTo: executedBySelf ? '' : assignedTo,
        status
    };

    tasks.push(task);
    resetForm();
    showDashboardPage();
});

// Render Tasks in Table
function renderTasks() {
    const taskTableBody = document.getElementById('task-table').querySelector('tbody');
    taskTableBody.innerHTML = '';

    // Pagination logic
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentTasks = tasks.slice(start, end);

    currentTasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>${task.status}</td>
            <td>${task.executedBySelf ? 'Self' : 'Other'}</td>
            <td>${task.assignedTo}</td>
            <td>
                ${task.executedBySelf ? '' : `<button onclick="acceptTask(${task.id})">Accept</button> <button onclick="rejectTask(${task.id})">Reject</button>`}
                <button onclick="completeTask(${task.id})">Complete</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });

    renderPagination();
}

// Accept, Reject and Complete Task
function acceptTask(taskId) {
    updateTaskStatus(taskId, 'In Progress');
}

function rejectTask(taskId) {
    updateTaskStatus(taskId, 'Rejected');
}

function completeTask(taskId) {
    updateTaskStatus(taskId, 'Completed');
}

// Update Task Status
function updateTaskStatus(taskId, newStatus) {
    tasks = tasks.map(task => task.id === taskId ? {...task, status: newStatus} : task);
    renderTasks();
}

// Render Pagination
function renderPagination() {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => {
            currentPage = i;
            renderTasks();
        });
        paginationDiv.appendChild(button);
    }
}

// Reset Form Fields
function resetForm() {
    document.getElementById('task-name').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('executed-by-self').checked = false;
    document.getElementById('assign-to-section').style.display = 'none';
}

// Initial Load
showCreateTaskPage();
