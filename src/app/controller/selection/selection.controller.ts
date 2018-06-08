import { ChartEvents } from './../../component/workspace/chart/chart.events';
import { VisualizationView } from './../../model/chart-view.model';
import { AbstractMouseController } from './../abstract.mouse.controller';

export class SelectionOptions {

}

export class SelectionController extends AbstractMouseController {

    protected _options; SelectionOptions;

    public get options(): SelectionOptions { return this._options; }
    public set options(value: SelectionOptions) {
        this._options = value;
    }

    public destroy(): void {

    }
    constructor(view: VisualizationView, events: ChartEvents, debounce: number = 10) {
        super(view, events, debounce);
        this._options = {};
    }
}
