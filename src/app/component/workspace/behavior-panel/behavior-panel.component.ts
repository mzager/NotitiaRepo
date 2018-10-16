import { FormGroup, FormBuilder } from '@angular/forms';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { GraphConfig } from 'app/model/graph-config.model';
import { SelectionTypeEnum } from 'app/model/enum.model';

@Component({
  selector: 'app-workspace-behavior-panel',
  templateUrl: './behavior-panel.component.html',
  styleUrls: ['./behavior-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BehaviorPanelComponent implements AfterViewInit {
  $configChange: Subject<GraphConfig> = new Subject();
  private _config: GraphConfig;
  private form: FormGroup;
  public selectionType: SelectionTypeEnum;
  public selectionTypes: Array<{
    label: string;
    value: SelectionTypeEnum;
  }> = [];

  @Input()
  set config(value: GraphConfig) {
    if (value === null) {
      return;
    }
    this._config = value;
    this.$configChange.next();
    this.selectionType = SelectionTypeEnum.LASSO;
    this.selectionTypes = [
      { label: 'Polygon', value: SelectionTypeEnum.HULL },
      { label: 'Brush', value: SelectionTypeEnum.KDTREE },
      { label: 'Lasso', value: SelectionTypeEnum.LASSO }
    ];
  }

  ngAfterViewInit(): void {}

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      navigation: [],
      selection: []
    });
  }
}
