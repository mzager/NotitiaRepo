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

    public static createNode( node: string, w: number, h: number, x: number, y: number): THREE.Shape {
        switch (node) {
            case PathwaysFactory.UNSPECIFIED_ENTRY:
            case PathwaysFactory.COMPARTMENT:
            case PathwaysFactory.MACROMOLECULE:
                return this.createRoundedRectangleShape( w, h, x, y);
            case PathwaysFactory.COMPLEX:
            case PathwaysFactory.COMPLEX_MULTIMER:
                return this.createOctagonShape( w, h, x, y);
            case PathwaysFactory.SIMPLE_CHEMICAL:
                return this.createRectangleShape( w, h, x, y);
            case PathwaysFactory.PROCESS:
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
}
