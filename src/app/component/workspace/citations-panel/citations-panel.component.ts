import { ModalService } from 'app/service/modal-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
    Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy,
    OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-workspace-citations-panel',
    styleUrls: ['./citations-panel.component.scss'],
    template:
        `
<!-- Card -->
<div>
    <h1>Citations</h1>
    <h2>Lorum Ipsum</h2>

    <!--
    <br /> Once selected, your cohort will appear in the geneset dropdown of the settings panel. </h2>
    -->
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitationsPanelComponent implements AfterViewInit, OnDestroy {

    // Attributes
   
    // Mini Batch Dictionary Learning
  // Mini Batch Sparse PCA
  // Sparse Coder
  // Dict Learning Online
  // Sparse Encode
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
      this.cd.markForCheck();
    });
  }


  ngAfterViewInit(): void { }
  ngOnDestroy(): void { }


    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {
    }
}
