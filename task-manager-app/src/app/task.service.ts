import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  date: string;
  entity_name: string;
  task_type: string;
  task_time: string;
  contact_person: string;
  phone: string;
  note: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'https://task-manager-backend-flask.onrender.com/tasks';
  constructor(private http: HttpClient) {}


  getTasks(params: any = {}): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl, { params });
  }

  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${taskId}`);
  }

  createTask(task: Partial<Task>): Observable<any> {
    return this.http.post(this.baseUrl, task);
  }

  updateTask(taskId: number, task: Partial<Task>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${taskId}`, task);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${taskId}`);
  }

 updateStatus(taskId: number, status: string): Observable<any> {
  return this.http.patch(`${this.baseUrl}/${taskId}/status`, { status });
  }

  updateNote(taskId: number, note: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${taskId}/note`, { note });
  }
}
