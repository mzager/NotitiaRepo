import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityTypeEnum } from 'app/model/enum.model';
import { StatVegaFactory } from '../../../service/stat.vega.factory';
import { ChartSelection } from './../../../model/chart-selection.model';
declare var $: any;
@Component({
  selector: 'app-workspace-selection-panel',
  templateUrl: './selection-panel.component.html',
  styleUrls: ['./selection-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelectionPanelComponent implements OnDestroy {
  // @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;

  @Output()
  hide = new EventEmitter<any>();
  @Output()
  saveCohort = new EventEmitter<any>();
  @Output()
  saveGeneset = new EventEmitter<any>();

  container: any;
  statVegaFactory: StatVegaFactory;
  _selection: ChartSelection = { type: EntityTypeEnum.NONE, ids: [] };
  _stats: Array<any> = [];
  form: FormGroup;
  closeClick(): void {
    this.hide.emit();
  }
  submit(): void {
    if (this.form.status === 'INVALID') {
      return;
    }
    const payload = {
      name: this.form.get('selectionName').value,
      selection: this._selection
    };
    if (this._selection.type === EntityTypeEnum.SAMPLE) {
      this.saveCohort.emit(payload);
    }
    if (this._selection.type === EntityTypeEnum.GENE) {
      this.saveGeneset.emit(payload);
    }
    this.hide.emit();
  }
  @Input()
  set selection(value: ChartSelection) {
    if (value === null) {
      return;
    }
    if (value.type === EntityTypeEnum.NONE) {
      return;
    }
    this._selection = value;
    this.cd.detectChanges();
  }
  @Input()
  set stats(value: Array<any>) {
    if (value === null) {
      return;
    }
    this._stats = value;
  }
  ngOnDestroy(): void {}
  constructor(public fb: FormBuilder, public cd: ChangeDetectorRef) {
    this.form = fb.group({
      selectionName: [null, Validators.required]
    });
  }
}
