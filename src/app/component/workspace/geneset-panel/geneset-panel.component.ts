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
  `
<!-- Card -->
<div class="card" style="width:800px; background:#FFFFFF;position:Absolute;left:100px;top:100px;" [ngDraggable]="true" [handle]="titlebar">
    <!-- Title Bar Row -->
    <div class="card-title-bar" #titlebar style="background: #029BE5; color:#FFF; font-weight:normal; font-size:12px; padding:5px 10px;
                                              text-transform:uppercase;letter-spacing:1px;">Gene Set Collections
        <i class="tiny material-icons" style="float: right; padding-top: 4px; cursor: pointer" (click)="hide.emit()">close</i>
        <span style="float: right; padding-top: 2px; padding-right:5px; cursor: pointer; font-size:10px;" (click)="helpClick()">Help</span>
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
            <div id="{{cid}}Hallmark">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc"> "H" Coherently expressed signatures derived by aggregating 
                          many MSigDB gene sets to represent well-defined biological states or processes.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="search" type="text" id="autocomplete-input">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="geneset-dropdown" *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
                            {{item.name}} - {{item.summary}}
                        </div>
                        <div class="geneset-select" *ngIf="autoCompleteOption">{{autoCompleteOption.name}} - {{autoCompleteOption.summary}}
                        </div>
                    </div>
                </div>
            </div>
            <!--end hallmark-->
            <div id="{{cid}}Positional">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc">"C1" Each human chromosome and cytogenetic band.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="search" type="text" id="autocomplete-input">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="geneset-dropdown" *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
                            {{item.name}} - {{item.summary}}
                        </div>
                        <div class="geneset-select" *ngIf="autoCompleteOption">{{autoCompleteOption.name}} - {{autoCompleteOption.summary}}
                        </div>
                    </div>
                </div>
            </div>
            <!--end Positional-->
            <div id="{{cid}}Curated">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc">"C2" Online pathway databases, publications in PubMed, 
                          and knowledge of domain experts.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="search" type="text" id="autocomplete-input">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="geneset-dropdown" *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
                            {{item.name}} - {{item.summary}}
                        </div>
                        <div class="geneset-select" *ngIf="autoCompleteOption">{{autoCompleteOption.name}} - {{autoCompleteOption.summary}}
                        </div>
                    </div>
                </div>
            </div>
            <!--end Curated-->
            <div id="{{cid}}Motif">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc">"C4" Conserved cis-regulatory motifs from a comparative analysis 
                          of the human, mouse, rat, and dog genomes.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="search" type="text" id="autocomplete-input">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="geneset-dropdown" *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
                            {{item.name}} - {{item.summary}}
                        </div>
                        <div class="geneset-select" *ngIf="autoCompleteOption">{{autoCompleteOption.name}} - {{autoCompleteOption.summary}}
                        </div>
                    </div>
                </div>
            </div>
            <!--end Motif-->
            <div id="{{cid}}Computational">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc"> "C4" Defined by mining large collections of cancer-oriented 
                          microarray data.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="search" type="text" id="autocomplete-input">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="geneset-dropdown" *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
                            {{item.name}} - {{item.summary}}
                        </div>
                        <div class="geneset-select" *ngIf="autoCompleteOption">{{autoCompleteOption.name}} - {{autoCompleteOption.summary}}
                        </div>
                    </div>
                </div>
            </div>
            <!--end Computational-->
            <div id="{{cid}}Go">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc"> "C5" Genes annotated by the same GO terms.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="search" type="text" id="autocomplete-input">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="geneset-dropdown" *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
                            {{item.name}} - {{item.summary}}
                        </div>
                        <div class="geneset-select" *ngIf="autoCompleteOption">{{autoCompleteOption.name}} - {{autoCompleteOption.summary}}
                        </div>
                    </div>
                </div>
            </div>
            <!--end Go-->
            <div id="{{cid}}Oncogenic">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc"> "C6" Microarray gene expression data from cancer 
                        \gene perturbations.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="search" type="text" id="autocomplete-input">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="geneset-dropdown" *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
                            {{item.name}} - {{item.summary}}
                        </div>
                        <div class="geneset-select" *ngIf="autoCompleteOption">{{autoCompleteOption.name}} - {{autoCompleteOption.summary}}
                        </div>
                    </div>
                </div>
            </div>
            <!--end Oncogenic-->
            <div id="{{cid}}Immunologic">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc"> "C7" Microarray gene expression data from immunologic studies.
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="search" type="text" id="autocomplete-input">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <div class="geneset-dropdown" *ngFor="let item of autoCompleteOptions" (click)="onAutoCompleteOption(item)">
                            {{item.name}} - {{item.summary}}
                        </div>
                        <div class="geneset-select" *ngIf="autoCompleteOption">{{autoCompleteOption.name}} - {{autoCompleteOption.summary}}
                        </div>
                    </div>
                </div>
            </div>
            <!--end Immunologicnic-->
            <div id="{{cid}}Custom">
                <div class="row">
                    <div class="col s12">
                        <div class="genseset-desc">Enter custom Gene IDs seperated by commas. Example: IDH1, TP53
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col s12">
                            <div class="input-field col s12">
                                <input formControlName="customGeneList" type="text" id="autocomplete-input" style="margin-bottom: 21px;">
                                <label class="geneset-search" for="autocomplete-input">Search</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="float:right;" class="form-group">
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
  cid = '';
  geneMap: any;
  autoCompleteOptions: Array<any>;
  autoCompleteOption: any;
  
  @Input() bounds: ElementRef;
  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Output() configChange = new EventEmitter<GraphConfig>();
  @Output() hide = new EventEmitter<any>();
  @Output() help: EventEmitter<any> = new EventEmitter();

  // NEED TO ADD
  helpClick(): void {
    // this.help.emit(this.configA.visualization);
  }

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