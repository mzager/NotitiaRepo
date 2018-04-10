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
    
        <div *ngFor='let result of results'>
            <div *ngFor='let method of result.methods'>
                <h2 class='citations-h2'>{{method.method}}</h2>
                <p class='citations-main-link'>{{method.url}}</p>
            </div>
            <div *ngFor='let citation of result.citations'>
                <p class= 'citations-name'>{{citation.name}}</p>
                <p class= 'citations-desc'> {{citation.desc}}</p>
            
            
                <p class='citations-link'><a href='{{citation.url}}' target='_blank'>{{citation.url}}</a></p>
                <p class='citations-link-2'><a href='{{citation.url}}' target='_blank'>{{citation.url2}}</a></p>
                <p class='citations-link-2'><a href='{{citation.url}}' target='_blank'>{{citation.url3}}</a></p>
            </div>
        </div>
    </div>
</div>
`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitationsPanelComponent implements AfterViewInit, OnDestroy {


    // Since sitation
    // methods: Array<{ method: string, url: string }> = [];
    // citations: Array<{ name: string, desc: string, url: string, url2?: string, url3?: string }> = [];
    results = [];

    // Attributes
    @Output() hide = new EventEmitter<any>();
    closeClick(): void {
        this.hide.emit();
    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void {
        this.dataService.getCitations().then(result => {

            this.results = result;
            this.cd.markForCheck();
        });
    }
    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {
    }
}
