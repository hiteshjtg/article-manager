import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  responseMsg = '';
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthserviceService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;

      this.authService
        .registerUser(name, email, password)
        .then((userCred) => {
          this.router.navigate(['/home']);
        })
        .catch((err) => {
          this.responseMsg = err;
        });
    }
  }

  GoSignIn(){ //just for redirection
    this.router.navigate(['/signin'])
  }

}
