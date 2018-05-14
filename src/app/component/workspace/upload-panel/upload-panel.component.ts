
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef, Renderer,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import { PanelEnum } from '../../../model/enum.model';
import { Storage, API } from 'aws-amplify';

@Component({
  selector: 'app-workspace-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UploadPanelComponent {

  @ViewChild('fileInput') fileInput: ElementRef;

  datasets = [];
  reviewTypes = [
    { name: 'IRB', requiresNumber: true },
    { name: 'IEC', requiresNumber: true },
    { name: 'Exempt With Waiver', requiresNumber: true },
    { name: 'Exempt', requiresNumber: false },
  ];

  formGroup: FormGroup;
  @Output() hide = new EventEmitter<any>();
  datasetDel(): void {

  }
  closeClick(): void {
    this.hide.emit();
  }
  uploadFile(): void {
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent',
      [new MouseEvent('click', { bubbles: true })]);
  }

  formSubmit(model: any, isValid: boolean): void {
    if (!isValid) { return; }
    if (this.fileInput.nativeElement.files.length === 0) { return; }
    const filename = (this.formGroup.get('name').value + Date.now().toString() + '.xls').replace(/\s+/gi, '');
    Storage.configure({ track: true });
    const project = {
      name: this.formGroup.get('name').value,
      description: this.formGroup.get('description').value,
      reviewType: this.formGroup.get('reviewType').value,
      reviewNumber: this.formGroup.get('reviewNumber').value,
      manifest: {},
      isPhi: this.formGroup.get('isPhi').value,
      isHuman: this.formGroup.get('isHuman').value,
      isPublic: this.formGroup.get('isPublic').value,
      file: filename,
      status: 'pending'
    };
    Promise.all([
      API.post('projectsCRUD', '/projects', {
        body: project
      }),
      Storage.vault.put(
        filename,
        this.fileInput.nativeElement.files[0],
        { contentType: 'application/vnd.ms-excel' }
      )
    ]).then(results => {
      alert('Thank you for submitting your dataset.  You will recieve an email when it is ready to explore.');
    }).catch(errors => {

    });
  }

  constructor(fb: FormBuilder, private renderer: Renderer) {
    this.formGroup = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      reviewType: [],
      reviewNumber: [],
      isPhi: [null, Validators.requiredTrue],
      isHuman: [],
      isPublic: [],
    });
  }
}
