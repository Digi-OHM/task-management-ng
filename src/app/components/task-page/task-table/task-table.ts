import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Task } from '../../../service/task/interface-task';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../service/task/task-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-table',
  imports: [CommonModule],
  templateUrl: './task-table.html',
  styleUrl: './task-table.scss',
})
export class TaskTable {
  taskService = inject(TaskService);
  col_center: string = 'text-center align-middle';
  tasks = input<Task[]>([]);
  refresh = output<void>();
  edit = output<Task>();
  selectedIds = signal<number[]>([]);
  expandedId = signal<number | null>(null);

  pageCurrent = input<number>(1);
  pageSize = input<number>(10);
  pageTotal = input<number>(0);

  toggleExpand(id: number | undefined) {
    if (!id) return;
    this.expandedId.update((currentId) => (currentId === id ? null : id));
  }

  formatDate(dateInput: Date | string): string {
    if (!dateInput) return '-';
    const date = new Date(dateInput);

    // เปลี่ยนจาก 'th-TH' เป็น 'en-US' หรือ 'en-GB' เพื่อให้เป็นสากล
    const datePart = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);

    return datePart;
  }

  onDelete(id: number | null | undefined) {
    if (id === null || id === undefined) {
      console.error('ID is missing');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The task has been removed.',
              icon: 'success',
              timer: 1200,
              showConfirmButton: false,
            });
            this.refresh.emit();
          },
          error: (err) => {
            Swal.fire('Error!', 'Could not delete the task.', 'error');
            console.error(err);
          },
        });
      }
    });
  }

  isAllSelected = computed(() => {
    const currentTasks = this.tasks();
    return currentTasks.length > 0 && this.selectedIds().length === currentTasks.length;
  });

  toggleSelection(id: number) {
    this.selectedIds.update((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );
  }

  onChangePriority(id: number | undefined, newPriority: string) {
    if (!id) return;

    this.taskService.updatePriority(id, newPriority).subscribe({
      next: (res) => {
        console.log('Priority updated:', res);
        this.refresh.emit();
      },
      error: (err) => {
        Swal.fire('Error', 'Could not update priority.', 'error');
        console.error(err);
      },
    });
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      const allIds = this.tasks()
        .map((t) => t.id)
        .filter((id) => id != null) as number[];
      this.selectedIds.set(allIds);
    } else {
      this.selectedIds.set([]);
    }
  }

  clearSelection() {
    this.selectedIds.set([]);
  }

  sortChange = output<'ASC' | 'DESC'>();
  currentSort = signal<'ASC' | 'DESC'>('ASC');

  onSortNo() {
    const newSort = this.currentSort() === 'ASC' ? 'DESC' : 'ASC';
    this.currentSort.set(newSort);
    this.sortChange.emit(newSort);
  }
}
