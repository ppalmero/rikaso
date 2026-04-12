import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Customers } from '../../shared/models/customers';
import { ToastService } from '../../shared/services/toast.service';
import { CustomerService } from '../../shared/services/customer.service';

@Component({
  selector: 'app-new-client',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.css'
})
export class NewClientComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
      private toast: ToastService,
      private customersService: CustomerService
    ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      identification: [0, [Validators.required, Validators.min(0)]],
      contacto: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async saveClient() {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.loading = true;
      try {
        const formValue = this.form.value;
        const newClient: Omit<Customers, 'id'> = {
          nombre: formValue.name!,
          identification: formValue.identification!,
          telefono: formValue.contacto!
        };
        await this.customersService.addCustomer(newClient);
        this.toast.show('Cliente agregado correctamente', 'success');
        this.form.reset({
          active: true,
          stock: 0,
          minStockAlert: 0
        });
      } catch (error) {
        console.error(error);
        this.toast.show('Error al agregar el cliente', 'error');
      } finally {
        this.loading = false;
      }
    }
  
    resetForm() {
      this.form.reset();
    }
}
