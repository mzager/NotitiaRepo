import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import { Component, Input, Output, EventEmitter, AfterViewInit,
  OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { LegendPanelEnum, VisualizationEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;

@Component({
  selector: 'app-workspace-cohort-panel',
  templateUrl: './cohort-panel.component.html',
  styleUrls: ['./cohort-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CohortPanelComponent implements AfterViewInit {


  @ViewChild('tabs') tabs: ElementRef;

  @Input() molecularData: Array<string>;
  @Input() clinicalFields: Array<DataField>;
  @Input() entityType: EntityTypeEnum;
  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;

  ngAfterViewInit(): void {
    $( this.tabs.nativeElement ).tabs();
  }
  constructor() {
  }

}
