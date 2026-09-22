// =====================================================
// STUDENT TASK MANAGER
// JavaScript Practical No. 2
// =====================================================


// =====================================================
// 1. ARRAY FOR STORING APPLICATION DATA
// =====================================================

let tasks = [];


// =====================================================
// 2. LOAD DATA FROM LOCAL STORAGE
// =====================================================

const storedTasks = localStorage.getItem("studentTasks");

if (storedTasks) {

    // JSON -> JavaScript Array

    tasks = JSON.parse(storedTasks);
}


// =====================================================
// 3. GET HTML ELEMENTS
// =====================================================

const taskForm =
    document.getElementById("taskForm");

const studentName =
    document.getElementById("studentName");

const email =
    document.getElementById("email");

const taskTitle =
    document.getElementById("taskTitle");

const priority =
    document.getElementById("priority");

const dueDate =
    document.getElementById("dueDate");

const taskList =
    document.getElementById("taskList");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const filterPriority =
    document.getElementById("filterPriority");

const clearAllBtn =
    document.getElementById("clearAllBtn");


// Statistics

const totalTasks =
    document.getElementById("totalTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const highPriorityTasks =
    document.getElementById("highPriorityTasks");

const taskCount =
    document.getElementById("taskCount");


// =====================================================
// 4. FORM SUBMIT EVENT
// =====================================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Clear previous errors

    clearErrors();


    // =================================================
    // 5. GET INPUT VALUES
    // =================================================

    const nameValue =
        studentName.value.trim();

    const emailValue =
        email.value.trim();

    const titleValue =
        taskTitle.value.trim();

    const priorityValue =
        priority.value;

    const dateValue =
        dueDate.value;


    // =================================================
    // 6. VALIDATION
    // =================================================

    let isValid = true;


    // Student name validation

    if (nameValue === "") {

        showError(
            "studentNameError",
            "Student name is required."
        );

        isValid = false;

    } else if (nameValue.length < 3) {

        showError(
            "studentNameError",
            "Name must contain at least 3 characters."
        );

        isValid = false;
    }


    // Email validation

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (emailValue === "") {

        showError(
            "emailError",
            "Email is required."
        );

        isValid = false;

    } else if (!emailPattern.test(emailValue)) {

        showError(
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;
    }


    // Task title validation

    if (titleValue === "") {

        showError(
            "taskTitleError",
            "Task title is required."
        );

        isValid = false;

    } else if (titleValue.length < 3) {

        showError(
            "taskTitleError",
            "Task title must contain at least 3 characters."
        );

        isValid = false;
    }


    // Priority validation

    if (priorityValue === "") {

        showError(
            "priorityError",
            "Please select a priority."
        );

        isValid = false;
    }


    // Date validation

    if (dateValue === "") {

        showError(
            "dueDateError",
            "Due date is required."
        );

        isValid = false;

    } else {

        const selectedDate =
            new Date(dateValue);

        const today =
            new Date();

        today.setHours(0, 0, 0, 0);


        if (selectedDate < today) {

            showError(
                "dueDateError",
                "Due date cannot be in the past."
            );

            isValid = false;
        }
    }


    // =================================================
    // STOP IF VALIDATION FAILED
    // =================================================

    if (!isValid) {

        return;
    }


    // =================================================
    // 7. CREATE JSON OBJECT
    // =================================================

    const newTask = {

        id: Date.now(),

        studentName: nameValue,

        email: emailValue,

        title: titleValue,

        priority: priorityValue,

        dueDate: dateValue,

        completed: false
    };


    // =================================================
    // 8. ADD OBJECT TO ARRAY
    // =================================================

    tasks.push(newTask);


    // =================================================
    // 9. SAVE ARRAY AS JSON
    // =================================================

    saveTasks();


    // =================================================
    // 10. UPDATE UI
    // =================================================

    renderTasks();

    updateStatistics();


    // =================================================
    // 11. RESET FORM
    // =================================================

    taskForm.reset();


    alert("Task added successfully!");
});


// =====================================================
// SHOW ERROR
// =====================================================

function showError(elementId, message) {

    document.getElementById(elementId).textContent =
        message;
}


// =====================================================
// CLEAR ERRORS
// =====================================================

function clearErrors() {

    const errors =
        document.querySelectorAll(".error");

    errors.forEach(function(error) {

        error.textContent = "";

    });
}


// =====================================================
// SAVE DATA AS JSON
// =====================================================

function saveTasks() {

    const jsonData =
        JSON.stringify(tasks);

    localStorage.setItem(
        "studentTasks",
        jsonData
    );
}


// =====================================================
// DISPLAY TASKS
// =====================================================

function renderTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedPriority =
        filterPriority.value;


    // Filter tasks

    const filteredTasks =
        tasks.filter(function(task) {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText)
                ||
                task.studentName
                    .toLowerCase()
                    .includes(searchText);


            const matchesPriority =
                selectedPriority === "All"
                ||
                task.priority === selectedPriority;


            return (
                matchesSearch &&
                matchesPriority
            );
        });


    // Empty message

    if (filteredTasks.length === 0) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";
    }


    // =================================================
    // CREATE HTML FOR EACH TASK
    // =================================================

    filteredTasks.forEach(function(task) {

        const card =
            document.createElement("div");


        card.className =
            "task-card";


        if (task.completed) {

            card.classList.add(
                "completed"
            );
        }


        card.innerHTML = `

            <div class="task-top">

                <div class="task-title">
                    ${task.title}
                </div>

                <span class="priority ${task.priority}">
                    ${task.priority}
                </span>

            </div>


            <div class="task-info">

                <strong>Student:</strong>
                ${task.studentName}

            </div>


            <div class="task-info">

                <strong>Email:</strong>
                ${task.email}

            </div>


            <div class="task-info">

                <strong>Due Date:</strong>
                ${task.dueDate}

            </div>


            <div class="task-info">

                <strong>Status:</strong>

                ${
                    task.completed
                    ? "Completed"
                    : "Pending"
                }

            </div>


            <div class="task-actions">

                <button
                    class="btn-success"
                    onclick="toggleTask(${task.id})"
                >
                    ${
                        task.completed
                        ? "Mark Pending"
                        : "Mark Complete"
                    }
                </button>


                <button
                    class="btn-delete"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>
        `;


        taskList.appendChild(card);

    });


    taskCount.textContent =
        `${filteredTasks.length} tasks`;
}


// =====================================================
// MARK TASK COMPLETE / PENDING
// =====================================================

function toggleTask(id) {

    const task =
        tasks.find(function(task) {

            return task.id === id;

        });


    if (task) {

        task.completed =
            !task.completed;

        saveTasks();

        renderTasks();

        updateStatistics();
    }
}


// =====================================================
// DELETE TASK
// =====================================================

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {

        return;
    }


    tasks =
        tasks.filter(function(task) {

            return task.id !== id;

        });


    saveTasks();

    renderTasks();

    updateStatistics();
}


// =====================================================
// SEARCH EVENT
// =====================================================

searchInput.addEventListener(
    "input",
    function() {

        renderTasks();

    }
);


// =====================================================
// FILTER EVENT
// =====================================================

filterPriority.addEventListener(
    "change",
    function() {

        renderTasks();

    }
);


// =====================================================
// CLEAR ALL TASKS
// =====================================================

clearAllBtn.addEventListener(
    "click",
    function() {

        if (tasks.length === 0) {

            alert(
                "There are no tasks to clear."
            );

            return;
        }


        const confirmation =
            confirm(
                "Delete all tasks?"
            );


        if (confirmation) {

            tasks = [];

            saveTasks();

            renderTasks();

            updateStatistics();

            alert(
                "All tasks have been deleted."
            );
        }
    }
);


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed === true;

        }).length;


    const pending =
        tasks.filter(function(task) {

            return task.completed === false;

        }).length;


    const highPriority =
        tasks.filter(function(task) {

            return task.priority === "High";

        }).length;


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;


    highPriorityTasks.textContent =
        highPriority;
}


// =====================================================
// INITIAL LOAD
// =====================================================

renderTasks();

updateStatistics();