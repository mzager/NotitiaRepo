import { ChartScene } from './../chart/chart.scene';
import { ModalService } from 'app/service/modal-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
    Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy,
    OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-workspace-settings-panel',
    styleUrls: ['./settings-panel.component.scss'],
    template:
        `<div>
    <a href='#' class='modalClose' (click)='closeClick()'></a>
    <h1>Global Settings</h1>

    <h2>Customize charts with inverted colors, custom color paletttes and create informative tooltips.</h2>
    <p>Invert Colors <span><i (click)='toggleBackgroundClick()'
    class="material-icons " style='position:absolute; color:#029BE5; cursor: pointer; margin-left: 10px;'>brightness_medium</i></span></p>

     <p>Clear Local Data</p>
    <p>Color Pallets</p>
    <p>Tooltips</p>
</div>`,
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
