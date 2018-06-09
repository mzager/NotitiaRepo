import {
    AfterViewInit, ChangeDetectionStrategy,
    ChangeDetectorRef, Component, EventEmitter,
    OnDestroy, Output, ViewEncapsulation
} from '@angular/core';
import { ModalService } from 'app/service/modal-service';
import { DataService } from './../../../service/data.service';

declare var $: any;

@Component({
    selector: 'app-workspace-feedback-panel',
    templateUrl: './feedback-panel.component.html',
    styleUrls: ['./feedback-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class FeedbackPanelComponent implements AfterViewInit, OnDestroy {


    // Attributes
    @Output() hide = new EventEmitter<any>();
    closeClick(): void {
        this.hide.emit();
    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void { }
    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {
    }
}


