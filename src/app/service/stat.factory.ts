import { DataDecorator, DataDecoratorValue } from './../model/data-map.model';
import { DataService } from 'app/service/data.service';
import { Injectable } from '@angular/core';
import { PcaDataModel } from './../component/visualization/pca/pca.model';
import { TruncatedSvdDataModel } from './../component/visualization/truncatedsvd/truncatedsvd.model';
import { StatKeyValues, StatOneD, StatTwoD } from './../model/stat.model';
import { PcaIncrementalDataModel } from './../component/visualization/pcaincremental/pcaincremental.model';
import { VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { Stat } from '../model/stat.model';

/*
    Singleton Class that produces arrays of stat objects.
*/
@Injectable()
export class StatFactory {
  private static _instance: StatFactory = null;

  private dataService: DataService;

  public static getInstance(dataService: DataService): StatFactory {
    if (StatFactory._instance === null) {
      StatFactory._instance = new StatFactory();
      StatFactory._instance.dataService = dataService;
    }
    return StatFactory._instance;
  }

  public getCohortsStats(config: GraphConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataService.getCustomCohorts(config.database).then(cohorts => {
        Promise.all(cohorts.map(cohort => this.getPatientStats(cohort.pids, config))).then(cohortStats => {
          const results = cohortStats.map((cohortStat, i) => ({
            cohort: cohorts[i],
            stats: cohortStat
          }));
          resolve(results);
        });
      });
    });
  }

  public getGenesetsStats(config: GraphConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataService.getCustomGenesets(config.database).then(genesets => {
        Promise.all(genesets.map(geneset => this.getGenesetStats(geneset.mids, config))).then(genesetStats => {
          const results = genesetStats.map((genesetStat, i) => ({
            geneset: genesets[i],
            stats: genesetStat
          }));
          resolve(results);
        });
      });
    });
  }

  // public getCohortStats(config: GraphConfig): Promise<Array<Stat>> {
  //     return new Promise((resolve, reject) => {

  //     });
  // }
  // public getGenesetStats(config: GraphConfig): Promise<Array<Stat>> {
  //     return new Promise((resolve, reject) => {
  //         this.dataService.getGeneStats(config.database,)
  //     });
  // }

  // public getSampleStats(sids: Array<string>, config: GraphConfig): Promise<Array<Stat>> {
  //     return new Promise((resolve, reject) => {

  //     });
  // }

  public getGenesetStats(mids: Array<string>, config: GraphConfig): Promise<Array<Stat>> {
    return new Promise((resolve, reject) => {
      this.dataService.getGeneStats(config.database, mids).then(results => {
        // Look at what comes back and turn it into STateOnD Objects... Just like below.
        // Don't forget 'mylabel'
      });
    });
  }
  public getSelectionStats(values: Array<DataDecoratorValue>, config: GraphConfig): Promise<Array<Stat>> {
    return new Promise((resolve, reject) => {});
  }
  public getPatientStats(pids: Array<string>, config: GraphConfig): Promise<Array<Stat>> {
    return new Promise((resolve, reject) => {
      this.dataService.getPatientStats(config.database, pids).then(results => {
        const stats = results.map(result => {
          const stat = new StatOneD(
            result.name,
            result.stat.map(w => ({
              mylabel: w.label,
              myvalue: w.value
            }))
          );
          if (result.type === 'number' || (result.type === 'category' && result.stat.length >= 7)) {
            stat.charts.reverse();
          }
          return stat;
        });
        resolve(stats);
      });
    });
  }
  // region Create Stats From GraphData + Graph Config
  public getComputeStats(data: any, config: GraphConfig): Promise<Array<Stat>> {
    return new Promise((resolve, reject) => {
      if (config === undefined) {
        resolve([]);
      }
      switch (config.visualization) {
        case VisualizationEnum.INCREMENTAL_PCA:
          resolve(this.createIncrementalPca(data));
          break;
        case VisualizationEnum.TRUNCATED_SVD:
          resolve(this.createTruncatedSvd(data));
          break;
        case VisualizationEnum.PCA:
          resolve(this.createPca(data));
          break;
        case VisualizationEnum.SPARSE_PCA:
          resolve(this.createSparse_PCA(data));
          break;
        case VisualizationEnum.KERNAL_PCA:
          resolve(this.createKernalPca(data));
          break;
        case VisualizationEnum.DICTIONARY_LEARNING:
          resolve(this.createDictionaryLearning(data));
          break;
        case VisualizationEnum.FA:
          resolve(this.createFactorAnalysis(data));
          break;
        case VisualizationEnum.LDA:
          resolve(this.createLatentDirichletAllocation(data));
          break;
        case VisualizationEnum.NMF:
          resolve(this.createNonNegativeMatrixFactorization(data));
          break;
        case VisualizationEnum.ISOMAP:
          resolve(this.createIsoMap(data));
          break;
        case VisualizationEnum.LOCALLY_LINEAR_EMBEDDING:
          resolve(this.createLocallyLinearEmbedding(data));
          break;
        case VisualizationEnum.MDS:
          resolve(this.createMds(data));
          break;
        case VisualizationEnum.FAST_ICA:
          resolve(this.createFastIca(data));
          break;
        case VisualizationEnum.SPECTRAL_EMBEDDING:
          resolve(this.createSpectralEmbedding(data));
          break;
        case VisualizationEnum.TSNE:
          resolve(this.createTSNE(data));
          break;
        case VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS:
          resolve(this.createLinearDiscriminantAnalysis(data));
          break;
        case VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS:
          resolve(this.createQuadraticDiscriminantAnalysis(data));
          break;
        case VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING:
          resolve(this.createDictionaryLearningMiniBatch(data));
          break;
        case VisualizationEnum.MINI_BATCH_SPARSE_PCA:
          resolve(null);
          break;
        case VisualizationEnum.CCA:
          resolve(this.createCCA(data));
          break;
        case VisualizationEnum.PLSREGRESSION:
          resolve(this.createplsRegression(data));
          break;
        case VisualizationEnum.PLSCANONICAL:
          resolve(this.createplsCanonical(data));
          break;
        case VisualizationEnum.LINEAR_SVC:
          resolve(this.createLinearSVC(data));
          break;
        case VisualizationEnum.LINEAR_SVR:
          resolve(this.createLinearSVR(data));
          break;
        case VisualizationEnum.NU_SVC:
          resolve(this.createNuSVC(data));
          break;
        case VisualizationEnum.NU_SVR:
          resolve(this.createNuSVR(data));
          break;
        case VisualizationEnum.ONE_CLASS_SVM:
          resolve(this.createOneClassSVM(data));
          break;
        case VisualizationEnum.SVR:
          resolve(this.createSVR(data));
          break;
        case VisualizationEnum.PLSSVD:
          resolve(this.createplsSVD(data));
          break;
        case VisualizationEnum.MINI_BATCH_SPARSE_PCA:
          resolve(this.createPCASparseMiniBatch(data));
          break;
        case VisualizationEnum.SPARSE_PCA:
          resolve(this.createPCASparseCoder(data));
          break;
        // case VisualizationEnum.TIMELINES: resolve(this.createTimelinesStats(data)); break;
      }
      resolve([]);
    });
  }

  // INDIVUAL METHOD STATS
  // Manifold Learning
  private createIsoMap(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createLocallyLinearEmbedding(data: any): Array<Stat> {
    const stats = [new StatKeyValues('', [{ mylabel: 'Stress:', myvalue: data.stress.toString() }])];
    return stats;
  }
  private createSpectralEmbedding(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createMds(data: any): Array<Stat> {
    const stats = [new StatKeyValues('', [{ mylabel: 'Stress:', myvalue: data.stress.toFixed(2) }])];
    return stats;
  }
  private createTSNE(data: any): Array<Stat> {
    const stats = [
      new StatKeyValues('', [
        { mylabel: 'kl Divergence:', myvalue: data.klDivergence.toFixed(2) },
        { mylabel: 'nIter:', myvalue: data.nIter.toString() }
      ])
    ];
    return stats;
  }
  private createUMap(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }

  // Cross Decomposition
  private createCCA(data: any): Array<Stat> {
    const stats = [new StatKeyValues('', [{ mylabel: 'nIter:', myvalue: data.nIter.toString() }])];
    return stats;
  }
  private createplsRegression(data: any): Array<Stat> {
    const stats = [new StatKeyValues('', [{ mylabel: 'nIter:', myvalue: data.nIter.toString() }])];
    return stats;
  }
  private createplsCanonical(data: any): Array<Stat> {
    const stats = [new StatKeyValues('', [{ mylabel: 'nIter:', myvalue: data.nIter.toString() }])];
    return stats;
  }
  private createplsSVD(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }

  // Discriminant Analysis
  private createLinearDiscriminantAnalysis(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createQuadraticDiscriminantAnalysis(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }

  // Matrix Decomposition
  private createDictionaryLearning(data: any): Array<Stat> {
    const stats = [
      new StatKeyValues('', [{ mylabel: 'nIter:', myvalue: data.nIter.toString() }]),
      new StatTwoD('PCA Loadings', this.formatPCALoadings(data.mid, data.components))
    ];
    return stats;
  }
  private createNonNegativeMatrixFactorization(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createDictionaryLearningMiniBatch(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createFactorAnalysis(data: any): Array<Stat> {
    const stats = [new StatKeyValues('', [{ mylabel: 'nIter:', myvalue: data.nIter.toString() }])];
    return stats;
  }
  private createFastIca(data: any): Array<Stat> {
    const stats = [new StatKeyValues('', [{ mylabel: 'nIter:', myvalue: data.nIter.toString() }])];
    return stats;
  }
  private createLatentDirichletAllocation(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createPca(data: PcaDataModel): Array<Stat> {
    const stats = [
      new StatKeyValues('', [
        { mylabel: 'Noise Variance:', myvalue: data.noiseVariance.toFixed(2) },
        { mylabel: 'nComponents:', myvalue: data.nComponents.toString() }
      ]),
      new StatOneD('Explained Variance', this.formatPrincipleComponents(data.explainedVariance)),
      new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.explainedVarianceRatio)),
      new StatTwoD('PCA Loadings', this.formatPCALoadings(data.mid, data.components))
    ];
    return stats;
  }
  private createIncrementalPca(data: PcaIncrementalDataModel): Array<Stat> {
    const stats = [
      new StatKeyValues('', [
        { mylabel: 'Samples Seen:', myvalue: data.nSamplesSeen.toString() },
        { mylabel: 'Components:', myvalue: data.nComponents.toString() },
        { mylabel: 'Noise Variance:', myvalue: data.noiseVariance.toFixed(2) }
      ]),
      new StatOneD('Explained Variance', this.formatPrincipleComponents(data.explainedVariance)),
      new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.explainedVarianceRatio)),
      new StatTwoD('PCA Loadings', this.formatPCALoadings(data.mid, data.components))
    ];
    return stats;
  }
  private createKernalPca(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createSparse_PCA(data: any): Array<Stat> {
    const stats = [
      new StatKeyValues('', [
        { mylabel: 'nIter:', myvalue: data.iter }
        // { mylabel: 'Components:', myvalue: data.components },
        // { mylabel: 'Error:', myvalue: data.error }
      ]),

      new StatTwoD('PCA Loadings', this.formatPCALoadings(data.mid, data.components))
    ];
    return stats;
  }
  private createPCASparseMiniBatch(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createPCASparseCoder(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }

  private createTruncatedSvd(data: TruncatedSvdDataModel): Array<Stat> {
    const stats = [
      new StatOneD('Explained Variance', this.formatPrincipleComponents(data.explainedVariance)),
      new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.explainedVarianceRatio))
    ];
    return stats;
  }

  // Support Vector Machines
  private createLinearSVC(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createLinearSVR(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createNuSVR(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createNuSVC(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createOneClassSVM(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }
  private createSVR(data: any): Array<Stat> {
    const stats = [];
    return stats;
  }

  // Format Utilities
  private formatPrincipleComponents(data: Array<number>): Array<{ mylabel: string; myvalue: number; color?: number }> {
    const rv = data.map((v, i) => ({ mylabel: 'PC' + (i + 1), myvalue: Math.round(v * 100) / 100 }));
    rv.push({
      mylabel: 'Other',
      myvalue: rv.reduce((p, c) => {
        p -= c.myvalue;
        return Math.round(p * 100) / 100;
      }, 100)
    });
    return rv;
  }
  private formatPCALoadings(
    markers: Array<string>,
    data: Array<Array<number>>
  ): Array<{ mylabel: string; myvalue: number; color?: number }> {
    const r = markers
      .map((v, i) => ({ marker: v, pc1: data[0][i], pc2: data[1][i], pc3: data[2][i] }))
      .sort((a, b) => b.pc1 - a.pc1)
      .map(v => ({ mylabel: v.marker, myvalue: Math.round(v.pc1 * 1e2) / 1e2 }))
      .splice(0, 11);
    return r;
  }
}
