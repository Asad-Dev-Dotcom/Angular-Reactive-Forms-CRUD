import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form: FormGroup;
  users: any[] = [];

  constructor() {
    this.form = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.maxLength(10),
          this.firstLetterCapitalValidator,
          this.noNumbersValidator,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          this.noDuplicateEmailValidator,
        ]),
        password: new FormControl('', [
          Validators.required,
          this.passwordComplexityValidator,
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );

    this.loadUsers();
  }

  // ===============================   Validators   ===============================


  firstLetterCapitalValidator(control: AbstractControl) {
  const value = control.value;
  if (!value) return null;
  return value[0] === value[0].toUpperCase() ? null : { firstLetterNotCapital: true };
}

noNumbersValidator(control: AbstractControl) {
  return /\d/.test(control.value) ? { containsNumber: true } : null;
}

passwordComplexityValidator(control: AbstractControl) {
  const value = control.value || '';
  const errors: any = {};
  if (value.length < 8) errors.minLength = true;
  if (!/[A-Z]/.test(value)) errors.uppercase = true;
  if (!/[a-z]/.test(value)) errors.lowercase = true;
  if (!/\d/.test(value)) errors.number = true;
  if (!/[!@#$%^&*]/.test(value)) errors.special = true;
  return Object.keys(errors).length > 0 ? errors : null;
}

noDuplicateEmailValidator(control: AbstractControl) {
  const existing = JSON.parse(localStorage.getItem('users') || '[]');
  const emailExists = existing.some((u: any) => u.email === control.value);
  return emailExists ? { emailExists: true } : null;
}

passwordMatchValidator(group: AbstractControl) {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}


  onSubmit() {
    if (this.form.valid) {
      const { name, email, password } = this.form.value;
      const user = { name, email, password };
      this.users.push(user);
      localStorage.setItem('users', JSON.stringify(this.users));
      this.form.reset();
      this.loadUsers();
    }
  }

  loadUsers() {
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
  }

  get name() {
    return this.form.get('name');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}
