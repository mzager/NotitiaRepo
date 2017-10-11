import { Injectable } from '@angular/core';
import { Memoize } from 'typescript-memoize';
import { GraphEnum, ShapeEnum, SizeEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as THREE from 'three';

export class ChartFactory {

    // Pools
    private static meshPool: Array<THREE.Mesh> = [];
    private static linePool: Array<THREE.Line> = [];

    // Mesh Pool
    public static meshRelease(mesh: THREE.Mesh): void {
        this.meshPool.push(mesh);
    }
    public static meshAllocate(color: number, shape: ShapeEnum, size: number, position: THREE.Vector3, data: any): THREE.Mesh {
        const mesh = (this.meshPool.length > 0) ? this.meshPool.shift() : new THREE.Mesh();
        mesh.geometry = this.getShape(shape);
        mesh.scale.set(size, size, size);
        mesh.position.set(position.x, position.y, position.z);
        mesh.material = this.getColorPhong( color );
        mesh.userData = data;
        return mesh;
    }
    public static meshDrain(): void {
        this.meshPool.length = 0;
    }

    // Line Pool
    public static lineRelease(line: THREE.Line): void {
        
    }
    public static lineAllocate(color: number, pt1: THREE.Vector3, pt2: THREE.Vector3): THREE.Line {
        const line = new THREE.Line();
        const geometry = new THREE.Geometry();
        geometry.vertices.push(pt1);
        geometry.vertices.push(pt2);
        line.geometry = geometry;
        line.material = this.getLineColor(color);
        return line;
    }
    public static lineDrain(): void {
        this.linePool.length = 0;
    }

    @Memoize()
    public static getLineColor(color: number): THREE.LineBasicMaterial {
        return new THREE.LineBasicMaterial({ color: color});
    }

    // @Memoize()
    public static getColorMetal(color: number): THREE.Material {
        return new THREE.MeshStandardMaterial(
            {color: color, emissive: new THREE.Color(0x000000),
             metalness: 0.2, roughness: .5, shading: THREE.SmoothShading});
        // return new THREE.MeshStandardMaterial(
        //     {color: color, emissive: new THREE.Color(0x000000),
        //     metalness: 0.5, roughness: .5, shading: THREE.SmoothShading});
    }

    @Memoize()
    public static getColorPhong(color: number): THREE.Material {
        const rv = new THREE.MeshPhongMaterial({ color: color,
            specular: 0x000000, shininess: 1 });
        return rv;
    }

    @Memoize()
    public static getShape(shape: ShapeEnum): THREE.Geometry {
        switch (shape) {
            case ShapeEnum.CIRCLE:
                return new THREE.SphereGeometry(2, 10, 10);
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
