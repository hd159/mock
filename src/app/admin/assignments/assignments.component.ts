import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AssignmentService } from 'src/app/client/assignment/assignment.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
})
export class AssignmentsComponent implements OnInit, OnDestroy {
  formAssignment: FormGroup;
  loading = false;
  unsubscription = new Subject();
  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.formAssignment = this.initForm();
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }

  initForm() {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      img: ['', Validators.required],
      lists_assignment: this.fb.array([this.itemAssignment()]),
    });
  }

  itemAssignment() {
    return this.fb.group({
      title: ['', Validators.required],
      chapters: this.fb.array([this.detailChapter()]),
    });
  }

  detailChapter() {
    return this.fb.group({
      html: ['', Validators.required],
      answer: ['', Validators.required],
      input: [''],
    });
  }

  addLecture(sectionItem) {
    const chapters = sectionItem.get('chapters') as FormArray;
    chapters.push(this.detailChapter());
  }

  addSection() {
    const sections = this.formAssignment.get('lists_assignment') as FormArray;
    sections.push(this.itemAssignment());
  }

  onSubmit() {
    const valid = this.checkForm();
    if (!valid) {
      return;
    }

    const assignData = this.formAssignment.value;
    this.loading = true;
    this.assignmentService
      .create(assignData)
      .pipe(takeUntil(this.unsubscription))
      .subscribe(
        (val) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Assignment Added',
          });
          this.formAssignment.reset();
        },
        (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "some thing wen't wrong",
          });
        }
      );
  }

  checkForm() {
    let valid = true;
    if (this.formAssignment.invalid) {
      valid = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please input all fields',
      });
    }

    return valid;
  }
}
