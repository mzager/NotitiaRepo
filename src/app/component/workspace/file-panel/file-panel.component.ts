import { IlluminaService } from './../../../service/illumina.service';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder } from '@angular/forms';
import { VegaFactory } from './../../../service/vega.factory';
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
  sessions = [];
  session = {Results: []};
  result = {Files: []};

  open(session): void {
    this.filesLoad.emit(session.Results.map(v => v.Files[1]));
  }

  constructor(private illuminaService: IlluminaService) {
    this.illuminaService.projects.subscribe( v => {
      const sess = v.filter( session => session.hasOwnProperty('Result') );
      sess.forEach(session => {
        session.Results = session.Results.filter( result => result.hasOwnProperty('Files') );
      });
      this.sessions = v;
      try {
        this.session = this.sessions[0];
        this.result = this.session.Results[0];
      } catch (e) { }
    });
  }
}
