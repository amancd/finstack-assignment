import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-new-task-modal',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    CommonModule,
    FormsModule
  ],
  templateUrl: './new-task-modal.component.html',
})
export class NewTaskModalComponent {

  @Input() task: any = null; // received task to edit
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  constructor(private taskService: TaskService) {}

  formData: any = {
    entityName: '',
    date: '',
    hour: '',
    minute: '',
    meridian: 'AM',
    taskType: '',
    phone: '',
    contact: '',
    note: '',
    status: 'Open'
  };

  splitTime(time: string): [string, string, string] {
  if (!time) return ['','', 'AM'];
  const [full, meridian] = time.split(' ');
  const [hour, minute] = full.split(':');
  return [hour.padStart(2, '0'), minute.padStart(2, '0'), meridian];
}

capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

  ngOnInit() {
  if (this.task) {
    const [hour, minute, meridian] = this.splitTime(this.task.task_time);
    this.formData = {
      entityName: this.task.entity_name || '',
      date: this.task.date || '',
      hour: hour,
      minute: minute,
      meridian: meridian,
      taskType: this.task.task_type || '',
      phone: this.task.phone || '',
      contact: this.task.contact_person || '',
      note: this.task.note || '',
      status: this.capitalize(this.task.status || 'Open')
    };
  }
}

  cancel() {
    this.close.emit(); // emit cancel
  }


  // Add these arrays for select dropdowns
  hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  minutes = ['00', '15', '30', '45'];
  meridians = ['AM', 'PM'];
  taskTypes = ['Call', 'Meeting', 'Video Call'];


dropdownOpen = false;

selectTask(task: string) {
  this.formData.taskType = task;
  this.dropdownOpen = false;
}

getTaskImage(task: string): string | null {
  switch (task) {
    case 'Call':
      return 'assets/call.png';
    case 'Meeting':
      return 'assets/location.png';
    case 'Video Call':
      return 'assets/webcam.png';
    default:
      return null;
  }
}

  // Method to set task status on toggle button click
  setStatus(status: string) {
    this.formData.status = status;
  }

  saveTask() {
  const taskPayload = {
    entity_name: this.formData.entityName,
    date: this.formData.date,
    task_type: this.formData.taskType,
    task_time: `${this.formData.hour}:${this.formData.minute} ${this.formData.meridian}`,
    contact_person: this.formData.contact,
    phone: this.formData.phone,
    note: this.formData.note,
    status: this.formData.status
  };

  if (this.task && this.task.id) {
    // It's an edit
    this.taskService.updateTask(this.task.id, taskPayload).subscribe({
      next: (response) => {
        console.log('Task updated successfully:', response);
        this.save.emit({ ...taskPayload, id: this.task.id }); // Send updated task to parent
        this.close.emit();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  } else {
    // It's a new task
    this.taskService.createTask(taskPayload).subscribe({
      next: (response) => {
        console.log('Task created successfully:', response);
        this.save.emit(response); // Assumes backend returns created task with ID
        this.close.emit();
      },
      error: (error) => {
        console.error('Error creating task:', error);
      }
    });
  }
}

}
