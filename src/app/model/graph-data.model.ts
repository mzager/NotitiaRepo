import { ShapeEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';

export interface GraphData {
    legendItems: Array<Legend>;
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: any; //Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
