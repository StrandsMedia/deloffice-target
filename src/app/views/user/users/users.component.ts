import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/common/services/auth.service';

import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { MaterialService } from 'src/app/common/services/material.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: Observable<any>;
  selectedUser: any = null;
  status = 1;

  public columns = [
    'name',
    'init',
    'dept',
    'visible',
    'status',
    'password',
    'edit'
  ];

  public statusForm: FormGroup = this.fb.group({
    status: this.status
  });

  public updateUserForm: FormGroup = this.fb.group({
    sales_rep: [null, [Validators.required]],
    rep_initial: [null, [Validators.required]],
    dept: [null, [Validators.required]],
    password: [null, [Validators.required]],
    visible: [null, [Validators.required]],
    status: [null, [Validators.required]],
    sales_id: [null, [Validators.required]]
  });

  public insertUserForm: FormGroup = this.fb.group({
    sales_rep: [null, [Validators.required]],
    rep_initial: [null, [Validators.required]],
    dept: [null, [Validators.required]],
    password: [null, [Validators.required]],
    visible: 0,
    status: 0
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private mdc: MaterialService
  ) { }

  ngOnInit() {
    this.get();
  }

  get() {
    this.users = this.auth.getUsers().pipe(
      map(users => {
        if (users) {
          const recs = users['records'].filter(user => {
            // tslint:disable-next-line:triple-equals
            if (user.visible == this.status) {
              return user;
            }
          });
          users['records'] = recs;
          return users;
        }
      })
    );
  }

  trackByFn(index, item) {
    return index;
  }

  assignUser(row) {
    this.selectedUser = row;
    this.updateUserForm.patchValue(this.selectedUser);
  }

  public getStatus(status: string): string {
    if (status == '1') return 'Visible';
    return 'Hidden';
  }

  change() {
    this.status = +this.statusForm.value.status;
    this.get();
  }

  show($event) {
    if ($event.target.type === 'password') {
      $event.target.type = 'text';
    }
  }

  hide($event) {
    if ($event.target.type === 'text') {
      $event.target.type = 'password';
    }
  }

  update() {
    this.auth.updateUser(this.updateUserForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.updateUserForm.reset();
        this.selectedUser = null;
      }
    );
  }

  create() {
    this.auth.createUser(this.insertUserForm.value).subscribe(
      (data) => {
        this.mdc.materialSnackBar(data);
      },
      (err) => {
        this.mdc.materialSnackBar(err.error);
      },
      () => {
        this.get();
        this.insertUserForm.reset();
      }
    );
  }

}
