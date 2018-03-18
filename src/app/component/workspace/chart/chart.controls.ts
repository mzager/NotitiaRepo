import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GraphEnum, ShapeEnum, ToolEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as THREE from 'three';

export class ChartControls {

    // private mode: ToolEnum;
    private camera: THREE.OrthographicCamera;
    private container: HTMLCanvasElement;
    private target: THREE.Object3D;

    // Observables
    private keyUp: Observable<KeyboardEvent>;
    private keyDown: Observable<KeyboardEvent>;
    private keyPress: Observable<any>;
    private mouseUp: Observable<MouseEvent>;
    private mouseDown: Observable<MouseEvent>;
    private mouseMove: Observable<MouseEvent>;
    private mouseDrag: Observable<MouseEvent>;
    private toolDrag: Observable<MouseEvent>;
    private toolZoom: Observable<MouseEvent>;
    private toolRotate: Observable<MouseEvent>;
    private toolSelect: Observable<MouseEvent>;


    private subscription: Subscription;

    // Subjects
    public render: Subject<null> = new Subject();
    private tool: BehaviorSubject<ToolEnum> = new BehaviorSubject(ToolEnum.MOVE);


    // State (oh no)
    private plane = new THREE.Plane();
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();
    private offset = new THREE.Vector3();
    private intersection = new THREE.Vector3();
    private selected: THREE.Object3D;
    private hovered = null;
    private rect: ClientRect = null;

    private mode: ToolEnum;
    public setMode(value: ToolEnum) {
        this.tool.next(value);
    }

    public attach(targetA: THREE.Object3D, targetB: THREE.Object3D) {
        this.target = targetA;
        this.setMode(ToolEnum.MOVE);
    }

    public detach() {

    }

    constructor(container: HTMLCanvasElement, camera: THREE.OrthographicCamera) {

        this.camera = camera;
        this.subscription = null;
        this.mode = null;
        this.container = container;
        this.mouseUp = Observable.fromEvent(container, 'mouseup');
        this.mouseMove = Observable.fromEvent(container, 'mousemove');
        this.mouseDown = Observable.fromEvent(container, 'mousedown');
        this.keyDown = Observable.fromEvent(document, 'keydown');
        this.keyUp = Observable.fromEvent(document, 'keyup');
        this.mouseDrag = this.mouseDown.filter((e => {
            return true;
        }).bind(this))
            .map(e => this.mouseMove.takeUntil(this.mouseUp)).concatAll();

        // Branch Events Based on Tool Selected
        this.toolDrag = this.mouseDrag.withLatestFrom(this.tool)
            .filter((v: any, i: number) => (v[1] === ToolEnum.MOVE)).map(v => v[0]);
        this.toolZoom = this.mouseDrag.withLatestFrom(this.tool)
            .filter((v: any, i: number) => (v[1] === ToolEnum.ZOOM)).map(v => v[0]);
        this.toolSelect = this.mouseDrag.withLatestFrom(this.tool)
            .filter((v: any, i: number) => (v[1] === ToolEnum.SELECT)).map(v => v[0]);
        this.toolRotate = this.mouseDrag.withLatestFrom(this.tool)
            .filter((v: any, i: number) => (v[1] === ToolEnum.ROTATE)).map(v => v[0]);

        this.toolDrag.subscribe((e: MouseEvent) => {
            // this.mouse.x = ( (e.clientX - this.rect.left) / this.rect.width ) * 2 - 1;
            // this.mouse.y = - ( (e.clientY - this.rect.top) / this.rect.height ) * 2 + 1;
            // this.raycaster.setFromCamera( this.mouse, this.camera );
            // if (this.raycaster.ray.intersectPlane( this.plane, this.intersection )) {
            //     this.selected.position.copy( this.intersection);
            //     this.plane.setFromNormalAndCoplanarPoint( this.camera.getWorldDirection( this.plane.normal ), this.selected.position );
            // }
            // this.render.next();
        });

        this.toolRotate.subscribe((e: MouseEvent) => {
            // this.target.rotateY( e.movementX * -0.01 );
            // this.target.rotateX( e.movementY * -0.01 );
            // let rotWorldMatrix = new THREE.Matrix4();
            // rotWorldMatrix.makeRotationAxis(new THREE.Vector3(1, 0, 0).normalize(), e.movementX * 0.01);
            // rotWorldMatrix = rotWorldMatrix.multiply(this.selected.matrix);
            // this.selected.matrix = rotWorldMatrix;
            // this.selected.parent.rotation.setFromRotationMatrix(this.selected.matrix, this.selected.rotation.order);
            // this.render.next();
        });
        this.toolZoom.subscribe((e: MouseEvent) => {
        });

    }
}
