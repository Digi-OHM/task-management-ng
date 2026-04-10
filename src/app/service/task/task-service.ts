import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { I_Priority, PageResponse, Task } from './interface-task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:8080/api/task';

  getTaskPageable(
    page: number,
    size: number,
    sort: string,
    priority?: I_Priority | null,
  ): Observable<PageResponse<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (priority) {
      params = params.set('priority', String(priority));
    }

    return this.http.get<PageResponse<Task>>(`${this.API_URL}/page`, { params });
  }

  deleteTask(id: number): Observable<string> {
    return this.http.delete(`${this.API_URL}/delete/${id}`, { responseType: 'text' });
  }

  addTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/add`, task);
  }

  updateTask(task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/edit`, task);
  }

  deleteMultiple(ids: number[]): Observable<string> {
    return this.http.delete(`${this.API_URL}/delete-multiple`, {
      body: ids,
      responseType: 'text',
    });
  }

  updatePriority(id: number, priority: string): Observable<Task> {
    const params = new HttpParams().set('priority', priority);
    return this.http.patch<Task>(`${this.API_URL}/priority/${id}`, {}, { params });
  }
}
