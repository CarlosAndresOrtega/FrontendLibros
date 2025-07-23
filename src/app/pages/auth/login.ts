import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { LayoutService } from '@/layout/service/layout.service';
import { Fluid } from 'primeng/fluid';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, FormsModule, ToastModule, MessageModule, PasswordModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="min-h-screen flex items-center justify-center p-0 lg:p-4 bg-white lg:bg-gray-50 dark:bg-gray-900 dark:lg:bg-gray-900 transition-colors duration-200">
            <!-- Card Container - only has card styling on large screens -->
            <div class="bg-white w-full lg:rounded-2xl lg:overflow-hidden lg:max-w-5xl flex flex-col lg:flex-row lg:shadow-lg dark:bg-gray-800 dark:text-white transition-colors duration-200">
                <!-- Left side - Login Form -->
                <div class="w-full lg:w-1/2 p-12 flex flex-col">

                    <!-- Login Header -->
                    <h1 class="text-3xl font-bold text-gray-800 mb-8 dark:text-white transition-colors duration-200">Ingreso</h1>

                    <!-- Login Form -->
                    <form [formGroup]="loginForm" class="w-full">
                        <div class="mb-6">
                            <label for="email" class="block text-gray-700 mb-2 text-sm dark:text-gray-300 transition-colors duration-200">User *</label>
                            <input id="email" pInputText type="text" class="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200" formControlName="email" />
                        </div>

                        <div class="mb-5">
                            <label for="password" class="block text-gray-700 mb-2 text-sm dark:text-gray-300 transition-colors duration-200">Contraseña *</label>
                            <div class="relative">
                                <p-password
                                    formControlName="password"
                                    [feedback]="false"
                                    toggleMask="true"
                                    styleClass="block w-full"
                                    inputStyleClass="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                                >
                                </p-password>
                            </div>
                        </div>

                        <button type="button" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-full transition duration-200" [disabled]="isLoading()" (click)="signIn()">
                            <span *ngIf="!isLoading()">Ingresar</span>
                            <span *ngIf="isLoading()" class="flex items-center justify-center">
                                <i class="pi pi-spin pi-spinner mr-2"></i>
                                Cargando...
                            </span>
                        </button>
                    </form>
                </div>

                <!-- Right side - Welcome Content -->
                <div class="w-full lg:w-1/2 bg-gray-900 text-white p-12 flex-col justify-center relative overflow-hidden hidden lg:flex dark:bg-gray-950 transition-colors duration-200">
                    <!-- Background SVG Circles -->
                    <svg class="absolute inset-0 pointer-events-none" viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                        <g class="text-gray-700 opacity-25 dark:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" stroke-width="100">
                            <circle r="234" cx="196" cy="23"></circle>
                            <circle r="234" cx="790" cy="491"></circle>
                        </g>
                    </svg>

                    <!-- Dots -->
                    <svg class="absolute -top-16 -right-16 text-gray-700 dark:text-gray-600 transition-colors duration-200" viewBox="0 0 220 192" width="220" height="192" fill="none">
                        <defs>
                            <pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
                            </pattern>
                        </defs>
                        <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"></rect>
                    </svg>

                    <div class="z-10">
                        <h1 class="text-5xl font-bold mb-6">Bienvenido<br />Libros Carlos.</h1>
                        <p class="text-base mb-16 opacity-90">
                            Explorá y gestioná fácilmente todo el catálogo de libros con nuestra aplicación. Visualizá datos actualizados, organizá tus búsquedas y accedé a herramientas avanzadas de scraping para encontrar lo que necesitás sin
                            complicaciones.
                        </p>

                        <div class="flex items-center">
                            <div class="flex -space-x-3">
                                <div class="w-8 h-8 rounded-full bg-white overflow-hidden border-2 border-gray-900 dark:border-gray-700 transition-colors duration-200"></div>
                                <div class="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-900 dark:border-gray-700 transition-colors duration-200"></div>
                                <div class="w-8 h-8 rounded-full bg-gray-400 overflow-hidden border-2 border-gray-900 dark:border-gray-700 transition-colors duration-200"></div>
                                <div class="w-8 h-8 rounded-full bg-gray-500 overflow-hidden border-2 border-gray-900 dark:border-gray-700 transition-colors duration-200"></div>
                            </div>
                            <!-- <span class="ml-4 text-sm">Ya somos más de 1000 clientes activos.</span> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class Login {
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    messageService = inject(MessageService);

    // Use signals for reactive state management
    isLoading = signal<boolean>(false);
    showPassword = signal<boolean>(false);
    fb = inject(FormBuilder);

    loginForm = this.fb.group({
        email: ['admin', [Validators.required, Validators.email]],
        password: ['admin123', [Validators.required]],
    });

    togglePasswordVisibility() {
        this.showPassword.update((current) => !current);
    }

    signIn() {
        // Reset error status and set loading state
        this.isLoading.set(true);

        const credentials = {
            email: this.loginForm.value.email ?? '',
            password: this.loginForm.value.password ?? '',
        };

        this.authService.signIn(credentials).subscribe({
            next: () => {
                this.isLoading.set(false);
                // Successful login is handled by the auth service (redirect)
            },
            error: (error) => {
                this.isLoading.set(false);

                if (error.status === 401) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error de autenticación',
                        detail: 'Las credenciales ingresadas son inválidas. Por favor intente nuevamente.',
                        life: 5000,
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Ocurrió un problema al intentar ingresar. Por favor intente nuevamente más tarde.',
                        life: 5000,
                    });
                }

                console.error('Login error:', error);
            },
        });
    }
}
