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
    selector: 'app-workspace-geneset-panel',
    styleUrls: ['./geneset-panel.component.scss'],
    template:
        `
<!-- Card -->
<div class="geneset-modal-panel">
        <div class="row">
                <a href='#' class='modalClose' (click)='closeClick()'></a>
                <div class="col s12">
                        <h1 class='geneset-h1'>Gene Sets</h1>

                        <h2 class='geneset-h2'>Select from thousands of curated gene sets, or build your own
                                <a href='https://www.youtube.com/embed/XQu8TTBmGhA' target='_blank'>
                                        <i class='small material-icons modalWatchVideoIcon'>ondemand_video</i>Watch Tutorial</a>
                        </h2>
                </div>
        </div>
    <div class='row'>
        <!-- My Cohorts -->
        <div class='col s12 l3 geneset-dropdown'>
            <span>My Genesets</span>
            <div *ngFor='let myGeneset of genesets' (click)='geneSetDel(myGeneset)'>
                <div class='geneset-my-row'>
                    <i class='material-icons geneset-my-row-delete'>remove_circle_outline</i>
                    <span class='geneset-my-name'>{{myGeneset.n}}</span>
                </div>
            </div>
        </div>
        <div class='col s12 l9 geneset-public-datasets'>
            <span>Select / Build a Gene Set</span>
            <!-- From -->
            <div class='geneset-field'>
                <label class='geneset-label hide-on-small-only'>From</label>
                <select class='geneset-field-dropdown browser-default' materialize='material_select'
                    (change)='setBuildType($event)'>
                    <option value='CURATED'>Curated Gene Set</option>
                    <option value='CUSTOM'>List of Genes</option>
                    <option value='CONDITIONAL'>Criteria</option>
                </select>
                <select *ngIf='buildType === "CURATED"'
                    class='geneset-field-dropdown browser-default' materialize='material_select'
                    (change)='genesetCategoryChange($event.target.value)'>
                    <option  *ngFor='let option of genesetCategories'>{{option.n}}</option>
                </select>
            </div>
            <!-- Curated -->
            <span *ngIf='buildType === "CURATED"'>
                <div class='geneset-field'>
                    <label class='geneset-label hide-on-small-only'>Where</label>
                    <!--inline to overide host:deep-->
                    <input style='margin-bottom: 5px;border-color: #EEE;width: 293px; padding-left: 6px;'
                    type='text' placeholder='Gene Set Contains e.g. IDH1, BRCA1'
                    (keyup)='$genesetFilter.next($event.target.value)'
                    ng-model='genesetFilter'
                    >
                </div>
                <div>
                    <div *ngFor='let option of genesetOptionsFilter'
                        (click)='geneSetAdd(option)'class='geneset-results' >
                       
                        <i class='material-icons geneset-icon hide-on-small-only'>add_circle_outline</i>
                        <div class='geneset-des'>
                            {{option.name}}<br />
                            {{option.summary}}
                        </div>
                    </div>
                </div>
            </span>
            <!-- Custom -->
            <span *ngIf='buildType === "CUSTOM"'>
                <div class='geneset-field'>
                    <label class='geneset-label' for='genesetName'>Create</label>
                    <!--inline to overide host:deep-->
                    <input style='margin-bottom: 5px;border-color: #EEE;width: 293px; padding-left: 6px;'
                    id='genesetName' [(ngModel)]='customName' type='text' placeholder='Enter Gene Set Name'>
                </div>
                <div class='geneset-box'>
                    <label class='geneset-label '>Genes</label>
                    <textarea type='text' [(ngModel)]='customGenes' placeholder='Enter a comma seperated list of gene names'
                        class='geneset-textarea'></textarea>
                </div>
        <div>
                    <a class='geneset-field-label'
                    class='geneset-save' href='#' (click)='onCustomSave()'>Save</a>
                    </div>
            </span>
            <!-- Conditional -->
            <span *ngIf='buildType === "CONDITIONAL"'>
                Above Expression...<br />
                With Mutation... <br />
                By Quartile... <br />
                etc...
            </span>
        </div>
    </div>
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenesetPanelComponent implements AfterViewInit, OnDestroy {

    @Input() genesets: Array<GeneSet> = [];
    @Output() addGeneset: EventEmitter<{ database: string, geneset: GeneSet }> = new EventEmitter();
    @Output() delGeneset: EventEmitter<{ database: string, geneset: GeneSet }> = new EventEmitter();
    $genesetFilter: Subject<any>;
    buildType: 'CURATED' | 'CUSTOM' | 'CONDITIONAL' = 'CURATED';
    genesetFilter = '';
    genesetCategories: Array<{ c: string, n: string, d: string }>;
    genesetOptions: Array<any>;
    genesetOptionsFilter: Array<any>;
    public customName = '';
    public customGenes = '';

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
    setBuildType(e: any): void {
        this.buildType = e.target.value;
        this.cd.markForCheck();
    }

    genesetCategoryChange(name: string): void {
        const genesetCode = this.genesetCategories.find(v => v.n === name).c;
        this.genesetOptions = [];
        this.cd.markForCheck();
        this.dataService.getGeneSetByCategory(genesetCode)
            .toPromise().then(v => {
                v.forEach(geneset => {
                    geneset.name = geneset.name.replace(/_/gi, ' ');
                    geneset.genes = geneset.hugo.split(',');
                });
                this.genesetOptions = v;
                this.genesetOptionsFilter = this.genesetOptions;
                this.cd.markForCheck();
            });
    }

    onCustomSave(): void {
        const name = this.customName.toLowerCase();
        const genes = this.customGenes.split(',').map(v => v.trim().toUpperCase());
        if (name.length === 0 || genes.length === 0) {
            alert('name or genes empty.. better validation coming.');
            return;
        }
        this.addGeneset.emit({ database: this.config.database, geneset: { n: name, g: genes } })
    }

    onGenesetFilterChange(criteria: string): void {
        const terms = criteria.split(' ').map(v => v.toUpperCase().trim()).filter(v => v.length > 1);
        this.genesetOptionsFilter = this.genesetOptions.filter(v => {
            const haystack = (v.name + ' ' + v.summary + ' ' + v.hugo).toUpperCase();
            for (let i = 0; i < terms.length; i++) {
                if (haystack.indexOf(terms[i]) === -1) { return false; }
            }
            return true;
        });
        this.cd.markForCheck();
    }
    geneSetDel(v: any): void {
        this.delGeneset.emit({ database: this.config.database, geneset: v });
    }

    geneSetAdd(v: any): void {
        this.addGeneset.emit({ database: this.config.database, geneset: { n: v.name.toLowerCase(), g: v.genes.map(v => v.toUpperCase()) } })
    }


    ngOnDestroy(): void {
        this.$genesetFilter.unsubscribe();
    }

    ngAfterViewInit(): void { }

    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {

        const categories = this.dataService.getGenesetCategories();
        const geneset = this.dataService.getGeneSetByCategory('H').toPromise();
        Promise.all([categories, geneset]).then(response => {
            response[1].forEach(v => {
                v.name = v.name.replace(/_/gi, ' ');
                v.genes = v.hugo.split(',');
            });
            this.genesetCategories = response[0];
            this.genesetOptions = response[1];
            this.genesetOptionsFilter = this.genesetOptions;
            this.cd.markForCheck();
        });
        this.$genesetFilter = new Subject();
        this.$genesetFilter.debounceTime(300).distinctUntilChanged().subscribe(this.onGenesetFilterChange.bind(this));

    }


}