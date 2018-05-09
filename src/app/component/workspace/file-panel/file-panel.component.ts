import { DataHubService } from './../../../service/datahub.service';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import { Legend } from 'app/model/legend.model';


@Component({
  selector: 'app-workspace-file-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './file-panel.component.html',
  styleUrls: ['./file-panel.component.scss'],
})
export class FilePanelComponent {

  @Output() uploadExcel = new EventEmitter<any>();
  @Output() loadTcga = new EventEmitter<any>();
  @Output() hide = new EventEmitter<any>();

  datasets = [
    { 'name': 'Adrenocortical carcinoma', 'disease': 'acc', 'img': 'DSadrenal' },
    { 'name': 'Bladder urothelial carcinoma', 'disease': 'blca', 'img': 'DSbladder' },
    { 'name': 'Breast', 'disease': 'brca', 'img': 'DSbreast' },
    { 'name': 'Cervical', 'disease': 'cesc', 'img': 'DSuterine' },
    { 'name': 'Cholangiocarcinoma', 'disease': 'chol', 'img': 'DSbile' },
    { 'name': 'Colon', 'disease': 'coad', 'img': 'DScoadread' },
    { 'name': 'Colorectal', 'disease': 'coadread', 'img': 'DScoadread' },
    { 'name': 'Diffuse large B Cell', 'disease': 'dlbc', 'img': 'DSblood' },
    { 'name': 'Esophageal', 'disease': 'esca', 'img': 'DSheadneck' },
    { 'name': 'Glioblastoma', 'disease': 'gbm', 'img': 'DSbrain' },
    { 'name': 'Head and Neck', 'disease': 'hnsc', 'img': 'DSheadneck' },
    { 'name': 'Kidney chromophobe', 'disease': 'kich', 'img': 'DSkidney' },
    { 'name': 'Kidney renal clear cell', 'disease': 'kirc', 'img': 'DSkidney' },
    { 'name': 'Kidney renal papillary cell', 'disease': 'kirp', 'img': 'DSkidney' },
    { 'name': 'Acute Myeloid Leukemia', 'disease': 'laml', 'img': 'DSblood' },
    { 'name': 'Lower grade glioma', 'disease': 'lgg', 'img': 'DSbrain' },
    { 'name': 'Liver', 'disease': 'lihc', 'img': 'DSliver' },
    { 'name': 'Lung adenocarcinoma', 'disease': 'luad', 'img': 'DSlung' },
    { 'name': 'Lung squamous cell', 'disease': 'lusc', 'img': 'DSlung' },
    { 'name': 'Mesothelioma', 'disease': 'meso', 'img': 'DSlung' },
    { 'name': 'Ovarian', 'disease': 'ov', 'img': 'DSovary' },
    { 'name': 'Pancreas', 'disease': 'paad', 'img': 'DSpancreas' },
    { 'name': 'Prostate', 'disease': 'prad', 'img': 'DSprostate' },
    { 'name': 'Pheochromocytoma + Paraganglioma', 'disease': 'pcpg', 'img': 'DSadrenal' },
    { 'name': 'Rectal', 'disease': 'read', 'img': 'DScoadread' },
    { 'name': 'Sarcoma', 'disease': 'sarc', 'img': 'DSsarcoma' },
    { 'name': 'Stomach', 'disease': 'stad', 'img': 'DSstomach' },
    { 'name': 'Testicular germ cell', 'disease': 'tgct', 'img': 'DStesticules' },
    { 'name': 'Thyroid carcinoma', 'disease': 'thca', 'img': 'DSthyroid' },
    { 'name': 'Thymoma', 'disease': 'thym', 'img': 'DSthymus' },
    { 'name': 'Uterine corpus endometrial', 'disease': 'ucec', 'img': 'DSuterine' },
    { 'name': 'Uterine carcinosarcoma', 'disease': 'ucs', 'img': 'DSuterine' },
    { 'name': 'Uveal melanoma', 'disease': 'uvm', 'img': 'DSeye' }
    // { 'name': 'AML Krakow', 'disease': 'ek', 'img': 'DSblood' }
  ].sort((a, b) => a.img.toUpperCase() < b.img.toUpperCase() ? -1 : 1);

  uploadExcelClick(): void {
    this.uploadExcel.emit();
  }

  onLogin(user): void {
    debugger;
    this.datahubService.login(user);
  }
  onLogout(): void {
    debugger;
    this.datahubService.logout();
  }


  closeClick(): void {
    this.hide.emit();
  }
  constructor(public datahubService: DataHubService) {
  }
}
