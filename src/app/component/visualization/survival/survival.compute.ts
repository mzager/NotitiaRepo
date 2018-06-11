import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { Legend } from './../../../model/legend.model';
import { SurvivalConfigModel } from './survival.model';
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
    };

    const formatResult = (data: any, property: string): Array<any> => {
        return Object.keys(data[property])
            .map(v => [parseFloat(v), data[property][v]])
            .sort((a, b) => a[0] - b[0]);
    };

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
    };


    const cohortNames = Array.from(new Set([...config.cohortsToCompare, config.cohortName]));
    Promise.all([
        worker.util.getCohorts(config.database, cohortNames),
        worker.util.getPatients([], config.database, 'patient')
    ]).then(results => {

        // TODO: Fix Setting Time To 1 When null
        const cohorts = results[0];
        const patients = results[1];

        // Extract Events And Times From Patient Data
        const e = patients.map(v => (v.vital_status === 'dead' || v.vital_status === 1) ? 1 : 0);
        const t = patients.map(v => (v.vital_status === 'dead' || v.vital_status === 1) ?
            v.days_to_death : (v.days_to_last_follow_up === undefined) ? v.days_to_last_followup : v.days_to_last_follow_up)
            .map(v => (v === null) ? 1 : Math.max(1, v));
        const p = patients.map((v, i) => ({ p: v.p, e: e[i], t: t[i] }));

        const promises = [];
        const cohortPatientData = [];
        if (cohortNames.indexOf('All Patients') !== -1) {
            promises.push(
                worker.util.fetchResult({
                    method: 'survival_ll_kaplan_meier',
                    times: t,
                    events: e
                })
            );
            cohortPatientData.push({
                name: 'All',
                patients: p
            });
        }

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
                })
            );
        });
        Promise.all(promises).then(survivalData => {
            const survivalResults = [];
            survivalData.forEach((result, i) => {
                survivalResults.push(
                    Object.assign(
                        processSurvival(survivalData[i]),
                        cohortPatientData[i],
                        { color: colors[i] }
                    )
                );
            });

            const legends: Array<Legend> = [
                Legend.create('Cohorts',
                    survivalResults.map(v => v.name),
                    survivalResults.map(v => '#' + (0xffffff + v.color + 1).toString(16).substr(1)),
                    'COLOR', 'DISCRETE')
            ];

            worker.postMessage({
                config: config,
                data: {
                    legends: legends,
                    result: {
                        survival: survivalResults,
                        cohorts: cohortPatientData
                    }
                }
            });
            worker.postMessage('TERMINATE');
        });
    });
};
