import { ShapeEnum, SizeEnum } from 'app/model/enum.model';
import * as scale from 'd3-scale';
import * as THREE from 'three';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { EntityTypeEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { VisualizationView } from './../../../service/chart-view.model';

export type DataDecoatorRenderer = (
  group: THREE.Group,
  mesh: THREE.Sprite,
  decorators: Array<DataDecorator>,
  index: number,
  count: number
) => void;

export class ChartFactory {
  private static meshPool: Array<THREE.Mesh> = [];
  private static linePool: Array<THREE.Line> = [];
  public static shader = {
    outline: {
      vertex_shader: [
        'uniform float offset;',
        'void main() {',
        'vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );',
        'gl_Position = projectionMatrix * pos;',
        '}'
      ].join('\n'),

      fragment_shader: ['void main(){', 'gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );', '}'].join(
        '\n'
      )
    }
  };
  public static sizes = [SizeEnum.S, SizeEnum.M, SizeEnum.L, SizeEnum.XL];
  public static shapes = [ShapeEnum.CIRCLE, ShapeEnum.BOX, ShapeEnum.SQUARE, ShapeEnum.CONE];
  public static colors = [
    0xd81b60,
    0x3949ab,
    0x43a047,
    0xffb300,
    0x6d4c41,
    0xf44336,
    0x9c27b0,
    0x2196f3
  ];
  public static colorsContinuous = [
    '#e53935',
    '#d81b60',
    '#8e24aa',
    '#5e35b1',
    '#3949ab',
    '#1e88e5',
    '#039be5',
    '#00acc1',
    '#00897b',
    '#43a047'
  ];
  // public static shapes = ['blast', 'blob', 'circle', 'diamond', 'polygon', 'square', 'star', 'triangle'];
  private static sprites = [
    SpriteMaterialEnum.CIRCLE,
    SpriteMaterialEnum.TRIANGLE,
    SpriteMaterialEnum.DIAMOND,
    SpriteMaterialEnum.POLYGON,
    SpriteMaterialEnum.SQUARE,
    SpriteMaterialEnum.STAR,
    SpriteMaterialEnum.BLAST,
    SpriteMaterialEnum.BLOB
  ];

  public static textures = {
    blast: new THREE.TextureLoader().load('assets/shapes/shape-blast-solid.png'),
    blob: new THREE.TextureLoader().load('assets/shapes/shape-blob-solid.png'),
    circle: new THREE.TextureLoader().load('assets/shapes/shape-circle-solid.png'),
    diamond: new THREE.TextureLoader().load('assets/shapes/shape-diamond-solid.png'),
    polygon: new THREE.TextureLoader().load('assets/shapes/shape-polygon-solid.png'),
    square: new THREE.TextureLoader().load('assets/shapes/shape-square-solid.png'),
    star: new THREE.TextureLoader().load('assets/shapes/shape-star-solid.png'),
    triangle: new THREE.TextureLoader().load('assets/shapes/shape-triangle-solid.png'),
    na: new THREE.TextureLoader().load('assets/shapes/shape-na-solid.png')
  };

  public static getScaleSizeOrdinal(values: Array<string>): Function {
    const len = values.length;
    return scale
      .scaleOrdinal()
      .domain(values)
      .range(ChartFactory.sizes.slice(0, values.length));
  }

  public static getScaleSizeLinear(min: number, max: number): Function {
    return scale
      .scaleLinear()
      .domain([min, max])
      .range([1, 3])
      .clamp(true);
  }
  public static getScaleShapeOrdinal(values: Array<string>): Function {
    const len = values.length;
    const cols = ChartFactory.sprites.slice(0, values.length);
    return scale
      .scaleOrdinal()
      .domain(values)
      .range(cols);
  }
  public static getScaleShapeLinear(min: number, max: number, bins: number = 0): Function {
    bins = Math.min(bins, 8);
    const range = ChartFactory.sprites.slice(0, bins);
    return scale
      .scaleQuantize<string>()
      .domain([min, max])
      .range(range);
  }
  public static getScaleGroupOrdinal(values: Array<string>): Function {
    const range = Array.from({ length: values.length }, (v, k) => (k + 1).toString());
    return scale
      .scaleOrdinal()
      .domain(values)
      .range(range);
  }
  public static getScaleGroupLinear(min: number, max: number, bins: number = 0): Function {
    bins = Math.min(bins, 8);
    const range = Array.from({ length: bins }, (v, k) => (k + 1).toString());
    return scale
      .scaleQuantize<string>()
      .domain([min, max])
      .range(range);
  }
  public static getScaleColorOrdinal(values: Array<string>): Function {
    const len = values.length;
    const cols =
      len > 4
        ? ChartFactory.colors.slice(0, values.length)
        : ChartFactory.colors.filter((c, i) => i % 2).slice(0, values.length);
    return scale
      .scaleOrdinal()
      .domain(values)
      .range(cols);
  }
  public static getScaleColorLinear(min: number, max: number, bins: number = 8): Function {
    bins = Math.min(bins, 8);
    const range =
      bins > 4
        ? ChartFactory.colorsContinuous.slice(0, bins)
        : ChartFactory.colorsContinuous.filter((c, i) => i % 2).slice(0, bins);
    return scale
      .scaleQuantize<string>()
      .domain([min, max])
      .range(range);
  }

  // Pools
  public static createDataGroup(
    id: string,
    idType: EntityTypeEnum,
    position: Vector3
  ): THREE.Group {
    const group = new THREE.Group();
    group.position.set(position.x, position.y, position.z);
    group.userData.id = id;
    group.userData.idType = idType;
    group.userData.tooltip = id;
    return group;
  }
  public static decorateDataGroups(
    groups: Array<THREE.Group>,
    decorators: Array<DataDecorator>,
    renderer: DataDecoatorRenderer = null,
    scaleFactor: number = 2
  ): void {
    // Retrieve Id
    if (groups.length === 0) {
      return;
    }
    const idType = groups[0].userData.idType;
    const idProperty =
      idType === EntityTypeEnum.PATIENT ? 'pid' : idType === EntityTypeEnum.SAMPLE ? 'sid' : 'mid';

    // Decorators
    const shapeDecorator = decorators.filter(
      decorator => decorator.type === DataDecoratorTypeEnum.SHAPE
    );
    const colorDecorator = decorators.filter(
      decorator => decorator.type === DataDecoratorTypeEnum.COLOR
    );
    const sizeDecorator = decorators.filter(
      decorator => decorator.type === DataDecoratorTypeEnum.SIZE
    );
    const selectDecorator = decorators.filter(
      decorator => decorator.type === DataDecoratorTypeEnum.SELECT
    );
    const labelDecorator = decorators.filter(
      decorator => decorator.type === DataDecoratorTypeEnum.LABEL
    );
    const groupDecorator = decorators.filter(
      decorator => decorator.type === DataDecoratorTypeEnum.GROUP
    );
    // const tooltipDecorator = decorators.filter(decorator => decorator.type === DataDecoratorTypeEnum.TOOLTIP);

    // Maps
    const shapeMap = !shapeDecorator.length
      ? null
      : shapeDecorator[0].values.reduce((p, c) => {
          p[c[idProperty]] = c.value;
          return p;
        }, {});
    const colorMap = !colorDecorator.length
      ? null
      : colorDecorator[0].values.reduce((p, c) => {
          p[c[idProperty]] = c.value;
          return p;
        }, {});

    const labelMap = !labelDecorator.length
      ? null
      : labelDecorator[0].values.reduce((p, c) => {
          p[c[idProperty]] = c.value;
          return p;
        }, {});

    const groupMap = !groupDecorator.length
      ? null
      : groupDecorator[0].values.reduce((p, c) => {
          p[c[idProperty]] = c.value;
          return p;
        }, {});

    // const sizeMap = (!sizeDecorator.length) ? null : sizeDecorator[0].values.reduce((p, c) => {
    //     p[c[idProperty]] = c.value;
    //     return p;
    // }, {});
    const count = groups.length;
    groups.forEach((item, i) => {
      while (item.children.length) {
        item.remove(item.children[0]);
      }
      const id = item.userData.id;
      const color = colorMap ? (colorMap[id] ? colorMap[id] : '#DDDDDD') : '#039be5';
      const label = labelMap ? (labelMap[id] ? labelMap[id] : 'NA') : '';
      const shape = shapeMap
        ? shapeMap[id]
          ? shapeMap[id]
          : SpriteMaterialEnum.NA
        : SpriteMaterialEnum.CIRCLE;
      const group = groupMap ? (groupMap[id] ? groupMap[id] : 0) : 0;

      const spriteMaterial = ChartFactory.getSpriteMaterial(shape, color);
      spriteMaterial.opacity = 0.8;
      const mesh: THREE.Sprite = new THREE.Sprite(spriteMaterial);
      item.userData.tooltip = label;
      item.userData.color = isNaN(color) ? parseInt(color.replace(/^#/, ''), 16) : color;
      mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
      mesh.userData.tooltip = label;
      mesh.userData.color = item.userData.color;
      mesh.userData.selectionLocked = false;
      if (renderer) {
        renderer(item, mesh, decorators, i, count);
      }
      item.add(mesh);
    });
  }

  public static getOutlineMaterial(): THREE.ShaderMaterial {
    const uniforms = {
      offset: {
        type: 'f',
        value: 1
      }
    };
    const outShader = ChartFactory.shader.outline;
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: outShader.vertex_shader,
      fragmentShader: outShader.fragment_shader
    });
  }

  // --------------------- Old ------------------------ //

  // Mesh Pool
  public static meshRelease(mesh: THREE.Mesh): void {
    mesh.userData = null;
    this.meshPool.push(mesh);
  }
  public static meshAllocate(
    color: number,
    shape: ShapeEnum,
    size: number,
    position: THREE.Vector3,
    data: any
  ): THREE.Mesh {
    const mesh = this.meshPool.length > 0 ? this.meshPool.shift() : new THREE.Mesh();
    mesh.geometry = this.getShape(shape);
    mesh.scale.set(size, size, size);
    mesh.position.set(position.x, position.y, position.z);
    mesh.material = this.getColorPhong(color);
    mesh.userData = data;
    return mesh;
  }
  public static meshDrain(): void {
    this.meshPool.length = 0;
  }

  public static planeAllocate(color: number, width: number, height: number, data): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(width, height);
    const material = this.getColorPhong(color);
    return new THREE.Mesh(geo, material);
  }

  public static lineRelease(line: THREE.Line): void {}
  public static lineAllocateCurve(
    color: number,
    pt1: THREE.Vector2,
    pt2: THREE.Vector2,
    pt3: THREE.Vector2
  ): THREE.Line {
    const line = new THREE.Line();
    line.material = this.getLineColor(color);
    const curve = new THREE.SplineCurve([pt1, pt3, pt2]);
    const path = new THREE.Path(curve.getPoints(50));
    const pts = path.getPoints().map(v => new Vector3(v.x, v.y, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    line.geometry = geometry;
    return line;
  }

  public static meshLineAllocate(
    color: number,
    pt1: THREE.Vector2,
    pt2: THREE.Vector2,
    camera: any,
    data?: any
  ): MeshLine {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(pt1.x, pt1.y, 0));
    geometry.vertices.push(new THREE.Vector3(pt2.x, pt2.y, 0));
    const line = new MeshLine();
    line.setGeometry(geometry);
    const material = new MeshLineMaterial({
      useMap: false,
      color: new THREE.Color(color),
      opacity: 1,
      // resolution: resolution,
      // sizeAttenuation: !false,
      lineWidth: 2,
      near: camera.near,
      far: camera.far
    });
    return new THREE.Mesh(line.geometry, material);
  }
  public static linesAllocate(color: number, pts: Array<THREE.Vector2>, data: any): THREE.Line {
    const line = new THREE.Line();
    line.material = this.getLineColor(color);
    line.userData = data;
    const geometry = new THREE.Geometry();
    geometry.vertices.push(...pts.map(v => new THREE.Vector3(v.x, v.y, 0)));
    line.geometry = geometry;
    return line;
  }
  public static lineAllocate(
    color: number,
    pt1: THREE.Vector2,
    pt2: THREE.Vector2,
    data?: any
  ): THREE.Line {
    const line = new THREE.Line();
    line.material = this.getLineColor(color);
    line.userData = data;
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(pt1.x, pt1.y, 0));
    geometry.vertices.push(new THREE.Vector3(pt2.x, pt2.y, 0));
    line.geometry = geometry;
    return line;
  }
  public static lineDrain(): void {
    this.linePool.length = 0;
  }

  // @memoize
  public static getLineColor(color: number): THREE.LineBasicMaterial {
    return new THREE.LineBasicMaterial({ color: color });
  }
  // @memoize
  public static getMeshLine(color: number, lineWidth: number = 2): MeshLineMaterial {
    return new MeshLineMaterial({ color: new THREE.Color(color), lineWidth: lineWidth });
  }

  // @memoize
  public static getColorMetal(color: number): THREE.Material {
    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: new THREE.Color(0x000000),
      metalness: 0.2,
      roughness: 0.5
    });
  }

  public static getOutlineShader(
    cameraPosition: Vector3,
    color: number = 0xff0000
  ): THREE.ShaderMaterial {
    const shader = {
      glow: {
        vertex_shader: [
          'uniform vec3 viewVector;',
          'uniform float c;',
          'uniform float p;',
          'varying float intensity;',
          'void main() ',
          '{',
          'vec3 vNormal = normalize( normalMatrix * normal );',
          'vec3 vNormel = normalize( normalMatrix * viewVector );',
          'intensity = pow( c - dot(vNormal, vNormel), p );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          '}'
        ].join('\n'),
        fragment_shader: [
          'uniform vec3 glowColor;',
          'varying float intensity;',
          'void main() ',
          '{',
          'vec3 glow = glowColor * intensity;',
          'gl_FragColor = vec4( glow, 1.0 );',
          '}'
        ].join('\n')
      }
    };
    const uniforms = {
      c: { type: 'f', value: 1.0 },
      p: { type: 'f', value: 1.4 },
      glowColor: { type: 'c', value: new THREE.Color(color) },
      viewVector: { type: 'v3', value: cameraPosition }
    };

    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.glow.vertex_shader,
      fragmentShader: shader.glow.fragment_shader,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
      transparent: true
    });
  }

  // @memoize
  public static getColor(color: number): THREE.Color {
    return new THREE.Color(color);
  }

  // @memoize
  public static getColorBasic(color: number): THREE.Material {
    return new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });
  }

  // @memoize
  public static getColorPhong(color: number): THREE.Material {
    return new THREE.MeshBasicMaterial({
      color: color
    });
    // return new THREE.MeshStandardMaterial(
    //     {
    //         color: color,
    //         roughness: 0.0,
    //         metalness: 0.02,
    //         emissive: new THREE.Color(0x000000)
    //         // color: color, emissive: new THREE.Color(0x000000),
    //         // metalness: 0.2, roughness: .5, shading: THREE.SmoothShading
    //     });
  }

  // @memoize
  public static getSpriteMaterial(shape: SpriteMaterialEnum, color: number): THREE.SpriteMaterial {
    switch (shape) {
      case SpriteMaterialEnum.BLAST:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.blast, color: color });
      case SpriteMaterialEnum.BLOB:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.blob, color: color });
      case SpriteMaterialEnum.CIRCLE:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.circle, color: color });
      case SpriteMaterialEnum.DIAMOND:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.diamond, color: color });
      case SpriteMaterialEnum.POLYGON:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.polygon, color: color });
      case SpriteMaterialEnum.SQUARE:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.square, color: color });
      case SpriteMaterialEnum.STAR:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.star, color: color });
      case SpriteMaterialEnum.TRIANGLE:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.triangle, color: color });
      case SpriteMaterialEnum.NA:
        return new THREE.SpriteMaterial({ map: ChartFactory.textures.na, color: color });
    }
    return new THREE.SpriteMaterial({ map: ChartFactory.textures.na, color: color });
  }

  // @memoize
  public static getShape(shape: ShapeEnum): THREE.Geometry {
    switch (shape) {
      case ShapeEnum.BOX:
        return new THREE.BoxGeometry(3, 3, 3);
      case ShapeEnum.CIRCLE:
        return new THREE.SphereGeometry(3, 15, 15);
      case ShapeEnum.SQUARE:
        return new THREE.CubeGeometry(3, 3, 3);
      case ShapeEnum.TRIANGLE:
        return new THREE.TetrahedronGeometry(3);
      case ShapeEnum.CONE:
        return new THREE.ConeGeometry(3, 3, 10, 10);
      default:
        return new THREE.TorusGeometry(2);
    }
  }

  public static configPerspectiveOrbit(view: VisualizationView, box: THREE.Box3): void {
    const perspective = view.camera as PerspectiveCamera;
    const orbit = view.controls as OrbitControls;
    const fovyR = (perspective.fov * Math.PI) / 180;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const modelHeight = sphere.radius;
    const zPosition = modelHeight / 2 / Math.tan(fovyR / 2);
    const distance = zPosition;
    orbit.minDistance = -distance * 0.5;
    orbit.maxDistance = distance * 2;
    perspective.position.z = distance * 2;
    perspective.lookAt(0, 0, 0);
    perspective.updateProjectionMatrix();
  }
}
