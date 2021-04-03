import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { CoursesService } from 'src/app/service/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  displayBasic = false;
  currentIndex: number;
  courses: any[] = [];
  constructor(private coursesService: CoursesService, private router: Router) {}

  ngOnInit(): void {
    this.coursesService.find().subscribe((val) => {
      this.courses = val;
    });
  }

  showBasicDialog(index?) {
    this.currentIndex = index;
    this.displayBasic = true;
  }

  closeBasicDialog() {
    this.displayBasic = false;
  }

  onNavigate(id: string) {
    this.router.navigate(['category/courses', id]);
  }
}
