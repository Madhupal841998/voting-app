import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../shared/register.service';
import { User } from '../shared/user.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  searchForm: FormGroup;
  adminData: any = [];
  filteredAdmin: any = [];
  first = 0;
  constructor(
    private fb: FormBuilder,
    public registerService: RegisterService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this. getAdmin();
  }

  getAdmin() {
    this.registerService.getAdmin().subscribe((res: any) => {
      if (res.status == true) {
        this.adminData = res.data;        
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.' });
      }

    });

  }

}
