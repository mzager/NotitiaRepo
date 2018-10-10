import { DataService } from 'app/service/data.service';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { PanelEnum } from '../../../model/enum.model';
import { DataHubService } from './../../../service/datahub.service';

@Component({
  selector: 'app-workspace-file-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './file-panel.component.html',
  styleUrls: ['./file-panel.component.scss']
})
export class FilePanelComponent {
  // todo: This needs to be revisited post launch.  Should be doing this in redux state.
  myDatasets: Array<any> = [];
  @Output()
  uploadExcel = new EventEmitter<any>();
  @Output()
  loadPublic = new EventEmitter<any>();
  @Output()
  loadPrivate = new EventEmitter<{ bucket: string; token: string }>();
  @Output()
  hide = new EventEmitter<any>();
  @Output()
  showPanel = new EventEmitter<PanelEnum>();
  datasets = [];
  filter = '';

  uploadExcelClick(): void {
    this.uploadExcel.emit();
  }

  addDataset(): void {
    this.showPanel.emit(PanelEnum.UPLOAD);
  }
  // onLogout(): void {
  //   // this.datahubService.logout();
  // }

  closeClick(): void {
    this.hide.emit();
  }
  constructor(public dataService: DataService, cd: ChangeDetectorRef) {
    dataService.getPublicDatasets().then(v => {
      const tcgaSets = [
        {
          name: 'Adrenocortical carcinoma',
          prefix: 'tcga_acc_',
          img: 'DSadrenal',
          src: 'tcga',
          uid: 'tcga_acc'
        },
        {
          name: 'Bladder urothelial carcinoma',
          prefix: 'tcga_blca_',
          img: 'DSbladder',
          src: 'tcga',
          uid: 'tcga_blca'
        },
        {
          name: 'Breast',
          prefix: 'tcga_brca_',
          img: 'DSbreast',
          src: 'tcga',
          uid: 'tcga_brca'
        },
        {
          name: 'Cervical',
          prefix: 'tcga_cesc_',
          img: 'DSuterine',
          src: 'tcga',
          uid: 'tcga_cesc'
        },
        {
          name: 'Cholangiocarcinoma',
          prefix: 'tcga_chol_',
          img: 'DSbile',
          src: 'tcga',
          uid: 'tcga_chol'
        },
        {
          name: 'Colon',
          prefix: 'tcga_coad_',
          img: 'DScoadread',
          src: 'tcga',
          uid: 'tcga_coad'
        },
        // {
        //   name: 'Colorectal',
        //   prefix: 'tcga_coadread_',
        //   img: 'DScoadread',
        //   src: 'tcga',
        //   uid: 'tcga_coadread'
        // },
        {
          name: 'Diffuse large B Cell',
          prefix: 'tcga_dlbc_',
          img: 'DSblood',
          src: 'tcga',
          uid: 'tcga_dlbc'
        },
        {
          name: 'Esophageal',
          prefix: 'tcga_esca_',
          img: 'DSheadneck',
          src: 'tcga',
          uid: 'tcga_esca'
        },
        {
          name: 'Glioblastoma',
          prefix: 'tcga_gbm_',
          img: 'DSbrain',
          src: 'tcga',
          uid: 'tcga_gbm'
        },
        {
          name: 'Glioma',
          prefix: 'tcga_brain_',
          img: 'DSbrain',
          src: 'tcga',
          uid: 'tcga_brain'
        },
        {
          name: 'Head and Neck',
          prefix: 'tcga_hnsc_',
          img: 'DSheadneck',
          src: 'tcga',
          uid: 'tcga_hnsc'
        },
        {
          name: 'Kidney chromophobe',
          prefix: 'tcga_kich_',
          img: 'DSkidney',
          src: 'tcga',
          uid: 'tcga_kich'
        },
        {
          name: 'Kidney renal clear cell',
          prefix: 'tcga_kirc_',
          img: 'DSkidney',
          src: 'tcga',
          uid: 'tcga_kirc'
        },
        {
          name: 'Kidney renal papillary cell',
          prefix: 'tcga_kirp_',
          img: 'DSkidney',
          src: 'tcga',
          uid: 'tcga_kirp'
        },
        {
          name: 'Lower grade glioma',
          prefix: 'tcga_lgg_',
          img: 'DSbrain',
          src: 'tcga',
          uid: 'tcga_lgg'
        },
        {
          name: 'Liver',
          prefix: 'tcga_lihc_',
          img: 'DSliver',
          src: 'tcga',
          uid: 'tcga_lihc'
        },
        {
          name: 'Lung adenocarcinoma',
          prefix: 'tcga_luad_',
          img: 'DSlung',
          src: 'tcga',
          uid: 'tcga_luad'
        },
        {
          name: 'Lung squamous cell',
          prefix: 'tcga_lusc_',
          img: 'DSlung',
          src: 'tcga',
          uid: 'tcga_lusc'
        },
        {
          name: 'Mesothelioma',
          prefix: 'tcga_meso_',
          img: 'DSlung',
          src: 'tcga',
          uid: 'tcga_meso'
        },
        {
          name: 'Ovarian',
          prefix: 'tcga_ov_',
          img: 'DSovary',
          src: 'tcga',
          uid: 'tcga_ov'
        },
        {
          name: 'Pancreas',
          prefix: 'tcga_paad_',
          img: 'DSpancreas',
          src: 'tcga',
          uid: 'tcga_paad'
        },
        {
          name: 'Prostate',
          prefix: 'tcga_prad_',
          img: 'DSprostate',
          src: 'tcga',
          uid: 'tcga_prad'
        },
        {
          name: 'Pheochromocytoma + Paraganglioma',
          prefix: 'tcga_pcpg_',
          img: 'DSadrenal',
          src: 'tcga',
          uid: 'tcga_pcpg'
        },
        {
          name: 'Rectal',
          prefix: 'tcga_read_',
          img: 'DScoadread',
          src: 'tcga',
          uid: 'tcga_read'
        },
        {
          name: 'Sarcoma',
          prefix: 'tcga_sarc_',
          img: 'DSsarcoma',
          src: 'tcga',
          uid: 'tcga_sarc'
        },
        {
          name: 'Stomach',
          prefix: 'tcga_stad_',
          img: 'DSstomach',
          src: 'tcga',
          uid: 'tcga_stad'
        },
        {
          name: 'Testicular germ cell',
          prefix: 'tcga_tgct_',
          img: 'DStesticules',
          src: 'tcga',
          uid: 'tcga_tgct'
        },
        {
          name: 'Thyroid carcinoma',
          prefix: 'tcga_thca_',
          img: 'DSthyroid',
          src: 'tcga',
          uid: 'tcga_thca'
        },
        {
          name: 'Thymoma',
          prefix: 'tcga_thym_',
          img: 'DSthymus',
          src: 'tcga',
          uid: 'tcga_thym'
        },
        {
          name: 'Uterine corpus endometrial',
          prefix: 'tcga_ucec_',
          img: 'DSuterine',
          src: 'tcga',
          uid: 'tcga_ucec'
        },
        {
          name: 'Uterine carcinosarcoma',
          prefix: 'tcga_ucs_',
          img: 'DSuterine',
          src: 'tcga',
          uid: 'tcga_ucs'
        },
        {
          name: 'Uveal melanoma',
          prefix: 'tcga_uvm_',
          img: 'DSeye',
          src: 'tcga',
          uid: 'tcga_uvm'
        }
      ].map((ds: any) => {
        ds.name += ' (Oncoscape TCGA)';
        ds['isPublic'] = true;
        return ds;
      });

      const imgMap = {
        plmeso: 'DSlung',
        paad: 'DSpancreas',
        prad: 'DSprostate',
        odg: 'DSbrain',
        nbl: 'DSbrain',
        nsclc: 'DSlung',
        mpnst: 'DSbrain',
        acbc: 'DSbreast',
        acc: 'DSadrenal',
        acyc: 'DSheadneck',
        soft_tissue: 'DSsarcoma',
        mnet: 'DSbrain',
        hgsoc: 'DSovary',
        all: 'na',
        mixed: 'na',
        mrt: 'na',
        aml: 'DSblood',
        angs: 'DSsarcoma',
        blca: 'DSbladder',
        brca: 'DSbreast',
        ccrcc: 'DSkidney',
        chol: 'DSbile',
        chrcc: 'DSkidney',
        dsbrain: 'DSbrain',
        difg: 'DSbrain',
        dlbcl: 'DSblood',
        dlbclnos: 'DSblood',
        esca: 'DSheadneck',
        gbm: 'DSbrain',
        gct: 'na',
        hcc: 'DSliver',
        hnsc: 'DSheadneck',
        luad: 'DSlung',
        prc: 'DSkidney',
        prcc: 'DSkidney',
        DSbrain: 'DSbrain',
        read: 'DScoadread'
      };
      const publicSets = v.map(x => {
        if (
          x.content.name.indexOf('(FHCRC)') !== -1 ||
          x.content.name.indexOf('(Broad)') !== -1 ||
          x.content.name.indexOf('(UW)') !== -1 ||
          x.content.name.indexOf('(Robert Debré)')
        ) {
          x.name = x.content.name;
        } else if (x.content.name.indexOf('(') === -1) {
          x.name = x.content.name + '(CBio)';
        } else {
          x.name = x.content.name.replace('(', '(CBio ');
        }

        if (!imgMap.hasOwnProperty(x.content.site.toLowerCase())) {
          console.log(x.content.site.toLowerCase());
          x.img = 'DScancer';
        } else {
          x.img = imgMap[x.content.site.toLowerCase()];
        }

        return x;
      });

      const uniq = [];
      this.datasets = tcgaSets
        .concat(publicSets)
        .filter(v2 => {
          // if (v2.name.toLowerCase().indexOf('kim') !== -1) {
          //   return false;
          // }
          if (uniq.indexOf(v2.name) === -1) {
            uniq.push(v2.name);
            return true;
          }
          return false;
        })
        .map(v2 => {
          v2.name = v2.name
            .toLowerCase()
            .replace(
              /\w\S*/g,
              txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
          return v2;
        })
        .sort((a: any, b: any) => (a.name < b.name ? -1 : 1))
        .sort((a: any, b: any) => (a.img < b.img ? -1 : 1));
      cd.markForCheck();
      console.dir(this.datasets);
      // const imgs = Object.keys(
      //   this.datasets.reduce((p, c, i) => {
      //     p[c.img] = 'x';
      //     return p;
      //   }, {})
      // );
      // console.log(imgs);
      // debugger;
    });
  }
}
