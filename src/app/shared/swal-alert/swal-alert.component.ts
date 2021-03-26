import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/service/loading.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-swal-alert',
  templateUrl: './swal-alert.component.html',
  styleUrls: ['./swal-alert.component.scss'],
})
export class SwalAlertComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  swalSuccess(text?: string, title: string = 'Removed!') {
    let timerInterval: any;

    return Swal.fire({
      icon: 'success',
      text: text,
      html: 'I will close in <b></b> milliseconds.',
      title: title,
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getContent();
          if (content) {
            const b = content.querySelector('b');
            if (b) {
              b.innerHTML = Swal.getTimerLeft().toString();
            }
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }

  swalConfirm(text?: string) {
    return Swal.fire({
      icon: 'warning',
      text: `Are you sure you want to delete ${text}??. All information associated will be permanently
      deleted. This operation can not be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    });
  }

  swalCancel(text?: string) {
    return Swal.fire('Cancelled', `${text} still in our database.)`, 'error');
  }

  swalError500() {
    return Swal.fire(
      '500',
      'Your connection has interrupted, reconnect and try again',
      'error'
    );
  }
}
