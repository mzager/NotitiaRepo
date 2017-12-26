import { ChartComponent } from './../workspace/chart/chart.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { LegendPanelEnum, StatPanelEnum, GraphPanelEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import * as XLSX from 'xlsx';
import * as downloadjs from 'downloadjs';
import { ChartScene } from 'app/component/workspace/chart/chart.scene';
declare var $: any;

@Component({
  selector: 'app-application-bar',
  templateUrl: './application-bar.component.html',
  styleUrls: ['./application-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationBarComponent implements OnInit, OnDestroy {

  @Output() statPanelToggle = new EventEmitter();
  @Output() edgePanelToggle = new EventEmitter();
  @Output() graphPanelToggle = new EventEmitter<GraphPanelEnum>();
  @Output() genesetPanelToggle = new EventEmitter();
  @Output() legendPanelToggle = new EventEmitter();
  @Output() toolPanelToggle = new EventEmitter();
  @Output() queryPanelToggle = new EventEmitter();
  @Output() historyPanelToggle = new EventEmitter();
  @Output() dataPanelToggle = new EventEmitter();
  @Output() cohortPanelToggle = new EventEmitter();
  @Output() workspacePanelToggle = new EventEmitter();
  @Output() filePanelToggle = new EventEmitter();
  @Output() fileOpen = new EventEmitter<DataTransfer>();

  public uploader: FileUploader = new FileUploader({ url: '' });
  private filesSubject: Subject<File>;
  private color = 0xFFFFFF;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!event.ctrlKey) { return; }
    switch (event.key.toLowerCase()) {
      case 'g': this.graphPanelToggle.emit(); break;
      case 'c': this.cohortPanelToggle.emit(); break;
      case 'x': this.genesetPanelToggle.emit(); break;
      case 'a': this.queryPanelToggle.emit(); break;
      case 's': this.statPanelToggle.emit(); break;
      case 'l': this.legendPanelToggle.emit(); break;
      case 'h': this.historyPanelToggle.emit(); break;
      case 'd': this.dataPanelToggle.emit(); break;
      case 'w': this.workspacePanelToggle.emit(); break;
      case 'e': this.edgePanelToggle.emit(); break;
      case 'f': this.filePanelToggle.emit(); break;
      case 'p': this.exportImage(); break;
      case 'i': this.toggleBackgroundColor(); break;
      // case "s": this.selectTool.emit( ToolEnum.SAVE_COHORT); break;
      // case "s": this.selectTool.emit( ToolEnum.INSERT_ANNOTATION); break;
    }
  }

  constructor() {
    this.filesSubject = new Subject();
  }

  toggleBackgroundColor() {
    this.color = (this.color === 0x000000) ? 0xFFFFFF : 0x000000;
    ChartScene.instance.renderer.setClearColor(this.color, 1);
    ChartScene.instance.render();
  }

  changeFile(evt: any) {
    this.fileOpen.next(evt.target);
  }
  print() {
    window.print();
  }
  exportImage() {
    const jpg = $('canvas')[0].toDataURL('image/jpeg', 1);
    downloadjs(jpg, 'test.jpg', 'image/jpeg');
  }
  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
