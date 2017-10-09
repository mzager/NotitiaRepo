/**
 * Represents a visual legend
 */
import { ColorEnum, ShapeEnum, SizeEnum } from '../model/enum.model';
export interface Legend {
  name: String;
  type: 'COLOR' | 'SHAPE' | 'SIZE';
  legendItems: Array<LegendItem>;
}
export interface LegendItem {
  name: string;
  description?: string;
  value: any; //ColorEnum | ShapeEnum | SizeEnum;
  type?: 'COLOR' | 'SHAPE' | 'SIZE';
}
