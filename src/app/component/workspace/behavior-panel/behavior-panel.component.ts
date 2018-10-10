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

  @Input()
  set config(value: GraphConfig) {
    if (value === null) {
      return;
    }
    this._config = value;
    this.$configChange.next();
  }

  ngAfterViewInit(): void {}
}
