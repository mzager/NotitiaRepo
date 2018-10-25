
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { ModalService } from 'app/service/modal-service';
import { Subject } from 'rxjs';
import { GeneSet } from './../../../model/gene-set.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataService } from './../../../service/data.service';
declare var $: any;

@Component({
  selector: 'app-workspace-geneset-panel',
  styleUrls: ['./geneset-panel.component.scss'],
  templateUrl: './geneset-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GenesetPanelComponent implements AfterViewInit, OnDestroy {
  @Input() genesets: Array<GeneSet> = [];
  @Output() addGeneset: EventEmitter<{ database: string; geneset: GeneSet }> = new EventEmitter();
  @Output() delGeneset: EventEmitter<{ database: string; geneset: GeneSet }> = new EventEmitter();
  $genesetFilter: Subject<any>;
  buildType: 'CURATED' | 'CUSTOM' | 'CONDITIONAL' = 'CURATED';
  genesetFilter = '';
  genesetCategories: Array<{ c: string; n: string; d: string }>;
  genesetCategory: { c: string; n: string; d: string };
  genesetOptions: Array<any>;
  genesetOptionsFilter: Array<any>;
  public customName = '';
  public customGenes = '';

  // Attributes
  private _config;
  get config(): GraphConfig {
    return this._config;
  }
  @Input()
  set config(config: GraphConfig) {
    this._config = config;
  }

  @Output() hide: EventEmitter<any> = new EventEmitter();

  closeClick() {
    this.hide.emit();
  }
  setBuildType(e: any): void {
    this.buildType = e.target.value;
    // this.cd.detectChanges();
  }

  genesetCategoryChange(e: MatSelectChange): void {
    const genesetCode = e.value.c;
    this.genesetOptions = [];
    this.dataService
      .getGeneSetByCategory(genesetCode)
      .toPromise()
      .then(v => {
        v.forEach(geneset => {
          geneset.name = geneset.sname.replace(/_/gi, ' ');
        });
        this.genesetOptions = v;
        this.genesetOptionsFilter = this.genesetOptions;
        this.cd.detectChanges();
      });
  }

  onCustomSave(): void {
    const name = this.customName.toLowerCase();
    const genes = this.customGenes.split(',').map(v => v.trim().toUpperCase());
    if (name.length === 0 || genes.length === 0) {
      alert('name or genes empty.. better validation coming.');
      return;
    }
    this.addGeneset.emit({ database: this.config.database, geneset: { n: name, g: genes } });
  }

  onGenesetFilterChange(criteria: string): void {
    const terms = criteria
      .split(' ')
      .map(v => v.toUpperCase().trim())
      .filter(v => v.length > 1);
    this.genesetOptionsFilter = this.genesetOptions.filter(v => {
      const haystack = (v.name + ' ' + v.summary + ' ' + v.hugo).toUpperCase();
      for (let i = 0; i < terms.length; i++) {
        if (haystack.indexOf(terms[i]) === -1) {
          return false;
        }
      }
      return true;
    });
    this.cd.detectChanges();
  }
  geneSetDel(v: any): void {
    if (this.genesets.length === 1) {
      alert('Please keep at least one geneset in your list of options.');
      return;
    }
    this.delGeneset.emit({ database: this.config.database, geneset: v });
  }

  geneSetAdd(v: any): void {
    const name = v.name.toLowerCase();
    if (this.genesets.find(gs => gs.n === name)) {
      alert(name + ' has already been added to your list of options.');
      return;
    }
    this.addGeneset.emit({
      database: this.config.database,
      geneset: { n: name, g: v.genes.map(w => w.toUpperCase()) }
    });
  }

  ngOnDestroy(): void {
    this.$genesetFilter.unsubscribe();
  }

  ngAfterViewInit(): void {}

  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    public ms: ModalService
  ) {
    const categories = this.dataService.getGenesetCategories();
    const geneset = this.dataService.getGeneSetByCategory('H|NA').toPromise();
    Promise.all([categories, geneset]).then(response => {
      response[1].forEach(v => {
        v.name = v.sname.replace(/_/gi, ' ');
        v.hugo = v.genes.join(',');
      });
      this.genesetCategories = response[0].map(v => ({ n: v.name, c: v.code, d: v.desc }));
      this.genesetCategory = this.genesetCategories[0];
      this.genesetOptions = response[1];
      this.genesetOptionsFilter = this.genesetOptions;
      this.cd.detectChanges();
    });
    this.$genesetFilter = new Subject();
    this.$genesetFilter.pipe(
      debounceTime(300),
      distinctUntilChanged(),)
      .subscribe(this.onGenesetFilterChange.bind(this));
  }
}
