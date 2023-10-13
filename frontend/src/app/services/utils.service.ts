import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Injectable()
export class UtilsService {
    constructor(private messageService: MessageService) {}

    showSuccessMessage(message?: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: message || 'Sucesso ao realizar operação',
            life: 3000,
        });
    }

    showErrorMessage(message?: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message || 'Erro ao realizar operação',
            life: 3000,
        });
    }

    isFieldValid(form: FormGroup, fieldName: string): boolean {
        return !(form.get(fieldName)?.dirty && form.get(fieldName)?.invalid);
    }
}
