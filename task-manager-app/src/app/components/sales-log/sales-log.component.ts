import { Component, OnInit, HostListener } from '@angular/core';
import { TaskService, Task } from '../../task.service';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { NewTaskModalComponent } from '../task-modal/new-task-modal.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../helper/click-outside.directive';

@Component({
  selector: 'app-sales-log',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, CommonModule, NewTaskModalComponent, FormsModule],
  templateUrl: './sales-log.component.html'
})
export class SalesLogComponent implements OnInit {
  tasks: Task[] = [];
  showModal = false;

  selectedTaskTypes: string[] = [];

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  originalTasks: any[] = []; // store original unfiltered data
  filteredTasks: any[] = []; // bind this to the template

  filterTasks(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredTasks = [...this.originalTasks].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA == null || valueB == null) return 0;

      const valA = typeof valueA === 'string' ? valueA.toLowerCase() : valueA;
      const valB = typeof valueB === 'string' ? valueB.toLowerCase() : valueB;

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  dropdownOpenTaskId: string | null = null;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.dropdownOpenTaskId) {
      this.dropdownOpenTaskId = null;
    }
  }

  toggleDropdown(taskId: number) {
    const idStr = taskId.toString();
    this.dropdownOpenTaskId = this.dropdownOpenTaskId === idStr ? null : idStr;
  }

  isTaskTypeFilterOpen = false;

  closeDropdown() {
    this.isTaskTypeFilterOpen = false;
  }

  generateUniqueId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  handleSave(updatedTask: any) {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index > -1) {
      this.tasks[index] = updatedTask; // Update
    } else {
      // Optionally assign a new id if creating
      updatedTask.id = this.generateUniqueId();
      this.tasks.push(updatedTask); // Create
    }
    this.fetchTasks(); // <== Refresh UI
    this.selectedTask = null;
    this.selectedTask = null;
  }

  getDropdownStyle(button: HTMLElement) {
    if (!button) return {};

    const rect = button.getBoundingClientRect();
    return {
      position: 'fixed',
      top: `${rect.top}px`, 
      left: `${rect.left}px`,
      width: '192px',  
      zIndex: 9999,
    };
  }

  selectedTask: any = null;

  editTask(task: any) {
    this.selectedTask = task;
    this.showModal = true;
    this.fetchTasks();
  }

  duplicateTask(task: any) {
    const duplicatedTask = {
      ...task,
      id: this.generateUniqueId(),
    };

    this.taskService.createTask(duplicatedTask).subscribe({
      next: (savedTask) => {
        this.tasks.push(savedTask);
        this.originalTasks.push(savedTask);
        this.filteredTasks.push(savedTask);
        this.fetchTasks();
        
      },
      error: (err) => {
        console.error('Error duplicating task:', err);
      }
    });
    this.dropdownOpenTaskId = null; // Close dropdown
  }

  deleteTask(task: any) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {

        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.originalTasks = this.originalTasks.filter(t => t.id !== task.id);
        this.filteredTasks = this.filteredTasks.filter(t => t.id !== task.id);

        this.fetchTasks(); // <== Refresh UI
        this.dropdownOpenTaskId = null;
      },
      error: (err) => {
        console.error('Failed to delete task:', err);
      }
    });
  }

  changeStatusToClose(task: any) {
    task.status = 'Closed';
    this.taskService.updateStatus(task.id, 'Closed').subscribe({
      next: () => {
        console.log('Status successfully updated to Closed', task);
      },
      error: (error) => {
        console.error('Failed to update status', error);
        task.status = 'Open';
      }
    });

    this.dropdownOpenTaskId = null; // close dropdown
  }

  changeStatus(task: any, newStatus: string) {
    if (task.status === newStatus) return;

    this.taskService.updateStatus(task.id, newStatus).subscribe({
      next: () => {
        task.status = newStatus;
        console.log(`Status updated to ${newStatus}`);
      },
      error: (err) => {
        console.error('Failed to update status', err);
      }
    });
  }


  filters = {
    meeting: false,
    call: false,
    videoCall: false
  };


  applyTaskTypeFilter(): void {
    const { meeting, call, videoCall } = this.filters;

    // 1) Start by copying all tasks
    let filtered = [...this.originalTasks];

    // 2) If any checkbox is checked, narrow down to only those task.task_type
    if (meeting || call || videoCall) {
      const selectedTypesLower: string[] = [];
      if (meeting)    selectedTypesLower.push('meeting');
      if (call)       selectedTypesLower.push('call');
      if (videoCall)  selectedTypesLower.push('video call');

      filtered = filtered.filter(task =>
        selectedTypesLower.includes(task.task_type?.toLowerCase())
      );
    }

    if (this.sortColumn) {
      filtered = filtered.sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];
        if (valueA == null || valueB == null) return 0;

        const valA = typeof valueA === 'string' ? valueA.toLowerCase() : valueA;
        const valB = typeof valueB === 'string' ? valueB.toLowerCase() : valueB;
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredTasks = filtered;
    this.groupTasksByDate();

    this.selectedTaskTypes = [];
    if (this.filters.meeting)   this.selectedTaskTypes.push('Meeting');
    if (this.filters.call)      this.selectedTaskTypes.push('Call');
    if (this.filters.videoCall) this.selectedTaskTypes.push('Video Call');

  }


  removeTaskType(type: string) {
    switch (type) {
      case 'Meeting':
        this.filters.meeting = false;
        break;
      case 'Call':
        this.filters.call = false;
        break;
      case 'Video Call':
        this.filters.videoCall = false;
        break;
    }
    this.applyTaskTypeFilter();
  }

  toggleFilter(filterName: string) {
    if (filterName === 'task_type') {
      this.isTaskTypeFilterOpen = !this.isTaskTypeFilterOpen;
    }
  }

  noteText: string = '';

  addNoteForTask(task: any) {
    this.selectedTask = task;
    this.noteText = task.note || '';
  }

  closeNoteModal() {
    this.selectedTask = null;
    this.noteText = '';
  }

  saveNote() {
    if (this.noteText.trim() === '') return;

    this.taskService.updateNote(this.selectedTask.id, this.noteText.trim()).subscribe({
      next: (res) => {
        this.selectedTask.note = this.noteText.trim(); // update UI
        this.closeNoteModal();
      },
      error: (err) => {
        console.error('Failed to update note', err);
        alert('Error saving note');
      },
    });
  }

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.originalTasks = [...data];
        this.filteredTasks = [...data];
        this.groupTasksByDate();
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }

groupedTasks: { label: string; date: string; formattedDate: string; tasks: Task[]; openCount: number }[] = [];

groupTasksByDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Strip time

  const groupMap = new Map<string, { label: string, tasks: Task[], openCount: number, formattedDate: string }>();

  for (const task of this.filteredTasks) {
    if (!task.date) continue;

    const [year, month, day] = task.date.split('-').map(Number);
    const taskDate = new Date(year, month - 1, day);
    taskDate.setHours(0, 0, 0, 0); // Strip time

    const daysDiff = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dateKey = task.date;

    let label = '';
    if (daysDiff === 0) label = 'Today ';
    else if (daysDiff === 1) label = 'In 1 day ';
    else if (daysDiff > 1) label = `In ${daysDiff} days `;
    else if (daysDiff === -1) label = '1 day ago ';
    else label = `${Math.abs(daysDiff)} days ago `;

    const formattedDate = taskDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (!groupMap.has(dateKey)) {
      groupMap.set(dateKey, { label, tasks: [], openCount: 0, formattedDate });
    }

    groupMap.get(dateKey)!.tasks.push(task);
    if (task.status === 'Open') groupMap.get(dateKey)!.openCount++;
  }

  this.groupedTasks = Array.from(groupMap.entries())
    .map(([date, { label, tasks, openCount, formattedDate }]) => ({
      date,
      label,
      formattedDate,
      tasks,
      openCount
    }))
    .sort((a, b) => {
      const [ay, am, ad] = a.date.split('-').map(Number);
      const [by, bm, bd] = b.date.split('-').map(Number);
      return new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime();
    });
}


}
