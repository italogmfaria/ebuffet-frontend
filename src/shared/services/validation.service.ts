import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface ValidationMessages {
  required?: string;
  email?: string;
  minlength?: string;
  maxlength?: string;
  pattern?: string;
  passwordMismatch?: string;
  custom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private defaultMessages = {
    required: 'Este campo é obrigatório.',
    email: 'Por favor, insira um e-mail válido.',
    minlength: 'Este campo deve ter pelo menos {min} caracteres.',
    maxlength: 'Este campo deve ter no máximo {max} caracteres.',
    pattern: 'Formato inválido.',
    passwordMismatch: 'As senhas não coincidem.'
  };

  constructor() {}

  /**
   * Valida um campo específico do formulário
   */
  validateField(control: AbstractControl | null, fieldName: string, customMessages?: ValidationMessages): ValidationResult {
    if (!control) {
      return { isValid: true };
    }

    if (control.valid) {
      return { isValid: true };
    }

    const errors = control.errors;
    if (!errors) {
      return { isValid: true };
    }

    // Verificar cada tipo de erro
    if (errors['required']) {
      return {
        isValid: false,
        message: customMessages?.required || this.defaultMessages.required
      };
    }

    if (errors['email']) {
      return {
        isValid: false,
        message: customMessages?.email || this.defaultMessages.email
      };
    }

    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      const message = customMessages?.minlength || this.defaultMessages.minlength;
      return {
        isValid: false,
        message: message.replace('{min}', minLength.toString())
      };
    }

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      const message = customMessages?.maxlength || this.defaultMessages.maxlength;
      return {
        isValid: false,
        message: message.replace('{max}', maxLength.toString())
      };
    }

    if (errors['pattern']) {
      return {
        isValid: false,
        message: customMessages?.pattern || this.defaultMessages.pattern
      };
    }

    return {
      isValid: false,
      message: customMessages?.custom || 'Campo inválido.'
    };
  }

  /**
   * Valida um formulário completo
   */
  validateForm(form: FormGroup): ValidationResult {
    if (form.valid) {
      return { isValid: true };
    }

    // Marcar todos os campos como touched para exibir erros
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });

    // Retornar a primeira mensagem de erro encontrada
    for (const key of Object.keys(form.controls)) {
      const control = form.get(key);
      const result = this.validateField(control, key);
      if (!result.isValid) {
        return result;
      }
    }

    return {
      isValid: false,
      message: 'Por favor, preencha todos os campos corretamente.'
    };
  }

  /**
   * Valida email
   */
  validateEmail(email: string): ValidationResult {
    if (!email || email.trim() === '') {
      return {
        isValid: false,
        message: 'Por favor, insira seu e-mail.'
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'Por favor, insira um e-mail válido.'
      };
    }

    return { isValid: true };
  }

  /**
   * Valida senha
   */
  validatePassword(password: string, minLength: number = 6): ValidationResult {
    if (!password || password.trim() === '') {
      return {
        isValid: false,
        message: 'Por favor, insira sua senha.'
      };
    }

    if (password.length < minLength) {
      return {
        isValid: false,
        message: `A senha deve ter pelo menos ${minLength} caracteres.`
      };
    }

    return { isValid: true };
  }

  /**
   * Valida se duas senhas são iguais
   */
  validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (!password || !confirmPassword) {
      return {
        isValid: false,
        message: 'Por favor, preencha ambas as senhas.'
      };
    }

    if (password !== confirmPassword) {
      return {
        isValid: false,
        message: 'As senhas não coincidem. Por favor, verifique e tente novamente.'
      };
    }

    return { isValid: true };
  }

  /**
   * Valida nome (mínimo 2 caracteres)
   */
  validateName(name: string, fieldName: string = 'nome'): ValidationResult {
    if (!name || name.trim() === '') {
      return {
        isValid: false,
        message: `Por favor, insira seu ${fieldName}.`
      };
    }

    if (name.trim().length < 2) {
      return {
        isValid: false,
        message: `O ${fieldName} deve ter pelo menos 2 caracteres.`
      };
    }

    return { isValid: true };
  }

  /**
   * Valida código numérico
   */
  validateCode(code: string, length: number = 6): ValidationResult {
    if (!code || code.trim() === '') {
      return {
        isValid: false,
        message: 'Por favor, insira o código de recuperação.'
      };
    }

    if (code.length < length) {
      return {
        isValid: false,
        message: `O código deve ter ${length} dígitos.`
      };
    }

    const numericRegex = /^\d+$/;
    if (!numericRegex.test(code)) {
      return {
        isValid: false,
        message: 'O código deve conter apenas números.'
      };
    }

    return { isValid: true };
  }

  /**
   * Valida se todos os campos obrigatórios estão preenchidos
   */
  validateRequiredFields(fields: { [key: string]: any }): ValidationResult {
    const emptyFields = Object.keys(fields).filter(key => !fields[key] || fields[key].toString().trim() === '');

    if (emptyFields.length > 0) {
      return {
        isValid: false,
        message: 'Por favor, preencha todos os campos.'
      };
    }

    return { isValid: true };
  }
}

