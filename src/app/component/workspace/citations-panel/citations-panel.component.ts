import { Observable } from 'rxjs/Observable';
import { ModalService } from 'app/service/modal-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
    Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy,
    OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import { VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-workspace-citations-panel',
    templateUrl: './citations-panel.component.html',
    styleUrls: ['./citations-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
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
            if (result.methods.find(method => {
                return (method.method.toLowerCase().indexOf(needle) > -1);
            })
                !== undefined) {
                result.visible = true;
            } else if (result.citations
                .find(citation => {
                    return (citation.name.toLowerCase().indexOf(needle) > -1
                        || citation.desc.toLowerCase().indexOf(needle)) > -1;
                }) !== undefined) {
                result.visible = true;
            } else {
                result.visible = false;
            }
        });
        this.cd.markForCheck();
    }

    ngOnInit(): void {
        this.filterInputChangeStream = Observable
            .fromEvent(this.filterInput.nativeElement, 'keyup')
            .debounceTime(300)
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
