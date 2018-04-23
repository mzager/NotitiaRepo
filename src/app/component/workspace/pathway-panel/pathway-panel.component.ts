import { Pathway } from './../../../model/pathway.model';
import { getPathways } from './../../../reducer/index.reducer';
import { GeneSet } from './../../../model/gene-set.model';
import { Observable } from 'rxjs/Observable';
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
import { Subject } from 'rxjs/Subject';
declare var $: any;

@Component({
    selector: 'app-workspace-pathway-panel',
    styleUrls: ['./pathway-panel.component.scss'],
    template:
        `
<!-- Card -->
<div class="pathways-modal-panel">
        <div class="row">
                <a href='#' class='modalClose' (click)='closeClick()'></a>
                <div class="col s12">
                        <h1 class='pathways-h1'>Pathways</h1>

                        <h2 class='pathways-h2'>Select from thousands of curated pathways
                                <a href='https://www.youtube.com/embed/XQu8TTBmGhA' target='_blank'>
                                        <i class='small material-icons modalWatchVideoIcon'>ondemand_video</i>Watch Tutorial</a>
                        </h2>
                </div>
        </div>
    <div class='row'>
        <!-- My Pathways -->
        <div class='col s12 l3 pathways-my-list'>
            <span>My Pathways</span>
            <div *ngFor='let myPathway of pathways' (click)='pathwayDel(myPathway)'>
                <div class='pathways-my-row'>
                    <i class='material-icons pathways-my-row-delete'>remove_circle_outline</i>
                    <span class='pathways-my-name'>{{myPathway.n}}</span>
                </div>
            </div>
        </div>
        <div class='col s12 l9 pathways-public-datasets'>
            <span class="pathways-public-span">Select a Pathway</span>
            <!-- From -->
            <div class='col s12 pathways-from-field'>
                <label class=' pathways-from-label'>From</label>
                <select
                    class='pathways-categories-dropdown browser-default' materialize='material_select'
                    (change)='pathwayCategoryChange($event.target.value)'>
                    <option  *ngFor='let option of pathwayCategories'>{{option.n}}</option>
                </select>
            </div>
            <!-- Curated -->
            <span>
                <div class='col s12 pathways-where-field'>
                    <label class='pathways-where-label '>Where</label>
                    <input
                    type='text' placeholder='Pathway Contains e.g. IDH1, BRCA1'
                    (keyup)='$pathwayFilter.next($event.target.value)'
                    ng-model='pathwayFilter'
                    >
                </div>
                <div>
                    <div *ngFor='let option of pathwayOptionsFilter'
                        (click)='pathwayAdd(option)'class='pathways-results' >
                        <i class='material-icons pathways-icon hide-on-small-only'>add_circle_outline</i>
                        <div class='pathways-des'>
                            {{option.name}}<br />
                            {{option.summary}}
                        </div>
                    </div>
                </div>
            </span>
        </div>
    </div>
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathwayPanelComponent implements AfterViewInit, OnDestroy {

    @Input() pathways: Array<GeneSet> = [];
    @Output() addPathway: EventEmitter<{ database: string, pathway: Pathway }> = new EventEmitter();
    @Output() delPathway: EventEmitter<{ database: string, pathway: Pathway }> = new EventEmitter();
    $pathwayFilter: Subject<any>;
    pathwayFilter = '';
    pathwayCategories: Array<{ c: string, n: string, d: string }>;
    pathwayOptions: Array<any>;
    pathwayOptionsFilter: Array<any>;

    // Attributes
    private _config;
    get config(): GraphConfig { return this._config; }
    @Input() set config(config: GraphConfig) {
        this._config = config;
    }

    @Output() hide: EventEmitter<any> = new EventEmitter();

    closeClick() {
        this.hide.emit();
    }

    pathwayCategoryChange(name: string): void {
        const pathwayCode = this.pathwayCategories.find(v => v.n === name).c;
        this.pathwayOptionsFilter = this.pathwayOptions.filter(v => (v.dataSource === pathwayCode));
        this.cd.markForCheck();
    }

    onPathwayFilterChange(criteria: string): void {
        const terms = criteria.split(' ').map(v => v.toUpperCase().trim()).filter(v => v.length > 1);
        this.pathwayOptionsFilter = this.pathwayOptions.filter(v => {
            const haystack = (v.name + ' ' + v.summary).toUpperCase();
            for (let i = 0; i < terms.length; i++) {
                if (haystack.indexOf(terms[i]) === -1) { return false; }
            }
            return true;
        });
        this.cd.markForCheck();
    }

    pathwayDel(v: any): void {
        this.delPathway.emit({ database: this.config.database, pathway: v });
    }

    pathwayAdd(v: any): void {
        this.addPathway.emit({
            database: this.config.database,
            pathway: { n: v.name.toLowerCase(), uri: v.uri }
        });
    }

    ngOnDestroy(): void {
        this.$pathwayFilter.unsubscribe();
    }

    ngAfterViewInit(): void { }

    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {
        const categories = this.dataService.getPathwayCategories();
        const pathways = this.dataService.getPathways();
        Promise.all([
            categories,
            pathways
        ]).then(results => {
            this.pathwayCategories = results[0];
            this.pathwayOptions = results[1]['searchHit'].map(v => ({
                name: v.name,
                uri: 'https://s3-us-west-2.amazonaws.com/notitia/pathways/' + v.uri.replace(/\//gi, '_').replace(':', '_') + '.json.gz',
                dataSource: v.dataSource[0],
                summary: v.numParticipants + ' Participants | ' +
                    v.numProcesses + ' Processes'
            }));
            const pathwayCode = this.pathwayCategories[0].c;
            this.pathwayOptionsFilter = this.pathwayOptions.filter(v => v.dataSource === pathwayCode);
            this.cd.markForCheck();
        });
        this.$pathwayFilter = new Subject();
        this.$pathwayFilter.debounceTime(300).distinctUntilChanged().subscribe(this.onPathwayFilterChange.bind(this));
    }
}
