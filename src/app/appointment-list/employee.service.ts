import { Injectable } from '@angular/core';
import { Appointment } from '../model/appointment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private  appointments: Appointment[] =[];


  constructor() { 
    let savedApp = localStorage.getItem("appointments");
    this.appointments = savedApp? JSON.parse(savedApp) : [];
  }
}
