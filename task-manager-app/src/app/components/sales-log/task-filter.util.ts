import { Task } from '../../task.service';

export interface TaskFilters {
  meeting: boolean;
  call: boolean;
  videoCall: boolean;
}

export function filterTasksByType(tasks: Task[], filters: TaskFilters): Task[] {
  const activeTypes = Object.entries(filters)
    .filter(([_, isActive]) => isActive)
    .map(([type]) => type);

  if (activeTypes.length === 0) return [...tasks];

  return tasks.filter(task => activeTypes.includes(task.task_type));
}
