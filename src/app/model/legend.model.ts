/**
 * Represents a visual legend
 */
export class Legend {
  name: String;
  type: 'COLOR' | 'SHAPE' | 'SIZE';
  display: 'CONTINUOUS' | 'DISCRETE';
  labels: Array<string>;
  values: Array<any>;
}

// export interface LegendItem {
//   name: string;
//   description?: string;
// }
// export interface DiscreteLegendItem extends LegendItem{
//   labels: Array<string>;
//   values: 
// }
