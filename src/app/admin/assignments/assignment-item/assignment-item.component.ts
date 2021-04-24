import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

@Component({
  selector: 'app-assignment-item',
  templateUrl: './assignment-item.component.html',
  styleUrls: ['./assignment-item.component.scss'],
})
export class AssignmentItemComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Output() addLecture = new EventEmitter();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  get formLists() {
    return this.parentForm.get('lists_assignment') as FormArray;
  }

  getChapter(formlistItem: any) {
    return formlistItem.get('chapters').controls;
  }

  onAddLecture(sectionItem) {
    this.addLecture.emit(sectionItem);
  }

  onDeleteChapter(sectionItem, index) {
    this.confirmationService.confirm({
      message:
        'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Lecture deleted',
        });
        sectionItem.get('chapters').removeAt(index);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }

  onDeleteSection(index) {
    this.confirmationService.confirm({
      message:
        'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Section deleted',
        });
        this.formLists.removeAt(index);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }
}
