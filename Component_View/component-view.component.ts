import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../../shared/breadcrumb/breadcrumb.service';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Message, SelectItem } from 'primeng/components/common/api';
import { SysComponent } from '../shared/component.model';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ComponentService } from '../shared/component.service';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../core/data-sharing.service';
import { ConfirmationService } from 'primeng/primeng';
import { Checkbox } from '../../../shared/models/checkbox.model';
import { PageType } from '../../../shared/enum/page-type.enum';
import { UserControlService } from '../../../core/user-control.service';
import { Permission } from '../../../shared/models/permission.model';
import { Module } from '../../../shared/enum/module.enum';
import { forEach } from '@angular/router/src/utils/collection';
import { isNull } from 'util';

@Component({
  selector: 'app-component-view',
  templateUrl: './component-view.component.html',
  styleUrls: ['./component-view.component.css']
})
export class ComponentViewComponent implements OnInit {
  id: number;

  parent: SysComponent;

  components: SysComponent;

  form: FormGroup;

  filteredSingle: any[];

  permission: Checkbox[];

  selectedPermission: string[];
  permissionName: string[];

  permissionControl: Permission = { allowGrant: false, allowAdd: false, allowEdit: false, allowView: false, allowDelete: false };


  constructor(private fb: FormBuilder, private breadcrumbService: BreadcrumbService, private componentService: ComponentService, private router: Router, private data: DataSharingService, private confirmationService: ConfirmationService, private userControlService: UserControlService) { }

  ngOnInit() {
    this.userControlService.authorizeControl(Module.SYS001).subscribe(auth => {
      this.permissionControl = this.userControlService.validatePermission(PageType.view, this.permissionControl, auth);
    });

    this.components = new SysComponent();
    this.parent = new SysComponent();

    this.componentService.getDDLPermission().then(res => {
      this.permission = res;
    });

    this.breadcrumbService.setItems([
      { label: 'Setting' },
      { label: 'Component Setting', routerLink: ['/component-setting'] },
      { label: 'View Component' }
    ]);

    //this.form = this.fb.group({
    //  'componentId': new FormControl('', Validators.required),
    //  'label': new FormControl('', Validators.required),
    //  'label_En': new FormControl('', Validators.required),
    //  'functionCaption': new FormControl(''),
    //  'functionCode': new FormControl(''),
    //  'icon': new FormControl(''),
    //  'parentId': new FormControl(''),
    //  'path': new FormControl(''),
    //  'screenSequence': new FormControl(''),
    //  'isActive': new FormControl('', Validators.required),
    //  'componentPermission': this.fb.array([])
    //});

    //this.data.currentData.subscribe(data => {
    //  this.id = data;
    //  const permissionIdArray = <FormArray>this.form.controls.componentPermission;
    //  this.componentService.getComponentById(this.id).then(com => {
    //    this.components = com;
    //    this.selectedPermission = com.componentPermission.map(String);
    //    this.selectedPermission.forEach(function (value) {
    //      permissionIdArray.push(new FormControl(value));
    //    });
    //    this.componentService.getComponentById(this.components.parentId).then(com => {
    //      this.parentDDL = com;
    //    });
    //    console.log(this.components);
    //    console.log(com);
    //  });

    //})

    this.data.currentData.subscribe(data => {
      this.id = data;
      this.componentService.getComponentById(this.id).then(com => {
        this.components = com;      
        this.selectedPermission = com.componentPermission.map(String);
        console.log(this.selectedPermission);
        console.log(com);
        this.componentService.getComponentById(this.components.parentId).then(p => {
          this.parent = p;
        });
        
      });
    });


    if (this.id == 0) {
      this.router.navigate(['/component-setting']);
    }

  }

  back() {
    this.router.navigate(['/component-setting']);
  }
}
