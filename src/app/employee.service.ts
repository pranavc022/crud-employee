import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // constructor(private http: HttpClient) { };
  constructor(private angularFirestore: AngularFirestore) {}

  
}
