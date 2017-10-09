import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { LegendPanelEnum, StatPanelEnum, GraphPanelEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import * as XLSX from 'xlsx';
import * as downloadjs from 'downloadjs';
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
  @Output() graphPanelToggle = new EventEmitter();
  @Output() legendPanelToggle = new EventEmitter();
  @Output() tcgaPanelToggle = new EventEmitter();
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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!event.ctrlKey) { return; }
    switch (event.key.toLowerCase()) {
      case 'g': this.graphPanelToggle.emit(); break;
      case 'c': this.cohortPanelToggle.emit(); break;
      case 'a': this.queryPanelToggle.emit(); break;
      case 's': this.statPanelToggle.emit(); break;
      case 'l': this.legendPanelToggle.emit(); break;
      case 'h': this.historyPanelToggle.emit(); break;
      case 'd': this.dataPanelToggle.emit(); break;
      case 'w': this.workspacePanelToggle.emit(); break;
      case 'e': this.edgePanelToggle.emit(); break;
      case 'b': this.filePanelToggle.emit(); break;
      case 't': this.tcgaPanelToggle.emit(); break;
      case 'p': this.exportImage(); break;
      // case "s": this.selectTool.emit( ToolEnum.SAVE_COHORT); break;
      // case "s": this.selectTool.emit( ToolEnum.INSERT_ANNOTATION); break;
    }
  }

  constructor() {
    this.filesSubject = new Subject();
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
