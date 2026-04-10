import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.scss',
})
export class WelcomePage {
  onClick() {
    Swal.fire({
      title: 'Drag me!',
      icon: 'success',
      draggable: true,
    });
  }
}
