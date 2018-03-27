import { SurvivalConfigModel } from './survival.model';
import { ChromosomeConfigModel } from './../chromosome/chromosome.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
export const survivalCompute = (config: SurvivalConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.getPatientData([], config.database, 'patient')
        .then(result => {
            const e = result.map(v => (v.vital_status === 'dead') ? 1 : 0);
            const t = result.map(v => (v.vital_status === 'dead') ?
                v.days_to_death : v.days_to_last_follow_up)
                .map(v => (v === null) ? 0 : v);
            const p = result.map((v, i) => ({ p: v.p, e: e[i], t: t[i] }));
            worker.util.fetchResult({
                method: 'survival_ll_kaplan_meier',
                times: t,
                events: e
            }).then((survivalResult) => {
                const ea = e;
                const et = t;
                const results = Object.keys(survivalResult.result.KM_estimate)
                    .map(v => [parseFloat(v), survivalResult.result.KM_estimate[v]])
                    .sort((a, b) => a[0] - b[0]);

                const upper = Object.keys(survivalResult.confidence['KM_estimate_upper_0.95'])
                    .map(v => [parseFloat(v), survivalResult.confidence['KM_estimate_upper_0.95'][v]])
                    .sort((a, b) => a[0] - b[0]);

                const lower = Object.keys(survivalResult.confidence['KM_estimate_lower_0.95'])
                    .map(v => [parseFloat(v), survivalResult.confidence['KM_estimate_lower_0.95'][v]])
                    .sort((a, b) => a[0] - b[0]);

                const range = [results[0][0], result[results.length - 1][0]];

                worker.postMessage({
                    config: config,
                    data: {
                        legendItems: [],
                        result: {
                            cohorts: [
                                {
                                    name: 'All',
                                    result: results,
                                    confidence: {
                                        upper: upper,
                                        lower: lower
                                    },
                                    median: survivalResult.median,
                                    timeRange: range,
                                    p: p
                                }
                            ]
                        }
                    }
                });
                worker.postMessage('TERMINATE');
            });
        });
};
