import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses-curriculum',
  templateUrl: './courses-curriculum.component.html',
  styleUrls: ['./courses-curriculum.component.scss'],
})
export class CoursesCurriculumComponent implements OnInit {
  formCurriculum: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService
  ) {}

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
      html: '',
      videoUrl: '',
      pdfUrl: '',
      article_lecture: '',
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

  prevPage() {
    this.router.navigate(['admin/courses/add/landing-page']);
  }

  nextPage() {
    const curriculumData = this.formCurriculum.value;
    this.coursesService.newCourse.next({
      ...this.coursesService.newCourseData,
      ...curriculumData,
    });
    this.router.navigate(['admin/courses/add/goals']);
  }
}
