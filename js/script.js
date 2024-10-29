
let tasks = [];

$('#task-form').submit(function(e) {
    e.preventDefault();

    const editIndex = $(this).data('edit-index');
    const taskName = $('#task-name').val().trim();
    const taskDesc = $('#task-desc').val().trim();
    const taskDate = $('#task-date').val();

    if (!taskName || !taskDesc || !taskDate) {
        alert('Please fill in all fields.');
        return;
    }

    
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(taskDate).setHours(0, 0, 0, 0);
    if (selectedDate < currentDate) {
        alert('Due date cannot be in the past.');
        return;
    }

    const newTask = {
        name: taskName,
        description: taskDesc,
        date: taskDate,
        completed: editIndex !== undefined ? tasks[editIndex].completed : false,
    };

    if (editIndex !== undefined && editIndex !== null) {
        tasks[editIndex] = newTask;
        $(this).removeData('edit-index');
        $('#task-form button[type="submit"]').text('Add Task');
    } else {
        tasks.push(newTask);
    }

    saveTasksToLocalStorage();
    displayTasks();
    $('#task-form')[0].reset();
    displayLatestActivity();
});

function displayTasks() {
    const taskList = $('#task-list');
    taskList.empty();

    let filteredTasks = [...tasks];

    
    const filterStatus = $('#filter-status').val();
    if (filterStatus !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
            filterStatus === 'completed' ? task.completed : !task.completed
        );
    }

    
    const sortOption = $('#sort-tasks').val();
    if (sortOption === 'name') {
        filteredTasks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'date') {
        filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    filteredTasks.forEach((task, index) => {
        const statusBadge = task.completed ? 'Completed' : 'Pending';
        const taskRow = `
            <tr data-status="${statusBadge.toLowerCase()}">
                <td>${task.name}</td>
                <td>${task.description}</td>
                <td>${task.date}</td>
                <td><span class="badge ${task.completed ? 'badge-success' : 'badge-warning'}">${statusBadge}</span></td>
                <td>
                    ${!task.completed ? `<button class="btn btn-success btn-sm complete-task" data-index="${index}">Complete</button>` : ''}
                    <button class="btn btn-info btn-sm edit-task" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-task" data-index="${index}">Delete</button>
                </td>
            </tr>
        `;
        taskList.append(taskRow);
    });
}



$(document).on('click', '.complete-task', function() {
    const index = $(this).data('index');
    tasks[index].completed = true;
    saveTasksToLocalStorage();
    displayTasks();
    displayLatestActivity();
});


$(document).on('click', '.delete-task', function() {
    const index = $(this).data('index');
    tasks.splice(index, 1);
    saveTasksToLocalStorage();
    displayTasks();
    displayLatestActivity();
});


$(document).on('click', '.edit-task', function() {
    const index = $(this).data('index');
    const task = tasks[index];
    $('#task-name').val(task.name);
    $('#task-desc').val(task.description);
    $('#task-date').val(task.date);
    $('#task-form').data('edit-index', index);
    $('#task-form button[type="submit"]').text('Update Task');
});



function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    displayTasks();
}



function displayLatestActivity() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const activityList = $('#activity-list');
    activityList.empty();

    storedTasks.slice(-5).reverse().forEach(task => {
        const activityItem = `<li class="list-group-item">${task.name} - ${task.completed ? "Completed" : "Pending"}</li>`;
        activityList.append(activityItem);
    });
}




// Filtering and sorting
$('#filter-status').change(function() {
    displayTasks();
});

$('#sort-tasks').change(function() {
    displayTasks();
});

// Load tasks on page load
$(document).ready(function() {
    loadTasksFromLocalStorage();

    if ($('#activity-list').length) {
        displayLatestActivity();
    }

    // Check localStorage for dark mode preference on page load
    const darkModeSetting = localStorage.getItem('darkMode') === 'enabled';
    applyDarkMode(darkModeSetting);
});


$(document).on('click', '#dark-mode-toggle', function() {
    const isDark = !$('body').hasClass('dark-mode');
    applyDarkMode(isDark);
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});


function applyDarkMode(isDark) {
    if (isDark) {
        $('body').addClass('dark-mode');
        $('#dark-mode-toggle')
            .text('Light Mode')
            .removeClass('btn-outline-light')
            .addClass('btn-outline-secondary');
        $('nav').removeClass('bg-primary').addClass('bg-dark');
        $('footer').removeClass('bg-primary').addClass('bg-dark');
    } else {
        $('body').removeClass('dark-mode');
        $('#dark-mode-toggle')
            .text('Dark Mode')
            .removeClass('btn-outline-secondary')
            .addClass('btn-outline-light');
        $('nav').removeClass('bg-dark').addClass('bg-primary');
        $('footer').removeClass('bg-dark').addClass('bg-primary');
    }
}


$('#contact-form').submit(function(e) {
    e.preventDefault();

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const subject = $('#subject').val().trim();
    const message = $('#message').val().trim();

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }

    const modalContent = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
    `;
    $('#modal-body').html(modalContent);
    $('#contactModal').modal('show');


    $('#contact-form')[0].reset();
});
