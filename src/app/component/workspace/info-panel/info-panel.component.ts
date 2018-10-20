import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ModalService } from 'app/service/modal-service';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from '../../../model/graph-config.model';

@Component({
  selector: 'app-workspace-info-panel',
  templateUrl: './info-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InfoPanelComponent implements AfterViewInit, OnDestroy {
  // // Attributes
  // @Output() hide = new EventEmitter<any>();
  // closeClick(): void {
  //     this.hide.emit();
  // }

  ngOnDestroy(): void {}
  ngAfterViewInit(): void {}
  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    public ms: ModalService
  ) {}
}
