import { ComputeWorkerUtil } from './compute.worker.util';
export interface DedicatedWorkerGlobalScope extends Window {
    util: ComputeWorkerUtil;
    postMessage(data: any, transferList?: any): void;
    importScripts(src: string): void;
}
