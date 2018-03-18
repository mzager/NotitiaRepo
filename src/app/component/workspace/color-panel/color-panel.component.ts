import {
  Component, Input, Output, ChangeDetectionStrategy,
  EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef
} from '@angular/core';

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
