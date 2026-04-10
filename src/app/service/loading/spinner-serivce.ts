import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private spinner = inject(NgxSpinnerService);
  private requestCount = 0;

  show() {
    // this.requestCount += 10; // for test view spinner
    this.requestCount++;
    setTimeout(() => this.spinner.show());
  }

  hide() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      setTimeout(() => this.spinner.hide());
    }
  }
}
