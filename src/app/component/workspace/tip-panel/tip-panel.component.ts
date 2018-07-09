import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from '@angular/core';
import { GraphConfig } from '../../../model/graph-config.model';

@Component({
  selector: 'app-workspace-tip-panel',
  templateUrl: './tip-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TipPanelComponent {
  public tip: any = null;
  public tipIndex = 0;
  public tipCount = 0;
  private _tips: Array<any>;
  @Input()
  set tips(value: Array<any>) {
    this.tip = value[0];
    this.tipIndex = 1;
    this.tipCount = value.length;
    this._tips = value;
    this.cd.markForCheck();
  }
  get tips(): Array<any> {
    return this._tips;
  }

  @Output() hide = new EventEmitter<any>();

  hideClick(): void {
    this.hide.emit();
  }
  nextClick(): void {
    this.tipIndex += 1;
    if (this.tipIndex > this.tipCount) {
      this.tipIndex = 1;
    }
    this.tip = this._tips[this.tipIndex - 1];
    this.cd.markForCheck();
  }
  // implements AfterViewInit, OnDestroy
  // Attributes
  // @Output() hide = new EventEmitter<any>();
  // closeClick(): void {
  //   this.hide.emit();
  // }
  // private _config: GraphConfig;
  // get config(): GraphConfig { return this._config; }
  // @Input() set config(value: GraphConfig) {
  // ngOnDestroy(): void {}
  // ngAfterViewInit(): void {}

  // Call cd.refresh() when something changes
  // To Hide call this.hide.emit();
  constructor(private cd: ChangeDetectorRef) {}
}
