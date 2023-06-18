import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../shared/register.service';
import { User } from '../shared/user.model';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent {

  votingForm: FormGroup;
  userId: string;
  constructor(
    private fb: FormBuilder,
    public registerService: RegisterService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.queryParams
      .subscribe((params: any): any => {
        if (!!params.id) {
          this.userId = params.id;
        }
      });
  }

  createForm() {
    this.votingForm = this.fb.group({
      candidateVoted: new FormControl(''),

    });
  }
  vote() {
    this.registerService.postVote({
      userId: this.userId,
      candidateId: this.votingForm.controls['candidateVoted'].value,
      votes: 1,
    }).subscribe((res:any) => {      
      if (res.status == true && res.voted == true) {
        this.messageService.add({ severity: 'success', summary: 'Voted Successfully!', detail: 'Your vote has been submitted successfully.' });
      } else if (res.voted == false) {
        this.messageService.add({ severity: 'error', summary: res.message, detail: 'Please try again with a different ID.' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.' });
      }      
    }); 
  }
}