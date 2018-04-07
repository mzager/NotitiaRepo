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
    <h1 class='about-h1'>About</h1>
    <h2 class='about-h2'>Seattle Tumor Translation Research (STTR) assists cancer researchers and clinicians to extract biological meaning through the development of custom 
    software solutions.</h2>
    <h2 class='about-h2'>The rapid growth of both public datasets and analytic methods presents challenges and opportunities. To maximize impact researchers 
    often need to enlist the support of biostatisticians, data scientists and software engineers that specialize in cloud technologies.</h2>
    <h2 class='about-h2'> To help mitigate these challenges, STTR has built a cloud-based platform called Oncoscape.  Our solution allows users to upload clinical and molecular data; leverage industry standard analytic libraries; augment with NCI sponsored data sets; and visualize with dozens of novel online interactive tools.
    Our mission is to accelerate your science.</h2>


    <h1 class='about-h1'>Feedback</h1>
    <h2 class='about-h2'>To learn more or request a custom solution, please send us a <a href="mailto:contact@oncoscape.org">message</a> </h2>


    <h1 class='about-h1'>Credits</h1>
    <h2>Lorum Ipsum</h2>

    <h1 class='about-h1'>Special Thanks</h1>
    <h2>Lorum Ipsum</h2>

    <h1 class='about-h1'>Site Citations</h1>
    <a href="#">View</a><h2 class='about-h2'>all libraries and resources used to build the Oncoscape platform</h2>

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
    ngAfterViewInit(): void { }
    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {
    }
}
