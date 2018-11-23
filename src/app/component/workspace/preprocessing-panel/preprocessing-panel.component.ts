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
  @Output()
  hide: EventEmitter<any> = new EventEmitter();
  pipelines: Array<Preprocessing>;
  possibleSteps: Array<PreprocessingStep> = [];
  preprocessing: Preprocessing = {
    n: '',
    steps: []
  };
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
  deleteClick(): void {}
  saveClick(): void {
    alert('save');
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
      this.preprocessing = {
        n: '',
        steps: [JSON.parse(JSON.stringify(this.defaultStep))] // Deep Copy
      };
      cd.markForCheck();
    });

    // this.activeCohort = { n: '', pids: [], sids: [], conditions: [] };
  }
}
