import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

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
}
