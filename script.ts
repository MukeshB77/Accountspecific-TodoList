// Define interfaces
interface Task {
    text: string;
    priority: string;
    completed: boolean;
    date: string;
    deleted?: boolean;
}

// Check if user is logged in
function checkAuth(): void {
    const currentUser = localStorage.getItem("currentUser");
    const authContainer = document.getElementById("auth-container") as HTMLDivElement;
    const contain = document.getElementById("contain") as HTMLDivElement;
    const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;
    const userInfo = document.getElementById("user-info") as HTMLDivElement;
    const usernameDisplay = document.getElementById("username-display") as HTMLSpanElement;

    if (currentUser) {
        authContainer.style.display = "none";
        contain.style.display = "flex";
        loginBtn.style.display = "none";
        userInfo.style.display = "flex";
        usernameDisplay.textContent = currentUser;
        loadUserTasks(currentUser);
    } else {
        authContainer.style.display = "flex";
        contain.style.display = "none";
        loginBtn.style.display = "block";
        userInfo.style.display = "none";
    }
}

// Load tasks for specific user
function loadUserTasks(username: string): void {
    const userTasks: Task[] = JSON.parse(localStorage.getItem(`tasks_${username}`) || "[]");
    const allUserTasks: Task[] = JSON.parse(localStorage.getItem(`allTasks_${username}`) || "[]");
    
    currentTasks = userTasks;
    allTasks = allUserTasks;
    
    showTasks();
}

// Save tasks for specific user
function saveTasks(tasks: Task[]): void {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;
    
    currentTasks = tasks;
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
    
    const currentTaskTexts = tasks.map(t => t.text);
    
    tasks.forEach(task => {
        if (!allTasks.some(t => t.text === task.text && t.date === task.date)) {
            allTasks.push({...task});
        }
    });
    
    localStorage.setItem(`allTasks_${currentUser}`, JSON.stringify(allTasks));
}

// Login/Logout functionality
document.getElementById("logout-btn")!.addEventListener("click", function(): void {
    localStorage.removeItem("currentUser");
    checkAuth();
    window.location.href = "index.html";
});

document.getElementById("login-btn")!.addEventListener("click", function(): void {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        window.location.href = "index.html";
    }
});

// Initialize
const taskDateInput = document.getElementById('task-date') as HTMLInputElement;
taskDateInput.valueAsDate = new Date();

let allTasks: Task[] = [];
let currentTasks: Task[] = [];

function showTasks(): void {
    const contain = document.getElementById("tasks-container") as HTMLDivElement;
    contain.innerHTML = ""; 
    currentTasks.forEach((task, idx) => {
        makeTask(task.text, task.priority, task.completed, idx, task.date);
    });
}

function getTasks(): Task[] {
    return currentTasks;
}

function makeTask(text: string, priority: string, completed: boolean, idx: number, date: string): void {
    const contain = document.getElementById("tasks-container") as HTMLDivElement;
    const newdiv = document.createElement("div");
    newdiv.classList.add("newd");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", function(): void {
        label.classList.toggle("completed", this.checked);
        const tasks = getTasks();
        tasks[idx].completed = this.checked;
        
        const allTaskIndex = allTasks.findIndex(t => t.text === text && t.date === date);
        if (allTaskIndex !== -1) {
            allTasks[allTaskIndex].completed = this.checked;
            saveTasks(tasks);
        }
        
        saveTasks(tasks);
    
        const listSection = document.getElementById("list-section") as HTMLDivElement;
        if (listSection.style.display === "block") {
            showList();
        }
    });

    const label = document.createElement("span");
    label.textContent = text;
    label.classList.add("task-text");
    if (completed) label.classList.add("completed");

    const priorityBadge = document.createElement("span");
    priorityBadge.classList.add("task-priority", `priority-${priority}`);
    if(priority === "low") priorityBadge.textContent = "Low";
    if(priority === "medium") priorityBadge.textContent = "Medium";
    if(priority === "high") priorityBadge.textContent = "High";
    
    const dateBadge = document.createElement("span");
    dateBadge.textContent = date || "No date";
    dateBadge.style.fontSize = "14px";
    dateBadge.style.color = "var(--grey)";

    const taskContent = document.createElement("div");
    taskContent.classList.add("task-content");

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener("click", function(): void {
        const taskToDelete = currentTasks[idx];
        const allTaskIndex = allTasks.findIndex(t => t.text === taskToDelete.text && t.date === taskToDelete.date);
        
        if (allTaskIndex !== -1) {
            allTasks[allTaskIndex].deleted = true;
        } else {
            taskToDelete.deleted = true;
            allTasks.push(taskToDelete);
        }
        
        saveTasks(allTasks);
        
        const tasks = getTasks();
        tasks.splice(idx, 1);
        saveTasks(tasks);
        showTasks();
        
        const listSection = document.getElementById("list-section") as HTMLDivElement;
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

function addbox(): void {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Please login to add tasks");
        return;
    }
    
    const inbox = document.getElementById("inbox") as HTMLInputElement;
    const text = inbox.value.trim();
    const prioritySelect = document.getElementById("priority-select") as HTMLSelectElement;
    const priority = prioritySelect.value;
    const dateInput = document.getElementById("task-date") as HTMLInputElement;
    const date = dateInput.value;
    
    if (text === "") {
        alert("Please enter a task");
        return;
    }
    
    const tasks = getTasks();
    tasks.push({text, priority, completed: false, date});
    saveTasks(tasks);
    showTasks();
    
    inbox.value = "";
}

const listBtn = document.getElementById("list-btn") as HTMLButtonElement;
const listSection = document.getElementById("list-section") as HTMLDivElement;
const overlay = document.getElementById("overlay") as HTMLDivElement;

function toggleList(): void {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Please login to view task history");
        return;
    }
    
    if (listSection.style.display === "block") {
        listSection.style.display = "none";
        overlay.style.display = "none";
    } else {
        listSection.style.display = "block";
        overlay.style.display = "block";
        showList();
    }
}

listBtn.addEventListener("click", toggleList);
overlay.addEventListener("click", toggleList);

function showList(): void {
    const tableBody = document.getElementById("list-table-body") as HTMLTableSectionElement;
    tableBody.innerHTML = "";
    
    const sortedTasks = [...allTasks].sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
    });
    
    sortedTasks.forEach(task => {
        const row = document.createElement("tr");
        
        const taskCell = document.createElement("td");
        taskCell.textContent = task.text;
        if (task.completed) taskCell.style.textDecoration = "line-through";
        row.appendChild(taskCell);
        
        const priorityCell = document.createElement("td");
        priorityCell.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        priorityCell.classList.add(`priority-text-${task.priority}`);
        row.appendChild(priorityCell);
        
        const statusCell = document.createElement("td");
        if (task.completed) {
            statusCell.textContent = "Completed";
            statusCell.classList.add("status-completed");
        } else {
            statusCell.textContent = "Pending";
            statusCell.classList.add("status-pending");
        }
        row.appendChild(statusCell);
        
        const dateCell = document.createElement("td");
        dateCell.textContent = task.date || "No date";
        row.appendChild(dateCell);
        
        tableBody.appendChild(row);
    });
}

// Check authentication on page load
checkAuth();