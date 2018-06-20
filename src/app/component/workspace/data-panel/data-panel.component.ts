import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef, Component, EventEmitter,
  Input, Output, ViewEncapsulation
} from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { CollectionTypeEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import Dexie from 'dexie';
import { DataTable } from './../../../model/data-field.model';
declare var $: any;

@Component({
  selector: 'app-workspace-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DataPanelComponent implements AfterViewInit {

  // @ViewChild('dataTable') dataTable;
  // @ViewChild('tabs') tabs: ElementRef;

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Output() hide: EventEmitter<any> = new EventEmitter();

  public _tables: Array<DataTable> = [];
  public _table: DataTable;
  public columns: Array<any> = [];
  public columnsToDisplay: Array<string> = [];
  public dataSource: Array<any> = [];
  public db: Dexie = null;
  public rowHeaders = [];
  public colHeaders = [];
  public settings = {
    width: window.innerWidth,
    height: window.innerHeight - 180,
    colWidths: 150,
    rowHeights: 23,
    autoRowSize: false,
    autoColSize: true,
    columnSorting: true,
    contextMenu: true,
    stretchH: 'all',
    manualRowResize: true,
    manualColumnResize: true,
    rowHeaders: true,
    manualRowMove: true,
    manualColumnMove: true,
    sortIndicator: true,
  };


  closeClick() {
    this.hide.emit();
  }

  @Input() set tables(v: Array<DataTable>) {
    //   { tbl: 'configA', label: 'Chart A', map: '', ctype: CollectionTypeEnum.UNDEFINED },
    //   { tbl: 'configB', label: 'Chart B', map: '', ctype: CollectionTypeEnum.UNDEFINED }
    // ]);
    // this._tables.push(...this._tables.splice(0, 2));
    // TODO: Add mutations, events, cohorts in list
    this._tables = v.filter(tbl => (tbl.tbl !== 'mutations' && tbl.tbl !== 'events'));
  }


  openDatabase(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.db === null) {
        this.db = new Dexie('notitia-' + this.configA.database);
      }
      if (this.db.isOpen()) {
        resolve();
      } else {
        this.db.open().then(resolve);
      }
    });
  }

  tableChange(e: MatSelectChange): void {
    this.loadTable(e.value);
  }
  loadTable(table: DataTable): void {
    this._table = table;
    if (table.ctype === CollectionTypeEnum.UNDEFINED) {
      const data = [];
      this.dataSource = data;
      return;
    }

    this.openDatabase().then(() => {
      switch (table.ctype) {
        case CollectionTypeEnum.MUTATION:
        case CollectionTypeEnum.EVENT:
          break;
        case CollectionTypeEnum.PATIENT:
          this.db.table(table.tbl).limit(300).toArray().then(result => {
            const keys = Object.keys(result[0]);
            this.colHeaders = Object.keys(result[0]).map(v => v.replace(/\_/gi, ' '));
            this.dataSource = result.map(v => keys.map(w => v[w]));
            this.cd.detectChanges();
          });
          break;
        default:
          if (table.tbl === 'mutations') { table.tbl = 'mut'; }
          Promise.all([
            this.db.table(table.tbl.replace(/\s/gi, '')).limit(300).toArray(),
            this.db.table(table.map.replace(/\s/gi, '')).toArray()
          ]).then(result => {
            this.colHeaders = result[1].map(v => v.s);
            this.colHeaders.unshift('m');
            this.dataSource = result[0].map(v => [v.m, ...v.d]);
            this.cd.detectChanges();

          });
          break;
      }

    });
  }

  ngAfterViewInit() {
    const patientTable = this._tables.filter(t => t.ctype === CollectionTypeEnum.PATIENT);
    const tbl: DataTable = (patientTable.length > 0) ? patientTable[0] : this._tables[0];
    this.loadTable(tbl);
  }

  constructor(private cd: ChangeDetectorRef) {
  }
}
