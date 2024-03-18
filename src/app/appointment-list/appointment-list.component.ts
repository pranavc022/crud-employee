import { Component } from '@angular/core';
import { Appointment } from '../model/appointment';
import { AppComponent } from '../app.component';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { SearchPipe } from '../search.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DeptInterfaceTs } from './dept.interface.ts';
// import {pen-to-square} from '@fortawesome/free-solid-svg-icons';
// import {faTrash} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent implements OnInit {
  employeeForm: FormGroup  = new FormGroup({});

  public departments:Array<DeptInterfaceTs> = [{id:1, name:'Manager'}, 
  {id:2,name:'Technical Trainee'}, {id:3, name: 'Project Lead'}, {id:4, name:'Hr Executive'},
  {id:5, name:'Software Developer'}];
  public deptID : string = "";
  
  constructor(private fb: FormBuilder,
  private router: Router,
  private employeeService: EmployeeService){}
  
  public resetId(){
      this.deptID = ""; 
    }
  // defaultGender: string= 'Male';

  gender = [
    {id: 1, value: 'Male'},
    {id: 2, value: 'Female'},
    {id: 3, value: 'Others'}
  ]

  newRole: string = "";
  newEmail: string ="";
  newName: string = "";
  newContact:  number = NaN;
  newGender : string = '';

  searchText ='';
  dtoptions: DataTables.Settings={};
  appointments: Appointment[] = []
  

  ngOnInit(): void {
    this.dtoptions={
      pagingType:'full_numbers'
    };
    let savedApp = localStorage.getItem("appointments")         // to initialse a new dataitem and fetch from local
    this.appointments = savedApp ? JSON.parse("savedApp") : []    //to check  if there are already some data in local storage,
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    })
  }
  onSubmit(){
    if (this.employeeForm.valid) {
      // Submit the form data
      console.log(this.employeeForm.value);
    } else {
      // Display validation errors
      alert('Form is invalid!');
    }
  }

  addAppointment() {     //new function to activate on clicking the button
    if(this.newName.trim().length && this.newEmail.length){
      let newAppoint: Appointment = {
        id : Date.now(),
        name: this.newName,
        contact: this.newContact,
        email : this.newEmail,
        role : this.newRole,
        gender: this.newGender
      }
      this.appointments.push(newAppoint);   //adds the user
      //reset string values
      this.newName = '';
      this.newEmail ='';
      this.newContact = NaN;
      this.newRole= '';
      this.newGender = '';

      localStorage.setItem("appointments", JSON.stringify(this.appointments))
    }
  }
  deleteAppointment(index : number){
    this.appointments.splice(index, 1)
    localStorage.setItem("appointments", JSON.stringify(this.appointments))

  }

  editAppointment(id: number){
    // this.router
    this.router.navigate(['/edit', id]);

  }
  // {  //creating var of type class
  //   id : 1,
  //   title: "New Appointment",
  //   date: new Date('03/04/2024')
  // }


}
