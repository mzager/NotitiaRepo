import { EntityTypeEnum } from './../../../model/enum.model';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { Injectable } from '@angular/core';
import memoize from 'memoize-decorator';
import { GraphEnum, ShapeEnum, SizeEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as THREE from 'three';
import { Vector3, Vector2, Shading, SmoothShading } from 'three';

export class ChartFactory {

    // Pools
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

    public static getMesh(id: string, idType: EntityTypeEnum, decorators: Array<DataDecorator>, 
        objVector: Vector3, cameraVector: Vector3): THREE.Group {
        const group = new THREE.Group();
        group.position.set(objVector.x, objVector.y, objVector.z);
        // const selectDecorator = decorators.filter(v => v.type === DataDecoratorTypeEnum.SELECT);
        // const shapeDecorator = decorators.filter(v => v.type === DataDecoratorTypeEnum.SHAPE);
        // const sizeDecorator = decorators.filter(v => v.type === DataDecoratorTypeEnum.SIZE);
        // const tipDecorator = decorators.filter(v => v.type === DataDecoratorTypeEnum.TOOLTIP);

        const shape = this.getShape(ShapeEnum.CIRCLE);
        const point = new THREE.Mesh(shape, this.getColorPhong(0x039be5));
        // const outline = new THREE.Mesh(shape, this.getOutlineShader(cameraVector, 0xFF0000));
        // outline.material.depthWrite = false;
        // outline.quaternion.set(point.quaternion.x, point.quaternion.y, point.quaternion.z, point.quaternion.w);
        group.add(point);
        // group.add(outline);
        return group;
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
