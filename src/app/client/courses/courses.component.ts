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

  sortPriceOptions: any[];
  sortCategoriesOptions: any[];
  sortOrder: number;
  sortField: string;

  constructor(private coursesService: CoursesService, private router: Router) {}

  ngOnInit(): void {
    this.coursesService.find().subscribe((val) => {
      this.courses = val;
      console.log(this.courses);
    });

    this.sortPriceOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];

    this.sortCategoriesOptions = [
      { label: 'Development', value: 'development' },
      { label: 'Business', value: 'business' },
      { label: 'IT & Software', value: 'it-software' },
      { label: 'Design', value: 'design' },
    ];
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

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
