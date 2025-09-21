var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Check if user is logged in
function checkAuth() {
    var currentUser = localStorage.getItem("currentUser");
    var authContainer = document.getElementById("auth-container");
    var contain = document.getElementById("contain");
    var loginBtn = document.getElementById("login-btn");
    var userInfo = document.getElementById("user-info");
    var usernameDisplay = document.getElementById("username-display");
    if (currentUser) {
        authContainer.style.display = "none";
        contain.style.display = "flex";
        loginBtn.style.display = "none";
        userInfo.style.display = "flex";
        usernameDisplay.textContent = currentUser;
        loadUserTasks(currentUser);
    }
    else {
        authContainer.style.display = "flex";
        contain.style.display = "none";
        loginBtn.style.display = "block";
        userInfo.style.display = "none";
    }
}
// Load tasks for specific user
function loadUserTasks(username) {
    var userTasks = JSON.parse(localStorage.getItem("tasks_".concat(username)) || "[]");
    var allUserTasks = JSON.parse(localStorage.getItem("allTasks_".concat(username)) || "[]");
    currentTasks = userTasks;
    allTasks = allUserTasks;
    showTasks();
}
// Save tasks for specific user
function saveTasks(tasks) {
    var currentUser = localStorage.getItem("currentUser");
    if (!currentUser)
        return;
    currentTasks = tasks;
    localStorage.setItem("tasks_".concat(currentUser), JSON.stringify(tasks));
    var currentTaskTexts = tasks.map(function (t) { return t.text; });
    tasks.forEach(function (task) {
        if (!allTasks.some(function (t) { return t.text === task.text && t.date === task.date; })) {
            allTasks.push(__assign({}, task));
        }
    });
    localStorage.setItem("allTasks_".concat(currentUser), JSON.stringify(allTasks));
}
// Login/Logout functionality
document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    checkAuth();
    window.location.href = "index.html";
});
document.getElementById("login-btn").addEventListener("click", function () {
    var currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        window.location.href = "index.html";
    }
});
// Initialize
var taskDateInput = document.getElementById('task-date');
taskDateInput.valueAsDate = new Date();
var allTasks = [];
var currentTasks = [];
function showTasks() {
    var contain = document.getElementById("tasks-container");
    contain.innerHTML = "";
    currentTasks.forEach(function (task, idx) {
        makeTask(task.text, task.priority, task.completed, idx, task.date);
    });
}
function getTasks() {
    return currentTasks;
}
function makeTask(text, priority, completed, idx, date) {
    var contain = document.getElementById("tasks-container");
    var newdiv = document.createElement("div");
    newdiv.classList.add("newd");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", function () {
        label.classList.toggle("completed", this.checked);
        var tasks = getTasks();
        tasks[idx].completed = this.checked;
        var allTaskIndex = allTasks.findIndex(function (t) { return t.text === text && t.date === date; });
        if (allTaskIndex !== -1) {
            allTasks[allTaskIndex].completed = this.checked;
            saveTasks(tasks);
        }
        saveTasks(tasks);
        var listSection = document.getElementById("list-section");
        if (listSection.style.display === "block") {
            showList();
        }
    });
    var label = document.createElement("span");
    label.textContent = text;
    label.classList.add("task-text");
    if (completed)
        label.classList.add("completed");
    var priorityBadge = document.createElement("span");
    priorityBadge.classList.add("task-priority", "priority-".concat(priority));
    if (priority === "low")
        priorityBadge.textContent = "Low";
    if (priority === "medium")
        priorityBadge.textContent = "Medium";
    if (priority === "high")
        priorityBadge.textContent = "High";
    var dateBadge = document.createElement("span");
    dateBadge.textContent = date || "No date";
    dateBadge.style.fontSize = "14px";
    dateBadge.style.color = "var(--grey)";
    var taskContent = document.createElement("div");
    taskContent.classList.add("task-content");
    var taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");
    var deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener("click", function () {
        var taskToDelete = currentTasks[idx];
        var allTaskIndex = allTasks.findIndex(function (t) { return t.text === taskToDelete.text && t.date === taskToDelete.date; });
        if (allTaskIndex !== -1) {
            allTasks[allTaskIndex].deleted = true;
        }
        else {
            taskToDelete.deleted = true;
            allTasks.push(taskToDelete);
        }
        saveTasks(allTasks);
        var tasks = getTasks();
        tasks.splice(idx, 1);
        saveTasks(tasks);
        showTasks();
        var listSection = document.getElementById("list-section");
        if (listSection.style.display === "block") {
            showList();
        }
    });
    taskContent.appendChild(checkbox);
    taskContent.appendChild(label);
    taskContent.appendChild(priorityBadge);
    taskContent.appendChild(dateBadge);
    taskActions.appendChild(deleteBtn);
    newdiv.appendChild(taskContent);
    newdiv.appendChild(taskActions);
    contain.appendChild(newdiv);
}
function addbox() {
    var currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Please login to add tasks");
        return;
    }
    var inbox = document.getElementById("inbox");
    var text = inbox.value.trim();
    var prioritySelect = document.getElementById("priority-select");
    var priority = prioritySelect.value;
    var dateInput = document.getElementById("task-date");
    var date = dateInput.value;
    if (text === "") {
        alert("Please enter a task");
        return;
    }
    var tasks = getTasks();
    tasks.push({ text: text, priority: priority, completed: false, date: date });
    saveTasks(tasks);
    showTasks();
    inbox.value = "";
}
var listBtn = document.getElementById("list-btn");
var listSection = document.getElementById("list-section");
var overlay = document.getElementById("overlay");
function toggleList() {
    var currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Please login to view task history");
        return;
    }
    if (listSection.style.display === "block") {
        listSection.style.display = "none";
        overlay.style.display = "none";
    }
    else {
        listSection.style.display = "block";
        overlay.style.display = "block";
        showList();
    }
}
listBtn.addEventListener("click", toggleList);
overlay.addEventListener("click", toggleList);
function showList() {
    var tableBody = document.getElementById("list-table-body");
    tableBody.innerHTML = "";
    var sortedTasks = __spreadArray([], allTasks, true).sort(function (a, b) {
        if (a.date < b.date)
            return 1;
        if (a.date > b.date)
            return -1;
        return 0;
    });
    sortedTasks.forEach(function (task) {
        var row = document.createElement("tr");
        var taskCell = document.createElement("td");
        taskCell.textContent = task.text;
        if (task.completed)
            taskCell.style.textDecoration = "line-through";
        row.appendChild(taskCell);
        var priorityCell = document.createElement("td");
        priorityCell.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        priorityCell.classList.add("priority-text-".concat(task.priority));
        row.appendChild(priorityCell);
        var statusCell = document.createElement("td");
        if (task.completed) {
            statusCell.textContent = "Completed";
            statusCell.classList.add("status-completed");
        }
        else {
            statusCell.textContent = "Pending";
            statusCell.classList.add("status-pending");
        }
        row.appendChild(statusCell);
        var dateCell = document.createElement("td");
        dateCell.textContent = task.date || "No date";
        row.appendChild(dateCell);
        tableBody.appendChild(row);
    });
}
// Check authentication on page load
checkAuth();
