import { DatasetService } from './../../service/dataset.service';
import { DataService } from 'app/service/data.service';
import { GraphConfig } from 'app/model/graph-config.model';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { ChartScene } from 'app/component/workspace/chart/chart.scene';
import { PanelEnum } from 'app/model/enum.model';
import * as downloadjs from 'downloadjs';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { CbioService } from 'app/service/datasource/cbio.service';
declare var $: any;

@Component({
  selector: 'app-application-bar',
  templateUrl: './application-bar.component.html',
  styleUrls: ['./application-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationBarComponent implements OnInit, OnDestroy {
  // TODO:  COME BACK AND CLEAN OUT
  @Output()
  togglePanelsChange = new EventEmitter<boolean>();
  @Output()
  splitScreenChange = new EventEmitter<boolean>();
  @Output()
  showPanel = new EventEmitter<PanelEnum>();
  public datasetSelected = false;
  public _config: GraphConfig;
  @Input()
  set config(config: GraphConfig) {
    this.datasetSelected = config !== null;
    this._config = config;
    this.cd.detectChanges();
  }

  // @Output() graphPanelToggle = new EventEmitter<GraphPanelEnum>();
  @Output()
  genesetPanelToggle = new EventEmitter();
  @Output()
  dataPanelToggle = new EventEmitter();
  @Output()
  pathwayPanelToggle = new EventEmitter();

  private togglePanels = false;
  private split = false;
  public uploader: FileUploader = new FileUploader({ url: '' });

  // @HostListener('document:keydown.shift', ['$event'])
  // keyEventDown(event: KeyboardEvent) {
  //   if (event.keyCode === 16) {
  //     this.togglePanels = true;
  //     $('.graphPanel').css('max-width', '0px');
  //   }
  // }
  // @HostListener('document:keyup.shift', ['$event'])
  // keyEventUp(event: KeyboardEvent) {
  //   if (event.keyCode === 16) {
  //     this.togglePanels = true;
  //     $('.graphPanel').css('max-width', 'inherit');
  //   }
  // }
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!event.ctrlKey) {
      return;
    }
    switch (event.key.toLowerCase()) {
      // case 'a': this.graphPanelToggle.emit(1); break;
      // case 'b': this.graphPanelToggle.emit(2); break;
      case 'g':
        this.genesetPanelToggle.emit();
        break;
      case 'd':
        this.dataPanelToggle.emit();
        break;
      case 'p':
        this.pathwayPanelToggle.emit();
        break;
      case 'e':
        this.viewPanel(PanelEnum.COHORT);
        break;
      case 't':
        this.onTogglePanels();
        break;
      case 'p':
        this.exportImage();
        break;
      case 'i':
        this.toggleBackgroundColor();
        break;
      case 'd':
        this.viewPanel(PanelEnum.DASHBOARD);
        break;
      case 's':
        this.viewPanel(PanelEnum.CITATION);
        break;
      case 'f':
        this.viewPanel(PanelEnum.FEEDBACK);
        break;
    }
  }

  onViewCohort(): void {
    this.viewPanel(PanelEnum.COHORT);
  }
  onViewGeneset(): void {
    this.viewPanel(PanelEnum.GENESET);
  }

  reload(): void {
    window.location.reload(true);
  }
  viewPanel(panel: PanelEnum): void {
    this.showPanel.emit(panel);
  }
  onTogglePanels(): void {
    this.togglePanels = !this.togglePanels;
    $('.graphPanel').css('max-width', this.togglePanels ? '0px' : 'inherit');
  }
  onSplitScreenChange(): void {
    this.split = !this.split;
    this.splitScreenChange.next(this.split);
  }
  toggleBackgroundColor(): void {
    const isBlack = ChartScene.instance.renderer.getClearColor().r === 0;
    ChartScene.instance.renderer.setClearColor(isBlack ? 0xffffff : 0x000000, 1);
    ChartScene.instance.render();
  }

  deleteAllCaches(): void {
    this.dataService.deleteAllDataSets().then(v => {
      window.location.reload(true);
    });
  }

  changeFile(evt: any) {
    // this.fileOpen.next(evt.target);
  }
  print() {
    // window.print();
  }

  exportJpg() {
    const jpg = $('canvas')[0].toDataURL('image/jpeg', 1);
    downloadjs(jpg, 'test.jpg', 'image/jpeg');
  }
  exportImage() {
    this.exportJpg();
  }
  ngOnInit() {}

  ngOnDestroy() {}
  constructor(public cd: ChangeDetectorRef, protected dataService: DatasetService, protected cbio: CbioService) {}
}
