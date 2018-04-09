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
                <h2 class='citations-section'>Site Citations</h2>  
     
    
        <div *ngFor='let result of results'>
            <div *ngFor='let method of result.methods'>
                {{method.method}}
                {{method.url}}
            </div>

            <div *ngFor='let citation of result.citations'>
                {{citation.name}}
                {{citation.desc}}
                {{citation.url}}
            </div>
        
        </div>
           <!--
        <div *ngFor='let attr of methods; let i = index'>
            <h1 class="citations-h1">{{method}}</h1>
            <a class='citations-link' href='{{url}}' target='_blank'>Learn More</a>
        </div>
        -->
        <!--
        <div *ngFor='let attr of citations; let i = index'>
                <p class='citations-label'>{{ attr.name }}</p>
                <p class='citations-desc'>{{ attr.desc }}
                    <br />
                    <span class='citations-link'>
                        <a class='citations-link' href='{{ attr.url }}' target='_blank'>Link to Pub</a>
                        <a class='citations-link' href='{{ attr.url2 }}' target='_blank'>Link to Pub</a>
                        <a class='citations-link' href='{{ attr.url3 }}' target='_blank'>Link to Pub</a>
                    </span>
                </p>
                </div>
            </div>
            -->
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
