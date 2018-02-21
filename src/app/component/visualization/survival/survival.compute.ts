import { SurvivalConfigModel } from './survival.model';
import { ChromosomeConfigModel } from './../chromosome/chromosome.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
export const survivalCompute = (config: SurvivalConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.getPatientData([], config.database, 'patient')
        .then(result => {

            const p = result.map(v => v.p);
            const e = result.map(v => (v.vital_status === 'dead') ? 1 : 0 );
            const t = result.map(v => (v.vital_status === 'dead') ?
                v.days_to_death : v.days_to_last_follow_up)
                .map(v => (v === null) ? 0 : v);

            worker.util.fetchResult({
                method: 'survival_ll_kaplan_meier',
                times: t,
                events: e
            }).then( (survivalResult) => {
<<<<<<< HEAD

                const result = Object.keys(survivalResult.result.KM_estimate)
                    .map(v => [parseFloat(v), survivalResult.result.KM_estimate[v]])
                    .sort( (a,b) => a[0]-b[0])
    
                const upper = Object.keys(survivalResult.confidence['KM_estimate_upper_0.95'])
                    .map(v => [parseFloat(v), survivalResult.confidence['KM_estimate_upper_0.95'][v]])
                    .sort( (a,b) => a[0]-b[0]);

                const lower = Object.keys(survivalResult.confidence['KM_estimate_lower_0.95'])
                    .map(v => [parseFloat(v), survivalResult.confidence['KM_estimate_lower_0.95'][v]])
                    .sort( (a,b) => a[0]-b[0]);

                const range = [result[0][0], result[result.length - 1][0]];
=======
                const sr = Object.keys(survivalResult.result.KM_estimate)
                    .map(v => [parseFloat(v), survivalResult.result.KM_estimate[v]]);
                const range = [sr[0][0], sr[result.length - 1][0]];
>>>>>>> a247df4a3862422d818b9c64d84ab84269eade6c

                worker.postMessage({
                    config: config,
                    data: {
                        legendItems: [],
                        result: {
                            cohorts: [
                                {
                                    name: 'All',
                                    result: result,
                                    confidence: {
<<<<<<< HEAD
                                        upper: upper,
                                        lower: lower
                                    },
                                    median: survivalResult.median,
                                    timeRange: range
=======
                                        upper: Object.keys(survivalResult.confidence['KM_estimate_upper_0.95'])
                                            .map(v => [parseFloat(v), survivalResult.confidence['KM_estimate_upper_0.95'][v]]),
                                        lower: Object.keys(survivalResult.confidence['KM_estimate_upper_0.95'])
                                            .map(v => [parseFloat(v), survivalResult.confidence['KM_estimate_upper_0.95'][v]])
                                    },
                                    tte: 0,
                                    median: sr,
                                    timeRange: sr
>>>>>>> a247df4a3862422d818b9c64d84ab84269eade6c
                                }
                            ]
                        }
                    }
                });
                worker.postMessage('TERMINATE');
            });

        });
}
