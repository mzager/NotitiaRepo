import { Injectable } from '@angular/core';
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
    static readonly PORT = 'port';
    static readonly NOT = 'not';
    static readonly AND = 'and';
    static readonly OR = 'or';
    static readonly STATE_VARIABLE = 'state variable';


}

export class PathwayEdgeEnum {
    static readonly CONSUMPTION = 'consumption';
    static readonly PRODUCTION = 'production';
    static readonly CATALYSIS = 'catalysis';
    static readonly INHIBITION = 'inhibition';
    static readonly STIMULATION = 'stimulation';
}
export class PathwaysFactory {

    public static createEdge(edge: any): Object3D {
        const start = new Vector2(edge.start.x, edge.start.y);
        const end = new Vector2(edge.end.x, edge.end.y);

        const dim = (edge.start.hasOwnProperty('w')) ?
            new Vector2(edge.start.w, edge.start.h) :
            new Vector2(48, 25);

        const radians = Math.atan2(end.y - start.y, end.x - start.x);
        const offset = new Vector2(
            Math.cos(radians) * dim.x * .5,
            Math.sin(radians) * dim.y * .5
        )
        // console.log('!!' + edge.class)
        switch (edge.class) {
            case PathwayEdgeEnum.CONSUMPTION:
                return this.createConsumption(start.x, start.y, end.x, end.y, offset.x, offset.y);
            case PathwayEdgeEnum.PRODUCTION:
                return this.createProduction(start.x, start.y, end.x, end.y, offset.x, offset.y);
            case PathwayEdgeEnum.CATALYSIS:
                return this.createCatalysis(start.x, start.y, end.x, end.y, offset.x, offset.y);
            case PathwayEdgeEnum.INHIBITION:
                return this.createInhibition(start.x, start.y, end.x, end.y, offset.x, offset.y);
            case PathwayEdgeEnum.STIMULATION:
                return this.createStimulation(start.x, start.y, end.x, end.y, offset.x, offset.y);
        }
        // console.log('!!' + edge.class)
        return this.createEdgeLine(start.x, start.y, end.x, end.y, offset.x, offset.y);
    }
    public static createNode(node: string, w: number, h: number, x: number, y: number): THREE.Shape {
        //return this.createOctagonShape(w, h, x, y);
        // return this.createRoundedRectangleShape(w, h, x, y);
        // return this.createRectangleShape(w, h, x, y);
        // return this.createEllipseShape(w, h, x, y);
        // console.log('---' + node)
        switch (node) {
            case PathwayNodeEnum.COMPARTMENT:
                this.createRoundedRectangleShape(w, h, x, y);
            case PathwayNodeEnum.SIMPLE_CHEMICAL:
                return this.createEllipseShape(20, 20, x, y);
            case PathwayNodeEnum.MACROMOLECULE:
                return this.createRoundedRectangleShape(30, 20, x, y);
            case PathwayNodeEnum.PROCESS:
                return this.createRoundedRectangleShape(12, 12, x, y);
            case PathwayNodeEnum.PORT:
                return this.createRoundedRectangleShape(10, 10, x, y);
            case PathwayNodeEnum.NOT:
            case PathwayNodeEnum.AND:
            case PathwayNodeEnum.OR:
                return this.createEllipseShape(10, 10, x, y);
            case PathwayNodeEnum.STATE_VARIABLE:
                return this.createEllipseShape(20, 10, x, y);




            // case PathwayNodeEnum.UNIT_OF_INFORMATION:
            //     return this.createUnitOfInformation
            // case PathwayNodeEnum.UNSPECIFIED_ENTRY: // Potentially Gene
            //     return this.createEllipseShape(w, h, x, y);

            // return this.createEllipseShape(w, h, x, y);
            // case PathwayNodeEnum.COMPARTMENT:
            // case PathwayNodeEnum.MACROMOLECULE: // Potentially Gene
            //     return this.createRoundedRectangleShape(w, h, x, y);
            // case PathwayNodeEnum.COMPLEX:  // Potentially Gene
            // case PathwayNodeEnum.COMPLEX_MULTIMER:  // Potentially Gene
            //     return this.createOctagonShape(w, h, x, y);
            // case PathwayNodeEnum.UNIT_OF_INFORMATION:
            //     return this.createRectangleShape(w, h, x, y);
            default:
                // console.log(node);
                return this.createRectangleShape(w, h, x, y);
        }
    }

    private static createRectangleShape(w: number, h: number, x: number, y: number): THREE.Shape {
        x = -0.5 * w;
        y = 0.5 * h;
        const rectShape = new THREE.Shape();
        rectShape.moveTo(x, y);
        rectShape.lineTo(x, y - h);
        rectShape.lineTo(x + w, y - h);
        rectShape.lineTo(x + w, y);
        rectShape.lineTo(x, y);
        return rectShape;
    }

    private static createEllipseShape(w: number, h: number, x: number, y: number): THREE.Shape {
        x = -0.5 * w;
        y = 0.5 * h;
        const ellipsePath = new THREE.EllipseCurve(
            (x + w / 2), (y - h / 2),
            w / 2, h / 2,
            0, 2 * Math.PI,
            false,
            0
        );
        const ellipsePoints = ellipsePath.getPoints(50);
        const ellipseShape = new THREE.Shape(ellipsePoints);
        return ellipseShape;
    }

    private static createOctagonShape(w: number, h: number, x: number, y: number): THREE.Shape {
        x = -0.5 * w;
        y = 0.5 * h;
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
        x = -0.5 * w;
        y = 0.5 * h;
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


    // LINES START
    private static lineIntersect(a, b) {
        a.m = (a[0].y - a[1].y) / (a[0].x - a[1].x);  // slope of line 1
        b.m = (b[0].y - b[1].y) / (b[0].x - b[1].x);  // slope of line 2
        return a.m - b.m < Number.EPSILON ? undefined
            : {
                x: (a.m * a[0].x - b.m * b[0].x + b[0].y - a[0].y) / (a.m - b.m),
                y: (a.m * b.m * (b[0].x - a[0].x) + b.m * a[0].y - a.m * b[0].y) / (b.m - a.m)
            };
    }
    private static createEdgeLine(x1, y1, x2, y2, xO, yO): THREE.Group {
        const group = new THREE.Group();
        group.add(ChartFactory.lineAllocate(0x90caf9, new Vector2(x1, y1), new Vector2(x2, y2)));
        return group;
    }
    private static createConsumption(x1, y1, x2, y2, xO, yO): THREE.Group {
        const rotation = Math.atan2(y2 - y1, x2 - x1);
        const color = ColorEnum.GREEN;
        const squareGeom = new THREE.ShapeGeometry(
            new THREE.Shape([
                new Vector2(0, 0),
                new Vector2(0, 5),
                new Vector2(5, 5),
                new Vector2(5, 0)
            ])
        );
        const square = new THREE.Mesh(
            squareGeom,
            ChartFactory.getColorPhong(color)
        );
        square.position.setX(x1 + Math.cos(rotation) * 15);
        square.position.setY(y1 + Math.sin(rotation) * 15);
        square.position.z = 0.1;
        square.rotateZ(rotation);


        const group = new THREE.Group();
        group.add(ChartFactory.lineAllocate(color, new Vector2(x1, y1), new Vector2(x2, y2)));
        group.add(square);
        return group;
    }
    private static createCatalysis(x1, y1, x2, y2, xO, yO): THREE.Group {
        const color = ColorEnum.PURPLE_DARK;
        const group = new THREE.Group();
        const line = ChartFactory.lineAllocate(color, new Vector2(x1, y1), new Vector2(x2, y2));
        line.position.z -= 0.1;
        group.add(line);
        const rotation = Math.atan2(y2 - y1, x2 - x1);
        const circle = new THREE.Mesh(
            new THREE.CircleGeometry(2.5),
            ChartFactory.getColorBasic(color));
        circle.position.setX(x1 + (Math.cos(rotation) * 15));
        circle.position.setY(y1 + (Math.sin(rotation) * 15));
        circle.position.z = 0.1;
        circle.rotateZ(rotation);
        group.add(circle);
        return group;
    }

    private static createInhibition(x1, y1, x2, y2, xO, yO): THREE.Group {
        // console.log("INHIBITION")
        const group = new THREE.Group();
        group.add(ChartFactory.lineAllocate(0xa5d6a7, new Vector2(x1, y1), new Vector2(x2, y2)));
        const line = ChartFactory.lineAllocate(0xa5d6a7, new Vector2(-5, 0), new Vector2(5, 0));
        line.position.x = x1 + xO;
        line.position.y = y1 + yO;
        line.position.z = -0.1;
        line.rotateZ(Math.atan2(y2 - y1, x2 - x1) + 1.5);
        group.add(line);
        return group;
    }

    private static createProduction(x1, y1, x2, y2, xO, yO): THREE.Group {
        // console.log("PRODUCTION");
        const color = ColorEnum.BLUE;
        const group = new THREE.Group();
        const line = ChartFactory.lineAllocate(color, new Vector2(x1, y1), new Vector2(x2, y2));
        line.position.z = -0.1;
        group.add(line);

        const rotation = Math.atan2(y2 - y1, x2 - x1);
        const triangleGeom = new THREE.ShapeGeometry(
            new THREE.Shape([
                new Vector2(0, 0),
                new Vector2(6, -3),
                new Vector2(6, 3),
            ])
        );
        const triangle = new THREE.Mesh(
            triangleGeom,
            ChartFactory.getColorBasic(color)
        );
        triangle.position.setX(x1 + Math.cos(rotation) * 5);
        triangle.position.setY(y1 + Math.sin(rotation) * 5);
        triangle.position.z = 0.1;
        triangle.rotateZ(rotation);
        group.add(triangle);
        return group;
    }
    private static createStimulation(x1, y1, x2, y2, xO, yO): THREE.Group {
        //console.log("SIMULATION");
        const group = new THREE.Group();
        const line = ChartFactory.lineAllocate(0xffcc80, new Vector2(x1, y1), new Vector2(x2, y2));
        line.position.z = -0.1;
        group.add(line);

        const rotation = Math.atan2(y2 - y1, x2 - x1);
        const triangleGeom = new THREE.ShapeGeometry(
            new THREE.Shape([
                new Vector2(0, 0),
                new Vector2(6, -3),
                new Vector2(6, 3),
            ])
        );
        const triangle = new THREE.Mesh(
            triangleGeom,
            ChartFactory.getColorPhong(0xffcc80)
        );
        triangle.position.setX(x1 + Math.cos(rotation) * 5);
        triangle.position.setY(y1 + Math.sin(rotation) * 5);
        triangle.position.z = 0.1;
        triangle.rotateZ(rotation);

        group.add(triangle);
        return group;
    }
}
