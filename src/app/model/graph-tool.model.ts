/**
 * Represents The Active Tool
 */
import { GraphEnum, ToolEnum } from '../model/enum.model';
export interface GraphTool {
  graph: GraphEnum;
  tool: ToolEnum;
};