import { StatFactory, VegaFactory } from './../../../model/stat.model';
import { ModalService } from 'app/service/modal-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum, StatRendererEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
    Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy,
    OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef,
    ViewContainerRef
} from '@angular/core';
import { VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
declare var $: any;
declare var vega: any;
declare var vegaTooltip: any;

@Component({
    selector: 'app-workspace-dashboard-panel',
    styleUrls: ['./dashboard-panel.component.scss'],
    template:
        `<div>
    <a href='#' class='modalClose' (click)='closeClick()'></a>
    <h1> Stats </h1>
    <div #chartContainer></div>
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPanelComponent implements AfterViewInit, OnDestroy {

    private statFactory: StatFactory;
    private container: any;

    @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
    @Output() hide = new EventEmitter<any>();
    private _config: GraphConfig;
    get config(): GraphConfig { return this._config; }
    @Input() set config(value: GraphConfig) {
        this._config = value;
        if (this.container === undefined) { return; }
        this.drawStats();

    }


    drawStats(): void {

        // Return Stat Objects That Get Drawn To Screen
        this.statFactory.getPopulationStats(this.config, this.dataService).then(stats => {
            stats.forEach((stat, i) => {

                // Create A Div For Each Stat
                const div = this.container.append('<div id="cc' + i.toString() +
                    '" class="statItemContainer" style="padding-bottom:20px;"></div>');

                // Process Stat Types
                switch (stat.renderer) {
                    case StatRendererEnum.VEGA:
                        const v = vega.parse(VegaFactory.getInstance().getChartObject(stat, stat.charts[0]), { renderer: ('svg') });
                        const c = new vega.View(v)
                            .initialize('#cc' + i.toString())
                            .hover()
                            .renderer('svg')
                            .run();
                        break;

                    case StatRendererEnum.HTML:
                        div.children('#cc' + i.toString()).append(
                            VegaFactory.getInstance().getChartObject(
                                stat, stat.charts[0]).toString());
                        break;
                }
            });
        });
    }

    closeClick(): void {
        this.hide.emit();
    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void {
        this.statFactory = StatFactory.getInstance();
        this.container = $(this.chartContainer.element.nativeElement);
        this.drawStats();
    }
    constructor(private cd: ChangeDetectorRef, private dataService: DataService) {

    }
}
