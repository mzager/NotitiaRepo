import { Injectable } from '@angular/core';
import { Memoize } from 'typescript-memoize';
import { GraphEnum, ShapeEnum, SizeEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as THREE from 'three';

export class PathwaysFactory {

    static readonly COMPARTMENT = 'compartment';
    static readonly MACROMOLECULE = 'macromolecule';
    static readonly COMPLEX = 'complex';
    static readonly COMPLEX_MULTIMER = 'complex multimer';
    static readonly SIMPLE_CHEMICAL = 'simple chemical';
    static readonly PROCESS = 'process';
    static readonly UNSPECIFIED_ENTRY = 'unspecified entity';
    static readonly UNIT_OF_INFORMATION = 'unit of information';

    public static createNode( node: string, w: number, h: number, x: number, y: number): THREE.Shape {
        switch (node) {
            case PathwaysFactory.UNSPECIFIED_ENTRY:
            case PathwaysFactory.SIMPLE_CHEMICAL:
                return this.createEllipseShape(w, h, x, y);
            case PathwaysFactory.PROCESS:
            case PathwaysFactory.COMPARTMENT:
            case PathwaysFactory.MACROMOLECULE:
                return this.createRoundedRectangleShape( w, h, x, y);
            case PathwaysFactory.COMPLEX:
            case PathwaysFactory.COMPLEX_MULTIMER:
                return this.createOctagonShape( w, h, x, y);
            case PathwaysFactory.UNIT_OF_INFORMATION:
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

    private static createCatalysis(x1, y1, x2, y2): THREE.Group {
        // calculate center coordinates for circle
        const r = 0.25; // change radius later
        const m = (y2 - y1) / (x2 - x1); // slope of line
        let x3, y3;
        if (x2 - x1 === 0) {
            x3 = x2;
            y3 = y2 - r;
        } else {
            x3 = x2 + Math.sqrt((r * r) / (m * m + 1));
            y3 = y2 + m * Math.sqrt((r * r) / (m * m + 1));
        }

        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(
            new THREE.Vector3(x1, y1, 0),
            new THREE.Vector3(x2, y2, 0)
        );
        const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 5}));

        const ellipsePath = new THREE.EllipseCurve(
            x3, y3,
            r, r, // the two radii
            0,  2 * Math.PI,
            false,
            0
        );
        const ellipsePoints = ellipsePath.getPoints(50);
        const ellipseShape = new THREE.Shape(ellipsePoints);
        const circleGeometry = new THREE.ShapeGeometry(ellipseShape);
        const circle = new THREE.Mesh(circleGeometry, new THREE.MeshBasicMaterial({color: 0x48137a}));
        const group = new THREE.Group();
        group.add(line);
        group.add(circle);
        return group;
    }

    private static createInhibition(x1, y1, x2, y2): THREE.Group {
        // Calculations to find coordinates of perpendicular line, length n
        const n = 1; // change later
        const m = (x1 - x2) / (y2 - y1); // perpendicular slope

        let x3, x4, y3, y4;

        if (y2 - y1 === 0) { // handle case where perp slope is undefined (vertical line)
            x3 = x2;
            x4 = x2;
            y3 = y2 + n / 2;
            y4 = y2 - n / 2;
        } else {
            x3 = x2 - (0.5) * (Math.sqrt((n * n) / (m * m + 1)));
            x4 = x2 + (0.5) * (Math.sqrt((n * n) / (m * m + 1)));
            y3 = y2 - (0.5) * (m) * (x4 - x3);
            y4 = y2 + (0.5) * (m) * (x4 - x3);
        }

        // draw lines
        const mainLineGeometry = new THREE.Geometry();
        mainLineGeometry.vertices.push(
            new THREE.Vector3(x1, y1, 0),
            new THREE.Vector3(x2, y2, 0)
        );

        const perpLineGeometry = new THREE.Geometry();
        perpLineGeometry.vertices.push(
            new THREE.Vector3(x3, y3, 0),
            new THREE.Vector3(x4, y4, 0)
        );

        const lineMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 5});
        const mainLine = new THREE.Line(mainLineGeometry, lineMaterial);
        const perpLine = new THREE.Line(perpLineGeometry, lineMaterial);

        const group = new THREE.Group();
        group.add(mainLine);
        group.add(perpLine);

        return group;
    }

    private static createStimulation(x1, y1, x2, y2): THREE.Group {

        // calculate midpoint of base of triangle
        const h = 0.25; // height of triangle; can change later
        const mLine = (y2 - y1) / (x2 - x1); // slope of line, differentiate from slope of perpLine
        let x5, y5; // coordinates of midpoint of triangle
        if (x2 - x1 === 0 && y2 > y1) {
            x5 = x2;
            y5 = y2 - h;
        } else if (x2 - x1 === 0 && y2 < y1) {
            x5 = x2;
            y5 = y2 + h;
        } else if (mLine === 0 && x2 > x1) {
            x5 = x2 - h;
            y5 = y2;
        } else if (mLine === 0 && x2 < x1) {
            x5 = x2 + h;
            y5 = y2;
        } else if (mLine < 0 && x2 > x1) { // DOESN'T SHOW TRIANGLE
            x5 = x2 - Math.sqrt((h * h) / (mLine * mLine + 1));
            y5 = y2 - mLine * Math.sqrt((h * h) / (mLine * mLine + 1));
        } else if (mLine < 0 && x2 < x1) { // DOESN'T SHOW TRIANGLE
            x5 = x2 + Math.sqrt((h * h) / (mLine * mLine + 1));
            y5 = y2 + mLine * Math.sqrt((h * h) / (mLine * mLine + 1));
        } else if (mLine > 0 && x2 > x1) {
            x5 = x2 - Math.sqrt((h * h) / (mLine * mLine + 1));
            y5 = y2 - mLine * Math.sqrt((h * h) / (mLine * mLine + 1));
        } else if (mLine > 0 && x2 < x1) {
            x5 = x2 + Math.sqrt((h * h) / (mLine * mLine + 1));
            y5 = y2 + mLine * Math.sqrt((h * h) / (mLine * mLine + 1));
        }

        // calculate coordinates of endpoints of base of triangle, length n
        const n = 0.25; // change later
        const mPerp = (x1 - x2) / (y2 - y1); // perpendicular slope

        let x3, x4, y3, y4;

        if (y2 - y1 === 0) { // handle case where perp slope is undefined (vertical line)
            x3 = x5;
            x4 = x5;
            y3 = y5 + n / 2;
            y4 = y5 - n / 2;
        } else {
            x3 = x5 - (0.5) * (Math.sqrt((n * n) / (mPerp * mPerp + 1)));
            x4 = x5 + (0.5) * (Math.sqrt((n * n) / (mPerp * mPerp + 1)));
            y3 = y5 - (0.5) * (mPerp) * (x4 - x3);
            y4 = y5 + (0.5) * (mPerp) * (x4 - x3);
        }

        // draw them
        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(
            new THREE.Vector3(x1, y1, 0),
            new THREE.Vector3(x2, y2, 0)
        );

        const triangleGeometry = new THREE.Geometry();
        triangleGeometry.vertices.push(
            new THREE.Vector3(x2, y2, 0),
            new THREE.Vector3(x3, y3, 0),
            new THREE.Vector3(x4, y4, 0)
        );
        triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));

        const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 5}));
        const triangleMaterial = new THREE.MeshBasicMaterial({color: 0x48137a, side: THREE.DoubleSide});
        const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);

        const group = new THREE.Group();
        group.add(line);
        group.add(triangle);

        return group;
    }
}
