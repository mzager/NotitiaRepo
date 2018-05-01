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
    <h2 class='about-h2'>Seattle Tumor Translation Research (STTR) assists cancer researchers and clinicians to extract biological meaning through
        the development of custom software solutions.</h2>
    <h2 class='about-h2'>The rapid growth of both public datasets and analytic methods presents challenges and opportunities. To maximize impact
        researchers often need to enlist the support of biostatisticians, data scientists and software engineers that specialize
        in cloud technologies.</h2>
    <h2 class='about-h2'> To help mitigate these challenges, STTR has built a cloud-based platform called Oncoscape.  Our solution allows users
        to upload clinical and molecular data; leverage industry standard analytic libraries; augment with NCI sponsored
        data sets; and visualize with dozens of novel online interactive tools. Our mission is to accelerate your science.</h2>
    <h1 class='about-h1'>Meet the Team</h1>
    <div class='row'>
        <div class='team-copy col s12 l6  '>
            <img class='team-copy-thumb responsive-img' src='assets/about/holland.jpg'>
            <p class='team-copy-title'>Eric Holland</p>
            <div class='team-copy-desc'>Dr. Holland is an internationally renowned neurosurgeon and brain cancer researcher.
            As senior vice president and director of the Human Biology Division of the Fred Hutchinson Cancer Research Center, Dr. Holland encourages collaboration among faculty with a broad range of expertise – from molecular and cellular... like oncoscape...
            </div>
        </div>
        <div class='team-copy col s12 l6  '>
            <img class='team-copy-thumb responsive-img' src='assets/about/zager.jpg'>
            <p class='team-copy-title'>Michael Zager</p>
            <div class='team-copy-desc'>Mr. Zager has been crafting digital strategies and executions for the past 15 years. He has served in leadership
                roles at several notable experiential and digital agencies and partnered with bio-tech, start-up and Fortune
                500 companies such as Proctor & Gamble, Toyota and Coca-Cola. Prior to joining the Fred Hutch, Michael was
                responsible for evolving and supporting all digital marketing platforms in T-Mobile’s retail stores. Michael’s
                passionate for transforming people’s lives with cutting edge technology lead him to the Fred Hutchinson.
                Today, he contributes enterprise architecture, software development best practices and big data expertise
                to Oncoscape.</div>
        </div>
    
        <div class='team-copy col s12 l6'>
            <img class='team-copy-thumb responsive-img' src='assets/about/krenn.jpg'>
            <p class='team-copy-title'>Gretchen Krenn</p>
            <div class='team-copy-desc'>Ms. Krenn started her research career on the bench and eventually moved to a program management roll assisting
                in the establishment of a central tissue repository for several national clinical trials. During her time
                in tissue banking she managed multiple SQL research databases. Motivated by the massive amounts of data being
                generated she began to further develop her programming skills to focus on front-end development and data
                visualization. On the Oncoscape team her education, research and software development background help to
                understand the limitations we face as researchers and guide to establish relevant cloud based solutions for
                the center.
            </div>
        </div>
        <div class='team-copy col s12 l6 '>
            <img class='team-copy-thumb responsive-img' src='assets/about/zhang.jpg'>
            <p class='team-copy-title'>Jenny Zhang</p>
            <div class='team-copy-desc'>Ms. Zhang, coming from biomedical science background, is also passionate about coding. She is a lab technician
                working with tumor molecular profiling. Her programming skillset includes R, javascript, and etc. She is
                very excited to contribute to Oncoscape from web-lab-based data-collection to dry-lab-based data packing
                and web application development.</div>
        </div>
        <div class='team-copy col s12 l6'>
            <img class='team-copy-thumb responsive-img' src='assets/about/mcdermott.jpg'>
            <p class='team-copy-title'> Rachel Galbraith</p>
            <div class='team-copy-desc'>
                Mr. Rachel started his career at the Fred Hutch in 2000 as an IT professional in Center IT. During that time,
                he has been involved with the design, implementation and administration of many IT systems including email,
                server virtualization, storage, cloud computing and more. He’s most interested in working on projects that
                have a direct and positive impact on the important research that is happening at the Center.
            </div>
        </div>
        <div class='team-copy col s12 l6'>
            <img class='team-copy-thumb responsive-img' src='assets/about/mcdermott.jpg'>
            <p class='team-copy-title'>Robert McDermott</p>
            <div class='team-copy-desc'>
                Mr. McDermott started his career at the Fred Hutch in 2000 as an IT professional in Center IT. During that time,
                he has been involved with the design, implementation and administration of many IT systems including email,
                server virtualization, storage, cloud computing and more. He’s most interested in working on projects that
                have a direct and positive impact on the important research that is happening at the Center.
            </div>
        </div>
    </div>
    <h1 class='about-h1'>Special Thanks</h1>
    <div class='row'>
    <div class='team-copy-desc'>
    <span class='team-copy-title'>Steering</span>
    Eric Holland, Raquel Sanchez, Elizabeth Krakow, Michael Zager<br />
    <span class='team-copy-title'>Biostats</span>
    Hamid Bolouri, Ilsa Coleman, Emily Kohlbrenner, Navonil De Sarkar, Lisa McFerrin, Chad He <br />
    <span class='team-copy-title'>Interns</span>
    Adam Samir Alayli, Vaishnavi Phadnis <br />
    </div>
    
       
        
    </div>
    <h1 class='about-h1'>Institutional Support</h1>
    <div class='row'>
        <div class='team-copy col s12 l6'>
            <img class='team-copy-thumb responsive-img' src='assets/about/fhcrc.jpg'>
            <p class='team-copy-title'>Fred Hutchinson Cancer Research Center</p>
            <div class='team-copy-desc'></div>
        </div>
        <!--
        <div class='team-copy col s12 l6'>
            <img class='team-copy-thumb responsive-img' src='assets/about/fhcrc.jpg'>
            <p class='team-copy-title'>Seattle Translational Tumor Research</p>
            <div class='team-copy-desc'></div>
        </div>
        -->
        <div class='team-copy col s12 l6'>
            <img class='team-copy-thumb responsive-img' src='assets/about/sarc.jpg'>
            <p class='team-copy-title'>Sarcoma Alliance for Research Through Collaboration</p>
            <div class='team-copy-desc'></div>
        </div>
    </div>
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
