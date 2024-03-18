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
    FontAwesomeModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
