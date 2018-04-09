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

    <h1 class='about-h1'>Meet the Team</h1>


    

    <div class=' row '>
        <div class='team-copy col l6  '>
            <div class='team-copy-thumb' style='background: url(assets/about/zager.jpg) no-repeat;'></div>
            <div class='team-copy-title'>Michael Zager</div>
            <span class='team-copy-desc' style="clear: both;">Mr. Zager has been crafting digital strategies and executions for the past 15 years. He has served in leadership 
            roles at several notable experiential and digital agencies and partnered with bio-tech, start-up and Fortune 500 companies such as Proctor & Gamble, 
            Toyota and Coca-Cola. Prior to joining the Fred Hutch, Michael was responsible for evolving and supporting all digital marketing platforms in 
            T-Mobile’s retail stores. Michael’s passionate for transforming people’s lives with cutting edge technology lead him to the Fred Hutchinson. 
            Today, he contributes enterprise architecture, software development best practices and big data expertise to Oncoscape.</span>
        </div>

        <div class='team-copy col l6 '>
            <div class='team-copy-thumb' style='background: url(assets/about/zhang.jpg) no-repeat;'></div>
            <div class='team-copy-title'>Jenny Zhang</div>
            <span class='team-copy-desc'>Ms. Zhang, coming from biomedical science background, is also passionate about coding. She is a lab technician 
            working with tumor molecular profiling. Her programming skillset includes R, javascript, and etc. She is very excited to contribute to Oncoscape 
            from web-lab-based data-collection to dry-lab-based data packing and web application development.</span>
        </div>
        </div>
        <div class=' row '>
        <div class='team-copy col l6'>
            <div class='team-copy-thumb' style='background: url(assets/about/krenn.jpg) no-repeat; '></div>
            <span class='team-copy-title'>Gretchen Krenn</span>
            <span class='team-copy-desc'>Ms. Krenn started her research career on the bench and eventually moved to a program management roll assisting 
            in the establishment of a central tissue repository for several national clinical trials. During her time in tissue banking she managed several 
            SQL research databases. Motivated by the massive amounts of data being generated she began to further develop her programming skills to focus 
            on front-end development and data visualization. On the Oncoscape team her education, research and software development background help to 
            understand the limitations we face as researchers and guide to establish relevant cloud based solutions for the center. 
            </span>
        </div>
        <div class='team-copy col l6'>
            <div class='team-copy-thumb' style='background: url(assets/about/bolouri.jpg) no-repeat;'></div>
            <span class='team-copy-title'>Hamid Bolouri</span>
            <div class='team-copy-desc'>Dr. Bolouri tackles big data, developing computational methods to discover how genes control the behavior of cells 
            in health and disease. Dr. Bolouri’s discoveries include the first genomic model of how roughly 150 genes drive the development of a type of immune 
            cell called a T cell, as well as the first model to reveal how a specific network of interacting genes controls early embryonic development in the 
            sea urchin. Dr. Bolouri has contributed to the development of more than a dozen software platforms, including Oncoscape. He is collaborating with 
            Fred Hutch colleague Dr. Soheil Meshinchi to identify key molecular changes in childhood acute leukemia that can be used to guide therapy. 
            With Dr. David MacPherson, Dr. Bolouri is studying the role that a specific regulatory gene plays in lung cancer. 
            As part of STTR, Dr. Bolouri has developed methods to sift through large amounts of clinical and molecular data to find patterns that can be used 
            to tailor treatment and improve precision medicine strategies.
            </div>
        </div>
    </div>

    
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
