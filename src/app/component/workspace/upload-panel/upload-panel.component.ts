
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef, Renderer,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import { PanelEnum } from '../../../model/enum.model';

@Component({
  selector: 'app-workspace-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UploadPanelComponent {

  @ViewChild('fileInput') fileInput: ElementRef;

  reviewTypes = [
    { name: 'IRB', requiresNumber: true },
    { name: 'IEC', requiresNumber: true },
    { name: 'Exempt With Waiver', requiresNumber: true },
    { name: 'Exempt', requiresNumber: false },
  ];

  formGroup: FormGroup;
  @Output() hide = new EventEmitter<any>();

  closeClick(): void {
    this.hide.emit();
  }
  uploadFile(): void {
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent',
      [new MouseEvent('click', { bubbles: true })]);
    this.fileInput.nativeElement.trigger('click');
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
