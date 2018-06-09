import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-workspace-color-panel',
  templateUrl: './color-panel.component.html',
  styleUrls: ['./color-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPanelComponent implements AfterViewInit {


  ngAfterViewInit(): void {
  }

}
