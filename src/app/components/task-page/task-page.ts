import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { I_Priority, Task } from '../../service/task/interface-task';
import { TaskService } from '../../service/task/task-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskTable } from './task-table/task-table';
import { PaginationCommon } from '../../common/pagination-common/pagination-common';
import { TaskModal } from './task-modal/task-modal';
import Swal from 'sweetalert2';
import { SpinnerService } from '../../service/loading/spinner-serivce';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-task-page',
  imports: [CommonModule, FormsModule, TaskTable, PaginationCommon, TaskModal],
  templateUrl: './task-page.html',
  styleUrl: './task-page.scss',
})
export class TaskPage implements OnInit {
  private taskService = inject(TaskService);
  private spinnerService = inject(SpinnerService);

  tasks = signal<Task[]>([]);

  pageCurrent: number = 1;
  pageSize: number = 10;
  pageSizeList: number[] = [10, 20, 30, 50, 100];
  pageTotal: number = 0;
  totalElements: number = 0;
  pageSort: 'ASC' | 'DESC' = 'ASC';
  pagePriorityFilter: I_Priority | null = null;

  modalMode: 'ADD' | 'EDIT' = 'ADD';
  selectedTask: Task | null = null;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.spinnerService.show();
    this.taskService
      .getTaskPageable(this.pageCurrent - 1, this.pageSize, this.pageSort, this.pagePriorityFilter)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: (res) => {
          if (res.content.length === 0 && this.pageCurrent > 1) {
            this.pageCurrent = res.totalPages > 0 ? res.totalPages : 1;
            this.loadTasks();
            return;
          }

          this.tasks.set(res.content);
          this.pageTotal = res.totalPages;
          this.totalElements = res.totalElements;
        },
        error: (err) => console.error('Error loadTasks:', err),
      });
  }

  onPageSizeChange(newSize: string | number) {
    this.pageSize = Number(newSize);
    this.pageCurrent = 1;
    if (this.taskTable) {
      this.taskTable.clearSelection();
    }
    this.loadTasks();
  }

  onPageChange(page: number) {
    this.pageCurrent = page;
    this.loadTasks();
  }

  onRefreshAfterDelete(): void {
    if (this.pageCurrent > 1 && this.tasks().length === 1) {
      this.pageCurrent--;
    }
    this.loadTasks();
  }

  openAddModal() {
    this.modalMode = 'ADD';
    this.selectedTask = null;
  }

  openEditModal(task: Task) {
    this.modalMode = 'EDIT';
    this.selectedTask = { ...task };
  }

  onTaskSaved() {
    if (this.modalMode === 'ADD') {
      if (this.pageSort === 'DESC') {
        this.pageCurrent = 1;
        this.loadTasks();
      } else {
        this.taskService
          .getTaskPageable(0, this.pageSize, this.pageSort, this.pagePriorityFilter)
          .pipe(finalize(() => this.spinnerService.hide()))
          .subscribe((res) => {
            this.pageTotal = res.totalPages;
            this.pageCurrent = res.totalPages || 1;
            this.loadTasks();
          });
      }
    } else {
      this.loadTasks();
    }
  }

  @ViewChild(TaskTable) taskTable!: TaskTable;
  deleteSelected() {
    const ids = this.taskTable.selectedIds();

    Swal.fire({
      title: `Confirm delete ${ids.length} items?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete all',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinnerService.show();
        this.taskService
          .deleteMultiple(ids)
          .pipe(finalize(() => this.spinnerService.hide()))
          .subscribe({
            next: (res) => {
              Swal.fire('Deleted!', res, 'success');

              // --- เริ่มต้น Logic การคำนวณหน้าใหม่ ---

              // เช็กว่าถ้าลบจำนวนเท่านี้ (ids.length) ในหน้าปัจจุบัน (tasks().length)
              // แล้วหน้าปัจจุบันจะว่างเปล่าหรือไม่
              const itemsRemainingOnPage = this.tasks().length - ids.length;

              if (itemsRemainingOnPage <= 0 && this.pageCurrent > 1) {
                // ถ้าลบจนหมดหน้า และไม่ใช่หน้าแรก ให้ถอยกลับไป 1 หน้า
                this.pageCurrent--;
              }

              // --- จบ Logic ---

              this.taskTable.clearSelection();
              this.loadTasks(); // โหลดข้อมูลใหม่ด้วยหน้าที่ถูกต้อง
            },
            error: (err) => {
              Swal.fire('Error!', 'Could not delete data.', 'error');
            },
          });
      }
    });
  }

  onSortChange(newSort: 'ASC' | 'DESC') {
    this.pageSort = newSort;
    // this.pageCurrent = 1;
    this.loadTasks();
  }

  onPriorityFilterChange(newPriority: any) {
    this.pagePriorityFilter = newPriority;
    this.pageCurrent = 1;
    this.loadTasks();
  }
}
