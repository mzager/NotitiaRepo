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
            Promise.all([
                worker.util.fetchResult({
                    method: 'survival_ll_kaplan_meier',
                    times: t,
                    events: e
                }),
                worker.util.fetchResult({
                    method: 'survival_ll_nelson_aalen',
                    times: t,
                    events: e
                })
            ]).then((survivalHazardResults) => {

                // Survival
                const survivalResult = survivalHazardResults[0];
                const ea = e;
                const et = t;
                const survivalResults = Object.keys(survivalResult.result.KM_estimate)
                    .map(v => [parseFloat(v), survivalResult.result.KM_estimate[v]])
                    .sort((a, b) => a[0] - b[0]);
                const survivalUpper = Object.keys(survivalResult.confidence['KM_estimate_upper_0.95'])
                    .map(v => [parseFloat(v), survivalResult.confidence['KM_estimate_upper_0.95'][v]])
                    .sort((a, b) => a[0] - b[0]);
                const survivalLower = Object.keys(survivalResult.confidence['KM_estimate_lower_0.95'])
                    .map(v => [parseFloat(v), survivalResult.confidence['KM_estimate_lower_0.95'][v]])
                    .sort((a, b) => a[0] - b[0]);
                const xRangeSurvival = [survivalResults[0][0], survivalResults[survivalResults.length - 1][0]];
                const yRangeSurvival = [survivalLower[0][1], survivalUpper[survivalUpper.length - 1][1]];
                // Hazard
                const hazardResult = survivalHazardResults[1];
                const hazardResults = Object.keys(hazardResult.hazard['NA_estimate'])
                    .map(v => [parseFloat(v), hazardResult.hazard['NA_estimate'][v]])
                    .sort((a, b) => a[0] - b[0]);

                const hazardUpper = Object.keys(hazardResult.confidence['NA_estimate_upper_0.95'])
                    .map(v => [parseFloat(v), hazardResult.confidence['NA_estimate_upper_0.95'][v]])
                    .sort((a, b) => a[0] - b[0]);
                const hazardLower = Object.keys(hazardResult.confidence['NA_estimate_lower_0.95'])
                    .map(v => [parseFloat(v), hazardResult.confidence['NA_estimate_lower_0.95'][v]])
                    .sort((a, b) => a[0] - b[0]);

                const xRangeHazard = [hazardResults[0][0], hazardResults[hazardResults.length - 1][0]];
                const yRangeHazard = [hazardLower[0][1], hazardUpper[hazardUpper.length - 1][1]];

                worker.postMessage({
                    config: config,
                    data: {
                        legendItems: [],
                        result: {
                            survival: [
                                {
                                    name: 'All',
                                    result: survivalResults,
                                    confidence: {
                                        upper: survivalUpper,
                                        lower: survivalLower
                                    },
                                    median: survivalResult.median,
                                    xRangeSurvival: xRangeSurvival,
                                    yRangeSurvival: yRangeSurvival,
                                    p: p
                                }
                            ],
                            hazard: [
                                {
                                    name: 'All',
                                    result: hazardResults,
                                    yRangeHazard: yRangeHazard,
                                    xRangeHazard: xRangeHazard,
                                    confidence: {
                                        upper: hazardUpper,
                                        lower: hazardLower
                                    }
                                }
                            ]
                        }
                    }
                });
                worker.postMessage('TERMINATE');
            });
        });
};
