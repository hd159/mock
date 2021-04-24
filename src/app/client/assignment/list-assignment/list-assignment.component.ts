import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AssignmentService } from '../assignment.service';

@Component({
  selector: 'app-list-assignment',
  templateUrl: './list-assignment.component.html',
  styleUrls: ['./list-assignment.component.scss'],
})
export class ListAssignmentComponent implements OnInit, OnDestroy {
  assignments: any[] = [];
  unsubscription = new Subject();
  constructor(private assignmentService: AssignmentService) {}

  ngOnInit(): void {
    this.assignmentService.find().subscribe((val) => {
      console.log(val);

      this.assignments = val;
    });
  }

  ngOnDestroy() {
    this.unsubscription.next();
    this.unsubscription.unsubscribe();
  }
}
