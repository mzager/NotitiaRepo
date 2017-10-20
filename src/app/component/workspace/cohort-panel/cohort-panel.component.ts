import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import { Component, Input, Output, EventEmitter, AfterViewInit,
  OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LegendPanelEnum, VisualizationEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;

@Component({
  selector: 'app-workspace-cohort-panel',
  templateUrl: './cohort-panel.component.html',
  styleUrls: ['./cohort-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CohortPanelComponent implements AfterViewInit {

  form: FormGroup;

  // geneSource = 'A MSigDB Geneset';
  genesetSources: Array<string> = ['A List of Hugo Symbols', 'A MSigDB Geneset', 'A Threshold'];

  // genesetCategory;
  genesetCategories;

  // geneset;
  genesets;

  @ViewChild('tabs') tabs: ElementRef;
  //@ViewChild('geneMsigInput') geneMsigInput: ElementRef;
  

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Output() configChange = new EventEmitter<GraphConfig>();

  ngAfterViewInit(): void {
    $( this.tabs.nativeElement ).tabs();
  }

  onGenesetCategoryLoaded(me: CohortPanelComponent, genesets: Array<any>): void {
    me.genesets = genesets;
    // me.geneset = genesets[0];
    me.cd.markForCheck();
  }

  genesetCategoryChange(): void {
    debugger;
    
    const category = this.form.get('genesetCategory').value.code;
    this.dataService.getGeneSetByCategory(category).toPromise().then( v => {
      debugger;
      this.onGenesetCategoryLoaded(this, v);
    });
  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {

    console.log(cd);

    this.dataService.getGeneSetCategories().toPromise().then(v => {
      this.genesetCategories = v;
      this.form.get('genesetCategory').setValue(this.genesetCategories[0]);
      this.genesetCategoryChange();
    });

    this.form = this.fb.group({
      genesetSource: [],
      genesetCategory: [],
      geneset: []
    });

    this.form.valueChanges
    .debounceTime(200)
    .distinctUntilChanged()
    .subscribe(data => {
      const form = this.form;
      if (form.get('genesetCategory').dirty) {
        form.markAsPristine();
        this.genesetCategoryChange();
      }
      // if (form.get())
      // if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
      // if (form.get('pointShape').dirty) { dirty |= DirtyEnum.SHAPE; }
      // if (form.get('pointSize').dirty)  { dirty |= DirtyEnum.SIZE; }
      // if (dirty === 0 ) { dirty |= DirtyEnum.LAYOUT; }
      
      form.markAsPristine();
      // this.configChange.emit(data);
    });
  }

}
