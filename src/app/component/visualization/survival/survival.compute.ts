import { SurvivalConfigModel } from './survival.model';
import { ChromosomeConfigModel } from './../chromosome/chromosome.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
export const survivalCompute = (config: SurvivalConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    const colors = [0x42a5f5, 0x66bb6a, 0xff9800, 0x795548, 0x673ab7, 0xe91e63];
    const getRange = (pointCollections: Array<any>): Array<any> => {
        const dx = [Infinity, -Infinity];
        const dy = [Infinity, -Infinity];
        pointCollections.forEach(pointCollection => {
            pointCollection.forEach(point => {
                dx[0] = Math.min(dx[0], point[0]);
                dx[1] = Math.max(dx[1], point[0]);
                dy[0] = Math.min(dy[0], point[1]);
                dy[1] = Math.max(dy[1], point[1]);
            });
        });
        return [dx, dy];
    }
    const formatResult = (data: any, property: string): Array<any> => {
        return Object.keys(data[property])
            .map(v => [parseFloat(v), data[property][v]])
            .sort((a, b) => a[0] - b[0]);
    }
    const processHazard = (result: any): any => {
        const line = formatResult(result.hazard, 'NA_estimate');
        const upper = formatResult(result.confidence, 'NA_estimate_upper_0.95');
        const lower = formatResult(result.confidence, 'NA_estimate_lower_0.95');
        const range = getRange([line, upper, lower]);
        return {
            line: line,
            upper: upper,
            lower: lower,
            range: range
        };
    }
    const processSurvival = (result: any): any => {
        const line = formatResult(result.result, 'KM_estimate');
        const upper = formatResult(result.confidence, 'KM_estimate_upper_0.95');
        const lower = formatResult(result.confidence, 'KM_estimate_lower_0.95');
        const range = getRange([line, upper, lower]);
        return {
            line: line,
            upper: upper,
            lower: lower,
            range: range
        };
    }
    Promise.all([
        worker.util.getCohorts(config.database),
        worker.util.getPatients([], config.database, 'patient')
    ]).then(results => {

        // TODO: Fix Setting Time To 1 When null
        const cohorts = results[0];
        const patients = results[1];
        const e = patients.map(v => (v.vital_status === 'dead') ? 1 : 0);
        const t = patients.map(v => (v.vital_status === 'dead') ?
            v.days_to_death : v.days_to_last_follow_up)
            .map(v => (v === null) ? 1 : Math.max(1, v));
        const p = patients.map((v, i) => ({ p: v.p, e: e[i], t: t[i] }));


        const promises = [
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
        ];

        const cohortPatientData = [{
            name: 'All',
            patients: p
        }];

        cohorts.forEach(cohort => {
            const cohortSet = new Set(cohort.pids);
            const cohortPatients = p.filter(v => cohortSet.has(v.p));
            const cohortEvents = cohortPatients.map(v => v.e);
            const cohortTimes = cohortPatients.map(v => v.t);
            cohortPatientData.push({
                name: cohort.n,
                patients: cohortPatients
            });
            promises.push(
                worker.util.fetchResult({
                    method: 'survival_ll_kaplan_meier',
                    times: cohortTimes,
                    events: cohortEvents
                }),
                worker.util.fetchResult({
                    method: 'survival_ll_nelson_aalen',
                    times: cohortTimes,
                    events: cohortEvents
                })
            );
        });
        debugger;
        Promise.all(promises).then(survivalHazardResults => {

            debugger;
            const survivalResults = [];
            const hazardResults = [];
            survivalHazardResults.forEach((result, i) => {
                if (i % 2) {
                    const x = cohortPatientData;
                    hazardResults.push(
                        Object.assign(
                            processHazard(survivalHazardResults[i]),
                            cohortPatientData[Math.ceil(i / 2)],
                            { color: colors[Math.ceil(i / 2)] }
                        )
                    );
                } else {
                    survivalResults.push(
                        Object.assign(
                            processSurvival(survivalHazardResults[i]),
                            cohortPatientData[Math.ceil(i / 2)],
                            { color: colors[Math.ceil(i / 2)] }

                        )
                    );
                }
            });

            worker.postMessage({
                config: config,
                data: {
                    legendItems: [],
                    result: {
                        survival: survivalResults,
                        hazard: hazardResults
                    }
                }
            });
            worker.postMessage('TERMINATE');
        });
    });
};
