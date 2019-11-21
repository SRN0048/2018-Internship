import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ConfirmationService, Message } from 'primeng/primeng';
import { UserControlService } from "../../core/user-control.service";
import { Module } from "../../shared/enum/module.enum";
import { PageType } from "../../shared/enum/page-type.enum";
import { Permission } from "../../shared/models/permission.model";
import { DataTableDirective } from 'angular-datatables';
import { Dropdown } from "../../shared/models/dropdown.model";
import { CommonService } from '../../shared/service/common.service';
import { DataSharingService } from "../../core/data-sharing.service";
import { EmployeeAddressService } from "./shared/employee-address.service";
import { EmployeeAddress } from "../employee-address/shared/employee-address.model";
import { MasterSetup } from '../../shared/enum/master-setup.enum';
import { EmployeeContactPerson } from "./shared/employee-contactperson.model";
import { EmployeeDocument } from "../employee-education/shared/employee-document.model";
import { isNull } from 'util';
import { count } from 'rxjs/operator/count';

@Component({
  selector: 'app-employee-address',
  templateUrl: './employee-address.component.html',
  styleUrls: ['./employee-address.component.css']
})
export class EmployeeAddressComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  id: number;
  countClickContact: number = 0;
  countClickEmergency: number = 0;
  //readFormOnly: boolean;
  //readAccFormOnly: boolean;

  employeeAddress_a: EmployeeAddress[];
  employeeAddress: EmployeeAddress;
  employeeAddressSubmit: Array<EmployeeAddress> = [];
  employeeAddressContact_a: EmployeeAddress[];
  employeeAddressContact: EmployeeAddress;

  employeeContactPersonArray: EmployeeContactPerson[];
  employeeContactPerson: EmployeeContactPerson;

  employeeDocuments: EmployeeDocument[];
  employeeDocument: EmployeeDocument;
  
  form: FormGroup;
  accForm: FormGroup;
  

  msgs: Message[] = [];
  uploadedFiles: any[];
  contactPerson: any[] = [];
  contactPersonId: number = null;
  relationShip: any = null;
  documentType: any = null;
  address: string;
  province: any = null;
  district: any = null;
  subDistrict: string;
  postNo: any;
  phoneNo: string;
  address_ca: string;
  subDistrict_ca: string;
  postNo_ca: any;
  phoneNo_ca: string;

  contactPersonName: any = null;
  contactPersonSurname: any = null;
  //relation_acc: any = null;
  contactPersonAddress: any = null;
  contactPersonSubdistrict: any = null;
  contactPersonPostalCode: any = null;
  contactPersonPhoneNo: any = null;
  

  relationShipDDL: Dropdown[];
  relationShipDDL_acc: Dropdown;
  documentTypeDDL: Dropdown[];
  provinces: Dropdown[];
  provinceDDL: Dropdown;
  districts: Dropdown[];
  districtDDL: Dropdown;
  provinces_ca: Dropdown[];
  provinceDDL_ca: Dropdown;
  districts_ca: Dropdown[];
  districtDDL_ca: Dropdown;
  provinces_acc: Dropdown[];
  provinceDDL_acc: Dropdown;
  districts_acc: Dropdown[];
  districtDDL_acc: Dropdown;

  documentTypeId: any = null;
  file: any = null;
  fileAttached: any = null;

  permission: Permission = { allowGrant: false, allowAdd: false, allowEdit: false, allowView: false, allowDelete: false };


  constructor(private fb: FormBuilder, private employeeAddressService: EmployeeAddressService, private confirmationService: ConfirmationService, private userControlService: UserControlService, private commonService: CommonService, private data: DataSharingService) { }

  ngOnInit() {
    this.userControlService.authorizeControl(Module.EMP001).subscribe(auth => {
      this.permission = this.userControlService.validatePermission(PageType.edit, this.permission, auth);
    });
      
    this.data.currentData.subscribe(data => {
      this.id = data;

      this.employeeAddressService.getEmployeeAddressByEmployeeId(this.id).then(res => { //region getEmployeeAddressByEmployeeId
        
        if (res.length > 0) {

          this.employeeAddress_a = res;
          this.employeeAddressContact_a = res;
          this.employeeAddress = res.find(emp => emp.addressType == 1);
          this.employeeAddressContact = res.find(emp => emp.addressType == 2);

          this.commonService.getDDLProvince().then(res => {
            this.provinces = res;
            this.provinces_ca = res;
            (!isNull(this.employeeAddress.provinceId)) ?
              this.provinceDDL = res.find(d => d.id == this.employeeAddress.provinceId) : null;
            (!isNull(this.employeeAddressContact.provinceId)) ?
              this.provinceDDL_ca = res.find(d => d.id == this.employeeAddressContact.provinceId) : null;
          });

          this.commonService.getDDLDistrict().then(res => {
            this.districts = res;
            this.districts_ca = res;
            (!isNull(this.employeeAddress.districtId)) ?
              this.districtDDL = res.find(d => d.id == this.employeeAddress.districtId) : null;
            (!isNull(this.employeeAddressContact.districtId)) ?
              this.districtDDL_ca = res.find(d => d.id == this.employeeAddressContact.districtId) : null;
          });

          this.commonService.getDDLDistrict().then(res => this.districts_acc = res);
          this.commonService.getDDLProvince().then(res => this.provinces_acc = res);

          this.employeeAddressService.getEmployeeContactPersonByEmployeeId(this.id).then(res => {
            this.employeeContactPersonArray = res;
          });

          this.commonService.getDDLMasterSetupById(MasterSetup.Relationship).then(res => {
            this.relationShipDDL = res;
          });

          this.commonService.getDDLMasterSetupById(MasterSetup.DocumentType).then(res => {
            this.documentTypeDDL = res;
          });
        }
        else {
          this.employeeAddress_a = res;
          this.commonService.getDDLProvince().then(res => {
            this.provinces = res;
            this.provinces_ca = res;
            this.provinces_acc = res;
          })

          this.commonService.getDDLDistrict().then(res => {
            this.districts = res;
            this.districts_ca = res;
            this.districts_acc = res;
          })

          this.commonService.getDDLMasterSetupById(MasterSetup.Relationship).then(res => {
            this.relationShipDDL = res;
          });
          this.commonService.getDDLMasterSetupById(MasterSetup.DocumentType).then(res => {
            this.documentTypeDDL = res;
          });
        }
      }); //end getEmployeeAddressByEmployeeId

      this.employeeAddressService.getEmployeeDocumentByEmployeeId(this.id).then(res => {
        this.employeeDocuments = res;
      });

    });

      this.form = this.fb.group({
        'employeeId': new FormControl(''),
        'address': new FormControl('', Validators.required),
        'provinceId': new FormControl('', Validators.required),
        'postalCode': new FormControl('', Validators.required),
        'districtId': new FormControl('', Validators.required),
        'phoneNo': new FormControl('', Validators.required),
        'subdistrict': new FormControl('', Validators.required),
        'address_ca': new FormControl('', Validators.required),
        'province_ca': new FormControl('', Validators.required),
        'postNo_ca': new FormControl('', Validators.required),
        'district_ca': new FormControl('', Validators.required),
        'phoneNo_ca': new FormControl('', Validators.required),
        'subDistrict_ca': new FormControl('', Validators.required),
        'employeeAddressId': new FormControl(''),
      });

      this.accForm = this.fb.group({
        'employeeId': new FormControl(''),
        'contactPersonId': new FormControl(''),
        'contactPersonName': new FormControl('', Validators.required),
        'contactPersonSurname': new FormControl('', Validators.required),
        'contactPersonRelationShipId': new FormControl('', Validators.required),
        'contactPersonAddress': new FormControl('', Validators.required),
        'contactPersonProvinceId': new FormControl('', Validators.required),
        'contactPersonPostalCode': new FormControl('', Validators.required),
        'contactPersonDistrictId': new FormControl('', Validators.required),
        'contactPersonPhoneNo': new FormControl('', Validators.required),
        'contactPersonSubDistrict': new FormControl('', Validators.required),
      });

      this.employeeAddress = new EmployeeAddress;
      this.employeeAddressContact = new EmployeeAddress;
      this.employeeContactPerson = new EmployeeContactPerson;
      this.employeeDocument = new EmployeeDocument();

      this.dtOptions = {
        processing: false,
        searching: false,
        info: false,
        paging: false,
        //scrollX: true,
        columnDefs: [
          { orderable: false, targets: '_all' }
        ],
      }
  }

  gridLoad() {
    this.employeeAddressService.getEmployeeAddressByEmployeeId(this.id).then(emp => {
      this.employeeAddress_a = emp;
    });
    this.employeeAddressService.getEmployeeAddressByEmployeeId(this.id).then(emp => {
      this.employeeAddressContact_a = emp;
    });
    this.employeeAddressService.getEmployeeContactPersonByEmployeeId(this.id).then(emp => {
      this.employeeContactPersonArray = emp;
    });

  }

  gridLoadDocument() {
    this.employeeAddressService.getEmployeeDocumentByEmployeeId(this.id).then(res => {
      this.employeeDocuments = res;
    });
  }

  useSameAddress1() {
      if (this.countClickContact == 0) {
        this.employeeAddressContact.address = this.employeeAddress.address;
        this.provinceDDL_ca = this.provinceDDL;
        this.districtDDL_ca = this.districtDDL;
        this.employeeAddressContact.subdistrict = this.employeeAddress.subdistrict;
        this.employeeAddressContact.postalCode = this.employeeAddress.postalCode;
        this.employeeAddressContact.phoneNo = this.employeeAddress.phoneNo;
        //this.readFormOnly = true;
        this.countClickContact++;
      } else if (this.countClickContact == 1) {
        this.employeeAddressContact.address = null;
        this.provinceDDL_ca = null;
        this.districtDDL_ca = null;
        this.employeeAddressContact.subdistrict = null;
        this.employeeAddressContact.postalCode = null;
        this.employeeAddressContact.phoneNo = null;
        //this.readFormOnly = false;
        this.countClickContact = 0;
      }
  }

  useSameAddress2() {
    if (this.countClickEmergency == 0) {
      this.contactPersonAddress = this.employeeAddress.address;
      this.provinceDDL_acc = this.provinceDDL;
      this.districtDDL_acc = this.districtDDL;
      this.contactPersonSubdistrict = this.employeeAddress.subdistrict;
      this.contactPersonPostalCode = this.employeeAddress.postalCode;
      this.contactPersonPhoneNo = this.employeeAddress.phoneNo;
      //this.readAccFormOnly = true;
      this.countClickEmergency++;
    } else if (this.countClickEmergency == 1) {
      this.contactPersonAddress = null;
      this.provinceDDL_acc = null;
      this.districtDDL_acc = null;
      this.contactPersonSubdistrict = null;
      this.contactPersonPostalCode = null;
      this.contactPersonPhoneNo = null;
      //this.readAccFormOnly = false;
      this.countClickEmergency = 0;
    }
  }

  onSubmitAddress(value: string) {
    if (this.employeeAddress_a.length == 0) {

      this.employeeAddressSubmit = [{
        employeeId: this.id, employeeAddressId: 0, addressType: 1, address: this.employeeAddress.address, subdistrict: this.employeeAddress.subdistrict,
        districtId: !isNull(this.districtDDL.id) ? this.districtDDL.id : null, provinceId: !isNull(this.provinceDDL.id) ? this.provinceDDL.id : null, postalCode: this.employeeAddress.postalCode, phoneNo: this.employeeAddress.phoneNo
      }, {
        employeeId: this.id, employeeAddressId: 0, addressType: 2, address: this.employeeAddressContact.address, subdistrict: this.employeeAddressContact.subdistrict,
        districtId: !isNull(this.districtDDL_ca.id) ? this.districtDDL_ca.id : null, provinceId: !isNull(this.provinceDDL_ca.id) ? this.provinceDDL_ca.id : null, postalCode: this.employeeAddressContact.postalCode, phoneNo: this.employeeAddressContact.phoneNo
      }];
      this.confirmationService.confirm({
        message: 'Are you sure you want to add?',
        header: 'Confirmation',
        icon: 'fa fa-question-circle',
        accept: () => {
          console.log(this.form.value);
          this.employeeAddressService.addEmployeeAddress(this.employeeAddressSubmit).subscribe(res => {
            if (res) {
              console.log('add');
              this.gridLoad();
              this.msgs = [];
              this.msgs.push({ severity: res ? 'info' : 'error', summary: res ? 'Success' : 'Fail', detail: res ? 'Add successfully!' : 'Cannot add!' });
            } else {
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: 'Fail', detail: 'Fail' });
            }
          });
        }
      })
    }
    else if (this.employeeAddress_a.length > 0) {
      console.log('check edit');
      console.log(this.id);
      this.employeeAddressSubmit = [{
        employeeId: !isNull(this.id) ? this.id : this.employeeAddress.employeeId, employeeAddressId: this.employeeAddress.employeeAddressId, addressType: 1, address: this.employeeAddress.address, subdistrict: this.employeeAddress.subdistrict,
        districtId: !isNull(this.districtDDL.id) ? this.districtDDL.id : null, provinceId: !isNull(this.provinceDDL.id) ? this.provinceDDL.id : null, postalCode: this.employeeAddress.postalCode, phoneNo: this.employeeAddress.phoneNo
      }, {
          employeeId: !isNull(this.id) ? this.id : this.employeeAddress.employeeId, employeeAddressId: this.employeeAddressContact.employeeAddressId, addressType: 2, address: this.employeeAddressContact.address, subdistrict: this.employeeAddressContact.subdistrict,
        districtId: !isNull(this.districtDDL_ca.id) ? this.districtDDL_ca.id : null, provinceId: !isNull(this.provinceDDL_ca.id) ? this.provinceDDL_ca.id : null, postalCode: this.employeeAddressContact.postalCode, phoneNo: this.employeeAddressContact.phoneNo
      }];
      this.confirmationService.confirm({
        message: 'Are you sure you want to edit?',
        header: 'Confirmation',
        icon: 'fa fa-question-circle',
        accept: () => {
          console.log(this.form.value);
          this.employeeAddressService.editEmployeeAddress(this.employeeAddressSubmit).subscribe(res => {
            if (res) {
              console.log('edit');
              this.gridLoad();
              this.msgs = [];
              this.msgs.push({ severity: res ? 'info' : 'error', summary: res ? 'Success' : 'Fail', detail: res ? 'Save successfully!' : 'Cannot save!' });
            } else {
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: 'Fail', detail: 'Fail' });
            }
          });
        }
      });
    }
  }

  onSubmitContactPerson(value: string) {
    console.log('onSubmitContactPerson');
    if (isNull(this.contactPersonId)) {
      console.log('add');
      this.confirmationService.confirm({
        message: 'Are you sure you want to add?',
        header: 'Confirmation',
        icon: 'fa fa-question-circle',
        accept: () => {
          console.log(this.contactPersonName);
          console.log(this.employeeContactPerson.contactPersonName);
          console.log(this.contactPersonSurname);
          console.log(this.contactPersonPostalCode);
          this.accForm.patchValue({
            'contactPersonId': 0,
            'employeeId': this.id,
            'contactPersonName': !isNull(this.employeeContactPerson.contactPersonName) ? this.employeeContactPerson.contactPersonName : null,
            'contactPersonSurname': !isNull(this.employeeContactPerson.contactPersonSurname) ? this.employeeContactPerson.contactPersonSurname : null,
            'contactPersonRelationShipId': !isNull(this.relationShipDDL_acc.id) ? this.relationShipDDL_acc.id : null,
            'contactPersonAddress': !isNull(this.contactPersonAddress) ? this.contactPersonAddress : null,
            'contactPersonProvinceId': !isNull(this.provinceDDL_acc.id) ? this.provinceDDL_acc.id : null,
            'contactPersonPostalCode': !isNull(this.contactPersonPostalCode) ? this.contactPersonPostalCode : null,
            'contactPersonDistrictId': !isNull(this.districtDDL_acc.id) ? this.districtDDL_acc.id : null,
            'contactPersonPhoneNo': !isNull(this.contactPersonPhoneNo) ? this.contactPersonPhoneNo : null,
            'contactPersonSubDistrict': !isNull(this.contactPersonSubdistrict) ? this.contactPersonSubdistrict : null,
          });
          this.employeeAddressService.addEmployeeContactPerson(this.accForm.value).subscribe(res => {
            if (res) {
              console.log('add contactperson')
              console.log(this.accForm.value);
              this.gridLoad();
              this. eraseContactPersonForm();
              this.msgs = [];
              this.msgs.push({ severity: res ? 'info' : 'error', summary: res ? 'Success' : 'Fail', detail: res ? 'Add successfully!' : 'Cannot add!' });
            } else {
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: 'Fail', detail: 'Fail' });
            }
          });
        }
      })
    }
    else {
      console.log('edit');
      this.confirmationService.confirm({
        message: 'Are you sure you want to edit?',
        header: 'Confirmation',
        icon: 'fa fa-question-circle',
        accept: () => {
          this.accForm.patchValue({
            'contactPersonId': this.contactPersonId,
            'employeeId': this.id,
            'contactPersonName': !isNull(this.employeeContactPerson.contactPersonName) ? this.employeeContactPerson.contactPersonName : null,
            'contactPersonSurname': !isNull(this.employeeContactPerson.contactPersonSurname) ? this.employeeContactPerson.contactPersonSurname : null,
            'contactPersonRelationShipId': !isNull(this.relationShipDDL_acc.id) ? this.relationShipDDL_acc.id : null,
            'contactPersonAddress': !isNull(this.contactPersonAddress) ? this.contactPersonAddress : null,
            'contactPersonProvinceId': !isNull(this.provinceDDL_acc.id) ? this.provinceDDL_acc.id : null,
            'contactPersonPostalCode': !isNull(this.contactPersonPostalCode) ? this.contactPersonPostalCode : null,
            'contactPersonDistrictId': !isNull(this.districtDDL_acc.id) ? this.districtDDL_acc.id : null,
            'contactPersonPhoneNo': !isNull(this.contactPersonPhoneNo) ? this.contactPersonPhoneNo : null,
            'contactPersonSubDistrict': !isNull(this.contactPersonSubdistrict) ? this.contactPersonSubdistrict : null,
          });
          this.employeeAddressService.editEmployeeContactPerson(this.accForm.value).subscribe(res => {
            if (res) {
              console.log('edit contactperson')
              console.log(this.accForm.value);
              this.gridLoad();
              this.eraseContactPersonForm();
              this.msgs = [];
              this.msgs.push({ severity: res ? 'info' : 'error', summary: res ? 'Success' : 'Fail', detail: res ? 'Save successfully!' : 'Cannot save!' });
            } else {
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: 'Fail', detail: 'Fail' });
            }
          });
        }
      });
    }
  }

  editContactPerson(contactPersonId: number) {
    this.employeeAddressService.getEmployeeContactPersonById(contactPersonId).then(res => {
      this.employeeContactPerson = res;
      this.contactPersonId = this.employeeContactPerson.contactPersonId;
      this.contactPersonAddress = this.employeeContactPerson.contactPersonAddress;
      this.contactPersonSubdistrict = this.employeeContactPerson.contactPersonSubdistrict;
      this.contactPersonPostalCode = this.employeeContactPerson.contactPersonPostalCode;
      this.contactPersonPhoneNo = this.employeeContactPerson.contactPersonPhoneNo;

      this.commonService.getDDLProvince().then(res => {
        this.provinces_acc = res;
        (!isNull(this.employeeContactPerson.contactPersonProvinceId))
          ? this.provinceDDL_acc = res.find(e => e.id == this.employeeContactPerson.contactPersonProvinceId)
          : null;
      });

      this.commonService.getDDLDistrictByProvinceId(this.employeeContactPerson.contactPersonProvinceId).then(res => {
        this.districts_acc = res;
        (!isNull(this.employeeContactPerson.contactPersonDistrictId))
          ? this.districtDDL_acc = res.find(e => e.id == this.employeeContactPerson.contactPersonDistrictId)
          : null;
      });
      this.commonService.getDDLMasterSetupById(MasterSetup.Relationship).then(res => {
        this.relationShipDDL = res;
        (!isNull(this.employeeContactPerson.contactPersonRelationShipId))
          ? this.relationShipDDL_acc = res.find(e => e.id == this.employeeContactPerson.contactPersonRelationShipId)
          : null;
      });

    });
  }

  deleteContactPerson(contactPersonId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.employeeAddressService.deleteEmployeeContactPerson(contactPersonId).subscribe(res => {
          if (res) {
            this.gridLoad();
            this.msgs = [];
            this.msgs.push({ severity: res ? 'info' : 'error', summary: res ? 'Success' : 'Fail', detail: res ? 'Delete successfully!' : 'Cannot delete!' });
          }
        });
      }
    });
  }

  eraseContactPersonForm() {
    this.contactPersonId = null;
    this.accForm.reset();
  }

  getDistrictRegisAddress() {
    this.districts = null;
    (!isNull(this.provinceDDL)) ? this.commonService.getDDLDistrictByProvinceId(this.provinceDDL.id).then(res => {
      this.districts = res;
      this.districtDDL = null;
    }) : null;
  }

  getDistrictContactAddress() {
     this.districts_ca = null;
    (!isNull(this.provinceDDL_ca)) ? this.commonService.getDDLDistrictByProvinceId(this.provinceDDL_ca.id).then(res => {
      this.districts_ca = res;
      this.districtDDL_ca = null;
    }) : null;
  }

  getDistrictContactPerson() {
    this.districts_acc = null;
    (!isNull(this.provinceDDL_acc)) ? this.commonService.getDDLDistrictByProvinceId(this.provinceDDL_acc.id).then(res => {
      this.districts_acc = res;
      this.districtDDL_acc = null;
    }) : null;
  }

  uploadFile(event) {
    this.file = event.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (e: any) => {
      this.fileAttached = e.target.result;

      this.employeeDocument.documentId = 0;
      this.employeeDocument.employeeId = this.id;
      this.employeeDocument.documentTypeId = this.documentTypeId.id;
      this.employeeDocument.documentType = this.documentTypeId.id;
      this.employeeDocument.file = this.fileAttached;
      this.employeeDocument.fileName = this.file.name;
      this.employeeDocument.fileSize = this.file.size;
      this.employeeDocument.fileType = this.file.type;

      this.employeeAddressService.addEmployeeDocument(this.employeeDocument).subscribe(res => {
        if (res) {
          this.gridLoadDocument();
          this.msgs = [];
          this.msgs.push({ severity: res ? 'info' : 'error', summary: res ? 'Success' : 'Fail', detail: res ? 'Upload successfully!' : 'Cannot upload!' });
        } else {
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: 'Fail', detail: 'Fail' });
        }
      });
    }
  }

  deleteDocument(documentId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.employeeAddressService.deleteEmployeeDocument(documentId).subscribe(res => {
          if (res) {
            this.gridLoadDocument();
            this.msgs = [];
            this.msgs.push({ severity: res ? 'info' : 'error', summary: res ? 'Success' : 'Fail', detail: res ? 'Delete successfully!' : 'Cannot delete!' });
          }
        });
      }
    });
  }

  downloadDocument(data: EmployeeDocument) {
    let file = data.file.substr(data.file.indexOf(',') + 1)
    let byteCharacters = atob(file);

    let byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], { "type": data.fileType });

    if (navigator.msSaveBlob) {
      let filename = data.fileName;
      navigator.msSaveBlob(blob, filename);
    } else {
      let link = document.createElement("a");

      link.href = URL.createObjectURL(blob);

      link.setAttribute('visibility', 'hidden');
      link.download = data.fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  }

}
