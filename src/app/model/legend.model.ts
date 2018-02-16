/**
 * Represents a visual legend
 */
export class Legend {
  name: string;
  type: 'COLOR' | 'SHAPE' | 'SIZE' | 'INTERSECT';
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
