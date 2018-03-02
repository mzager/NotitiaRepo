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
    selector: 'app-workspace-geneset-panel',
    styleUrls: ['./geneset-panel.component.scss'],
    template:
        `
<!-- Card -->
<div>
    <h1>Gene Sets</h1>
    <h2>Select from thousands of curated gene sets, or build your own - <a href='' target='_blank'>Watch Tutorial</a></h2>

    <div class='row'>
        <!-- My Cohorts -->
        <div class='col s3' style='border: 0px solid #EEE; border-right-width: 1px;padding-left: 0px;padding-right: 30px;'>
            <span class='cohortHeader'>My Genesets</span>
            <div *ngFor='let myGeneset of myGenesets' (click)='geneSetDel(myGeneset)'>
                <div class='cohortMyRow'><span class='cohortMyRowname'>{{myGeneset.name}}</span> ({{myGeneset.genes.length}} genes)<i class='material-icons cohortMyRowDelete'>delete</i></div>
            </div>
        </div>
        <div class='col s6' style='padding-left:30px;padding-right:30px;'>
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
                    <input id='cohortName' type='text' placeholder='Gene Set Contains'
                    ng-model='genesetFilter'
                    style='margin-bottom:5px;border-color:#EEE;width:293px;padding-left: 6px;'>
                </div>

                <div style='position:relative;'>
                    <label class='cohortFieldLabel'>Options</label>
                    <div style='height:40vh;overflow-y:scroll;display: inline-block;position: absolute;left: 80px;top: 5px;'>
                        <div class='cohortField' *ngFor='let option of genesetOptions'
                        style='border:0px solid #ddd; border-bottom-width:1px;padding: 5px 0px;'>
                            <div class='cohortFieldButtons'>
                                <button class='waves-effect waves-light btn btn-small white cohortBtn' 
                                (click)='geneSetAdd(option)'
                                ><i class="material-icons">add</i></button>
                            </div>
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
                    <input id='genesetName' type='text' placeholder='Enter Gene Set Name'
                    style='margin-bottom:5px;border-color:#EEE;width:293px;padding-left: 6px;'>
                </div>
    
                <div style='position:relative;'>
                    <label class='cohortFieldLabel'>Genes</label>
                    <textarea type='text' placeholder='Enter a comma seperated list of gene names'
                        style='padding:5px;height:40vh;overflow-y:scroll;display: inline-block;
                        width:80%;position: absolute;left: 80px;top: 5px; border-color:#EEE;'></textarea>
                </div>
                <div>
                    <button class='waves-effect waves-light btn btn-small white cohortBtn'>Save</button>
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
        <div class='col s3' style='border: 0px solid #EEE; border-left-width: 1px; padding-left:30px; padding-right:0px; '>
            <div style='width:100%; height:150px; background:#eee; text-align: center; padding-top: 40px;'>
                <i class="material-icons large">play_circle_outline</i>
            </div>
        </div>
    </div>
 <!--
                <select class='cohortValueDropdown browser-default'materialize='material_select'><option>Female</option></select>
                <div class='cohortFieldButtons'>
                    <button class='waves-effect waves-light btn btn-small white cohortBtn' (click)='fieldAnd(condition)'>And</button>
                    <button class='waves-effect waves-light btn btn-small white cohortBtn' (click)='fieldOr(condition)'>Or</button>
                    <button class='waves-effect waves-light btn btn-small white cohortBtn' (click)='fieldDel(condition)'><i class="material-icons">delete</i></button>
                </div>
                -->
  


<!--
    <div id='GenesetPanelLoad' style='width:60%'>
        <div class='row'>
            <div class=' geneset-load-panel' >
                <div class='col s6'>
                        <select   materialize='material_select'
                        (change)='collectionChange($event.target.value)'>
                            <option  *ngFor='let option of collections'>{{option.n}}</option>
                    </select>
                </div>
        <div class='col s6'>
            <input id='filter' type='text'
                class='geneset-load-filter  browser-default'
                placeholder='Filter'
                (keyup)='filterChange($event.target.value)'>
            </div>
        </div>
    </div>
        <div class='results'>
            <div class='geneset-load-desc'>
                {{collection.d}}
            </div>
            <div *ngFor='let option of options' class='geneset-result-row'>
                <div class='geneset-result-name'>{{option.name}}<div>
                <div class='geneset-result-summary'>{{option.summary}}</div>
                <div>{{option.genes.length | number}} Genes<span class='materialize-builder'>
                <a class='materialize-pointer'
                (click)='selectGeneset(option)'>Select</a> | <a class='materialize-pointer'
                (click)='selectGeneset(option)'>Deselect</a> | <a class='materialize-pointer'
                (click)='filterGeneset(option)'>Filter</a></span></div>
            </div>
        </div>

        <div id='GenesetPanelCreate' style='wifth:40%'>
        <div class='center-block geneset-panel-custom'>
            <span class='form-label geneset-custom-label'>Custom Gene Set</span>
            <textarea class='browser-default geneset-custom-textarea'
                [(ngModel)]='customGenesetGenes'
                placeholder='Enter Comma Seperated Gene Ids'></textarea>
            <input class='browser-default geneset-custom-name' type='text'
                [(ngModel)]='customGenesetName'
                placeholder='Enter Gene Set Name'>
            <button class='waves-effect waves-grey genset-custom-button browser-default'
            (click)='save()'>Save</button>
        </div>
    </div>
    -->
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenesetPanelComponent implements AfterViewInit, OnDestroy {

    buildType: 'CURATED' |  'CUSTOM' | 'CONDITIONAL' = 'CURATED';
    myGenesets: Array<{name:string, genes:Array<string>, query:any}> = [];
    genesetFilter = '';
    genesetCategories: Array<{ c: string, n: string, d: string }>;
    genesetOptions: Array<any>;

    // Attributes
    private _config;
    get config(): GraphConfig { return this._config; }
    @Input() set config(config: GraphConfig) {
        this._config = config;
        this.refreshGenelist();   
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
                this.cd.markForCheck();
            });
    }

    refreshGenelist(): void {
        this.dataService.getCustomGenesets(this.config.database).then(v => { 
            this.myGenesets = v.map(v => ({name: v.n, genes: v.g, query: ''}));
            this.cd.markForCheck();
        });
    }

    geneSetDel(v): void {
        this.dataService.deleteCustomGeneset(this.config.database, v.name).then( v => {
            this.refreshGenelist();
        });
    }

    geneSetAdd(v): void {
         v.name;
         v.genes;
         this.dataService.createCustomGeneset(this.config.database, v.name, v.genes).then(v => { 
            this.refreshGenelist();
         })
    }

    

    // // Properties
    // customGenesetName = '';
    // customGenesetGenes = '';
    // collections: Array<{ c: string, n: string, d: string }>;
    // genesets: Array<any>;   // All Possible Genesets In A Category
    // collection: any = { c: '', g: '', d: 'Loading' };
    // options: Array<any>;    // Genesets That Match Criteria + Show Up In List
    // filterChange: Function;

    // // Event Handlers
    // collectionChange(name: string): void {
    //     this.collection = this.collections.find(v => v.n === name);
    //     const collectionCode = this.collection.c;
    //     this.options = [];
    //     // debugger;
    //     this.cd.markForCheck();
    //     if (collectionCode === 'Custom') {
    //         this.dataService.getCustomGenesets(this.configA.database).then(result => {
    //             this.options = this.genesets = result.map(v => ({
    //                 genes: v.g,
    //                 hugo: v.g.join(','),
    //                 name: v.n,
    //                 summary: ''
    //             }));
    //             this.cd.markForCheck();
    //         });
    //     } else {
    //         this.dataService.getGeneSetByCategory(collectionCode)
    //             .toPromise().then(v => {
    //                 v.forEach(geneset => {
    //                     geneset.name = geneset.name.replace(/_/gi, ' ');
    //                     geneset.genes = geneset.hugo.split(',');
    //                 });
    //                 this.options = this.genesets = v;
    //                 this.cd.markForCheck();
    //             });
    //     }
    // }
    // filter(criteria: string): void {
    //     const terms = criteria.split(' ').map(v => v.toUpperCase().trim()).filter(v => v.length > 1);
    //     this.options = this.genesets.filter(v => {
    //         const haystack = (v.name + ' ' + v.summary + ' ' + v.hugo).toUpperCase();
    //         for (let i = 0; i < terms.length; i++) {
    //             if (haystack.indexOf(terms[i]) === -1) { return false; }
    //         }
    //         return true;
    //     });
    //     this.cd.markForCheck();
    // }
    // save(): void {
    //     const genes = this.customGenesetGenes.split(',').map(v => v.trim().toUpperCase());
    //     if (this.customGenesetName.length === 0) { return; }
    //     if (this.customGenesetGenes.length === 0) { return; }
    //     this.dataService.createCustomGeneset(this.configA.database, this.customGenesetName, genes);
    // }

       

    // // Life Cycle
    // init(): void {
        // const categories = this.dataService.getGenesetCategories();
        // const geneset = this.dataService.getGeneSetByCategory('H').toPromise();
        // this.options = [];
    //     this.filterChange = _.debounce(this.filter);
        // Promise.all([categories, geneset]).then(response => {
        //     response[1].forEach(v => {
        //         v.name = v.name.replace(/_/gi, ' ');
        //         v.genes = v.hugo.split(',');
        //     });
        //     response[0].push({ c: 'Custom', n: 'My Gene Sets', d: 'User Generated Genesets' });
        //     this.collections = response[0];
        //     this.collection = this.collections[0];
        //     this.genesets = response[1];
        //     this.options = this.genesets;
        //     this.cd.markForCheck();
        // });
    // }

    ngOnDestroy(): void { }
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
            this.cd.markForCheck();
        });
    }


}