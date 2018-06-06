import { DataService } from './../../../service/data.service';

import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormControl, NgForm } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef, Renderer,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';
import { PanelEnum } from '../../../model/enum.model';
import { Storage, API } from 'aws-amplify';
import { ErrorStateMatcher } from '@angular/material';

export class OncoscapeErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-workspace-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UploadPanelComponent {

  @ViewChild('fileInput') fileInput: ElementRef;

  formGroup: FormGroup;
  datasets = [];
  reviewTypes = ['IRB', 'IEC', 'Exempt With Waiver', 'Exempt'];
  showReviewNumber = true;
  matcher = new OncoscapeErrorStateMatcher();

  @Output() hide = new EventEmitter<any>();

  datasetDel(dataset: any): void {
    API.del('dataset', '/dataset/' + dataset.datasetId, {}).then(
      v => {
        this.fetchDatasets();
      });
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
    const dataset = {
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
      API.post('dataset', '/dataset', {
        body: { content: dataset }
      }),
      Storage.vault.put(
        filename,
        this.fileInput.nativeElement.files[0],
        {
          contentType: 'application/vnd.ms-excel',
          progress: (progress, total) => {
            console.log(progress + '/' + total);
          }
        }
      )
    ]).then(results => {
      // tslint:disable-next-line:max-line-length
      alert('Thank you for submitting your dataset.  During our beta, we will be manually overseeing the ingestion process.  You will recieve an email when your dataset is ready explore.  For questions or status updates please contact: info@oncoscape.sttrcancer.org.');
      this.fetchDatasets();
    }).catch(errors => {

    });
  }
  fetchDatasets(): void {
    API.get('dataset', '/dataset', {}).then(datasets => {
      this.datasets = datasets;
      this.cd.detectChanges();
    });
  }


  constructor(fb: FormBuilder, public cd: ChangeDetectorRef, private renderer: Renderer) {
    this.formGroup = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      reviewType: [null, Validators.required],
      reviewNumber: [null, Validators.required],
      isPhi: [false, Validators.requiredTrue],
      isHuman: [false],
      isPublic: [false],
    });

    this.formGroup.get('reviewType').valueChanges.subscribe(
      (mode: string) => {
        const reviewNumberControl = this.formGroup.controls['reviewNumber'];
        if (mode === 'Exempt') {
          reviewNumberControl.clearValidators();
          this.showReviewNumber = false;
        } else {
          reviewNumberControl.setValidators([Validators.required]);
          this.showReviewNumber = true;
        }
        reviewNumberControl.updateValueAndValidity();
      });

    this.fetchDatasets();
  }
}
