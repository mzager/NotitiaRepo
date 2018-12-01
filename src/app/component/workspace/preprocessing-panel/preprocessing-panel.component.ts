import { PreprocessingStep, Preprocessing } from './../../../model/preprocessing.model';
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
import { PreprocessingType } from 'app/model/enum.model';
import { MatSelectChange } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-workspace-preprocessing-panel',
  styleUrls: ['./preprocessing-panel.component.scss'],
  templateUrl: './preprocessing-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})
export class PreprocessingPanelComponent implements AfterViewInit {
  @Input() preprocessings: Array<Preprocessing> = [];
  @Input() config: GraphConfig;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() addPreprocessing: EventEmitter<{ database: string; preprocessing: Preprocessing }> = new EventEmitter();
  @Output() delPreprocessing: EventEmitter<{ database: string; preprocessing: Preprocessing }> = new EventEmitter();

  pipelines: Array<Preprocessing>;
  possibleSteps: Array<PreprocessingStep> = [];
  preprocessing: Preprocessing = Preprocessing.getUndefined();
  get defaultStep(): PreprocessingStep {
    return this.possibleSteps[0];
  }
  ngAfterViewInit(): void {}

  closeClick() {
    this.hide.emit();
  }

  stepAdd(addAfterIndex: number): void {
    this.preprocessing.steps.splice(addAfterIndex, 0, this.defaultStep);
  }

  stepDel(deleteIndex: number): void {
    this.preprocessing.steps.splice(deleteIndex, 1);
  }
  deleteClick(option: Preprocessing): void {
    this.delPreprocessing.emit({ database: this.config.database, preprocessing: option });
  }
  saveClick(): void {
    const name = this.preprocessing.n.toLowerCase().trim();
    if (name.length === 0) {
      alert('Please specify a name for this pipeline');
      return;
    }
    if (this.preprocessings.find(p => p.n === name)) {
      alert(name + ' has already been added to your list of options.');
      return;
    }
    this.addPreprocessing.emit({ database: this.config.database, preprocessing: this.preprocessing });
  }
  stepCompareFn(opt1: PreprocessingStep, opt2: PreprocessingStep) {
    return opt1.method === opt2.method;
  }
  selectionChange(step: PreprocessingStep, i: number, e: MatSelectChange): void {
    const selectedStep = JSON.parse(JSON.stringify(e.value));
    this.preprocessing.steps[i] = selectedStep;
    this.cd.markForCheck();
  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {
    dataService.getPreprocessingSteps().then(steps => {
      this.possibleSteps = steps.filter(step => step.type === PreprocessingType.NUMERIC);
      this.preprocessing = new Preprocessing();
      this.preprocessing.n = '';
      this.preprocessing.steps.push(this.possibleSteps[0]);
      cd.markForCheck();
    });
  }
}
