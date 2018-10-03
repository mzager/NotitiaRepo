import { resolve } from 'url';
import { Deploy } from './src/pipeline/step7_deploy';
import { Xls2Csv, ParseTree } from './src/pipeline/step1_xls2csv';
import { Validate } from './src/pipeline/step2_validate';
import { WriteLog } from './src/pipeline/step3_log';
import { WriteJson } from './src/pipeline/step4_json';
import { WriteParquet } from './src/pipeline/step5_parquet';
import { WriteZips } from './src/pipeline/step6_compress';
var fs = require('fs');
class Startup {
  public static main(): number {
    // ParseTree.Run().then(dsFolders => {
    //   debugger;
    // });
    const dsFolders = [
      './src/cbio/acbc_mskcc_2015/',
      './src/cbio/acc_tcga/',
      './src/cbio/acc_tcga_pan_can_atlas_2018/',
      './src/cbio/acyc_fmi_2014/',
      './src/cbio/acyc_mskcc_2013/',
      './src/cbio/all_phase2_target_2018_pub/',
      './src/cbio/aml_target_2018_pub/',
      './src/cbio/angs_project_painter_2018/',
      './src/cbio/blca_mskcc_solit_2014/',
      './src/cbio/blca_nmibc_2017/',
      './src/cbio/blca_plasmacytoid_mskcc_2016/',
      './src/cbio/blca_tcga/',
      './src/cbio/blca_tcga_pan_can_atlas_2018/',
      './src/cbio/blca_tcga_pub/',
      './src/cbio/blca_tcga_pub_2017/',
      './src/cbio/brca_igr_2015/',
      './src/cbio/brca_mbcproject_wagle_2017/',
      './src/cbio/brca_metabric/',
      './src/cbio/brca_tcga/',
      './src/cbio/brca_tcga_pan_can_atlas_2018/',
      './src/cbio/brca_tcga_pub/',
      './src/cbio/brca_tcga_pub2015/',
      './src/cbio/cellline_ccle_broad/',
      './src/cbio/cesc_tcga/',
      './src/cbio/cesc_tcga_pan_can_atlas_2018/',
      './src/cbio/chol_tcga/',
      './src/cbio/chol_tcga_pan_can_atlas_2018/',
      './src/cbio/coad_tcga_pan_can_atlas_2018/',
      './src/cbio/coadread_tcga/',
      './src/cbio/coadread_tcga_pub/',
      './src/cbio/crc_msk_2018/',
      './src/cbio/dlbc_tcga/',
      './src/cbio/dlbc_tcga_pan_can_atlas_2018/',
      './src/cbio/egc_msk_2017/',
      './src/cbio/esca_tcga/',
      './src/cbio/esca_tcga_pan_can_atlas_2018/',
      './src/cbio/gbm_tcga/',
      './src/cbio/gbm_tcga_pan_can_atlas_2018/',
      './src/cbio/gbm_tcga_pub/',
      './src/cbio/gct_msk_2016/',
      './src/cbio/hnsc_tcga/',
      './src/cbio/hnsc_tcga_pan_can_atlas_2018/',
      './src/cbio/hnsc_tcga_pub/',
      './src/cbio/kich_tcga/',
      './src/cbio/kich_tcga_pan_can_atlas_2018/',
      './src/cbio/kich_tcga_pub/',
      './src/cbio/kirc_tcga/',
      './src/cbio/kirc_tcga_pan_can_atlas_2018/',
      './src/cbio/kirc_tcga_pub/',
      './src/cbio/kirp_tcga/',
      './src/cbio/kirp_tcga_pan_can_atlas_2018/',
      './src/cbio/laml_tcga/',
      './src/cbio/laml_tcga_pan_can_atlas_2018/',
      './src/cbio/laml_tcga_pub/',
      './src/cbio/lgg_tcga/',
      './src/cbio/lgg_tcga_pan_can_atlas_2018/',
      './src/cbio/lgggbm_tcga_pub/',
      './src/cbio/lihc_tcga/',
      './src/cbio/lihc_tcga_pan_can_atlas_2018/',
      './src/cbio/luad_tcga/',
      './src/cbio/luad_tcga_pan_can_atlas_2018/',
      './src/cbio/luad_tcga_pub/',
      './src/cbio/lung_msk_2017/',
      './src/cbio/lusc_tcga/',
      './src/cbio/lusc_tcga_pan_can_atlas_2018/',
      './src/cbio/mel_tsam_liang_2017/',
      './src/cbio/meso_tcga/',
      './src/cbio/meso_tcga_pan_can_atlas_2018/',
      './src/cbio/mpnst_mskcc/',
      './src/cbio/msk_impact_2017/',
      './src/cbio/nbl_target_2018_pub/',
      './src/cbio/nsclc_pd1_msk_2018/',
      './src/cbio/odg_msk_2017/',
      './src/cbio/ov_tcga/',
      './src/cbio/ov_tcga_pan_can_atlas_2018/',
      './src/cbio/ov_tcga_pub/',
      './src/cbio/paad_qcmg_uq_2016/',
      './src/cbio/paad_tcga/',
      './src/cbio/paad_tcga_pan_can_atlas_2018/',
      './src/cbio/paad_utsw_2015/',
      './src/cbio/pcpg_tcga/',
      './src/cbio/pcpg_tcga_pan_can_atlas_2018/',
      './src/cbio/prad_eururol_2017/',
      './src/cbio/prad_fhcrc/',
      './src/cbio/prad_mskcc/',
      './src/cbio/prad_mskcc_2017/',
      './src/cbio/prad_p1000/',
      './src/cbio/prad_tcga/',
      './src/cbio/prad_tcga_pan_can_atlas_2018/',
      './src/cbio/prad_tcga_pub/',
      './src/cbio/read_tcga_pan_can_atlas_2018/',
      './src/cbio/rt_target_2018_pub/',
      './src/cbio/sarc_tcga/',
      './src/cbio/sarc_tcga_pan_can_atlas_2018/',
      './src/cbio/skcm_tcga/',
      './src/cbio/skcm_tcga_pan_can_atlas_2018/',
      './src/cbio/skcm_vanderbilt_mskcc_2015/',
      './src/cbio/stad_tcga/',
      './src/cbio/stad_tcga_pan_can_atlas_2018/',
      './src/cbio/stad_tcga_pub/',
      './src/cbio/stes_tcga_pub/',
      './src/cbio/tgct_tcga/',
      './src/cbio/tgct_tcga_pan_can_atlas_2018/',
      './src/cbio/thca_tcga/',
      './src/cbio/thca_tcga_pan_can_atlas_2018/',
      './src/cbio/thca_tcga_pub/',
      './src/cbio/thym_tcga/',
      './src/cbio/thym_tcga_pan_can_atlas_2018/',
      './src/cbio/thyroid_mskcc_2016/',
      './src/cbio/ucec_tcga/',
      './src/cbio/ucec_tcga_pan_can_atlas_2018/',
      './src/cbio/ucec_tcga_pub/',
      './src/cbio/ucs_tcga/',
      './src/cbio/ucs_tcga_pan_can_atlas_2018/',
      './src/cbio/urcc_mskcc_2016/',
      './src/cbio/uvm_tcga/',
      './src/cbio/uvm_tcga_pan_can_atlas_2018/',
      './src/cbio/wt_target_2018_pub/'
    ];

    // Skipped [12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 27, 28, 29,
    // 33, 38, 40, 60, 61, 63, 65, 73,75, 84, 98, 99, 100, 110, 111
    // Check 42, 53, 54, 113 Deployed multiple times... Shit
    // check 49, 92 failed on upload 95?
    // Not sure about 64...

    /*
    Round 2
    :: Cannot read property 'data' of undefined:  84
    98
    */

    const index = 14; // Not yet run - MZ Gos to 117
    console.log(':::::::::::::::::::' + index);
    const v = dsFolders[index];
    console.log(v);

    // type_of_cancer
    var meta = JSON.parse(fs.readFileSync(dsFolders[index] + 'metadata.json'));

    const datasetNode = meta.filter((v: any) =>
      v.hasOwnProperty('type_of_cancer')
    )[0];
    const name = datasetNode.short_name;
    const desc = datasetNode.description;
    const site = datasetNode.type_of_cancer;
    console.dir(name + ': ' + desc + ':' + site);
    this.processOutputDirectory(v, name, site, 'NA').then(() => {
      console.log('ZZZZZZZZZZZZZZZZZZ' + index);
    });

    // this.processOutputDirectory(v, v.split('/')[3], '');

    // this.processInputDirectory(
    //   'Broad - ASC',
    //   './src/input/ASCp_Oncoscape_06292018.xlsx'
    // );

    return 0;
  }

  public static processInputDirectory(
    name: string,
    description: string,
    site: string,
    file: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      Xls2Csv.Run(file).then(() => {
        Validate.Run().then(() => {
          WriteLog.Run().then(() => {
            console.log('WROTE LOG');
            WriteJson.Run().then(v => {
              console.log('WROTE JSON');
              // WriteParquet.All().then(v => {
              WriteZips.All().then(v => {
                console.log('WROTE ZIPS');
                Deploy.All(name, site, description).then(v => {
                  console.log('END');
                  resolve();
                });
              });
            });
          });
        });
      });
    });
  }
  public static processOutputDirectory(
    folder: string,
    name: string,
    site: string,
    desc: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('START');
      fs.readdirSync('./src/output/').forEach((v: any) => {
        fs.unlinkSync('./src/output/' + v);
      });
      fs.readdirSync(folder).forEach((v: any) => {
        if (v !== '.DS_Store' && v.indexOf('rppa') === -1) {
          console.log(folder + v);
          fs.copyFileSync(folder + v, './src/output/' + v);
        }
      });
      Validate.Run().then(() => {
        WriteLog.Run().then(() => {
          console.log('WROTE LOG');
          WriteJson.Run().then(v => {
            console.log('WROTE JSON');
            // WriteParquet.All().then(v => {
            WriteZips.All().then(v => {
              console.log('WROTE ZIPS');
              Deploy.All(name, site, desc).then(v => {
                console.log('END');
                resolve();
              });
            });
          });
        });
      });
    });
  }
}

Startup.main();

let EXIT = false;
function wait() {
  if (!EXIT) setTimeout(wait, 10000);
}
wait();
