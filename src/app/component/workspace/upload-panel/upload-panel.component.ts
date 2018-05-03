import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-workspace-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})
export class UploadPanelComponent {

  documentationTypes = [
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

  constructor(fb: FormBuilder) {
    this.formGroup = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }
}
