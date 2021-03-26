import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  @Input() showModal: boolean;
  @Output() showModalChange = new EventEmitter<boolean>();

  formEdit: FormGroup = this.fb.group({
    title: '',
    img: '',
    group: '',
    desc: '',
  });
  constructor(private fb: FormBuilder) {}

  ngOnChanges() {}

  ngOnInit(): void {}

  onClose() {
    this.showModalChange.emit(!this.showModal);
  }

  onSubmit() {
    const { value } = this.formEdit;

    this.onClose();
  }

  ngOnDestroy() {}
}
