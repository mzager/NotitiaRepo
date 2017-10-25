import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
  Component, Input, Output, EventEmitter, AfterViewInit,
  OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { LegendPanelEnum, VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;

@Component({
  selector: 'app-workspace-geneset-panel',
  template: `<div class="card" style="width:225px;">
  <div class="card-tabs">
  <ul class="tabs tabs-fixed-width" #tabs>
      <li class="tab"><a class="active" href="#geneset-panel-genes">Geneset</a></li>
  </ul>
</div>
  <div class="card-content">
      <div id="geneset-panel-genes">
          <form [formGroup]="form" novalidate>
              <div class="form-group">
                  <label class="center-block">
                      <span class="form-label">Source</span>
                      <select class="browser-default" materialize="material_select" 
                          formControlName="genesetSource">
                          <option *ngFor="let option of genesetSources">{{option}}</option>
                      </select>
                  </label>
              </div>
              <div class="form-group">
                  <label class="center-block">
                      <span class="form-label">Category</span>
                      <select class="browser-default" materialize="material_select"
                          [compareWith]="byName"
                          formControlName="genesetCategory">
                          <option *ngFor="let option of genesetCategories" [ngValue]="option">{{option.name}}</option>
                      </select>
                  </label>
              </div>
              <div class="form-group">
                  <label class="center-block">
                      <span class="form-label">Geneset</span>
                      <select class="browser-default" materialize="material_select"
                          [compareWith]="byName"
                          formControlName="geneset">
                          <option *ngFor="let option of genesets" [ngValue]="option">{{option.name}}</option>
                      </select>
                  </label>
              </div>
          </form>
      </div>
  </div>
</div>`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class GenesetPanelComponent implements AfterViewInit {

  form: FormGroup;

  geneSource = 'A MSigDB Geneset';
  genesetSources: Array<string> = ['A MSigDB Geneset', 'A List of Hugo Symbols', 'A Threshold'];

  // genesetCategory;
  genesetCategories;

  // geneset;
  genesets;

  @ViewChild('tabs') tabs: ElementRef;

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Output() configChange = new EventEmitter<GraphConfig>();

  ngAfterViewInit(): void {
    $(this.tabs.nativeElement).tabs();
  }

  onGenesetCategoryLoaded(me: GenesetPanelComponent, genesets: Array<any>): void {
    me.genesets = genesets;
    me.form.patchValue({geneset:genesets[0]},{emitEvent:true});
    me.cd.markForCheck();
  }

  genesetCategoryChange(): void {

    const f = this.form;

    const v = this.form.getRawValue().genesetCategory.code;

    const category = this.form.get('genesetCategory').value.code;
    this.dataService.getGeneSetByCategory(category).toPromise().then( genesets => {
      this.onGenesetCategoryLoaded(this, genesets);
    });
  }

  byName(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.name === p2.name;
  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {

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
        if (form.get('geneset').dirty) {
          form.markAsPristine();
          const genes = form.get('geneset').value.hugo.split(',');
          const dirty = DirtyEnum.LAYOUT; // & DirtyEnum.COLOR & DirtyEnum.SHAPE & DirtyEnum.SIZE & DirtyEnum.INTERSECT;
          this.configA.markerFilter = this.configB.markerFilter = genes;
          this.configA.dirtyFlag = this.configB.dirtyFlag = dirty;
          this.configChange.emit(this.configA);
          // this.configChange.emit(this.configB);
        }
      });
  }

}
