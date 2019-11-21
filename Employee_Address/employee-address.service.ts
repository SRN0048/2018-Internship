import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { DataTablesResponse } from '../../../core/shared/data-tables-response.model';
import { SelectItem } from 'primeng/primeng';
import { Dropdown } from '../../../shared/models/dropdown.model';
import { DropdownDataItem } from '../../../shared/models/dropdown-data-item.model';
import { CommonService } from '../../../shared/service/common.service';
import { EmployeeAddress } from "./employee-address.model";
import { EmployeeContactPerson } from "./employee-contactperson.model";
import { EmployeeDocument } from "../../employee-education/shared/employee-document.model";

@Injectable()
export class EmployeeAddressService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string, private authService: OAuthService, private commonService: CommonService) {
  }

  getEmployeeAddressById(employeeAddressId: number) {
    return this.http.get(this.apiUrl + 'EmployeeAddress/GetEmployeeAddressById/' + employeeAddressId).toPromise()
      .then(res => <EmployeeAddress>res);
  }

  getEmployeeAddressByEmployeeId(employeeId: number) {
    return this.http.get(this.apiUrl + 'EmployeeAddress/GetEmployeeAddressByEmployeeId/' + employeeId).toPromise()
      .then(res => <EmployeeAddress[]>res);
  }

  addEmployeeAddress(emp: EmployeeAddress[]) {
    var body = JSON.stringify(emp);
    console.log(body);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.apiUrl + 'EmployeeAddress/AddEmployeeAddress', body, httpOptions);
  }

  editEmployeeAddress(emp: EmployeeAddress[]) {
    var body = JSON.stringify(emp);
    console.log(body);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.apiUrl + 'EmployeeAddress/EditEmployeeAddress', body, httpOptions);
  }

  getEmployeeContactPersonById(employeeContactPersonId: number) {
    return this.http.get(this.apiUrl + 'EmployeeContactPerson/GetEmployeeContactPersonById/' + employeeContactPersonId).toPromise()
      .then(res => <EmployeeContactPerson>res);
  }

  getEmployeeContactPersonByEmployeeId(employeeId: number) {
    return this.http.get(this.apiUrl + 'EmployeeContactPerson/GetEmployeeContactPersonByEmployeeId/' + employeeId).toPromise()
      .then(res => <EmployeeContactPerson[]>res);
  }

  addEmployeeContactPerson(emp: EmployeeContactPerson) {
    this.commonService.changeDateJSON();
    var body = JSON.stringify(emp);
    console.log(body);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.apiUrl + 'EmployeeContactPerson/AddEmployeeContactPerson', body, httpOptions);
  }

  editEmployeeContactPerson(emp: EmployeeContactPerson) {
    this.commonService.changeDateJSON();
    console.log(body);
    var body = JSON.stringify(emp);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.apiUrl + 'EmployeeContactPerson/EditEmployeeContactPerson', body, httpOptions);
  }

  deleteEmployeeContactPerson(ContactPersonId: number) {
    var body = JSON.stringify(ContactPersonId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.apiUrl + 'EmployeeContactPerson/DeleteEmployeeContactPerson', body, httpOptions);
  }

  getEmployeeDocumentByEmployeeId(employeeId: number) {
    return this.http.get(this.apiUrl + 'EmployeeDocument/GetEmployeeDocumentByEmployeeId/' + employeeId).toPromise()
      .then(res => <EmployeeDocument[]>res);
  }

  addEmployeeDocument(emp: EmployeeDocument) {
    var body = JSON.stringify(emp);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.apiUrl + 'EmployeeDocument/AddEmployeeDocument', body, httpOptions);
  }

  deleteEmployeeDocument(documentId: number) {
    var body = JSON.stringify(documentId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.apiUrl + 'EmployeeDocument/DeleteEmployeeDocument', body, httpOptions);
  }
}
