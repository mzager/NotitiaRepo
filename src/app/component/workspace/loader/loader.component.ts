import {
    Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy,
    OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

@Component({
    selector: 'app-workspace-loader',
    styleUrls: ['./loader.component.scss'],
    template:
        `<div class='loader'>
    <div class='loader-background'></div>
    <div class='loader-animation'></div>
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements AfterViewInit, OnDestroy {

    @Input() set visbibility(value: boolean) {

    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void { }
    constructor() {
    }
}
