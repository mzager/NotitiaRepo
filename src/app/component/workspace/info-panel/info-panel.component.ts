import * as TWEEN from '@tweenjs/tween.js';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { ModalService } from 'app/service/modal-service';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from '../../../model/graph-config.model';
import { Renderer3 } from '@angular/core/src/render3/interfaces/renderer';

@Component({
  selector: 'app-workspace-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InfoPanelComponent implements AfterViewInit, OnDestroy {
  private static _defaultMessage = '';

  static set defaultMessage(value: string) {
    this._defaultMessage = value;
  }
  static get defaultMessage(): string {
    return this._defaultMessage;
  }
  static showDefault: EventEmitter<null> = new EventEmitter();
  static showMessage: EventEmitter<{
    msg: string;
    time: number;
  }> = new EventEmitter();

  @ViewChild('messageDiv')
  messageDiv: ElementRef;

  private timeout = -1;
  public message = 'asdf';

  private onShowDefault(): void {
    this.message = InfoPanelComponent.defaultMessage;
    this.cd.markForCheck();
  }
  private onShowMessage(value: { msg: string; time: number }): void {
    this.message = value.msg;
    // const t = new TWEEN.Tween();
    // const txt = this.renderer.createText(this.message);
    // this.renderer.
    // this.renderer.appendChild(this.messageDiv.nativeElement, txt);
    this.renderer.setAttribute(
      this.messageDiv.nativeElement,
      'innerHTML',
      this.message
    );
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {}
  ngAfterViewInit(): void {}
  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    public ms: ModalService,
    public renderer: Renderer2
  ) {
    InfoPanelComponent.showDefault.subscribe(this.onShowDefault.bind(this));
    InfoPanelComponent.showMessage.subscribe(this.onShowMessage.bind(this));
  }
}
