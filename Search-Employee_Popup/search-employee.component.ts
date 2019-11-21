import { Component, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Dropdown } from '../../../shared/models/dropdown.model';
import { EmployeeService } from "../../../employee-movements/employee/shared/employee.service";
import { Employee } from "../../../employee-movements/employee/shared/employee.model";
import { Level } from "../../enum/level.enum";
import { isNull } from 'util';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.css']
})
export class SearchEmployeeComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  
  display: boolean = false;
  cols: any[];
  selectedEmployee: Employee;

  orgLevelOneDDL: Dropdown[];
  orgLevelTwoDDL: Dropdown[];
  orgLevelThreeDDL: Dropdown[];
  employeeStatusDDL: Dropdown[];
  searchEmployee: Employee[];

  searchOrgLevelOne: any = null;
  searchOrgLevelTwo: any = null;
  searchOrgLevelThree: any = null;
  searchEmployeeNo: any = '';
  searchName: any = '';
  searchEmployeeStatus: any = null;
  
  orgLevelOne: any = null;
  orgLevelTwo: any = null;
  orgLevelThree: any = null;
  employeeNo: any = '';
  name: any = '';
  employeeStatus: any = null;
  
  @Input() popupPlaceholder : string;

  @Output() messageEvent = new EventEmitter<string>();
  @Output() detailEmployee = new EventEmitter<Employee>();

  constructor(private employeeService: EmployeeService, private commonService: CommonService) { }

  ngOnInit() {
    if (this.popupPlaceholder == null) {
      this.popupPlaceholder = 'Click to Search Employee';
    }

    this.cols = [
      { data: 'EmployeeId'},
      { data: 'Name' },
      { data: 'EmployeeNo', header: 'รหัสพนักงาน'},
      { data: 'Email', header: 'อีเมล์'  },
      { data: 'OrgLevelOne', header: 'บริษัท' },
      { data: 'OrgLevelTwo', header: 'สายงาน'},
      { data: 'OrgLevelThree', header: 'ฝ่าย' },
      { data: 'EmployeeStatus', header: 'สถานะพนักงาน'  },
    ];
    
    this.commonService.getDDLOrganizationByLevel(0, Level.orgLevelOne).then(res => {
      this.orgLevelOneDDL = res;
    });
    this.commonService.getDDLEmployeeStatus().then(res => {
      this.employeeStatusDDL = res;
    });

    this.gridLoad();
  }

  onSelect(emp: Employee ): void {
    this.selectedEmployee = emp;
    this.sendMessage();
    this.closeDialog();
  }

  sendMessage() {
    this.popupPlaceholder = this.selectedEmployee.name + " " + this.selectedEmployee.surname;
    this.messageEvent.emit(this.popupPlaceholder);
    this.detailEmployee.emit(this.selectedEmployee);
  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }

  gridLoad() {
    this.dtOptions = {
      order: [[1, 'asc']],
      columnDefs: [
        { orderable: false, targets: [0] },
      ],
      pagingType: 'full_numbers',
      dom: 'ltip',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      columns: this.cols,
      ajax: (dataTablesParameters: any, callback) => {
        this.employeeService.getEmployee(dataTablesParameters)
          .subscribe(resp => {
            this.searchEmployee = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      }
    };
  }

  getOrgLevelTwo() {
    this.orgLevelTwoDDL = null;
    this.orgLevelThreeDDL = null;
    this.searchOrgLevelTwo = null;
    (!isNull(this.searchOrgLevelOne)) ?
      this.commonService.getDDLOrganizationByLevel(this.searchOrgLevelOne.id, Level.orgLevelTwo).then(res => {
        this.orgLevelTwoDDL = res;
      }) : null;
  }

  getOrgLevelThree() {
    this.orgLevelThreeDDL = null;
    this.searchOrgLevelThree = null;
    (!isNull(this.searchOrgLevelTwo)) ?
      this.commonService.getDDLOrganizationByLevel(this.searchOrgLevelTwo.id, Level.orgLevelThree).then(res => {
        this.orgLevelThreeDDL = res;
      }) : null;
  }

  search() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(1).search(this.searchName);
      dtInstance.column(2).search(this.searchEmployeeNo);
      dtInstance.column(4).search(isNull(this.searchOrgLevelOne) ? '' : this.searchOrgLevelOne.id);
      dtInstance.column(5).search(isNull(this.searchOrgLevelTwo) ? '' : this.searchOrgLevelTwo.id);
      dtInstance.column(6).search(isNull(this.searchOrgLevelThree) ? '' : this.searchOrgLevelThree.id);
      dtInstance.column(7).search(isNull(this.searchEmployeeStatus) ? '' : this.searchEmployeeStatus.id);
      dtInstance.draw();
    });
  }
}
