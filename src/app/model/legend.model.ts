/**
 * Represents a visual legend
 */

export class Legend {
  name: string;
  type: 'COLOR' | 'SHAPE' | 'SIZE' | 'INTERSECT' | 'IMAGE';
  display: 'CONTINUOUS' | 'DISCRETE';
  labels: Array<string>;
  values: Array<any>;

  get items(): Array<{ label: string, value: string }> {
    console.log('1111');
    return this.labels.map((lbl, i) => ({
      label: lbl,
      value: this.values[i]
    }));
  }
  public static create(name: string, labels: Array<string>,
    values: Array<string>, type: 'COLOR' | 'SHAPE' | 'SIZE' | 'INTERSECT' | 'IMAGE', display: 'CONTINUOUS' | 'DISCRETE'): Legend {
    const l = new Legend();
    l.display = display;
    l.name = name;
    l.type = type;
    l.labels = labels;
    l.values = values;
    return l;
  }
}

// export interface LegendItem {
//   name: string;
//   description?: string;
// }
// export interface DiscreteLegendItem extends LegendItem{
//   labels: Array<string>;
//   values:
// }
