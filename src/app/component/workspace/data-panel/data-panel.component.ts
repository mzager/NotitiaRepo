import { DataTable } from './../../../model/data-field.model';
import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { HotTableModule } from 'ng2-handsontable';
import { DataField } from 'app/model/data-field.model';
import {
  ChangeDetectorRef, ViewChild, Component, Input, Output, ElementRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, NgZone
} from '@angular/core';
import { LegendPanelEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as util from 'app/service/compute.worker.util';
import Dexie from 'dexie';
declare var $: any;
// declare var Handsontable: any;

@Component({
  selector: 'app-workspace-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataPanelComponent implements AfterViewInit {

  @ViewChild('dataTable') dataTable;
  @ViewChild('tabs') tabs: ElementRef;

  @Input() tables: Array<DataTable>;

  private db: Dexie;

  // private computeWorkerUtil: ComputeWorkerUtil;

  // private data: any[] = [];
  // private colHeaders: string[] = ['id', 'name'];
  // private columns: any[] = [
  //   {data: 'id'},
  //   {data: 'name'},

  // ];
  // private options: any = {
  //   stretchH: 'all',
  //   columnSorting: true,
  //   contextMenu: [
  //     'row_above', 'row_below', 'remove_row'
  //   ]
  // };

  // private _fields: Array<DataField>;

  // private convertType(dfType): string {
  //   switch (dfType) {
  //     case 'STRING':
  //       return 'text';
  //     case 'NUMBER':
  //       return 'numeric';
  //     default:
  //       return 'text';
  //   }
  // }

  // @Input()
  // private set fields(dataFields: Array<DataField>) {
  //   this._fields = dataFields;
  //   new ComputeWorkerUtil().loadData('Uploaded2').then(this.onDataLoad.bind(this));
  // }

  // onDataLoad(result): void {
  //   const colHeaders = this._fields.map( v => v.label );
  //   const columns = this._fields.map(v => ({ data: v.key, type: this.convertType(v.type)}) );
  //   const data = result.patientData;
  //   this.dataTable.inst.updateSettings({
  //     manualColumnResize: true,
  //     rowHeaders: true,
  //     columnSorting: true,
  //     sortIndicator: true,
  //     columns: columns,
  //     colHeaders: colHeaders,
  //     stretchH: 'all',
  //     contextMenu: true,
  //     className: 'htCenter htMiddle'
  //   });
  //   this.dataTable.inst.loadData(data);
  // }

  tableChange(table: DataTable): void {
    this.loadTable(table);
  }
  openDatabase(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.db.isOpen()) {
        resolve();
      } else {
        this.db.open().then(resolve);
      }
    });
  }

  loadTable(table: DataTable): void {
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
  }

  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
    this.loadTable(this.tables[0]);
  }

  constructor() {
    this.db = new Dexie('notitia-dataset');
  }
}
