import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef, Component, EventEmitter,
  Input, OnDestroy, Output, ViewEncapsulation
} from '@angular/core';
import { DataService } from 'app/service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { ModalService } from './../../../service/modal-service';
declare var $: any;

@Component({
  selector: 'app-workspace-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HelpPanelComponent implements AfterViewInit, OnDestroy {

  // Mini Batch Dictionary Learning
  // Mini Batch Sparse PCA
  // Sparse Coder
  // Dict Learning Online
  // Sparse Encode
  learn = '';
  method = '';
  desc = '';
  url = '';
  urlparagraph = '';
  attrs: Array<{ name: string, type: string, desc: string }> = [];
  params: Array<{ name: string, type: string, desc: string }> = [];
  citations: Array<{ name: string, desc: string, url: string }> = [];
  tutorial: Array<{ desc: string, url: string }> = [];


  @Input() set config(config: GraphConfig) {
    this.dataService.getHelpInfo(config).then(result => {
      this.method = result.method;
      this.desc = result.desc;
      this.url = result.url;
      this.urlparagraph = result.urlparagraph;
      this.attrs = result.attrs;
      this.params = result.params;
      this.citations = result.citations;
      this.tutorial = result.tutorial;
      this.learn = '';
      this.cd.detectChanges();
    });
  }


  @Output() hide: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit(): void { }
  ngOnDestroy(): void { }

  closeClick() {
    this.hide.emit();
  }
  constructor(private dataService: DataService, public ms: ModalService, private cd: ChangeDetectorRef) {

  }

}
