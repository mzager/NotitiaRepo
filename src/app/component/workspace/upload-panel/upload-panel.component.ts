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
import { Http, Headers } from '@angular/http';

export class OncoscapeErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
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
  @ViewChild('fileInput')
  fileInput: ElementRef;

  formGroup: FormGroup;

  accessOption = 'private';
  datasets = [];
  collaborator = '';
  collaborators = [];
  reviewTypes = ['IRB', 'IEC', 'Exempt With Waiver', 'Exempt'];
  speciesTypes = [
    'Human',
    'C.eligins',
    'Dog',
    'Fruit Fly',
    'Mouse',
    'Rat',
    'Yeast',
    'Zebra Fish',
    'Other'
  ];
  siteTypes = ['Lung', 'Breast'];
  showReviewNumber = true;
  matcher = new OncoscapeErrorStateMatcher();

  @Output()
  hide = new EventEmitter<any>();

  accessChange(e: any): void {
    switch (e.value) {
      case 'public':
      case 'private':
      case 'protected':
        break;
    }
    this.cd.markForCheck();
  }
  closeClick(): void {
    this.hide.emit();
  }
  uploadFile(): void {
    this.renderer.invokeElementMethod(
      this.fileInput.nativeElement,
      'dispatchEvent',
      [new MouseEvent('click', { bubbles: true })]
    );
  }

  formSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (this.fileInput.nativeElement.files.length === 0) {
      return;
    }
    const filename = (
      this.formGroup.get('name').value +
      Date.now().toString() +
      '.xls'
    ).replace(/\s+/gi, '');

    // Gistic, Copy Number, eXome Seq, Rna Seq, Meth, Proteomic, Metabolomics, Single Cell

    const dataset = {
      name: this.formGroup.get('name').value,
      description: this.formGroup.get('description').value,
      reviewType: this.formGroup.get('reviewType').value,
      reviewNumber: this.formGroup.get('reviewNumber').value,
      site: this.formGroup.get('site').value,
      institution: this.formGroup.get('institution').value,
      lab: this.formGroup.get('lab').value,
      contactName: this.formGroup.get('contactName').value,
      contactEmail: this.formGroup.get('contactEmail').value,
      contactPhone: this.formGroup.get('contactPhone').value,
      contactAllow: this.formGroup.get('contactAllow').value,
      species: this.formGroup.get('species').value,
      permissions: this.formGroup.get('permissions').value,
      file: filename,
      status: 'pending'
    };

    const formData = new FormData();
    formData.append('xls', this.fileInput.nativeElement.files[0], 'source.xls');
    formData.append('data', JSON.stringify(dataset));

    const headers = new Headers({
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json'
    });

    this.http
      .post('https://oncoscape.v3.sttrcancer.org/dataset', formData, {
        headers: headers
      })
      .toPromise()
      .then(v => {})
      .catch(e => {
        const z = e;
      });
  }

  addCollaborator(): void {
    this.collaborator = this.collaborator.toLowerCase();
    if (
      this.collaborators.findIndex(v => v.email === this.collaborator) === -1
    ) {
      this.collaborators.push({ email: this.collaborator });
    }
    this.collaborator = '';
    this.cd.markForCheck();
  }

  removeCollaborator(opt: any): void {
    this.collaborators.splice(
      this.collaborators.findIndex(v => (v.email = opt.email)),
      1
    );
    this.cd.markForCheck();
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
      reviewType: [null, Validators.required],
      reviewNumber: [null, Validators.required],
      site: [null, Validators.required],
      lab: [null, Validators.required],
      institution: [null, Validators.required],
      contactName: [null, Validators.required],
      contactEmail: [null, Validators.required],
      contactPhone: [null, Validators.required],
      contactAllow: [true, Validators.required],
      species: [null, Validators.required],
      permissions: ['private', Validators.required]
    });

    // this.formGroup.get('reviewType').valueChanges.subscribe((mode: string) => {
    //   const reviewNumberControl = this.formGroup.controls['reviewNumber'];
    //   if (mode === 'Exempt') {
    //     reviewNumberControl.clearValidators();
    //     this.showReviewNumber = false;
    //   } else {
    //     reviewNumberControl.setValidators([Validators.required]);
    //     this.showReviewNumber = true;
    //   }
    //   reviewNumberControl.updateValueAndValidity();
    // });
  }
}
