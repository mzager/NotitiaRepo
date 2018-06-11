import { EntityTypeEnum } from 'app/model/enum.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartSelection } from './../../../model/chart-selection.model';
import {
    AfterViewInit, ChangeDetectionStrategy, Component,
    ViewEncapsulation, Input, ChangeDetectorRef,
    ViewChild, ViewContainerRef
} from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { StatVegaFactory } from '../../../service/stat.vega.factory';
declare var $: any;
@Component({
    selector: 'app-workspace-selection-panel',
    templateUrl: './selection-panel.component.html',
    styleUrls: ['./selection-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SelectionPanelComponent implements OnDestroy {

    // @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;

    container: any;
    statVegaFactory: StatVegaFactory;
    _selection: ChartSelection = { type: EntityTypeEnum.NONE, ids: [] };
    _stats: Array<any> = [];
    form: FormGroup;
    closeClick(): void {
        alert('close');
    }
    @Input() set selection(value: ChartSelection) {
        if (value === null) { return; }
        if (value.type === EntityTypeEnum.NONE) { return; }
        this._selection = value;
        this.cd.detectChanges();
    }
    @Input() set stats(value: Array<any>) {
        if (value === null) { return; }
        this._stats = value;
    }
    ngOnDestroy(): void {
        // throw new Error("Method not implemented.");
    }
    // ngAfterViewInit(): void {
    //     alert('hi');
    //     this.container = $(this.chartContainer.element.nativeElement);
    //     this.statVegaFactory = StatVegaFactory.getInstance();
    // }
    constructor(public fb: FormBuilder, public cd: ChangeDetectorRef) {
        this.form = fb.group({
            selectionName: [null, Validators.required]
        });
    }
}
