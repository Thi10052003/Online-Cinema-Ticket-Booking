function handleKey(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const taskList = document.getElementById('taskList');

        // Create new list item
        const li = document.createElement('li');

        // Create checkbox for marking task as complete
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', toggleComplete);

        // Add task text
        const taskLabel = document.createElement('span');
        taskLabel.textContent = taskText;

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', deleteTask);

        li.appendChild(checkbox);
        li.appendChild(taskLabel);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
        taskInput.value = '';  // Clear input field
    }
}

function toggleComplete(event) {
    const listItem = event.target.parentElement;
    listItem.classList.toggle('completed');

    const taskList = document.getElementById('taskList');
    taskList.removeChild(listItem);

    if (listItem.classList.contains('completed')) {
        taskList.appendChild(listItem);  // Move completed tasks to the end
    } else {
        taskList.insertBefore(listItem, taskList.firstChild);  // Move incomplete tasks to the top
    }
}

function deleteTask(event) {
    const listItem = event.target.parentElement;
    const taskList = document.getElementById('taskList');
    taskList.removeChild(listItem);
}
