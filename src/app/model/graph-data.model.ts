import { ShapeEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';

export interface GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;
    legends: Array<Legend>;
}
