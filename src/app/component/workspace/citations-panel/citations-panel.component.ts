import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/subject';
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
    selector: 'app-workspace-citations-panel',
    styleUrls: ['./citations-panel.component.scss'],
    template:
        `
<div class="citations-modal-panel">
    <div class='row'>
        <a href='#' class='modalClose' (click)='closeClick()'></a>
        <div class='col s12 m9'>
            <h1 class='citations-h1'>Complete Oncoscape Citations</h1>  
            <input type='text' #filterInput>
            <div *ngFor='let result of results'>
                <span *ngIf='result.visible'>
                    <div *ngFor='let method of result.methods'>
                        <h2 class='citations-h2'>{{method.method}}</h2>
                        <p class='citations-main-link'>{{method.url}}</p>
                    </div>
                    <div *ngFor='let citation of result.citations'>
                        <p class='citations-name'>{{citation.name}}</p>
                        <p class='citations-desc'> {{citation.desc}}</p>
                        <p class='citations-link'><a href='{{citation.url}}' target='_blank'>{{citation.url}}</a></p>
                        <p class='citations-link-2'><a href='{{citation.url}}' target='_blank'>{{citation.url2}}</a></p>
                        <p class='citations-link-2'><a href='{{citation.url}}' target='_blank'>{{citation.url3}}</a></p>
                    </div>
                </span>
            </div>
        </div>
    </div>
</div>
`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitationsPanelComponent implements AfterViewInit, OnInit, OnDestroy {

    @ViewChild('filterInput') filterInput: ElementRef;
    filterInputChangeStream: Observable<any>;
    filterInputSubscription: Subscription;
    results = [];

    // Attributes
    @Output() hide = new EventEmitter<any>();
    closeClick(): void {
        this.hide.emit();
    }

    filterChange(e: any): void {
        const needle = e.target.value.toLowerCase();
        this.results.forEach(result => {
            if (result.methods.find(method => { return (method.method.toLowerCase().indexOf(needle) > -1) }) !== undefined) {
                result.visible = true;
            } else if (result.citations.find(citation => { return (citation.name.toLowerCase().indexOf(needle) > -1 || citation.desc.toLowerCase().indexOf(needle)) > -1 }) !== undefined) {
                result.visible = true;
            } else {
                result.visible = false;
            }
        });
        this.cd.markForCheck();
    }

    ngOnInit(): void {
        console.log('iini');
        this.filterInputChangeStream = Observable
            .fromEvent(this.filterInput.nativeElement, 'keyup')
            .debounceTime(600)
            .distinctUntilChanged();
        this.filterInputSubscription = this.filterInputChangeStream.subscribe(this.filterChange.bind(this));
    }
    ngOnDestroy(): void {
        this.filterInputSubscription.unsubscribe();
    }
    ngAfterViewInit(): void {
        this.dataService.getCitations().then(results => {
            this.results = results.map(result => Object.assign(result, { visible: true }));
            this.cd.markForCheck();
        });
    }


    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {

    }
}
