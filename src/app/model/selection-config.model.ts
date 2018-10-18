import { GraphConfig } from 'app/model/graph-config.model';
import { SelectionTypeEnum } from 'app/model/enum.model';

export class SelectionToolConfig {
  public type: SelectionTypeEnum;
  public label: string;
  public data: any;
  static createDefault(): SelectionToolConfig {
    return new SelectionToolConfig(SelectionTypeEnum.LASSO, 'Lasso', {});
  }
  static getToolOptions(config: GraphConfig): Array<SelectionToolConfig> {
    return [
      new SelectionToolConfig(SelectionTypeEnum.LASSO, 'Lasso', {}),
      new SelectionToolConfig(SelectionTypeEnum.KDTREE, 'Brush', {}),
      new SelectionToolConfig(SelectionTypeEnum.HULL, 'Polygon', {})
    ];
  }
  constructor(type: SelectionTypeEnum, label: string, data: any) {
    this.type = type;
    this.label = label;
    this.data = data;
  }
}
