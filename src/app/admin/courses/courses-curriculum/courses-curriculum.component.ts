import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-courses-curriculum',
  templateUrl: './courses-curriculum.component.html',
  styleUrls: ['./courses-curriculum.component.scss'],
})
export class CoursesCurriculumComponent implements OnInit {
  formCurriculum: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formCurriculum = this.initForm();
  }

  initForm() {
    return this.fb.group({
      section: this.fb.array([this.detailSection()]),
    });
  }

  detailSection() {
    return this.fb.group({
      title: 'Introduction',

      chapter: this.fb.array([this.detailChapter()]),
    });
  }

  detailChapter() {
    return this.fb.group({
      title: 'Introduction',
      desctiption: '',
      videoUrl: '',
    });
  }

  addLecture(sectionItem) {
    const chapters = sectionItem.get('chapter') as FormArray;
    chapters.push(this.detailChapter());
  }

  addSection() {
    const sections = this.formCurriculum.get('section') as FormArray;
    sections.push(this.detailSection());
  }



  onSubmit() {
    console.log(this.formCurriculum.value);
  }
}
