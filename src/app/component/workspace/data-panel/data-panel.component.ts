import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { HotTableModule } from 'ng2-handsontable';
import { DataField } from 'app/model/data-field.model';
import { ChangeDetectorRef, ViewChild, Component, Input, Output,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, NgZone } from '@angular/core';
import { LegendPanelEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as util from 'app/service/compute.worker.util';
// declare var Handsontable: any;

@Component({
  selector: 'app-workspace-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataPanelComponent implements AfterViewInit {

  @ViewChild('dataTable') dataTable;

  private computeWorkerUtil: ComputeWorkerUtil;

  private data: any[] = [];
  private colHeaders: string[] = ['id', 'name'];
  private columns: any[] = [
    {data: 'id'},
    {data: 'name'},

  ];
  private options: any = {
    stretchH: 'all',
    columnSorting: true,
    contextMenu: [
      'row_above', 'row_below', 'remove_row'
    ]
  };

  private _fields: Array<DataField>;

  private convertType(dfType): string {
    switch (dfType) {
      case 'STRING':
        return 'text';
      case 'NUMBER':
        return 'numeric';
      default:
        return 'text';
    }
  }

  @Input()
  private set fields(dataFields: Array<DataField>) {
    this._fields = dataFields;
    new ComputeWorkerUtil().loadData('Uploaded2').then(this.onDataLoad.bind(this));
  }

  onDataLoad(result): void {
    const colHeaders = this._fields.map( v => v.label );
    const columns = this._fields.map(v => ({ data: v.key, type: this.convertType(v.type)}) );
    const data = result.patientData;
    this.dataTable.inst.updateSettings({
      manualColumnResize: true,
      rowHeaders: true,
      columnSorting: true,
      sortIndicator: true,
      columns: columns,
      colHeaders: colHeaders,
      stretchH: 'all',
      contextMenu: true,
      className: 'htCenter htMiddle'
    });
    this.dataTable.inst.loadData(data);
  }


  ngAfterViewInit() {
    // $('ul.tabs').tabs();
  }

  constructor() {
  }
}
