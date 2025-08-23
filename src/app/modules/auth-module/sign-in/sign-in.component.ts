import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})

export class SignInComponent {
  signinForm: FormGroup;
  responseMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthserviceService,
    private router: Router,
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      const email = this.email?.value;
      const password = this.password?.value;

      this.authService.loginUser(email, password).subscribe({
        next: (msg: string) => {
          this.responseMsg = msg;
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          this.responseMsg = err.message;
        }
      });
    }
  }


  GoSignUp() {
    this.router.navigate(['/signup']);
  }
}
