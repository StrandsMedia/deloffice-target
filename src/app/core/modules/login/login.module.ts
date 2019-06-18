import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from '../../layout/login/login.component';

const loginroutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login',
      id: 999
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(loginroutes),
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
