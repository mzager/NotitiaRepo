import {
  Component, Input, Output, ChangeDetectionStrategy,
  EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef, ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-workspace-landing-panel',
  templateUrl: './landing-panel.component.html',
  styleUrls: ['./landing-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LandingPanelComponent implements AfterViewInit {

  @Output() onGetStarted: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit(): void {
  }

  getStartedClick(): void {
    this.onGetStarted.next();
  }

}
