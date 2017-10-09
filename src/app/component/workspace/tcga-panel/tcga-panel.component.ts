import { GraphConfig } from 'app/model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { Observable } from 'rxjs/Observable';
import {
  Component, OnInit, ViewChild, ElementRef,
  Input, Output, AfterViewInit, EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-workspace-tcga-panel',
  templateUrl: './tcga-panel.component.html',
  styleUrls: ['./tcga-panel.component.scss']
})
export class TcgaPanelComponent {

  @Output() loadTcga = new EventEmitter<GraphConfig>();

  datasets = [{ 'name': 'Breast', 'disease': 'brca', 'img': 'DSbreast.png' },
    { 'name': 'Esophageal', 'disease': 'esca', 'img': 'DSheadneck.png' },
    { 'name': 'Glioblastoma', 'disease': 'gbm', 'img': 'DSbrain.png' },
    { 'name': 'Head and Neck', 'disease': 'hnsc', 'img': 'DSheadneck.png' },
    { 'name': 'Kidney chromophobe', 'disease': 'kich', 'img': 'DSkidney.png' },
    { 'name': 'Kidney renal clear cell', 'disease': 'kirc', 'img': 'DSkidney.png' },
    { 'name': 'Kidney renal papillary cell', 'disease': 'kirp', 'img': 'DSkidney.png' },
    { 'name': 'Lower grade glioma', 'disease': 'lgg', 'img': 'DSbrain.png' },
    { 'name': 'Liver', 'disease': 'lihc', 'img': 'DSliver.png' },
    { 'name': 'Lung adenocarcinoma', 'disease': 'luad', 'img': 'DSlung.png' },
    { 'name': 'Lung squamous cell', 'disease': 'lusc', 'img': 'DSlung.png' },
    { 'name': 'Sarcoma', 'disease': 'sarc', 'img': 'DSsarcoma.png' },
    { 'name': 'Pancreas', 'disease': 'paad', 'img': 'DSpancreas.png' },
    { 'name': 'Prostate', 'disease': 'prad', 'img': 'DSprostate.png' },
    { 'name': 'Skin cutaneous melanoma', 'disease': 'skcm', 'img': 'DSskin.png' },
    { 'name': 'Stomach', 'disease': 'stad', 'img': 'DSstomach.png' },
    { 'name': 'Thyroid carcinoma', 'disease': 'thca', 'img': 'DSthyroid.png' },
    { 'name': 'Uterine corpus endometrial', 'disease': 'ucec', 'img': 'DSuterine.png' },
    { 'name': 'Adrenocortical carcinoma', 'disease': 'acc', 'img': 'DSadrenal.png' },
    { 'name': 'Bladder urothelial carcinoma', 'disease': 'blca', 'img': 'DSbladder.png' },
    { 'name': 'Cervical', 'disease': 'cesc', 'img': 'DSuterine.png' },
    { 'name': 'Cholangiocarcinoma', 'disease': 'chol', 'img': 'DSbile.png' },
    { 'name': 'Diffuse large B Cell', 'disease': 'dlbc', 'img': 'DSblood.png' },
    { 'name': 'Colorectal', 'disease': 'coadread', 'img': 'DScoadread.png' },
    { 'name': 'Lung', 'disease': 'lung', 'img': 'DSlung.png' },
    { 'name': 'Colon', 'disease': 'coad', 'img': 'DScoadread.png' },
    { 'name': 'Acute Myeloid Leukemia', 'disease': 'laml', 'img': 'DSblood.png' },
    { 'name': 'Rectal', 'disease': 'read', 'img': 'DScoadread.png' },
    { 'name': 'Uterine carcinosarcoma', 'disease': 'ucs', 'img': 'DSuterine.png' },
    { 'name': 'Uveal melanoma', 'disease': 'uvm', 'img': 'DSeye.png' },
    { 'name': 'Thymoma', 'disease': 'thym', 'img': 'DSthymus.png' },
    { 'name': 'Testicular germ cell', 'disease': 'tgct', 'img': 'DStesticules.png' },
    { 'name': 'Pheochromocytoma & Paraganglioma', 'disease': 'pcpg', 'img': 'DSadrenal.png' },
    { 'name': 'Ovarian', 'disease': 'ov', 'img': 'DSovary.png' },
    { 'name': 'Gliomas', 'disease': 'brain', 'img': 'DSbrain.png' },
    { 'name': 'gbm', 'disease': 'GBM_NatGen2016', 'img': 'DSbrain.png' },
    { 'name': 'gbm16', 'disease': 'tcganatgengbm', 'img': 'DSbrain.png' }];

    loadDataset(dataset) {

      this.loadTcga.emit( dataset );

      // fetch('assets/tcga/result.json')
      //   .then( v => v.json() )
      //   .then( v => {
      //     debugger;
      //   })
      // .then( v => v.json() )
      // .then( v => {
      //   // Filter Out Genes That Aren't Mutated in At Least 30%
      //   const NumberOfZerosInGistic = v.data[0].map(function(col, i) {
      //     return v.data.map(function(row) {
      //       return row[i];
      //     });
      //   }).map( a => a.filter( b => b !== 0).length );
      //   const includeGenes = NumberOfZerosInGistic.map(x => x > v.data.length * 0.5);
      //   const genes = v.genes.filter( (datum, i) => includeGenes[i] )
      //   const data = v.data.map( datum => datum.filter( (gene, index) => includeGenes[index] ) );

      //   fetch('https://0x8okrpyl3.execute-api.us-west-2.amazonaws.com/dev', {
      //     method: 'POST',
      //     headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //           method: 'cluster_sk_pca_incremental',
      //           components: 3,
      //           data: data,
      //           whiten: false,
      //     })
      //   })
      //   .then( r => r.json())
      //   .then( r => {
      //     console.log("DONE");
      //     console.log(new Date());
      //       debugger;
      //   });
      // });
    }
}
