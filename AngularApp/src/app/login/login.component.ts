import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../shared/register.service';
import { User } from '../shared/user.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    public registerService: RegisterService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.registerService.getUser({
      name: this.loginForm.controls['name'].value,
      password: this.loginForm.controls['password'].value,
    }).subscribe((res: any) => {
      if (res.status == true) {
        this.messageService.add({ severity: 'success', summary: 'Login Successfully!!', detail: 'Form Submitted!!' });
        if (res.email.toLowerCase().includes("@admin.com")) {
          this.router.navigate(['/admin']);
        }else{
          this.router.navigate(['/vote'], {
            queryParams: { id: res.id },
          });
        }
      } else {
        this.messageService.add({ severity: 'error', summary: "Error", detail: 'Please Try Again !!' });
      }
    });
  }

}
