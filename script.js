class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentTaskId = null;
        this.init();
        this.loadSampleTasks();
    }

    init() {
        this.bindEvents();
        this.updateTaskCounts();
    }

    bindEvents() {
        // Modal events
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.querySelector('.cancel-btn').addEventListener('click', () => this.closeModal());
        
        // Form events
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('deleteTaskBtn').addEventListener('click', () => this.deleteTask());
        
        // Search and filter events
        document.getElementById('searchInput').addEventListener('input', () => this.filterTasks());
        document.getElementById('priorityFilter').addEventListener('change', () => this.filterTasks());
        document.getElementById('assigneeFilter').addEventListener('change', () => this.filterTasks());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('taskModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    loadSampleTasks() {
        const sampleTasks = [
            {
                id: 1,
                title: "Launch Instagram ad campaign for Q2",
                description: "Create and launch targeted Instagram advertising campaign focusing on event discovery and social planning features",
                assignee: "Marketing",
                priority: "high",
                status: "todo",
                dueDate: "2024-02-15",
                comments: "Need to coordinate with design team for creative assets"
            },
            {
                id: 2,
                title: "Implement user feedback collection",
                description: "Build in-app feedback system to gather user insights on event planning experience",
                assignee: "Product",
                priority: "medium",
                status: "inprogress",
                dueDate: "2024-02-20",
                comments: "Working on UI mockups and user flow"
            },
            {
                id: 3,
                title: "Design onboarding flow improvements",
                description: "Redesign user onboarding to better showcase core features and increase activation rates",
                assignee: "Product",
                priority: "high",
                status: "review",
                dueDate: "2024-02-10",
                comments: "Initial designs ready for stakeholder review"
            },
            {
                id: 4,
                title: "Analyze competitor event discovery features",
                description: "Research and analyze how competitors handle event discovery, filtering, and recommendation systems",
                assignee: "Growth",
                priority: "medium",
                status: "done",
                dueDate: "2024-01-30",
                comments: "Completed competitive analysis report with actionable insights"
            },
            {
                id: 5,
                title: "Optimize calendar integration performance",
                description: "Improve sync speed and reliability of calendar integrations (Google Calendar, Apple Calendar)",
                assignee: "Product",
                priority: "high",
                status: "todo",
                dueDate: "2024-02-25",
                comments: "Users reporting sync delays and occasional failures"
            },
            {
                id: 6,
                title: "Develop referral program strategy",
                description: "Create comprehensive referral program to leverage social connections for user acquisition",
                assignee: "Growth",
                priority: "medium",
                status: "inprogress",
                dueDate: "2024-03-01",
                comments: "Researching incentive structures and tracking mechanisms"
            }
        ];

        this.tasks = sampleTasks;
        this.renderAllTasks();
        this.updateTaskCounts();
    }

    openModal(taskId = null) {
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');
        const deleteBtn = document.getElementById('deleteTaskBtn');
        
        this.currentTaskId = taskId;
        
        if (taskId) {
            // Edit mode
            modalTitle.textContent = 'Edit Task';
            deleteBtn.style.display = 'block';
            this.populateForm(taskId);
        } else {
            // Add mode
            modalTitle.textContent = 'Add New Task';
            deleteBtn.style.display = 'none';
            this.clearForm();
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('taskModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentTaskId = null;
        this.clearForm();
    }

    populateForm(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        document.getElementById('taskTitle').value = task.title || '';
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskAssignee').value = task.assignee || 'Marketing';
        document.getElementById('taskPriority').value = task.priority || 'medium';
        document.getElementById('taskStatus').value = task.status || 'todo';
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskComments').value = task.comments || '';
    }

    clearForm() {
        document.getElementById('taskForm').reset();
        document.getElementById('taskAssignee').value = 'Marketing';
        document.getElementById('taskPriority').value = 'medium';
        document.getElementById('taskStatus').value = 'todo';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('taskTitle').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            assignee: document.getElementById('taskAssignee').value,
            priority: document.getElementById('taskPriority').value,
            status: document.getElementById('taskStatus').value,
            dueDate: document.getElementById('taskDueDate').value,
            comments: document.getElementById('taskComments').value.trim()
        };

        if (!formData.title) {
            alert('Task title is required');
            return;
        }

        if (this.currentTaskId) {
            // Update existing task
            const taskIndex = this.tasks.findIndex(t => t.id === this.currentTaskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...formData };
            }
        } else {
            // Create new task
            const newTask = {
                id: Date.now(),
                ...formData
            };
            this.tasks.push(newTask);
        }

        this.renderAllTasks();
        this.updateTaskCounts();
        this.closeModal();
    }

    deleteTask() {
        if (!this.currentTaskId) return;
        
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== this.currentTaskId);
            this.renderAllTasks();
            this.updateTaskCounts();
            this.closeModal();
        }
    }

    renderAllTasks() {
        const columns = ['todo', 'inprogress', 'review', 'done'];
        
        columns.forEach(status => {
            const container = document.getElementById(`${status}-list`);
            container.innerHTML = '';
            
            const tasksInColumn = this.tasks.filter(task => task.status === status);
            tasksInColumn.forEach(task => {
                container.appendChild(this.createTaskCard(task));
            });
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card priority-${task.priority}`;
        card.dataset.taskId = task.id;
        card.draggable = true;
        
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const today = new Date();
        const isOverdue = dueDate && dueDate < today;
        const isDueSoon = dueDate && dueDate <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
        
        let dueDateClass = '';
        if (isOverdue) dueDateClass = 'overdue';
        else if (isDueSoon) dueDateClass = 'due-soon';
        
        card.innerHTML = `
            <div class="task-header">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
            </div>
            ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                <span class="task-assignee">${task.assignee}</span>
                ${task.dueDate ? `<span class="task-due-date ${dueDateClass}"><i class="fas fa-calendar"></i> ${this.formatDate(task.dueDate)}</span>` : ''}
            </div>
            ${task.comments ? `<div class="task-comments">${this.escapeHtml(task.comments)}</div>` : ''}
        `;
        
        // Add click event
        card.addEventListener('click', () => this.openModal(task.id));
        
        // Add drag events
        card.addEventListener('dragstart', (e) => this.handleDragStart(e));
        card.addEventListener('dragend', (e) => this.handleDragEnd(e));
        
        return card;
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
        e.target.classList.add('dragging');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    setupDropZones() {
        const taskLists = document.querySelectorAll('.task-list');
        
        taskLists.forEach(list => {
            list.addEventListener('dragover', (e) => {
                e.preventDefault();
                list.classList.add('drag-over');
            });
            
            list.addEventListener('dragleave', (e) => {
                if (!list.contains(e.relatedTarget)) {
                    list.classList.remove('drag-over');
                }
            });
            
            list.addEventListener('drop', (e) => {
                e.preventDefault();
                list.classList.remove('drag-over');
                
                const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                const newStatus = list.id.replace('-list', '');
                
                this.updateTaskStatus(taskId, newStatus);
            });
        });
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            task.status = newStatus;
            this.renderAllTasks();
            this.updateTaskCounts();
        }
    }

    filterTasks() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const priorityFilter = document.getElementById('priorityFilter').value;
        const assigneeFilter = document.getElementById('assigneeFilter').value;
        
        const taskCards = document.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            const taskId = parseInt(card.dataset.taskId);
            const task = this.tasks.find(t => t.id === taskId);
            
            if (!task) return;
            
            const matchesSearch = !searchTerm || 
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm) ||
                task.comments.toLowerCase().includes(searchTerm);
            
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter;
            
            if (matchesSearch && matchesPriority && matchesAssignee) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        this.updateTaskCounts();
    }

    updateTaskCounts() {
        const columns = ['todo', 'inprogress', 'review', 'done'];
        
        columns.forEach(status => {
            const visibleTasks = document.querySelectorAll(`#${status}-list .task-card[style=""], #${status}-list .task-card:not([style])`);
            const countElement = document.querySelector(`[data-status="${status}"] .task-count`);
            if (countElement) {
                countElement.textContent = visibleTasks.length;
            }
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    
    // Setup drag and drop after initialization
    setTimeout(() => {
        taskManager.setupDropZones();
    }, 100);
});