const taskInput = document.getElementById('taskInput');
const groupInput = document.getElementById('groupInput');
const addBtn = document.getElementById('addBtn');
const tasksContainer = document.getElementById('tasksContainer');

// Load tasks from localStorage when page loads
window.addEventListener('DOMContentLoaded', loadTasks);

taskInput.addEventListener('input', toggleAddBtn);
groupInput.addEventListener('input', toggleAddBtn);

function toggleAddBtn() {
    addBtn.disabled = taskInput.value.trim() === '' || groupInput.value.trim() === '';
}

addBtn.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    const groupName = groupInput.value.trim();

    if (!taskName || !groupName) return;

    addTask(taskName, groupName, false);

    // Save to localStorage
    saveTasksToLocalStorage();

    taskInput.value = '';
    addBtn.disabled = true;
});

function addTask(taskName, groupName, completed) {
    let groupDiv = document.querySelector(`.group[data-group="${groupName}"]`);
    if (!groupDiv) {
        groupDiv = document.createElement('div');
        groupDiv.classList.add('group');
        groupDiv.dataset.group = groupName;

        const groupHeader = document.createElement('h2');
        groupHeader.textContent = groupName;
        groupDiv.appendChild(groupHeader);

        const groupTasks = document.createElement('div');
        groupTasks.classList.add('group-tasks');
        groupDiv.appendChild(groupTasks);

        tasksContainer.appendChild(groupDiv);
    }

    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.textContent = '✓';
    if (completed) taskDiv.style.textDecoration = 'line-through';

    completeBtn.addEventListener('click', () => {
        taskDiv.style.textDecoration = taskDiv.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        saveTasksToLocalStorage(); // Update localStorage
    });

    const taskText = document.createElement('span');
    taskText.textContent = taskName;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        taskDiv.remove();
        saveTasksToLocalStorage(); // Update localStorage
    });

    taskDiv.appendChild(completeBtn);
    taskDiv.appendChild(taskText);
    taskDiv.appendChild(deleteBtn);

    groupDiv.querySelector('.group-tasks').appendChild(taskDiv);
}

function saveTasksToLocalStorage() {
    const groups = [];
    document.querySelectorAll('.group').forEach(group => {
        const groupName = group.dataset.group;
        const tasks = [];
        group.querySelectorAll('.task').forEach(taskDiv => {
            tasks.push({
                name: taskDiv.querySelector('span').textContent,
                completed: taskDiv.style.textDecoration === 'line-through'
            });
        });
        groups.push({ groupName, tasks });
    });
    localStorage.setItem('tasks', JSON.stringify(groups));
}

function loadTasks() {
    const savedGroups = JSON.parse(localStorage.getItem('tasks')) || [];
    savedGroups.forEach(group => {
        group.tasks.forEach(task => {
            addTask(task.name, group.groupName, task.completed);
        });
    });
}
