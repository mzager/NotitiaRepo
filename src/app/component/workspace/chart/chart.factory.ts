import { EntityTypeEnum } from './../../../model/enum.model';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { Injectable } from '@angular/core';
import memoize from 'memoize-decorator';
import { GraphEnum, ShapeEnum, SizeEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as THREE from 'three';
import { Vector3, Vector2, Shading, SmoothShading, Geometry } from 'three';
import * as scale from 'd3-scale';
import { schemeRdBu, interpolateRdBu, interpolateSpectral } from 'd3-scale-chromatic';
export class ChartFactory {

    private static meshPool: Array<THREE.Mesh> = [];
    private static linePool: Array<THREE.Line> = [];
    public static shader = {
        'outline': {
            'vertex_shader': [
                'uniform float offset;',
                'void main() {',
                'vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );',
                'gl_Position = projectionMatrix * pos;',
                '}'
            ].join('\n'),

            fragment_shader: [
                'void main(){',
                'gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );',
                '}'
            ].join('\n')
        }
    };

    public static sizes = [SizeEnum.S, SizeEnum.M, SizeEnum.L, SizeEnum.XL];
    public static shapes = [ShapeEnum.CIRCLE, ShapeEnum.BOX, ShapeEnum.SQUARE, ShapeEnum.CONE];
    public static colors = [0xb71c1c, 0x880e4f, 0x4a148c, 0x311b92, 0x1a237e, 0x0d47a1, 0x01579b, 0x006064,
        0x004d40, 0x1b5e20, 0x33691e, 0x827717, 0xf57f17, 0xff6f00, 0xe65100, 0xbf360c, 0x3e2723,
        0xf44336, 0xe91e63, 0x9c27b0, 0x673ab7, 0x3f51b5, 0x2196f3, 0x03a9f4, 0x00bcd4, 0x009688,
        0x4caf50, 0x8bc34a, 0xcddc39, 0xffeb3b, 0xffc107, 0xff9800, 0xff5722, 0x795548];

    public static getScaleSizeOrdinal(values: Array<string>): Function {
        const len = values.length;
        return scale.scaleOrdinal().domain(values).range(ChartFactory.sizes.filter((v, i) => i < len));
    }
    public static getScaleSizeLinear(min: number, max: number): Function {
        return scale.scaleLinear().domain([min, max]).range([1, 3]).clamp(true);
    }
    public static getScaleShapeOrdinal(values: Array<string>): Function {
        const len = values.length;
        return scale.scaleOrdinal().domain(values).range(ChartFactory.shapes.filter((v, i) => i < len));
    }
    public static getScaleColorOrdinal(values: Array<string>): Function {
        const len = values.length;
        return scale.scaleOrdinal().domain(values).range(ChartFactory.colors.filter((v, i) => i < len));
    }

    // The most cleaver functon in oncoscape
    public static getScaleColorLinear(min: number, max: number): Function {
        const scaleFn = scale.scaleSequential<string>(interpolateSpectral).domain([min, max]);
        return (input) => {
            const v = scaleFn(input);
            const c = v.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            // tslint:disable-next-line:radix
            return parseInt('0x' + (parseInt(c[1]) << 16 | parseInt(c[2]) << 8 | parseInt(c[3])).toString(16).toUpperCase());
        };
    }

    // Pools
    public static createDataGroup(id: string, idType: EntityTypeEnum, position: Vector3): THREE.Group {
        const group = new THREE.Group();
        group.position.set(position.x, position.y, position.z);
        group.userData.id = id;
        group.userData.idType = idType;
        group.userData.tooltip = 'ID: ' + id;
        return group;
    }
    public static decorateDataGroups(groups: Array<THREE.Group>, decorators: Array<DataDecorator>): void {

        // Retrieve Id
        if (groups.length === 0) { return; }
        const idType = groups[0].userData.idType;
        const idProperty = (idType === EntityTypeEnum.PATIENT) ? 'pid' :
            (idType === EntityTypeEnum.SAMPLE) ? 'sid' : 'mid';

        // Decorators
        const shapeDecorator = decorators.filter(decorator => decorator.type === DataDecoratorTypeEnum.SHAPE);
        const colorDecorator = decorators.filter(decorator => decorator.type === DataDecoratorTypeEnum.COLOR);
        const sizeDecorator = decorators.filter(decorator => decorator.type === DataDecoratorTypeEnum.SIZE);
        const selectDecorator = decorators.filter(decorator => decorator.type === DataDecoratorTypeEnum.SELECT);
        const tooltipDecorator = decorators.filter(decorator => decorator.type === DataDecoratorTypeEnum.TOOLTIP);

        // Maps
        const shapeMap = (!shapeDecorator.length) ? null : shapeDecorator[0].values.reduce((p, c) => {
            p[c[idProperty]] = c.value;
            return p;
        }, {});
        const colorMap = (!colorDecorator.length) ? null : colorDecorator[0].values.reduce((p, c) => {
            p[c[idProperty]] = c.value;
            return p;
        }, {});
        const sizeMap = (!sizeDecorator.length) ? null : sizeDecorator[0].values.reduce((p, c) => {
            p[c[idProperty]] = c.value;
            return p;
        }, {});

        groups.forEach(group => {
            while (group.children.length) {
                group.remove(group.children[0]);
            }
            const id = group.userData.id;
            const shape = this.getShape((shapeMap) ? shapeMap[id] : ShapeEnum.CIRCLE);
            const color = (colorMap) ? colorMap[id] : 0x039be5;
            const material = this.getColorPhong(color);
            material.opacity = 0.8;
            material.transparent = true;
            const scale = (sizeMap) ? sizeMap[id] : 1;
            shape.scale(scale, scale, scale);
            const mesh: THREE.Mesh = new THREE.Mesh(shape, material);
            mesh.userData.tooltip = id;
            mesh.userData.color = color;
            group.add(mesh);
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
            fragmentShader: outShader.fragment_shader,
        });
    }

    // --------------------- Old ------------------------ //

    // Mesh Pool
    public static meshRelease(mesh: THREE.Mesh): void {
        mesh.userData = null;
        this.meshPool.push(mesh);
    }
    public static meshAllocate(color: number, shape: ShapeEnum, size: number, position: THREE.Vector3, data: any): THREE.Mesh {
        const mesh = (this.meshPool.length > 0) ? this.meshPool.shift() : new THREE.Mesh();
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

    // Line Pool
    public static lineRelease(line: THREE.Line): void {

    }
    public static lineAllocateCurve(color: number, pt1: THREE.Vector2, pt2: THREE.Vector2, pt3: THREE.Vector2): THREE.Line {
        const line = new THREE.Line();
        line.material = this.getLineColor(color);
        const curve = new THREE.SplineCurve([pt1, pt3, pt2]);
        const path = new THREE.Path(curve.getPoints(50));

        const pts = path.getPoints();

        const geometry = new THREE.BufferGeometry().setFromPoints(pts);

        line.geometry = geometry;
        // line.geometry = path.createPointsGeometry(50);
        return line;
    }

    public static meshLineAllocate(color: number, pt1: THREE.Vector2, pt2: THREE.Vector2, camera: any, data?: any): MeshLine {
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
    public static lineAllocate(color: number, pt1: THREE.Vector2, pt2: THREE.Vector2, data?: any): THREE.Line {
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

    // @memoize()
    public static getLineColor(color: number): THREE.LineBasicMaterial {
        return new THREE.LineBasicMaterial({ color: color });
    }

    // @memoize()
    public static getColorMetal(color: number): THREE.Material {
        return new THREE.MeshStandardMaterial(
            {
                color: color, emissive: new THREE.Color(0x000000),
                metalness: 0.2, roughness: .5
            });

        // return new THREE.MeshStandardMaterial(
        //     {color: color, emissive: new THREE.Color(0x000000),
        //     metalness: 0.5, roughness: .5, shading: THREE.SmoothShading});
    }


    // @memoize()
    public static getOutlineShader(cameraPosition: Vector3, color: number = 0xff0000): THREE.ShaderMaterial {
        // const shader = {
        //     'outline' : {
        //         'vertex_shader': [
        //             'uniform float offset;',
        //             'void main() {',
        //             'vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );',
        //             'gl_Position = projectionMatrix * pos;',
        //             '}'
        //         ].join('\n'),
        //         'fragment_shader': [ 'void main(){',
        //         'gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );',
        //     '}'].join('\n')
        //     }
        // };
        // const uniforms = {
        //     'offset': {
        //         'type': 'f',
        //         'value': 1
        //     }
        // };
        const shader = {
            'glow': {
                'vertex_shader': [
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
                'fragment_shader': [
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
            'c': { type: 'f', value: 1.0 },
            'p': { type: 'f', value: 1.4 },
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

    // @memoize()
    public static getColor(color: number): THREE.Color {
        return new THREE.Color(color);
    }
    // @memoize()
    public static getColorBasic(color: number): THREE.Material {
        return new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
    }

    // @memoize()
    public static getColorPhong(color: number): THREE.Material {
        return new THREE.MeshStandardMaterial(
            {
                color: color,
                roughness: 0.0,
                metalness: 0.02,
                emissive: new THREE.Color(0x000000)
                // color: color, emissive: new THREE.Color(0x000000),
                // metalness: 0.2, roughness: .5, shading: THREE.SmoothShading
            });

        // const rv = new THREE.MeshPhongMaterial({
        //     specular: 0xAAAAAA, shininess: .5
        // });
        // rv.color.set( new THREE.Color( color ) );
        // return rv;
    }
    public static getColorHighlight(color: number): THREE.Material {
        return new THREE.MeshStandardMaterial(
            {
                color: color,
                roughness: 0.0,
                metalness: 0.02,
                emissive: new THREE.Color(0x000000)
                // color: color, emissive: new THREE.Color(0x000000),
                // metalness: 0.2, roughness: .5, shading: THREE.SmoothShading
            });

        // const rv = new THREE.MeshPhongMaterial({
        //     specular: 0xAAAAAA, shininess: .5
        // });
        // rv.color.set( new THREE.Color( color ) );
        // return rv;
    }

    // @memoize()
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
}
