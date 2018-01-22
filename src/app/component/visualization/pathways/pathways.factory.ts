import { Injectable } from '@angular/core';
import { Memoize } from 'typescript-memoize';
import { GraphEnum, ShapeEnum, SizeEnum, ColorEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as THREE from 'three';
import { Vector2, Object3D } from 'three';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';

export class PathwayNodeEnum {
    static readonly COMPARTMENT = 'compartment';
    static readonly MACROMOLECULE = 'macromolecule';
    static readonly COMPLEX = 'complex';
    static readonly COMPLEX_MULTIMER = 'complex multimer';
    static readonly SIMPLE_CHEMICAL = 'simple chemical';
    static readonly PROCESS = 'process';
    static readonly UNSPECIFIED_ENTRY = 'unspecified entity';
    static readonly UNIT_OF_INFORMATION = 'unit of information';
}

export class PathwayEdgeEnum {
    static readonly CONSUMPTION = 'consumption';
    static readonly PRODUCTION = 'production';
    static readonly CATALYSIS = 'catalysis';
    static readonly INHIBITION = 'inhibition';
    static readonly STIMULATION = 'stimulation';
}
export class PathwaysFactory {

    public static createEdge( edge: string, start: Vector2, end: Vector2): Object3D {
        console.log(edge);
        switch (edge) {
            case PathwayEdgeEnum.CONSUMPTION:
                return this.createConsumption(start.x, start.y, end.x, end.y);
            case PathwayEdgeEnum.PRODUCTION:
                return this.createEdgeLine(start.x, start.y, end.x, end.y);
            case PathwayEdgeEnum.CATALYSIS:
                return this.createCatalysis(start.x, start.y, end.x, end.y);
            case PathwayEdgeEnum.INHIBITION:
                return this.createInhibition(start.x, start.y, end.x, end.y);
            case PathwayEdgeEnum.STIMULATION:
                return this.createStimulation(start.x, start.y, end.x, end.y);
        }
        return this.createEdgeLine(start.x, start.y, end.x, end.y);
    }
    public static createNode( node: string, w: number, h: number, x: number, y: number): THREE.Shape {
        switch (node) {
            case PathwayNodeEnum.UNSPECIFIED_ENTRY:
            case PathwayNodeEnum.SIMPLE_CHEMICAL:
                return this.createEllipseShape(w, h, x, y);
            case PathwayNodeEnum.PROCESS:
            case PathwayNodeEnum.COMPARTMENT:
            case PathwayNodeEnum.MACROMOLECULE:
                return this.createRoundedRectangleShape( w, h, x, y);
            case PathwayNodeEnum.COMPLEX:
            case PathwayNodeEnum.COMPLEX_MULTIMER:
                return this.createOctagonShape( w, h, x, y);
            case PathwayNodeEnum.UNIT_OF_INFORMATION:
                return this.createRectangleShape( w, h, x, y);
            default:
                return this.createRectangleShape( w, h, x, y);
        }
    }

    private static createRectangleShape(w: number, h: number, x: number, y: number): THREE.Shape {
        const rectShape = new THREE.Shape();
        rectShape.moveTo(x, y);
        rectShape.lineTo(x, y - h);
        rectShape.lineTo(x + w, y - h);
        rectShape.lineTo(x + w, y);
        rectShape.lineTo(x, y);
        return rectShape;
    }

    private static createEllipseShape(w: number, h: number, x: number, y: number): THREE.Shape {
        const ellipsePath = new THREE.EllipseCurve(
            (x + w / 2), (y - h / 2),
            w / 2, h / 2,
            0,  2 * Math.PI,
            false,
            0
        );
        const ellipsePoints = ellipsePath.getPoints(50);
        const ellipseShape = new THREE.Shape(ellipsePoints);
        return ellipseShape;
    }

    private static createOctagonShape(w: number, h: number, x: number, y: number): THREE.Shape {
        const octShape = new THREE.Shape();
        const corner = h / 6;
        octShape.moveTo(x, y - corner);
        octShape.lineTo(x, y - h + corner);
        octShape.lineTo(x + corner, y - h);
        octShape.lineTo(x + w - corner, y - h);
        octShape.lineTo(x + w, y - h + corner);
        octShape.lineTo(x + w, y - corner);
        octShape.lineTo(x + w - corner, y);
        octShape.lineTo(x + corner, y);
        octShape.lineTo(x, y - corner);
        return octShape;
    }

    private static createRoundedRectangleShape(w: number, h: number, x: number, y: number): THREE.Shape {
        const roundedRectShape = new THREE.Shape();
        const radius = h / 6;
        roundedRectShape.moveTo(x, y - radius);
        roundedRectShape.lineTo(x, y - h + radius);
        roundedRectShape.quadraticCurveTo(x, y - h, x + radius, y - h);
        roundedRectShape.lineTo(x + w - radius, y - h);
        roundedRectShape.quadraticCurveTo(x + w, y - h, x + w, y - h + radius);
        roundedRectShape.lineTo(x + w, y - radius);
        roundedRectShape.quadraticCurveTo(x + w, y, x + w - radius, y);
        roundedRectShape.lineTo(x + radius, y);
        roundedRectShape.quadraticCurveTo(x, y, x, y - radius);
        return roundedRectShape;
    }

    private static createEdgeLine(x1, y1, x2, y2): THREE.Group {
        const group = new THREE.Group();
        group.add(ChartFactory.lineAllocate(0x90caf9, new Vector2(x1, y1), new Vector2(x2, y2)));
        return group;
    }
    private static createConsumption(x1, y1, x2, y2): THREE.Group {
        const group = new THREE.Group();
        group.add(ChartFactory.lineAllocate(0xf48fb1, new Vector2(x1, y1), new Vector2(x2, y2)));
        return group;
    }
    private static createCatalysis(x1, y1, x2, y2): THREE.Group {
        const group = new THREE.Group();
        group.add(ChartFactory.lineAllocate(0xb39ddb, new Vector2(x1, y1), new Vector2(x2, y2)));
        const radians = Math.atan2(y2 - y1, x2 - x1);
        const yOff = Math.sin(radians) * 5;
        const xOff = Math.cos(radians) * 5;
        const circle = new THREE.Mesh(
            new THREE.CircleGeometry(5),
            ChartFactory.getColorPhong(0xb39ddb));
            circle.position.x = x1 + xOff;
            circle.position.y = y1 + yOff;
        group.add(circle);
        return group;
    }

    private static createInhibition(x1, y1, x2, y2): THREE.Group {
        const group = new THREE.Group();
        group.add(ChartFactory.lineAllocate(0xa5d6a7, new Vector2(x1, y1), new Vector2(x2, y2)));
        const line = ChartFactory.lineAllocate(0xa5d6a7, new Vector2(-5, 0), new Vector2(5, 0));
        line.position.setX(x1);
        line.position.setY(y1);
        line.rotateZ(Math.atan2(y2 - y1, x2 - x1) + 1.5);
        group.add(line);
        return group;
    }

    private static createStimulation(x1, y1, x2, y2): THREE.Group {
        const group = new THREE.Group();
        const line = ChartFactory.lineAllocate(0xffcc80, new Vector2(x1, y1), new Vector2(x2, y2));
        group.add(line);
        const triangleGeom = new THREE.ShapeGeometry(
            new THREE.Shape([
                new Vector2(0, 0),
                new Vector2(10, -7),
                new Vector2(10, 7),
            ])
        );
        const triangle = new THREE.Mesh(
            triangleGeom,
            ChartFactory.getColorPhong(0xffcc80)
        );
        triangle.position.setX(x1);
        triangle.position.setY(y1);
        triangle.rotateZ(Math.atan2(y2 - y1, x2 - x1));
        group.add(triangle);
        return group;
    }
}
