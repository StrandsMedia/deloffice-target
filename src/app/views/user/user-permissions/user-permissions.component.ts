import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../common/services/auth.service';
import { MaterialService } from '../../../common/services/material.service';

import { Observable, combineLatest, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent implements OnInit {
  public module$: Observable<any>;
  public user$: Observable<any>;

  public tempArray: number[] = [];

  public columns = [
    'moduleId',
    'moduleName',
    'create',
    'read',
    'update',
    'delete'
  ];

  public lockData = {
    mod: null,
    modId: null,
    permtype: null,
    permop: null
  };

  constructor(
    private _auth: AuthService,
    private _mdc: MaterialService
  ) { }

  ngOnInit() {
    this.get();
  }

  private get(): void {
    this.module$ = this._auth.getPermissions();
  }

  public trackByFn(index: any, item: any) {
    return index;
  }

  public status(num: number): string {
    switch (num) {
      case 0:
        return 'Create';
        break;
      case 1:
        return 'Read';
        break;
      case 2:
        return 'Update';
        break;
      case 3:
        return 'Delete';
        break;
    }
  }

  public statusNum(num: number): string {
    switch (num) {
      case 0:
        return 'create';
        break;
      case 1:
        return 'read';
        break;
      case 2:
        return 'update';
        break;
      case 3:
        return 'delete';
        break;
    }
  }

  bindPermission(permStatus: number, module: any) {
    this.lockData.mod = module.moduleName;
    this.lockData.modId = module.moduleId;
    this.lockData.permtype = this.status(permStatus);
    this.lockData.permop = this.statusNum(permStatus);
    this.user$ = combineLatest(
      this._auth.getUsers().pipe(
        map((users: any) => (users.records).filter(user => user.status == 0))
      ),
      of(module[this.lockData.permop]).pipe(
        tap(v => this.tempArray = v)
      )
    );
  }

  reloadPermission() {
    this.user$ = combineLatest(
      this._auth.getUsers().pipe(
        map((users: any) => (users.records).filter(user => user.status == 0))
      ),
      of(module[this.lockData.permop]).pipe(
        tap(v => this.tempArray = v)
      )
    );
  }

  public get permData(): string {
    if (this.lockData) {
      return this.lockData.mod + ' - ' + this.lockData.permtype;
    } else {
      return '';
    }
  }

  public isInArr(arr: number[], user: number): boolean {
    return arr.includes(user);
  }

  public whereInArr(arr: number[], user: number): number {
    if (arr.includes(user)) {
      return arr.lastIndexOf(user);
    }
  }

  public allInArr(arr: number[], arr2: any[]): boolean {
    return arr.length === arr2.length;
  }

  public removeDuplicates(arr: any[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index).sort((a, b) => a - b);
  }

  public changePerm($event, arr) {
    if ($event.target.checked === true) {
      this.tempArray.push(+$event.target.value);
    } else {
      if (this.isInArr(this.tempArray, +$event.target.value)) {
        const idx = this.whereInArr(this.tempArray, +$event.target.value);
        this.tempArray.splice(idx, 1);
      }
    }

    this.tempArray = this.removeDuplicates(this.tempArray);

    const obj = {
      moduleId: this.lockData.modId,
      op: this.lockData.permop
    };
    obj['mod'] = this.tempArray;
    console.log(obj, $event.target.checked);
    this._auth.changePermission(obj)
    .subscribe(
      data => this._mdc.materialSnackBar(data),
      err => this._mdc.materialSnackBar(err.error),
      () => {
        this.get();
      }
    );
  }

  public changePermAll($event, arr: any[]) {
    if ($event.target.checked === true) {
      this.tempArray = [];
      arr.forEach(user => {
        this.tempArray.push(+user.sales_id);
      });

      this.tempArray = this.removeDuplicates(this.tempArray);
    } else {
      this.tempArray = [];
    }

    const obj = {
      moduleId: this.lockData.modId,
      op: this.lockData.permop
    };
    obj['mod'] = this.tempArray;
    console.log(obj, $event.target.checked);
    this._auth.changePermission(obj)
    .subscribe(
      data => this._mdc.materialSnackBar(data),
      err => this._mdc.materialSnackBar(err.error),
      () => {
        this.get();
      }
    );
  }

}
