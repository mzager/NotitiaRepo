import { Vector3, Group } from 'three';

export class Grid extends Group {
  // Shaders
  private fragShader = require('raw-loader!glslify-loader!app/glsl/line.frag');
  private vertShader = require('raw-loader!glslify-loader!app/glsl/line.vert');

  // Position
  private _position: Vector3;
  public get position(): Vector3 {
    return this._position;
  }
  public set position(v: Vector3) {
    this._position = v;
  }

  // Dimension
  private _dimension: Vector3;
  public get dimension(): Vector3 {
    return this._dimension;
  }
  public set dimension(v: Vector3) {
    this._dimension = v;
  }

  // Segments
  private _segments: Vector3;
  public get segments(): Vector3 {
    return this._segments;
  }
  public set segments(v: Vector3) {
    this._segments = v;
  }
  private update(): void {
    // const vertices: Array<Vector3> = [];
    // let delta = 0;
    // if (this.segments.x > 0) {
    //   delta = this.dimension.x
    //   for (let i = 0, l = this.segments.x; i < l; i++) {
    //   }
    // }
  }

  constructor(
    dimension: Vector3 = new Vector3(100, 100, 100),
    segments: Vector3 = new Vector3(10, 10, 10),
    position: Vector3 = new Vector3(0, 0, 0)
  ) {
    super();
    this._dimension = dimension;
    this._segments = segments;
    this._position = position;
    this.update();
  }
}
