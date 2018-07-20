import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { API } from 'aws-amplify';
import { Http, Headers } from '@angular/http';

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
    API.del('dataset', '/dataset/' + dataset.datasetId, {}).then(v => {
      this.fetchDatasets();
    });
  }

  closeClick(): void {
    this.hide.emit();
  }
  uploadFile(): void {
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [
      new MouseEvent('click', { bubbles: true })
    ]);
  }

  formSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (this.fileInput.nativeElement.files.length === 0) {
      return;
    }
    const filename = (this.formGroup.get('name').value + Date.now().toString() + '.xls').replace(
      /\s+/gi,
      ''
    );
    // Storage.configure({ track: true });
    const dataset = {
      name: this.formGroup.get('name').value,
      site: this.formGroup.get('site').value,
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

    const formData = new FormData();
    formData.append('xls', this.fileInput.nativeElement.files[0], 'source.xls');
    formData.append('data', JSON.stringify(dataset));

    const headers = new Headers({
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      // tslint:disable-next-line:max-line-length
      zager:
        'eyJraWQiOiJSbklMK0dXSUNPZ21OMFpUU2Y4ZllpYUxyZlg4ZFo4a0w3KzBkNWVRSVYwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4Yzk5YWY4NC03Zjg5LTRlNjMtYmZiOC1hODJjYTFlYTRkNDAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOmZpcnN0bmFtZSI6Ik1pY2hhZWwiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl8wOUtzcXRyclQiLCJjb2duaXRvOnVzZXJuYW1lIjoiOGM5OWFmODQtN2Y4OS00ZTYzLWJmYjgtYTgyY2ExZWE0ZDQwIiwiYXVkIjoiM2xxZ3IwNTFnc3Vwb2E4am8yNG4xa3VnZmQiLCJldmVudF9pZCI6ImI1ZGNmZjUyLTgwOTItMTFlOC1iMDdhLTk1ODM3YTRmMWZkYyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTMwODIyODI0LCJjdXN0b206bWFpbGluZ2xpc3QiOiJ0cnVlIiwiY3VzdG9tOmxhc3RuYW1lIjoiWmFnZXIiLCJleHAiOjE1MzA4MjY0MjQsImlhdCI6MTUzMDgyMjgyNCwiZW1haWwiOiJtaWNoYWVsQHphZ2VyLmNvIn0.4OciNpvV4FyoyHeY4AFJ6PKdm7frNnwX2STRpohWj006WDUVorKhckz9DwalvCl7FAH8kvJEuhFRdgBw0D5vOdE7e_Mksy1SfBcOY6qJZKdXS1Vg19SzuUeWiNA1FoySgxDhLdWIoOC5SsqMq42ytKvNJveW6G9eeikepPw8XJO9c2-F8S1_cXEk5hD9dxS7mAf0LzUyiTx8igLT-E8P_ZhhWr4hF54sR_Ygy8UTs4v14zG11_ncGyOrbGyWgZ0gXpzvKWdqiPDECPI5M3pLalVgVhxwhEywkyFDGTy_m-QyyEOo7qCctUAp5PzyzJjTwHRr85Ta-LaREAuveuKdwQ'
    });

    this.http
      .post('https://oncoscape.v3.sttrcancer.org/dataset', formData, {
        headers: headers
      })
      .toPromise()
      .then(v => {
        debugger;
      })
      .catch(e => {
        const z = e;
        debugger;
      });

    // Promise.all([
    //   API.post('dataset', '/dataset', {
    //     body: { content: dataset }
    //   }),
    //   Storage.vault.put(filename, this.fileInput.nativeElement.files[0], {
    //     contentType: 'application/vnd.ms-excel',
    //     progress: (progress, total) => {
    //       console.log(progress + '/' + total);
    //     }
    //   })
    // ])
    //   .then(results => {
    //     // tslint:disable-next-line:max-line-length
    //     alert(
    //       // tslint:disable-next-line:max-line-length
    //       'Thank you for submitting your dataset.  During our beta, we will be manually
    // overseeing the ingestion process.You will recieve an email when your dataset is ready explore.For questions or
    // status updates please contact: info@oncoscape.sttrcancer.org.'
    //     );
    //     this.closeClick();
    //     this.fetchDatasets();
    //   })
    //   .catch(errors => {});
  }
  fetchDatasets(): void {
    // API.get('dataset', '/dataset', {}).then(result => {
    //   this.datasets = result.datasets;
    //   this.cd.detectChanges();
    // });
  }

  constructor(
    fb: FormBuilder,
    public cd: ChangeDetectorRef,
    private renderer: Renderer,
    private http: Http
  ) {
    this.formGroup = fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      site: [null, Validators.required],
      reviewType: [null, Validators.required],
      reviewNumber: [null, Validators.required],
      isPhi: [false, Validators.requiredTrue],
      isHuman: [false],
      isPublic: [false]
    });

    this.formGroup.get('reviewType').valueChanges.subscribe((mode: string) => {
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
