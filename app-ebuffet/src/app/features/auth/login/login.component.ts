import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthRequest} from "../../../core/dtos/auth-dto";
import {AuthService} from "../../../core/services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent {

  form!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    const payload: AuthRequest = this.form.value as AuthRequest;
    this.auth.login(payload).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => this.errorMessage = 'Usuário ou senha inválidos',
    });
  }

}
