import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DataTablesModule} from 'angular-datatables'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { SearchPipe } from './search.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DeptInterfaceTs } from './appointment-list/dept.interface.ts';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseApp } from 'firebase/app';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';


@NgModule({
  declarations: [
    AppComponent,
    AppointmentListComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DataTablesModule,
    FontAwesomeModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
