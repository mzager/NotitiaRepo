import {
    AfterViewInit, ChangeDetectionStrategy,
    ChangeDetectorRef, Component, EventEmitter,
    OnDestroy, Output, ViewEncapsulation
} from '@angular/core';
import { ModalService } from 'app/service/modal-service';
import { DataService } from './../../../service/data.service';
import { ChartScene } from './../chart/chart.scene';
declare var $: any;

@Component({
    selector: 'app-workspace-settings-panel',
    styleUrls: ['./settings-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './settings-panel.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPanelComponent implements AfterViewInit, OnDestroy {

    // Attributes
    @Output() hide = new EventEmitter<any>();

    closeClick(): void {
        this.hide.emit();
    }
    toggleBackgroundClick(): void {
        const isBlack = ChartScene.instance.renderer.getClearColor().r === 0;
        ChartScene.instance.renderer.setClearColor(isBlack ? 0xFFFFFF : 0x000000, 1);
        ChartScene.instance.render();
    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void { }
    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {
    }
}
