import {
  AfterViewInit, ChangeDetectionStrategy,
  Component, EventEmitter, Output, ViewEncapsulation
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

    ((d, s, id) => {
      let js: any;
      const p = 'https';
      const fjs = d.getElementsByTagName(s)[0];
      if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, 'script', 'twitter-wjs');
  }

  getStartedClick(): void {
    this.onGetStarted.next();
  }

}
