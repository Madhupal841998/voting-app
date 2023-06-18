import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../shared/register.service';
import { User } from '../shared/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    public registerService: RegisterService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  adduser() {
    this.registerService.postUser({
      name: this.registerForm.controls['name'].value,
      email: this.registerForm.controls['email'].value,
      phone: this.registerForm.controls['phone'].value,
      password: this.registerForm.controls['password'].value,
    }).subscribe((res: any) => {
      if (res.status == true) {
        this.messageService.add({ severity: 'success', summary: 'Registered Successfully!!', detail: 'Form Submitted!!' });
        this.router.navigate(['/login']);
      } else {
        this.messageService.add({ severity: 'error', summary: res.message, detail: 'Please Try Again !!' });
      }
    });
  }


}
