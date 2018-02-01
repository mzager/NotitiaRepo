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
import { LegendPanelEnum, VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
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
<div class='card' style='width:285px;background:#FFFFFF;' [ngDraggable]='true' [handle]='titlebar' [inBounds]='true' [bounds]='bounds'
    [zIndex]='zIndex' [zIndexMoving]='99999' (click)='this.ms.$focus.next("genesetPanel");'>
    <!-- Title Bar Row -->
    <div class='card-title-bar' #titlebar style='background: #029BE5; color:#FFF; font-weight:normal; font-size:12px; padding:5px 10px;
        text-transform:uppercase;letter-spacing:1px;'>Gene Sets
        <i class='tiny material-icons' style='float: right; padding-top: 4px; cursor: pointer' (click)='hide.emit()'>close</i>
        <span style='float: right; padding-right:5px; cursor: pointer;' (click)='helpClick()'>Help</span>
    </div>
    <!-- Card Tabs -->
    <div class='card-tabs'>
        <ul class='tabs tabs-fixed-width' #tabs>
            <li class='tab'>
                <a class='active' href='#GenesetPanelLoad'>Load</a>
            </li>
            <li class='tab'>
                <a href='#GenesetPanelCreate'>Create</a>
            </li>
        </ul>
    </div>
    <!-- Panel Content -->
    <div class='card-content'>
        <div id='GenesetPanelCreate'>
            <div class='center-block' style='padding:20px; font-size:1rem;'>
                <span class='form-label' style='width:100%;padding-bottom:5px;'>Custom Gene Set</span>
                <textarea class='browser-default'
                    style='resize:none;width:100%; border: solid 1px #EEEEEE; height:100px;'
                    [(ngModel)]='customGenesetGenes'
                    placeholder='Enter Comma Seperated Gene Ids'></textarea>
                <input class='browser-default' type='text'
                    [(ngModel)]='customGenesetName'
                    style="width:175px;border-width:1px;margin-bottom:5px;"
                    placeholder='Enter Gene Set Name'>
                <button style='width:66px;' class='browser-default btn-config' (click)='save()'>Save</button>
            </div>
        </div>
        <div id='GenesetPanelLoad'>
            <div class='center-block' style='border: solid 1px #EEEEEE;border-radius:3px;margin: 20px 20px 0px 20px;'>
                <select class='browser-default' materialize='material_select'
                style='width:75px;display:inline-block;border-bottom-width:0px;'
                    (change)='collectionChange($event.target.value)'>
                    <option *ngFor='let option of collections'>{{option.n}}</option>
                </select>
                <input id='filter' class='browser-default' type='text'
                style='border:0px solid #EEEEEE;width:143px;margin:0px;border-left-width:1px;padding:0px 10px;display:inline-block;'
                    placeholder='Filter'
                    (keyup)='filterChange($event.target.value)'>
            </div>
            <div class='results' style='max-height:300px;overflow-y:scroll;overflow-x:wrap;padding:20px;'>
                <div  style='padding-bottom:5px;'>
                    <div style='font-weight:700;'>{{collection.n}}</div>
                    {{collection.d}}
                </div>
                <div *ngFor='let option of options' class='geneset-result-row'>
                    <div class='geneset-result-name'>{{option.name}}<div>
                    <div class='geneset-result-summary'>{{option.summary}}</div>
                    <div class='geneset-result-genes'>{{option.genes.length | number}} Genes<span style='padding-top: 5px;float:right'>
                    <a style='cursor:pointer;'
                    (click)='selectGeneset(option)'>Select</a> | <a style='cursor:pointer;'
                    (click)='selectGeneset(option)'>Deselect</a> | <a style='cursor:pointer;'
                    (click)='filterGeneset(option)'>Filter</a></span></div>
                </div>
            </div>
        </div>
    </div>
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenesetPanelComponent implements AfterViewInit, OnDestroy {

    // Elements
    @ViewChild('tabs') tabs: ElementRef;

    // Attributes
    @Input() bounds: ElementRef;
    @Input() configA: GraphConfig;
    @Input() configB: GraphConfig;
    @Output() configChange = new EventEmitter<GraphConfig>();
    @Output() hide = new EventEmitter<any>();
    @Output() help: EventEmitter<any> = new EventEmitter();

    // Properties
    customGenesetName = '';
    customGenesetGenes = '';
    collections: Array<{ c: string, n: string, d: string }>;
    genesets: Array<any>;   // All Possible Genesets In A Category
    collection: any = { c: '', g: '', d: 'Loading' };
    options: Array<any>;    // Genesets That Match Criteria + Show Up In List
    zIndex = 1000;
    focusSubscription: Subscription;
    filterChange: Function;

    // Event Handlers
    helpClick(): void { this.help.emit('GenesetPanel'); }
    collectionChange(name: string): void {
        this.collection = this.collections.find(v => v.n === name);
        const collectionCode = this.collection.c;
        this.options = [];
        // debugger;
        this.cd.markForCheck();
        if (collectionCode === 'Custom') {
            this.dataService.getCustomGenesets(this.configA.database).then(result => {
                this.options = this.genesets = result.map(v => ({
                    genes: v.g,
                    hugo: v.g.join(','),
                    name: v.n,
                    summary: ''
                }));
                this.cd.markForCheck();
            });
        } else {
            this.dataService.getGeneSetByCategory(collectionCode)
                .toPromise().then(v => {
                    v.forEach(geneset => {
                        geneset.name = geneset.name.replace(/_/gi, ' ');
                        geneset.genes = geneset.hugo.split(',');
                    });
                    this.options = this.genesets = v;
                    this.cd.markForCheck();
                });
        }
    }
    filter(criteria: string): void {
        const terms = criteria.split(' ').map(v => v.toUpperCase().trim()).filter(v => v.length > 1);
        this.options = this.genesets.filter(v => {
            const haystack = (v.name + ' ' + v.summary + ' ' + v.hugo).toUpperCase();
            for (let i = 0; i < terms.length; i++) {
                if (haystack.indexOf(terms[i]) === -1) { return false; }
            }
            return true;
        });
        this.cd.markForCheck();
    }
    save(): void {
        const genes = this.customGenesetGenes.split(',').map(v => v.trim().toUpperCase());
        if (this.customGenesetName.length === 0) { return; }
        if (this.customGenesetGenes.length === 0) { return; }
        this.dataService.createCustomGeneset(this.configA.database, this.customGenesetName, genes);
        $(this.tabs.nativeElement).tabs('select_tab', 'GenesetPanelLoad');
    }
    selectGeneset(option): void {
        this.configA.markerSelect = option.hugo.split(',').map(v => v.toUpperCase().trim() );
        this.configA.dirtyFlag = DirtyEnum .LAYOUT;
        this.configChange.emit(this.configA);
        this.configB.markerSelect = option.hugo.split(',').map(v => v.toUpperCase().trim() );
        this.configB.dirtyFlag = DirtyEnum.LAYOUT;
        this.configChange.emit(this.configB);
    }
    filterGeneset(option): void {
        this.configA.markerFilter = option.hugo.split(',').map(v => v.toUpperCase().trim() );
        this.configA.dirtyFlag = DirtyEnum.LAYOUT;
        this.configChange.emit(this.configA);
        this.configB.markerFilter = option.hugo.split(',').map(v => v.toUpperCase().trim() );
        this.configB.dirtyFlag = DirtyEnum.LAYOUT;
        this.configChange.emit(this.configB);
    }


    // Life Cycle
    init(): void {
        const categories = this.dataService.getGenesetCategories();
        const geneset = this.dataService.getGeneSetByCategory('H').toPromise();
        this.options = [];
        this.filterChange = _.debounce(this.filter);
        Promise.all([categories, geneset]).then(response => {
            response[1].forEach(v => {
                v.name = v.name.replace(/_/gi, ' ');
                v.genes = v.hugo.split(',');
            });
            response[0].push({ c: 'Custom', n: 'My Gene Sets', d: 'User Generated Genesets' });
            this.collections = response[0];
            this.collection = this.collections[0];
            this.genesets = response[1];
            this.options = this.genesets;
            this.cd.markForCheck();
        });
        this.focusSubscription = this.ms.$focus.subscribe(v => {
            this.zIndex = (v === 'genesetPanel') ? 1001 : 1000;
            this.cd.markForCheck();
        });
    }

    ngOnDestroy(): void { this.focusSubscription.unsubscribe(); }
    ngAfterViewInit(): void { $(this.tabs.nativeElement).tabs(); }
    constructor(private cd: ChangeDetectorRef, private dataService: DataService, private ms: ModalService) {
        this.init();
    }


}