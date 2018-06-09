import {
  AfterViewInit, ChangeDetectionStrategy,
  Component, ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-workspace-analysis-panel',
  templateUrl: './analysis-panel.component.html',
  styleUrls: ['./analysis-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AnalysisPanelComponent implements AfterViewInit {

  ngAfterViewInit(): void {
  }

}
