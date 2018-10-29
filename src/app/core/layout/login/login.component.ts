import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';

import { flyfadeIn } from '../../../common/interfaces/animations';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [flyfadeIn]
})
export class LoginComponent implements OnInit {
  error: string = null;
  loading: boolean;
  trigger: boolean;

  public loginForm = this.fb.group({
    username: ['', [
      Validators.required
    ]],
    password: ['', [
      Validators.required
    ]]
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.materialise();
    this.trigger = true;
  }

  get f(): any {
    return this.loginForm.controls;
  }

  materialise() {
    const loginForm = document.querySelector('#loginForm');
    const loginFields = loginForm.getElementsByClassName('mdc-text-field');
    for (let i = 0; i < loginFields.length; i++) {
        MDCTextField.attachTo(loginFields[i]);
    }
    const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
  }

  loginUser() {
    this.loading = !this.loading;
    this.auth.login(this.loginForm.value).subscribe(
      (data) => {
        this.router.navigate(['/']);
        this.loading = !this.loading;
      },
      (err) => {
        console.log('Something went wrong: ', err.message);
        this.error = err.message;
        this.loginForm.reset();
        this.loading = !this.loading;
      }
    );
  }

}
