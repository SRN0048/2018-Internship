import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../../shared/breadcrumb/breadcrumb.service';
import { ConfirmationService, Message } from 'primeng/primeng';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../core/data-sharing.service';
import { EmployeeService } from './../shared/employee.service';
import { Employee } from './../shared/employee.model';
import { Dropdown } from '../../../shared/models/dropdown.model';
import { isUndefined, isNull, isNullOrUndefined } from 'util';
import { UserControlService } from '../../../core/user-control.service';
import { PageType } from '../../../shared/enum/page-type.enum';
import { Permission } from '../../../shared/models/permission.model';
import { Module } from '../../../shared/enum/module.enum';
import { MasterSetup } from '../../../shared/enum/master-setup.enum';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Level } from '../../../shared/enum/level.enum';
import { CommonService } from '../../../shared/service/common.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {

  id: number;
  employee: Employee;

  skinColorDDL: Dropdown[];
  religionDDL: Dropdown[];
  marriageStatusDDL: Dropdown[];
  militaryStatusDDL: Dropdown[];
  raceDDL: Dropdown[];
  bloodTypesDDL: Dropdown[];
  nationalityDDL: Dropdown[];
  titlesDDL: Dropdown[];

  form: FormGroup;

  presentYear: any = null;
  bloodGroup: any = null;
  title: any = null;
  nationalityId: any = null;
  skinColorId: any = null;
  religionId: any = null;
  raceId: any = null;
  marriageStatus: any = null;
  militaryStatus: any = null;
  hasPicture: boolean = false;

  dateIdCardIssue: any = null;
  dateIdCardExpire: any = null;
  datePassportIssue: any = null;
  datePassportExpire: any = null;
  dateOfBirth: any = null;

  msgs: Message[] = [];

  image: any = "assets/layout/images/avatar/avatar6.png";

  validDate: boolean = true;

  permission: Permission = { allowGrant: false, allowAdd: false, allowEdit: false, allowView: false, allowDelete: false };

  constructor(private fb: FormBuilder, private breadcrumbService: BreadcrumbService, private employeeService: EmployeeService, private commonService: CommonService, private confirmationService: ConfirmationService, private router: Router, private data: DataSharingService, private userControlService: UserControlService) {}

  ngOnInit() { 

    this.userControlService.authorizeControl(Module.EMP001).subscribe(auth => {
      this.permission = this.userControlService.validatePermission(PageType.search, this.permission, auth);
    });

    this.breadcrumbService.setItems([
      { label: 'Employee Movement' },
      { label: 'ข้อมูลพนักงาน', routerLink: ['/employee'] },
      { label: 'แก้ไขข้อมูลพนักงาน' }
    ]);

    this.employee = new Employee();

    this.form = this.fb.group({
      'hasPicture': new FormControl(''),
      'originalPicture': new FormControl(''),
      'gender': new FormControl(''),
      'bloodGroup': new FormControl(''),
      'nationalityId': new FormControl(''),
      'dateIdCardExpire': new FormControl(''),
      'datePassportExpire': new FormControl(''),
      'heightInCM': new FormControl(''),
      'skinColorId': new FormControl(''),
      'religionId': new FormControl(''),
      'telephoneNo': new FormControl(''),
      'idCardIssuePlace': new FormControl(''),
      'passportNo': new FormControl(''),
      'marriageStatus': new FormControl(''),
      'dateOfBirth': new FormControl(''),
      'weightInKGS': new FormControl(''),
      'raceId': new FormControl(''),
      'lineId': new FormControl(''),
      'mobileNo': new FormControl(''),
      'dateIdCardIssue': new FormControl(''),
      'datePassportIssue': new FormControl(''),
      'militaryStatus': new FormControl(''),
      'remark': new FormControl(''),
      'employeeId': new FormControl(''),
      'nickName': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required),
      'name_EN': new FormControl('', Validators.required),
      'emailAddress': new FormControl('', Validators.required),
      'idCardNo': new FormControl('', Validators.required),
      'title': new FormControl('', Validators.required),
      'nickName_EN': new FormControl('', Validators.required),
      'surname': new FormControl('', Validators.required),
      'surname_EN': new FormControl('', Validators.required),
    });

    this.data.currentData.subscribe(data => {
      this.id = data;
      this.employeeService.getEmployeeById(this.id).then(emp => {

        this.employee = emp;
        this.hasPicture = this.employee.hasPicture;
        (!isNull(this.employee.originalPicture)) ? this.image = this.employee.originalPicture : null; 
        (!isNull(this.employee.dateIDCardExpire)) ? this.dateIdCardExpire = new Date(this.employee.dateIDCardExpire) : null;
        (!isNull(this.employee.datePassportExpire)) ? this.datePassportExpire = new Date(this.employee.datePassportExpire) : null;
        (!isNull(this.employee.dateOfBirth)) ? this.dateOfBirth = new Date(this.employee.dateOfBirth) : null;
        (!isNull(this.employee.dateIDCardIssue)) ? this.dateIdCardIssue = new Date(this.employee.dateIDCardIssue) : null;
        (!isNull(this.employee.datePassportIssue)) ? this.datePassportIssue = new Date(this.employee.datePassportIssue) : null;

        this.commonService.getDDLMasterSetupById(MasterSetup.BloodType).then(res => {
          this.bloodTypesDDL = res;
          (!isNull(this.employee.bloodGroup)) ? this.bloodGroup = res.find(e => e.id == this.employee.bloodGroup) : null;
        });

        this.commonService.getDDLMasterSetupById(MasterSetup.SkinColor).then(res => {
          this.skinColorDDL = res;
          (!isNull(this.employee.skinColorId)) ? this.skinColorId = res.find(e => e.id == this.employee.skinColorId): null;
        });

        this.commonService.getDDLMasterSetupById(MasterSetup.Race).then(res => {
          this.raceDDL = res;
          (!isNull(this.employee.raceId)) ? this.raceId = res.find(e => e.id == this.employee.raceId) : null;
        });

        this.commonService.getDDLMasterSetupById(MasterSetup.Religion).then(res => {
          this.religionDDL = res;
          (!isNull(this.employee.religionId)) ? this.religionId = res.find(e => e.id == this.employee.religionId) : null;
        });

        this.commonService.getDDLMasterSetupById(MasterSetup.Nationality).then(res => {
          this.nationalityDDL = res;
          (!isNull(this.employee.nationalityId)) ? this.nationalityId = res.find(e => e.id == this.employee.nationalityId) : null;
        });

        this.commonService.getDDLMasterSetupById(MasterSetup.MarriageStatus).then(res => {
          this.marriageStatusDDL = res;
          (!isNull(this.employee.marriageStatus)) ? this.marriageStatus = res.find(e => e.id == this.employee.marriageStatus): null;
        });

        this.commonService.getDDLMasterSetupById(MasterSetup.MilitaryStatus).then(res => {
          this.militaryStatusDDL = res;
          (!isNull(this.employee.militaryStatus)) ? this.militaryStatus = res.find(e => e.id == this.employee.militaryStatus) : null;
        });

        this.commonService.getDDLTitle().then(res => {
          this.titlesDDL = res;
          this.title = res.find(e => e.id == this.employee.title);
        });
      });
    })

    this.presentYear = this.commonService.getPresentYear();

    if (this.id == 0) {
      this.router.navigate(['/employee']);
    }
  }

  onChooseImage(event) {
    this.image = event.files[0];
    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.image = e.target.result;
    }
    reader.readAsDataURL(event.files[0]);
    this.hasPicture = true;
  }

  //checkDateIdCard() {
  //  (!isNull(this.dateIdCardIssue)) ? (this.dateIdCardExpire > this.dateIdCardIssue) ? this.validDate = true : this.validDate = false : (!isNull(this.dateIdCardExpire)) ? this.validDate = false : this.validDate = true;
  //}

  //checkDatePassport() {
  //  (!isNull(this.datePassportIssue)) ? (this.datePassportExpire > this.datePassportIssue) ? this.validDate = true : this.validDate = false : (!isNull(this.datePassportExpire)) ? this.validDate = false : this.validDate = true;
  //}

  onSubmit(value: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to edit?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.form.patchValue({
          'title': this.title.id,
          'hasPicture': this.hasPicture,
          'originalPicture': (this.hasPicture == true) ? this.image : null,
          'raceId': !isNull(this.raceId) ? this.raceId.id : null,
          'bloodGroup': !isNull(this.bloodGroup) ? this.bloodGroup.id : null,
          'skinColorId': !isNull(this.skinColorId) ? this.skinColorId.id : null,
          'religionId': !isNull(this.religionId) ? this.religionId.id : null,
          'marriageStatus': !isNull(this.marriageStatus) ? this.marriageStatus.id : null,
          'militaryStatus': !isNull(this.militaryStatus) ? this.militaryStatus.id : null,
          'nationalityId': !isNull(this.nationalityId) ? this.nationalityId.id : null,
        });
        this.employeeService.editEmployeeInformation(this.form.value).subscribe(res => {
          if (res) {
            this.router.navigate(['/employee']);
          } else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Fail', detail: 'Fail' });
          }
        });
      }
    });
  }

  back() {
    this.router.navigate(['/employee']);
  }

}
