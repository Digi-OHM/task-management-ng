import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../service/task/task-service';
import { Task, I_Priority } from '../../../service/task/interface-task';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.scss',
})
export class TaskModal implements OnChanges {
  @Input() mode: 'ADD' | 'EDIT' = 'ADD';
  @Input() editData: Task | null = null;
  @Output() saved = new EventEmitter<void>();

  private taskService = inject(TaskService);

  saveError = signal<string | null>(null);
  isSubmitting = signal(false);

  taskForm = new FormGroup({
    id: new FormControl<number | null>(null),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', Validators.required),
    priority: new FormControl<I_Priority>('LOW', [Validators.required]),
    dueDate: new FormControl<string>('', [Validators.required]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.editData) {
      let dateStr = '';
      if (this.editData.dueDate) {
        const d = new Date(this.editData.dueDate);
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString().split('T')[0];
        }
      }

      this.taskForm.patchValue({
        id: this.editData.id ?? null,
        title: this.editData.title,
        description: this.editData.description,
        priority: this.editData.priority,
        dueDate: dateStr,
      });
    }
  }

  resetForm() {
    this.taskForm.reset({
      priority: 'LOW',
      dueDate: '',
    });
    this.saveError.set(null);
    this.isSubmitting.set(false);
  }

  onSave() {
    if (this.taskForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.taskForm.getRawValue();

    const payload: Task = {
      id: formValue.id ?? undefined,
      title: formValue.title ?? '',
      description: formValue.description ?? '',
      priority: formValue.priority as I_Priority,
      dueDate: new Date(formValue.dueDate || new Date()),
    };

    const request$ =
      this.mode === 'ADD'
        ? this.taskService.addTask(payload)
        : this.taskService.updateTask(payload);

    request$.subscribe({
      next: () => {
        Swal.fire({
          // เพิ่มงานสำเร็จ / แก้ไขข้อมูลสำเร็จ -> Task Added! / Task Updated!
          title: this.mode === 'ADD' ? 'Task Added!' : 'Task Updated!',
          text: `"${payload.title}" has been saved successfully.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });

        this.saved.emit();
        this.closeModal();
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        // ไม่สามารถบันทึกข้อมูลได้... -> Could not save data...
        this.saveError.set('Could not save data. Please try again.');
        console.error(err);

        Swal.fire('Error!', 'Could not save data. Please check your connection.', 'error');
      },
    });
  }

  closeModal() {
    const closeBtn = document.getElementById('closeTaskModal') as HTMLButtonElement;
    closeBtn?.click();
  }
}
