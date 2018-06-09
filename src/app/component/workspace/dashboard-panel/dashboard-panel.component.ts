import {
    AfterViewInit, ChangeDetectionStrategy,
    ChangeDetectorRef, Component, EventEmitter, Input,
    OnDestroy, Output, ViewChild, ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { StatFactory } from './../../../service/stat.factory';
import { StatVegaFactory } from './../../../service/stat.vega.factory';
declare var $: any;
declare var vega: any;
declare var vegaTooltip: any;

@Component({
    selector: 'app-workspace-dashboard-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard-panel.component.html',
    styleUrls: ['./dashboard-panel.component.scss']

})
export class DashboardPanelComponent implements AfterViewInit, OnDestroy {

    private statFactory: StatFactory;
    private statVegaFactory: StatVegaFactory;
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
        this.container.empty();
        Promise.all([
            this.statFactory.getCohortsStats(this.config)
            // this.statFactory.getGenesetsStats(this.config)
        ]).then(results => {
            const allResults = results.reduce((p, c) => p.concat(...c), []);
            allResults.forEach(result => {

                // TODO : Need to figure out what's wrong with the data for year of death.
                result.stats = result.stats.filter(v => v.name !== 'year of death');
                const id = 'cc' + Math.random().toString(36).substring(7);
                // tslint:disable-next-line:max-line-length
                const cohortDiv = this.container.append('<div style="font-size:2rem; font-weight: 300; margin-bottom:20px; margin-top:10px;">' + result.cohort.n + '</div>');
                result.stats.forEach(stat => {
                    const id2 = 'cc' + Math.random().toString(36).substring(7);
                    const div = cohortDiv.append('<div id="' + id2 +
                        '" style="display:inline-block;padding-bottom:40px;padding-right:20px;"></div>');
                    this.statVegaFactory.drawChartObject(stat, stat.charts[0], id2, div);
                });
            });
            // console.log(results);
        });
    }

    closeClick(): void {
        this.hide.emit();
    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void {
        this.statFactory = StatFactory.getInstance(this.dataService);
        this.statVegaFactory = StatVegaFactory.getInstance();
        this.container = $(this.chartContainer.element.nativeElement);
        this.drawStats();
    }
    constructor(private cd: ChangeDetectorRef, private dataService: DataService) { }
}
