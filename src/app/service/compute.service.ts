import { PcaSparseConfigModel } from './../component/visualization/pcasparse/pcasparse.model';
import { PcaKernalConfigModel } from './../component/visualization/pcakernal/pcakernal.model';
import { PcaIncrementalConfigModel } from './../component/visualization/pcaincremental/pcaincremental.model';
import { SpectralEmbeddingConfigModel } from './../component/visualization/spectralembedding/spectralembedding.model';
import { LocalLinearEmbeddingConfigModel } from './../component/visualization/locallinearembedding/locallinearembedding.model';
import { IsoMapConfigModel } from './../component/visualization/isomap/isomap.model';
import { Subject } from 'rxjs/Subject';
import { FastIcaConfigModel } from './../component/visualization/fastica/fastica.model';
import { TruncatedSvdDataModel, TruncatedSvdConfigModel } from './../component/visualization/truncatedsvd/truncatedsvd.model';
import { NmfConfigModel } from './../component/visualization/nmf/nmf.model';
import { LdaConfigModel } from './../component/visualization/lda/lda.model';
import { DictionaryLearningConfigModel } from './../component/visualization/dictionarylearning/dictionarylearning.model';
import { FaConfigModel } from './../component/visualization/fa/fa.model';
import { MdsConfigModel } from './../component/visualization/mds/mds.model';
import { SomConfigModel } from './../component/visualization/som/som.model';
import { HeatmapConfigModel } from './../component/visualization/heatmap/heatmap.model';
import { EdgeConfigModel } from './../component/visualization/edges/edges.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { chromosomeCompute } from './../component/visualization/chromosome/chromosome.compute';
import { ChromosomeConfigModel } from './../component/visualization/chromosome/chromosome.model';
import { GraphEnum } from 'app/model/enum.model';
import { IlluminaService } from './illumina.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { pcaCompute } from './../component/visualization/pca/pca.compute';
import { PcaConfigModel } from './../component/visualization/pca/pca.model';
import { tsneCompute } from './../component/visualization/tsne/tsne.compute';
import { TsneConfigModel } from './../component/visualization/tsne/tsne.model';
import { UUID } from 'angular2-uuid';
import * as Pool from 'generic-promise-pool';
declare var thread;

/*
When samples and genes are specified empty arrays == all
*/
@Injectable()
export class ComputeService {

    private workers: Array<Worker>;
    private pool: Pool;
    private isoMap$ = new Subject<any>();
    private localLinearEmbedding$ = new Subject<any>();
    private spectralEmbedding$ = new Subject<any>();
    private pcaIncremental$ = new Subject<any>();
    private pcaKernal$ = new Subject<any>();
    private pcaSparse$ = new Subject<any>();
    private fastIca$ = new Subject<any>();
    private truncatedSvd$ = new Subject<any>();
    private dictionaryLearning$ = new Subject<any>();
    private lda$ = new Subject<any>();
    private nmf$ = new Subject<any>();
    private fa$ = new Subject<any>();
    private mds$ = new Subject<any>();
    private pca$ = new Subject<any>();
    private som$ = new Subject<any>();
    private chromosome$ = new Subject<any>();
    private tsne$ = new Subject<any>();
    private edges$ = new Subject<any>();
    private heatmap$ = new Subject<any>();
    private dataload$ = new Subject<any>();

    constructor(private illumina: IlluminaService) {
        this.pool = Pool.create({
            name    : 'worker',
            max     : 6,
            min     : 2,
            create  : () => {
                return new Worker('assets/compute.js');
            },
            destroy : (worker: Worker) => {
                worker.terminate();
            }
        });
    }

    execute(config: GraphConfig, subject: Subject<any>): Observable<any> {
        this.pool.acquire( worker => {
            return new Promise<any>( ( resolve, reject ) => {
                const onMessage = (v) => {
                    if (v.data === 'TERMINATE') {
                        worker.removeEventListener( 'message', onMessage );
                        resolve();
                    } else { subject.next(v.data); }
                };
                worker.addEventListener( 'message', onMessage );
                worker.postMessage( config );
            });
        });
        return subject;
    }

    heatmap(config: HeatmapConfigModel): Observable<any> {
        return this.execute(config, this.heatmap$);
    }

    tsne(config: TsneConfigModel): Observable<any> {
        return this.execute(config, this.tsne$);
    }

    pca(config: PcaConfigModel): Observable<any> {
        return this.execute(config, this.pca$);
    }

    chromosome(config: ChromosomeConfigModel): Observable<any> {
        return this.execute(config, this.chromosome$);
    }

    edges(config: EdgeConfigModel): Observable<any> {
        return this.execute(config, this.edges$);
    }

    som(config: SomConfigModel): Observable<any> {
        return this.execute(config, this.som$);
    }

    mds(config: MdsConfigModel): Observable<any> {
        return this.execute(config, this.mds$);
    }

    fa(config: FaConfigModel): Observable<any> {
        return this.execute(config, this.fa$);
    }

    dictionaryLearning(config: DictionaryLearningConfigModel): Observable<any> {
        return this.execute(config, this.dictionaryLearning$);
    }

    lda(config: LdaConfigModel): Observable<any> {
        return this.execute(config, this.lda$);
    }

    nmf(config: NmfConfigModel): Observable<any> {
        return this.execute(config, this.nmf$);
    }

    truncatedSvd(config: TruncatedSvdConfigModel): Observable<any> {
        return this.execute(config, this.truncatedSvd$);
    }

    fastIca(config: FastIcaConfigModel): Observable<any> {
        return this.execute(config, this.fastIca$);
    }

    isoMap(config: IsoMapConfigModel): Observable<any> {
        return this.execute(config, this.isoMap$);
    }

    localLinearEmbedding(config: LocalLinearEmbeddingConfigModel): Observable<any> {
        return this.execute(config, this.localLinearEmbedding$);
    }

    spectralEmbedding(config: SpectralEmbeddingConfigModel): Observable<any> {
        return this.execute(config, this.spectralEmbedding$);
    }

    pcaIncremental(config: PcaIncrementalConfigModel): Observable<any> {
        return this.execute(config, this.pcaIncremental$);
    }

    pcaKernal(config: PcaKernalConfigModel): Observable<any> {
        return this.execute(config, this.pcaKernal$);
    }

    pcaSparse(config: PcaSparseConfigModel): Observable<any> {
        return this.execute(config, this.pcaSparse$);
    }
}
