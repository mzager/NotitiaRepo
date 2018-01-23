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
<div class="card" style="width:800px; background:#FFFFFF;position:Absolute;left:100px;top:100px;" [ngDraggable]="true" [handle]="titlebar" >
    <!-- Title Bar Row -->
  <div class="card-title-bar" #titlebar style="background: #029BE5; color:#FFF; font-weight:normal; font-size:12px; padding:5px 10px;
                                                text-transform:uppercase;letter-spacing:1px;">Gene Set Collections
    <i class="tiny material-icons" style="float: right; padding-top: 4px; cursor: pointer" (click)="hide.emit()">close</i>
            <span style="float: right; padding-top: 2px; padding-right:5px; cursor: pointer; font-size:10px;"
        (click)="helpClick()">Info</span>
  </div>
    <!-- Card Tabs -->
  <div class="card-tabs">
    <ul class="tabs tabs-fixed-width" #tabs>
      <li class="tab">
        <a class="active" href="#{{cid}}Hallmark">Hallmark</a>
      </li>
      <li class="tab">
        <a href="#{{cid}}Positional">Positional</a>
      </li>
      <li class="tab">
        <a href="#{{cid}}Curated">Curated</a>
      </li>
      <li class="tab">
        <a href="#{{cid}}Motif">Motif</a>
      </li>
      <li class="tab">
        <a href="#{{cid}}Computational">Computational</a>
      </li>
      <li class="tab">
        <a href="#{{cid}}Go">Go</a>
      </li>
      <li class="tab">
        <a href="#{{cid}}Oncogenic">Oncogenic</a>
      </li>
      <li class="tab">
        <a href="#{{cid}}Immunologic">Immunologic</a>
      </li>
      <li class="tab">
        <a href="#{{cid}}Custom">Custom</a>
      </li>
    </ul>
  </div>
<!-- Panel Content -->
  <div class="card-content" style="padding:20px">
    <form [formGroup]="form" novalidate>
      <div id="{{cid}}Hallmark" >
        <div class="form-group">
          <div class="row">
            <div class="col s12">
               <div class="input-field col s12">
                <input  formControlName="search" style="color: #666666;"type="text" id="autocomplete-input" class="autocomplete">
                <label style="font-size: 0.8rem;" for="autocomplete-input">Search</label>
              </div>
          </div>
        </div>
    </div>
        <div *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
          {{item.name}}
           <hr>
        </div>
    <div *ngIf="autoCompleteOption">{{autoCompleteOption.name}}<br/>{{autoCompleteOption.summary}}
    </div>
    </div>
      <div id="{{cid}}Custom">
        <div class="form-group">
          <label class="center-block"><span class="form-label">Gene List</span>
            <textarea placeholder="Gene Ids seperated by commas"
              class="browser-default" formControlName="customGeneList"></textarea>
          </label>
        </div>
      </div>
      <div style="float:right;"class="form-group">
        <label>
          <button (click)="filterGeneset()" class=" btn-config" style="width:71px;">
              Filter
          </button>
          <button (click)="selectGeneset()" class=" btn-config" style="width:71px;">
              Select
          </button>
        </label>
      </div>
    </form>
  </div>
</div>`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class GenesetPanelComponent implements AfterViewInit {

  @ViewChild('tabs') tabs: ElementRef;

  form: FormGroup;
  cid = 'gfcfhj';
  geneMap: any;
  autoCompleteOptions: Array<any>;
  autoCompleteOption: any;

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Output() configChange = new EventEmitter<GraphConfig>();
  @Output() hide = new EventEmitter<any>();

  ngAfterViewInit(): void {
    $(this.tabs.nativeElement).tabs();
  }

  getActiveGeneName(): string {
    return $(this.tabs.nativeElement).find('.active')[0].innerText;
  }

  // Ignore
  byName(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.name === p2.name;
  }

  filterGeneset(): void {
    if (this.getActiveGeneName() === 'CUSTOM') {
      this.onGeneListChange(this.form.get('customGeneList').value, 'filter');
    }
  }
  selectGeneset(): void {
    if (this.getActiveGeneName() === 'CUSTOM') {
      this.onGeneListChange(this.form.get('customGeneList').value, 'apply');
    }
  }
  onAutoCompleteOption(item: any): void {
     this.autoCompleteOptions = [];
     this.autoCompleteOption = item;
     this.cd.markForCheck();
  }

  onSearchChange(searchTerm: string): void {
    console.log("SEARCH FOR: " + searchTerm);
    this.dataService.getGeneSetQuery('H', searchTerm).toPromise()
      .then(result => {
        this.autoCompleteOptions = result;
        this.cd.markForCheck();
      });
  }

  onGeneListChange(geneList: string, action: string) {

    const genes = geneList.split(',').map(v => v.trim().toUpperCase());
    const geneMap = this.geneMap;
    const resolvedGenes = genes.map(gene => geneMap.find(mapItem => {
      if (mapItem.hugo === gene) { return true; }
      if (mapItem.symbols.indexOf(gene) !== -1) { return true; }
      return false;
    })
    ).filter(v => v).map(v => v.hugo);

    // Alert User Genes Were Not Found
    if (genes.length !== resolvedGenes.length) {
      alert('lost genes');
    }

    if (action === 'filter') {
      this.configA.markerFilter = resolvedGenes;
      this.configB.markerFilter = resolvedGenes;
    } else {
       this.configA.markerSelect = resolvedGenes;
       this.configB.markerSelect = resolvedGenes;
    }

    this.configChange.emit(this.configA);
    this.configChange.emit(this.configB);

  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {

    this.form = this.fb.group({
      search: [],
      customGeneList: []
    });

    this.dataService.getGeneMap().toPromise().then(geneMap => {

      // Save Gene Map
      this.geneMap = geneMap;

      // Listens For Changes On The Form And Updates Values
      this.form.valueChanges
        .debounceTime(300)  // Wait At Least This Long
        .distinctUntilChanged() // Throw Away Unless Somethings Different
        .subscribe(data => {
          const form = this.form;
          if (form.get('search').dirty) {
            this.onSearchChange(form.get('search').value);
            form.markAsPristine();
          }
        });
    });
  }
}
