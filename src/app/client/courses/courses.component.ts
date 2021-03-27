import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  url = 'https://baas.kinvey.com/blob/kid_rJvDFm84u';
  uploadedFiles = [];
  file;
  p: FileUpload;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.getFile().subscribe((val: any) => {
    //   console.log(val);
    //   this.file = val;
    // });
    const headers = new HttpHeaders().set('Authorization', '111');
    this.http
      .get(`${this.url}/a6270052-bd59-4340-8226-934a0bc0e3ca`, { headers })
      .subscribe(console.log);
  }

  onUpload(event) {
    console.log(event);
  }

  onBeforeUpload(event) {
    console.log(event);
  }

  getFile() {
    return this.http.get(`${this.url}/a6270052-bd59-4340-8226-934a0bc0e3ca`);
  }
}
