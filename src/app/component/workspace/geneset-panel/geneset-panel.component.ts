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
  styleUrls: ['./geneset-panel.component.scss'],
  template:
`  <!-- Card -->
<div class="card" style="width:250px; background:#FFFFFF;" [ng2-draggable]="true" [ng2DraggableHandle]="titlebar">
    <!-- Title Bar Row -->
  <div class="card-title-bar" #titlebar style="background: #029BE5; color:#FFF; font-weight:normal; font-size:12px; padding:5px 10px;text-transform:uppercase;letter-spacing:1px;">Gene Set
    <i class="tiny material-icons" style="float: right; padding-top: 4px; cursor: pointer" (click)="hide.emit()">close</i>
            <span style="float: right; padding-top: 2px; padding-right:5px; cursor: pointer; font-size:10px;"
        (click)="helpClick()">Info</span>
  </div>
        <!-- Card Tabs -->
<div class="card-tabs">
  <ul class="tabs tabs-fixed-width" #tabs>
    <li class="tab">
      <a class="active" href="#{{cid}}MSigDB">MSigDB</a>
    </li>
    <li class="tab">
      <a href="#{{cid}}Custom">Custom</a>
    </li>
    </ul>
</div>
  <!-- MSigDB card, search bar, summary,-->
<!-- Panel Content -->
<div class="card-content" style="padding:20px;">
<div id="geneset-panel-genes">
    <form [formGroup]="form" novalidate>
        <div class="form-group">
            <label class="center-block">
                <span class="form-label">Source</span>
                <select class="browser-default" materialize="material_select" formControlName="genesetSource">
                    <option *ngFor="let option of genesetSources">{{option}}</option>
                </select>
            </label>
        </div>
        <div id="{{cid}}MSigDB" *ngIf="config" style="padding:20px">
        <span *ngIf="form.get('genesetSource').value === 'Public Gene Set'">
        <div class="input">
    <label for="search" ><i class="right tiny material-icons">search</i></label>
      <input id="search" type="search" placeholder="Search" required>
  </div>
    <div class="row">
      <form class="col s12">
       <!--REMOVE BAD ROW OVERIDE FROM SCSS FILE-->
        <p style="font-size: 0.8rem; color: #666666;">Contrary to popular belief, Lorem Ipsum is not simply
          random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. 
          Richard McClintock, a Latin professor at Hampden-Sydney
        </p>
      </form>
    </div>
            <div class="form-group">
                <label class="center-block">
                    <span class="form-label">Category</span>
                    <select class="browser-default" materialize="material_select"
                      [compareWith]="byName" formControlName="genesetCategory">
                        <option *ngFor="let option of genesetCategories" [ngValue]="option">{{option.name}}</option>
                    </select>
                </label>
            </div>
            <div class="form-group">
                <label class="center-block">
                    <span class="form-label">Geneset</span>
                    <select class="browser-default" materialize="material_select" [compareWith]="byName" formControlName="geneset">
                        <option *ngFor="let option of genesets" [ngValue]="option">{{option.name}}</option>
                    </select>
                </label>
            </div>
        </span>
        </div>
        <div id="{{cid}}Custom" *ngIf="config" style="padding:20px">
        <span *ngIf="form.get('genesetSource').value === 'Custom Gene Set'">
            <div class="form-group">
                  <div class="input-field">
                      <textarea id="geneList" formControllName="genelist"
                      style="font-size:10px;border:1px solid #f2f2f2;margin-top:5px;margin-bottom:5px;padding:5px;"
                      class="materialize-textarea browser-default" placeholder="Click To Enter Comma Delimited Values"></textarea>
                      <label for="geneList" class="form-label active" style="width:auto;font-size:0.8rem">Hugo Genes</label>
                  </div>
            </div>
        </span>
        </div>
        <div class="form-group">
        <label class="center-block">
          <span class="form-label">
              Geneset:
          </span>
          <button (click)="filterGeneset.emit()" class=" btn-config" style="width:71px;">
              Filter
          </button>
          <button (click)="applyGeneset.emit()" class=" btn-config" style="width:71px;">
              Apply
          </button>
      </label>
    </div>
    </form>
</div>
</div>
</div>`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class GenesetPanelComponent implements AfterViewInit {

  @ViewChild('tabs') tabs: ElementRef;
  // Defining All Component Public Properties
  form: FormGroup;
  cid = 'gfcfhj';
  genesetSources: Array<string> = ['Public Gene Set', 'Custom Gene Set'];
  geneSource = this.genesetSources[0];
  genesetCategories;
  genesets;

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Output() configChange = new EventEmitter<GraphConfig>();
  @Output() hide = new EventEmitter<any>();

  ngAfterViewInit(): void { 

    $( this.tabs.nativeElement ).tabs();
  }

  onGenesetCategoryLoaded(me: GenesetPanelComponent, genesets: Array<any>): void {
    me.genesets = genesets;
    me.form.setValue({ geneset: genesets[0] }, { emitEvent: true });
    me.cd.markForCheck();
  }

  genesetCategoryChange(): void {
    const category = this.form.get('genesetCategory').value.code;
    this.dataService.getGeneSetByCategory(category).toPromise().then(genesets => {
      this.onGenesetCategoryLoaded(this, genesets);
    });
  }

  // Ignore
  byName(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.name === p2.name;
  }

  submit(graph) {

    // ok mz - get rid of the 1st dropdown and add custom list as an option to source... 
    const genes = (this.form.get('genesetSource').value === 'Public Gene Set') ?
      this.form.get('geneset').value.hugo.split(',') :
      this.form.get('genelist').value.split(',').map(v => v.trim().toUpperCase());

    if (graph.indexOf('A') !== -1) {
      this.configA.markerFilter = genes.map(v => v.toUpperCase());
      this.configA.dirtyFlag = DirtyEnum.LAYOUT;
      this.configChange.emit(this.configA);
    }

    if (graph.indexOf('B') !== -1) {
      this.configB.markerFilter = genes.map(v => v.toUpperCase());
      this.configB.dirtyFlag = DirtyEnum.LAYOUT;
      this.configChange.emit(this.configB);
    }
  }

  // This runs automatically
  // The parameters are 'injected'... To reference them use this.[paramname]
  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {

    // Load Genesets From Server
    this.dataService.getGeneSetCategories().toPromise().then(result => {
      // Got Genesets + Save In Public Variable So It Can Be Used W/ Binding (ngFor)
      this.genesetCategories = result;

      // Update Our Form Model To Select The First Geneset Category
      this.form.get('genesetCategory').setValue(this.genesetCategories[0]);

      // Trigger Geneset Category Change (Same Function That Gets Called When You Change Dropdown)
      this.genesetCategoryChange();
    });

    // Create Our Form (First Parameter In Arrays is Default)
    this.form = this.fb.group({
      genesetSource: [this.geneSource],
      genesetCategory: [],
      geneset: [],
      genelist: []
    });

    // Listens For Changes On The Form And Updates Values
    this.form.valueChanges
      .debounceTime(200)  // Wait At Least This Long
      .distinctUntilChanged() // Throw Away Unless Somethings Different
      .subscribe(data => {
        const form = this.form;
        if (form.get('genesetCategory').dirty) { // If Geneset Category Has Changed
          form.markAsPristine();  // I'm handling The Change... Clean Form
          this.genesetCategoryChange();
        }
      });
  }

}
