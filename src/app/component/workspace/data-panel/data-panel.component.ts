import { DataTable } from './../../../model/data-field.model';
import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { HotTableModule } from 'ng2-handsontable';
import { DataField } from 'app/model/data-field.model';
import {
  ChangeDetectorRef, ViewChild, Component, Input, Output, ElementRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, NgZone
} from '@angular/core';
import { LegendPanelEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as util from 'app/service/compute.worker.util';
import Dexie from 'dexie';
import { GraphConfig } from 'app/model/graph-config.model';
declare var $: any;
// declare var Handsontable: any;

@Component({
  selector: 'app-workspace-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataPanelComponent implements AfterViewInit {

  //@ViewChild('dataTable') dataTable;
  @ViewChild('tabs') tabs: ElementRef;


  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;

  public _tables: Array<DataTable> = [];
  public db: Dexie;

  @Input() set tables(v: Array<DataTable>) {
    this._tables = v.concat([
      { tbl: 'configA', label: 'Chart A', map: '', ctype: CollectionTypeEnum.UNDEFINED },
      { tbl: 'configB', label: 'Chart B', map: '', ctype: CollectionTypeEnum.UNDEFINED }
    ]);
  }

  tableChange(table: DataTable): void {
    this.loadTable(table);
  }
  openDatabase(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.dir(this);
      if (this.db === null) {
        this.db = new Dexie('notitia-' + this.configA.database);
      }
      console.dir(this);
      if (this.db.isOpen()) {
        resolve();
      } else {
        this.db.open().then(resolve);
      }
    });
  }

  loadTable(table: DataTable): void {
    /*
    if (table.ctype === CollectionTypeEnum.UNDEFINED) {
      const config: GraphConfig = (table.tbl === 'configA') ? this.configA : this.configB;
      const markers: Array<any> = config.markerFilter.map(v =>
        ( [v, 'Gene', (config.markerSelect.indexOf(v) !== -1) ] ));
      const samples: Array<any> = config.sampleFilter.map(v =>
        ( [v, 'Sample', (config.sampleSelect.indexOf(v) !== -1) ] ));


      const data = markers.concat(samples);
      const colHeaders = ['Name', 'Type', 'Selected'];

      this.dataTable.inst.updateSettings({
        manualColumnResize: true,
        columnSorting: true,
        sortIndicator: true,
        width: window.innerWidth,
        height: window.innerHeight - 60,
        colWidths: 200,
        rowHeights: 23,
        rowHeaderWidth: 150,
        colHeaders: colHeaders,
        rowHeaders: null,
        autoRowSize: false,
        autoColSize: false,
        contextMenu: true
      });
      this.dataTable.inst.loadData(data);

      return;
    }
    this.openDatabase().then(() => {
      Promise.all([
        this.db.table(table.tbl).limit(100).toArray(),
        this.db.table(table.map).toArray()
      ]).then(result => {
        const colHeaders = result[1].map(v => v.s);
        const rowHeaders = result[0].map(v => v.m );
        const data = result[0].map(v => v.d );
        this.dataTable.inst.updateSettings({
          manualColumnResize: true,
          columnSorting: true,
          sortIndicator: true,
          width: window.innerWidth,
          height: window.innerHeight - 60,
          colWidths: 100,
          rowHeights: 23,
          rowHeaderWidth: 150,
          colHeaders: colHeaders,
          rowHeaders: rowHeaders,
          autoRowSize: false,
          autoColSize: false,
          contextMenu: true
        });
        this.dataTable.inst.loadData(data);
      });
    });
    */
  }

  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
    // this.loadTable(this._tables[0]);
  }

  constructor() {
  }
}
