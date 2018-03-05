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
    selector: 'app-workspace-about-panel',
    styleUrls: ['./about-panel.component.scss'],
    template:
        `
<!-- Card -->
<div>
    <a href='#' class='modalClose' (click)='closeClick()'></a>
    <h1>About</h1>
    <h2>Fhcrc / holland Lab</h2>

    <h1>Feedback</h1>
    <h2>Lorum Ipsum</h2>

    <h1>Credits</h1>
    <h2>Lorum Ipsum</h2>
  
    <h1>Special Thanks</h1>
    <h2>Lorum Ipsum</h2>

    <h1>Citations</h1>
    <h2>Lorum Ipsum</h2>

    <!--
    <br /> Once selected, your cohort will appear in the geneset dropdown of the settings panel. </h2>
    -->
</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPanelComponent implements AfterViewInit, OnDestroy {

 
    // Attributes
    @Output() hide = new EventEmitter<any>();
    closeClick(): void {
         this.hide.emit();
    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void {}
    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {
    }


}