import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GraphConfig } from '../../../model/graph-config.model';
import { DataService } from '../../../service/data.service';

declare var $: any;

@Component({
  selector: 'app-workspace-preprocessing-panel',
  styleUrls: ['./preprocessing-panel.component.scss'],
  templateUrl: './preprocessing-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})
export class PreprocessingPanelComponent implements AfterViewInit {
  @Input()
  ngAfterViewInit(): void {}
  // private _config: GraphConfig;
  // get config(): GraphConfig {
  //   return this._config;
  // }
  // @Input()

  // ngAfterViewInit(): void {}

  // closeClick() {
  //   this.hide.emit();
  // }

  // isValid(): boolean {
  //   return true;
  // }

  // constructor(
  //   private cd: ChangeDetectorRef,
  //   private fb: FormBuilder,
  //   private dataService: DataService
  // ) {
  //   // this.activeCohort = { n: '', pids: [], sids: [], conditions: [] };
  // }
}
