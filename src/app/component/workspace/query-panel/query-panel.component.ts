import { GraphConfig } from 'app/model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { GraphEnum } from 'app/model/enum.model';
import { ConditionModel } from './query-panel.model';
import { EntityTypeEnum, DataTypeEnum } from './../../../model/enum.model';
import { DataField } from './../../../model/data-field.model';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, ElementRef,
   Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import * as d3 from 'D3';
import { tree } from 'd3-hierarchy';
import * as Tree from 'angular-tree-component';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-workspace-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.scss']
})
export class QueryPanelComponent implements AfterViewInit {

  public static genesetsInCategory: Array<any> = [];

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Input() set molecularData(tables: Array<string>){
    this.dataOptions = tables.map( v => {
      const rv = {key: v, label: _.startCase(_.toLower(v))};
      return rv;
    });
    this.dataOption = this.dataOptions[0];
  }
  @Output() configChange: EventEmitter<GraphConfig> = new EventEmitter();

  private dataOption: {key: string, label: string};
  private dataOptions: Array<{key: string, label: string}>;
  private dimensions: ClientRect;
  private fields: Array<DataField>;
  private model: Array<ConditionModel>;
  private options = {
    allowDrag: true,
    allowDrop: true,
    levelPadding: 0,
    isExpandedField: 'expanded'
    };

  private action = 'Select';
  private actions: Array<string> = ['Select', 'Deselect', 'Filter', 'Include', 'Exclude'];

  private entity = 'Genes';
  private entities: Array<string> = ['Samples', 'Genes'];

  private graph = 'Graph A';
  private graphs: Array<string> = ['Graph A', 'Graph B', 'Both Graphs'];

  private geneSource = 'A List of Hugo Symbols';
  private geneSources: Array<string> = ['A List of Hugo Symbols', 'A MSigDB Geneset', 'A Threshold'];

  private genesetCategory;
  private genesetCategories;

  private operators: Array<string> = ['And', 'Or'];
  private conditions: Array<string> = ['=', '≠', '<', '<=', '>', '>='];

  @Input()
  private set clinicalFields(data: Array<DataField>) {
    if (data.length === 0 ) { return; }
    this.fields = data;
  }

  @Output() queryPanelToggle = new EventEmitter();

  constructor(private dataService: DataService) {
  }


  onGenesetCategoryLoaded(v): void {
    QueryPanelComponent.genesetsInCategory = v;
    $('#geneMsigInput').autocomplete({
        data: v.reduce( (p, c) => { p[c.name.replace(/_/g, ' ')] = null; return p; }, {}),
        limit: 10, // The max amount of results that can be shown at once. Default: Infinity.
        onAutocomplete: function(val) {
      },
      minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    });
  }

  genesetCategoryChange(): void {
    $('#geneMsigInput')[0].value = '';
    this.dataService.getGeneSetByCategory(this.genesetCategory.code).subscribe( this.onGenesetCategoryLoaded );
  }

  ngAfterViewInit(): void {
    this.dataService.getGeneSetCategories().subscribe(v => {
      this.genesetCategories = v;
      this.genesetCategory = v[0];
      this.genesetCategoryChange();
    });
  }

  execute(): void {
    if (this.entity === 'Samples') {

    }
    if (this.entity === 'Genes') {

      let genes = [];
      switch (this.geneSource) {

        case 'A List of Hugo Symbols':
          genes = $('#geneListInput')[0].value.replace(/ +?/g, '').toUpperCase().split(',');
          break;

        case 'A MSigDB Geneset':
          const genesetName = $('#geneMsigInput')[0].value.replace(/ +?/g, '_');
          const genesetObject = QueryPanelComponent.genesetsInCategory.find( (e) => e.name === genesetName );
          genes = genesetObject.hugo;
          break;

        case 'A Threshold':
          alert('Not yet implemented');
          break;
      }

      const configs: Array<GraphConfig> = [];
      if (this.graph.indexOf('A') !== -1 ) {
        configs.push(this.configA);
      }
      if (this.graph.indexOf('B') !== -1 ) {
        configs.push(this.configB);
      }

      switch (this.action) {
        case 'Select':
          configs.forEach( v => v.markerSelect = genes );
          break;
        case 'Deselect':
          // configs.forEach( v => v.markerSelect = genes );
          break;
        case 'Filter':
          configs.forEach( v => v.markerFilter = genes );
          break;
        case 'Include':
        case 'Exclude':
          break;
      }
      configs.forEach( config => {
        this.configChange.emit(config);
      });
      this.queryPanelToggle.emit();
      
    }
  }



}
