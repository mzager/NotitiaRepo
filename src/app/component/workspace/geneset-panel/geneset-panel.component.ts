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
<div>
    <a href='#' class='modalClose' (click)='closeClick()'></a>
    <h1 style = 'font-size: 3rem; font-weight: 300; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 3px;'>Gene Sets</h1>
    <h2>Select from thousands of curated gene sets, or build your own <a href='https://www.youtube.com/embed/XQu8TTBmGhA' target='_blank'><i class='small material-icons modalWatchVideoIcon'>ondemand_video</i>Watch Tutorial</a></h2>

    <div class='row'>
        <!-- My Cohorts -->
        <div class='col s3' style='border: 0px solid #EEE; border-right-width: 1px;padding-left: 0px;padding-right: 30px;'>
            <span class='cohortHeader'>My Genesets</span>
            <div *ngFor='let myGeneset of genesets' (click)='geneSetDel(myGeneset)'>
                <div class='cohortMyRow'>
                    <i class='material-icons cohortMyRowDelete'>remove_circle_outline</i>
                    <span class='cohortMyRowname'>{{myGeneset.n}}</span>
                </div>    
            </div>
        </div>
        <div class='col s9' style='padding-left:30px;padding-right:30px;'>
            <span class='cohortHeader' style='padding-bottom:20px;'>Select / Build a Gene Set</span>

            <!-- From -->
            <div class='cohortField'>
                <label>From</label>
                <select class='cohortFieldDropdown browser-default' materialize='material_select'
                    (change)='setBuildType($event)'>
                    <option value='CURATED'>Curated Gene Set</option>
                    <option value='CUSTOM'>List of Genes</option>
                    <option value='CONDITIONAL'>Criteria</option>
                </select>
                <select *ngIf='buildType === "CURATED"'
                    class='cohortFieldDropdown browser-default' materialize='material_select' 
                    (change)='genesetCategoryChange($event.target.value)'>
                    <option  *ngFor='let option of genesetCategories'>{{option.n}}</option>
                </select>
            </div>

            <!-- Curated -->
            <span *ngIf='buildType === "CURATED"'>
                <div class='cohortField' >
                    <label>Where</label>
                    <input type='text' placeholder='Gene Set Contains'
                    (keyup)='$genesetFilter.next($event.target.value)'
                    ng-model='genesetFilter'
                    style='margin-bottom:5px;border-color:#EEE;width:293px;padding-left: 6px;'>
                </div>
                <div>                  
                    <div class='cohortField genesetResult' *ngFor='let option of genesetOptionsFilter'
                        (click)='geneSetAdd(option)'>
                        <i class='material-icons'>add_circle_outline</i>
                        <div>
                            {{option.name}}<br />
                            {{option.summary}}
                        </div>
                    </div>
                </div>
            </span>
        
            <!-- Custom -->
            <span *ngIf='buildType === "CUSTOM"'>
                <div class='cohortField'>
                    <label for='genesetName'>Create</label>
                    <input id='genesetName' [(ngModel)]='customName' type='text' placeholder='Enter Gene Set Name'
                    style='margin-bottom:5px;border-color:#EEE;width:293px;padding-left: 6px;'>
                </div>
                <div style='position:relative;'>
                    <label class='cohortFieldLabel'>Genes</label>
                    <textarea type='text' [(ngModel)]='customGenes' placeholder='Enter a comma seperated list of gene names'
                        style='padding:5px;height:40vh;overflow-y:scroll;display: inline-block;
                        width:80%;position: absolute;left: 80px;top: 5px; border-color:#EEE;'></textarea>
                </div>
                <div>
                    <a class='cohortFieldLabel' 
                    style='border: 2px solid #039be5' href='#' (click)='onCustomSave()'>Save</a>
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