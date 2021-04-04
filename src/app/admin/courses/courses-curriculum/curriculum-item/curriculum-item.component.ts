import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';

@Component({
  selector: 'app-curriculum-item',
  templateUrl: './curriculum-item.component.html',
  styleUrls: ['./curriculum-item.component.scss'],
})
export class CurriculumItemComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Output() addSection = new EventEmitter();
  @Output() addLecture = new EventEmitter();

  isEditSection = false;
  currentIndexSection: number = 0;
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void { }

  get formLists() {
    return this.parentForm.get('section') as FormArray;
  }

  getTitleSection(formSectionItem: FormControl) {
    return formSectionItem.get('title').value;
  }

  getChapter(formSectionItem: any) {
    return formSectionItem.get('chapter').controls;
  }

  getTitleChapter(formItem: FormControl) {
    return formItem.get('title').value;
  }

  getDescriptionChapter(formItem: FormControl) {
    return formItem.get('description').value;
  }

  getVideoUrlChapter(formItem: FormControl) {
    return formItem.get('videoUrl').value;
  }

  onDelete(index) {
    this.formLists.removeAt(index);
  }

  onAddLecture(sectionItem) {
    this.addLecture.emit(sectionItem);
  }

  onEditSection(index) {
    this.isEditSection = true;
    this.currentIndexSection = index;

  }

  onDeleteSection(index) {

    this.confirmationService.confirm({
      message: 'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Section deleted' });
        this.formLists.removeAt(index)
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  onDeleteChapter(sectionItem, index) {
    this.confirmationService.confirm({
      message: 'You are about to remove a curriculum item. Are you sure you want to continue?',
      header: 'Please confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Lecture deleted' });
        sectionItem.get('chapter').removeAt(index);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }


}
