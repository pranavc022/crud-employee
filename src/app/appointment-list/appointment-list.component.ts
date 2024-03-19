import { Component } from '@angular/core';
import { Appointment } from '../model/appointment';
import { AppComponent } from '../app.component';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators, AbstractControl } from '@angular/forms';
import { EmployeeService } from './employee.service';
import { SearchPipe } from '../search.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DeptInterfaceTs } from './dept.interface.ts';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'


// import {pen-to-square} from '@fortawesome/free-solid-svg-icons';
// import {faTrash} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  currentPageIndex = 0;
  pageSize = 5;
  pageSizeOptions= [5, 10, 20, 50];
  pageIndex = 0;

  empData: Appointment[] = [];
  employeeForm: FormGroup  = new FormGroup({});

  public departments: DeptInterfaceTs[] = [{id:'1', name:'Manager'}, 
  {id:'2',name:'Technical Trainee'}, {id:'3', name: 'Project Lead'}, {id:'4', name:'Hr Executive'},
  {id:'5', name:'Software Developer'}];
  public deptID : string = "";
  
  constructor(private fb: FormBuilder,
  private router: Router,
  private http: HttpClient,
  // private paginator: MatPaginator,
  private employeeService: EmployeeService){}
  
  public resetId(){
      this.deptID = ''; 
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
  displayedColumns: string[] = ['id', 'name', 'gender', 'email', 'contact', 'role', 'action'];
  searchText ='';
  dtoptions: DataTables.Settings={};
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  dataSource = new MatTableDataSource<any>(this.appointments);

  


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
  onPaginateChange(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
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
      this.newGender = '';
        localStorage.setItem("appointments", JSON.stringify(this.appointments))
    }
  }

  deleteAppointment(index: number) {
    const isConfirmed = confirm("Are you sure you want to delete the appointment?");

      // If user confirms, proceed with deletion
      if (isConfirmed) {
          this.appointments.splice(index, 1);
          localStorage.setItem("appointments", JSON.stringify(this.appointments));
    }
  }
  loadData() {
    // Retrieve data from local storage
    const storedData = localStorage.getItem('appointments');
  
    if (storedData) {
      // Parse the stored JSON data
      const jsonData = JSON.parse(storedData);
  
      // Calculate the starting index based on the current page and page size
      const startIndex = this.currentPageIndex * this.pageSize;
  
      // Slice the data array to get the current page of data
      const pageData = jsonData.slice(startIndex, startIndex + this.pageSize);
  
      // Do something with the data (e.g., assign it to a component property)
      this.appointments = pageData;
    } else {
      console.log('No data found in local storage.');
    }
  }

  editAppointment(id: number){
  
  

  }
  filterAppointments() {
    this.filteredAppointments = this.appointments.filter(
      (appointment) => appointment.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectSuggestion(suggestion: Appointment) {
    this.searchText = suggestion.name;
    this.filteredAppointments = []; // Hide suggestions after selection
  }

  trackByFn(index: number, item: any) {
    return item.id; // Ensure unique tracking for both table and suggestions
  }



}
