import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatSliderChange } from '@angular/material';
import { GraphConfig } from './../../../model/graph-config.model';
import { SurvivalConfigModel } from './survival.model';

@Component({
  selector: 'app-survival-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survival.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SurvivalFormComponent implements OnDestroy {

  @Output() configChange = new EventEmitter<GraphConfig>();

  _cohortSelected: any;
  _cohortOptions: Array<any>;
  _cohorts: Array<any>;

  private _config: SurvivalConfigModel;
  @Input() set config(v: SurvivalConfigModel) {
    this._config = v;
    if (this._cohorts !== undefined) {
      this.updateOptions();
    }
  }

  public get cohorts(): Array<any> { return this._cohorts; }
  @Input() public set cohorts(value: Array<any>) {
    this._cohorts = value;
    if (this._config !== undefined) {
      this.updateOptions();
    }
  }

  updateOptions(): void {
    const me = this;

    this._cohortOptions = this._cohorts
      .filter(v => (v.n !== this._config.cohortName))
      .map(v => ({ n: v.n, sel: (this._config.cohortsToCompare.indexOf(v.n) !== -1) }));
    this.cd.detectChanges();
  }

  compareChange(e: MatSliderChange): void {
    this._config.cohortsToCompare = this._cohortOptions.filter(v => v.sel).map(v => v.n);
    this.configChange.emit(this._config);
  }

  ngOnDestroy(): void { }

  constructor(public cd: ChangeDetectorRef) {
  }
}
