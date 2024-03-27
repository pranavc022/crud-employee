import { Component, booleanAttribute } from '@angular/core';
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
  styleUrls : ['appointment-list.component.scss']

})
export class AppointmentListComponent implements OnInit {

  isEditMode = false;
  
  totalEmployees: number = 0;
  activeEmployees: number = 0;
  maleEmployees: number = 0;
  femaleEmployees: number = 0;
  otherEmployees: number = 0;

  empData: Appointment[] = [];
  employeeForm: FormGroup  = new FormGroup({});

  public departments:Array<DeptInterfaceTs> = [{id:'1', name:'Manager'}, 
  {id:'2',name:'Technical Trainee'}, {id:'3', name: 'Project Lead'}, {id:'4', name:'Hr Executive'},
  {id:'5', name:'Software Developer'}];
  public deptID : string = "";

  currentAppointmentIndex: number | null = null;
  editingIndex: number | null = null;
  
  constructor(private fb: FormBuilder,
  private router: Router,
  private http: HttpClient,
  // private paginator: MatPaginator,
  private employeeService: EmployeeService){}
  
  public resetId(){
      this.deptID = '0'; 
    }
 
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
  newactiveEmployee: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'gender', 'email', 'contact', 'role', 'action'];
  searchText ='';
  dtoptions: DataTables.Settings={};
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  dataSource = new MatTableDataSource<any>(this.appointments);

  pageSize = 3;
  pageSizeOptions = [3, 10, 20, 50];
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
   
    this.loadAppointments();
    this.updateEmployeeCounts();
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
    // Implement logic to update data based on page and page size changes
    this.pageSize = event.pageSize;
  }


  loadAppointments() {
    let savedApp = localStorage.getItem('appointments');
    this.appointments = savedApp ? JSON.parse(savedApp) : [];
    this.dataSource = new MatTableDataSource<Appointment>(this.appointments);
    this.updateEmployeeCounts(); // Update counts whenever appointments are loaded
  }

   updateEmployeeCounts() {
    this.totalEmployees = this.appointments.length;
    this.activeEmployees = this.appointments.filter(app => app.activeEmployee).length;
    this.maleEmployees = this.appointments.filter(app => app.gender === 'Male').length;
    this.femaleEmployees = this.appointments.filter(app => app.gender === 'Female').length;
    this.otherEmployees = this.appointments.filter(app => app.gender === 'Others').length;
  }

  addOrUpdateAppointment() {
    // Ensure email ends with the correct domain
    if (this.newEmail.endsWith("@relanto.ai")) {
        if (this.newName.trim().length && this.newEmail.length) {
            const isUpdateOperation = this.currentAppointmentIndex !== null;
    
            if (isUpdateOperation) {
                // Now use the currentAppointmentIndex for updates.
                const index = this.currentAppointmentIndex;
                if (index !== null && index >= 0 && index < this.appointments.length) {
                    this.appointments[index] = {
                        id: this.appointments[index].id, // Preserve the existing id
                        name: this.newName,
                        contact: this.newContact,
                        email: this.newEmail,
                        activeEmployee: this.newactiveEmployee,
                        role: this.newRole,
                        gender: this.newGender
                        
                    };
                    alert("Employee Updated Successfully!")
                } else {
                    console.log("Error: Appointment to update not found.");
                    return;
                }
                this.isEditMode=false
            } else {
                // Adding a new appointment
                let newAppoint = {
                    id: Date.now(),
                    name: this.newName,
                    contact: this.newContact,
                    email: this.newEmail,
                    role: this.newRole,
                    gender: this.newGender,
                    activeEmployee: this.newactiveEmployee
                };
                this.appointments.push(newAppoint);
                alert("Employee Added Successfully!")
            }
    
            // Resetting form fields manually
            this.newName = '';
            this.newEmail = '';
            this.newContact = NaN; // Reset to 0 or another appropriate numeric value.
            this.newRole = '';
            this.newGender = '';
            this.newactiveEmployee = false;
    
            // Update local storage
            localStorage.setItem("appointments", JSON.stringify(this.appointments));
    
            // Reset the index to null to exit edit mode
            this.currentAppointmentIndex = null;
            this.updateEmployeeCounts()
        }
    } else {
        alert("Email must end with @relanto.ai");
    }
  }

  

  deleteAppointment(index : number){
    this.appointments.splice(index, 1)
    localStorage.setItem("appointments", JSON.stringify(this.appointments))
    this.updateEmployeeCounts();
    alert("Employee Deleted Successfully!");

  }


  clickMethod(index: number) {
    if(confirm("Are you sure you want to delete the record")) {
      console.log(this.deleteAppointment(index));
    }
  }

  // editAppointment(id: number){
  //   // this.router
  //   this.router.navigate(['/edit', id]);

  // }
  editAppointment(index: number) {
    this.isEditMode = true;
    this.currentAppointmentIndex = index;
    const appointmentToEdit = this.appointments[index];
    this.newName = appointmentToEdit.name;
    this.newGender = appointmentToEdit.gender;
    this.newEmail = appointmentToEdit.email;
    this.newContact = appointmentToEdit.contact;
    this.newRole = appointmentToEdit.role;
  }

  filterAppointments() {
    this.filteredAppointments = this.appointments.filter(
      (appointment) => appointment.name.toLowerCase().startsWith(this.searchText.toLowerCase())
    );
  }
  

  selectSuggestion(suggestion: Appointment) {
    this.searchText = suggestion.name;
    this.filteredAppointments = []; // Hide suggestions after selection
  }

  trackByFn(index: number, item: any) {
    return item.id; // Ensure unique tracking for both table and suggestions
  }

  // {  //creating var of type class
  //   id : 1,
  //   title: "New Appointment",
  //   date: new Date('03/04/2024')
  // }


}