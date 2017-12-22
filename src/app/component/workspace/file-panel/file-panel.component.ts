import { IlluminaService } from './../../../service/illumina.service';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import { Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { LegendPanelEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';


@Component({
  selector: 'app-workspace-file-panel',
  templateUrl: './file-panel.component.html',
  styleUrls: ['./file-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilePanelComponent {

  @Output() filesLoad = new EventEmitter<any>();
  @Output() filePanelToggle = new EventEmitter();
  @Input() tab: number = 2;

  showDatasource(source: number): void{
    this.tab = source;
    debugger;
  }
  loadTcga(v:any): void{

  }
  constructor() {
    
  }
}
