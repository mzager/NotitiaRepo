/**
 * Represents a visual legend
 */

export class Legend {

  public static create(name: string, labels: Array<string>, values: Array<string>, type: 'COLOR' | 'SHAPE' | 'SIZE' | 'INTERSECT', display: 'CONTINUOUS' | 'DISCRETE'): Legend {
    const l = new Legend();
    l.display = display;
    l.name = name;
    l.type = type;
    l.labels = labels;
    l.values = values;
    return l;
  }
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
