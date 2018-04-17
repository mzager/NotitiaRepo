import { WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphEnum } from 'app/model/enum.model';
import { VisualizationView } from './../../../model/chart-view.model';
import * as THREE from 'three';
import { Box3, Vector3, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

export class ChartUtil {

    private static raycaster: THREE.Raycaster = new THREE.Raycaster();

    public static calcualteBoundSphere(root: THREE.Object3D): THREE.Sphere {
        return null;
        // const sphere = new THREE.Sphere();
        // let sceneCenter = new THREE.Vector3(0, 0, 0);
        // let sceneRadius = 0;
        // root.traverse(o => {
        //     console.log(o);
        //     const radius = 6;
        //     const localPos = o.position.clone();
        //     const worldPos = o.matrixWorld.multiplyVector3(localPos);
        //     const newCenter = sceneCenter.clone().add(worldPos).divideScalar(2.0);
        //     const distCenter = newCenter.distanceTo(sceneCenter);
        //     const newRadius = Math.max(distCenter, sceneRadius);
        //     sceneCenter = newCenter;
        //     sceneRadius = newRadius;
        // });
        // return new THREE.Sphere(sceneCenter, sceneRadius);
    }
    // public static calculateBoundingSphere2(objects: Array<THREE.Object3D>): THREE.Sphere {
    //     let sceneBSCenter = new THREE.Vector3(0, 0, 0);
    //     let sceneBSRadius = 0;
    //     const numObjects = objects.length;
    //     for (let i = 0; i < objects.length; i++) {
    //         if (objects[i] instanceof THREE.Sprite) {
    //             const sprite = objects[i] as THREE.Sprite;
    //             let radius = 6;
    //             let objectCenterLocal = sprite.position.clone();
    //             let objectCenterWorld = sprite.matrixWorld.multiplyVector3(objectCenterLocal);
    //             let newCenter = sceneBSCenter.clone().add(objectCenterWorld).divideScalar(2.0);
    //             let dCenter = newCenter.distanceTo(sceneBSCenter);
    //             var newRadius = Math.max(dCenter + radius, dCenter + sceneBSRadius);
    //             sceneBSCenter = newCenter;
    //             sceneBSRadius = newRadius;
    //         } else if (objects[i] instanceof THREE.Mesh) {
    //             const mesh = objects[i] as THREE.Mesh;
    //             mesh.geometry.computeBoundingSphere();
    //             let radius = mesh.geometry.boundingSphere.radius;
    //             let objectCenterLocal = mesh.position.clone();
    //             let objectCenterWorld = mesh.matrixWorld.multiplyVector3(objectCenterLocal);
    //             let newCenter = sceneBSCenter.clone().add(objectCenterWorld).divideScalar(2.0);
    //             let dCenter = newCenter.distanceTo(sceneBSCenter);
    //             var newRadius = Math.max(dCenter + radius, dCenter + sceneBSRadius);
    //             sceneBSCenter = newCenter;
    //             sceneBSRadius = newRadius;
    //             console.log(objectCenterWorld);
    //         } else if (objects[i] instanceof THREE.Group) {
    //             const group = objects[i] as THREE.Group;
    //             let radius = 6;
    //             let objectCenterLocal = group.position.clone();
    //             let objectCenterWorld = group.matrixWorld.multiplyVector3(objectCenterLocal);
    //             let newCenter = sceneBSCenter.clone().add(objectCenterWorld).divideScalar(2.0);
    //             let dCenter = newCenter.distanceTo(sceneBSCenter);
    //             var newRadius = Math.max(dCenter + radius, dCenter + sceneBSRadius);
    //             sceneBSCenter = newCenter;
    //             sceneBSRadius = newRadius;
    //         }
    //         console.log('...');


    //     }
    //     return new THREE.Sphere(sceneBSCenter, sceneBSRadius);
    // }
    // public static calculateBoundingBox(root: THREE.Object3D): THREE.Box3 {
    //     // let box: THREE.Box3 = new THREE.Box3();
    //     // root.traverse(function (obj3D) {
    //     //     if (obj3D.hasOwnProperty('geometry')) {
    //     //         const geometry: THREE.Geometry = obj3D['geometry'];
    //     //         geometry.computeBoundingBox();
    //     //         if (box === null) { box = geometry.boundingBox; }
    //     //         else {
    //     //             box.union(geometry.boundingBox);
    //     //         }
    //     //         console.log('.........');
    //     //     } else {
    //     //         const bbb = new Box3();
    //     //         bbb.setFromCenterAndSize(obj3D.position, new THREE.Vector3(3, 3, 3));
    //     //         box.union(box);
    //     //     }
    //     // });
    //     // return box;
    // }
    // public static calcualteBoundingSphere(root: THREE.Object3D): THREE.Sphere {
    //     let sceneBSCenter = new THREE.Vector3(0, 0, 0);
    //     let sceneBSRadius = 0;
    //     root.traverseVisible((obj: THREE.Object3D) => {
    //         if (obj instanceof THREE.Mesh) {
    //             console.log(obj + "!!!");
    //             const object = obj as THREE.Mesh;
    //             object.geometry.computeBoundingSphere();
    //             let radius = object.geometry.boundingSphere.radius;
    //             let objectCenterLocal = object.position.clone();
    //             let objectCenterWorld = object.matrixWorld.multiplyVector3(objectCenterLocal);
    //             let newCenter = sceneBSCenter.clone().add(objectCenterWorld).divideScalar(2.0);
    //             // New radius in world space
    //             let dCenter = newCenter.distanceTo(sceneBSCenter);
    //             var newRadius = Math.max(dCenter + radius, dCenter + sceneBSRadius);
    //             sceneBSCenter = newCenter;
    //             sceneBSRadius = newRadius;
    //         }
    //     });
    //     return new THREE.Sphere(sceneBSCenter, sceneBSRadius);
    // }
    // public static fitCameraToBox(view: VisualizationView, box: THREE.Box3): void {
    //     const scale = 1;
    //     const camera: PerspectiveCamera = view.camera as PerspectiveCamera;
    //     const controls: OrbitControls = view.controls as OrbitControls;
    //     const objectAngularSize = (camera.fov * Math.PI / 180) * scale;
    //     // const distanceToCamera = box.getBoundingSphere() / Math.tan(objectAngularSize / 2)
    //     // const len = Math.sqrt(Math.pow(distanceToCamera, 2) + Math.pow(distanceToCamera, 2))
    //     // camera.position.set(len, len, len);
    //     debugger;
    // }
    public static fitCameraToSphere(view: VisualizationView, sphere: THREE.Sphere): void {
        return null;
        // const aspect = view.viewport.width / view.viewport.height;
        // const fov = (view.camera as PerspectiveCamera).fov * (Math.PI / 180);
        // view.camera.position.set(
        //     sphere.center.x,
        //     sphere.center.y,
        //     sphere.center.z + (sphere.radius * 1.5)
        // );
        // view.camera.lookAt(sphere.center);

        // view.controls.target.set(sphere.center.x, sphere.center.y, sphere.center.z);




        // const scale = 0.618; // object size / display size
        // // const scale = 1;
        // const camera: PerspectiveCamera = view.camera as PerspectiveCamera;
        // const controls: OrbitControls = view.controls as OrbitControls;
        // const objectAngularSize = (camera.fov * Math.PI / 180) * scale;
        // const distanceToCamera = sphere.radius / Math.tan(objectAngularSize / 2)
        // const len = Math.sqrt(Math.pow(distanceToCamera, 2) + Math.pow(distanceToCamera, 2))
        // // camera.position.set(len, len, len);
        // console.log(len);
        // view.controls.update();
        // camera.lookAt(sphere.center);
        // view.controls.target.set(sphere.center.x, sphere.center.y, sphere.center.z);
        // camera.updateProjectionMatrix();
    }

    // public static fitCameraToObject(camera, object: Box3, offset, controls) {

    //     // offset = offset || 1.25;

    //     // const boundingBox = object;
    //     // // get bounding box of object - this will be used to setup controls and camera
    //     // // boundingBox.setFromObject( object );

    //     // const center = boundingBox.getCenter();

    //     // const size = boundingBox.getSize();

    //     // // get the max side of the bounding box (fits to width OR height as needed )
    //     // const maxDim = Math.max(size.x, size.y, size.z);
    //     // const fov = camera.fov * (Math.PI / 180);
    //     // let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

    //     // cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    //     // camera.position.z = cameraZ;

    //     // const minZ = boundingBox.min.z;
    //     // const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    //     // camera.far = cameraToFarEdge * 3;
    //     // camera.updateProjectionMatrix();
    //     // if (controls) {
    //     //     // set camera to rotate around center of loaded object
    //     //     controls.target = center;
    //     //     // prevent camera from zooming out far enough to create far plane cutoff
    //     //     controls.maxDistance = cameraToFarEdge * 2;
    //     //     //   controls.saveState();
    //     // } else {
    //     //     camera.lookAt(center);
    //     // }
    // }
    public static objectToScreen(obj: THREE.Object3D, view: VisualizationView, layout: WorkspaceLayoutEnum): THREE.Vector2 {

        const vector = new THREE.Vector3();
        obj.updateMatrixWorld(true);
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(view.camera);
        if (vector.y > 1 || vector.y < -1 || vector.x > 1 || vector.x < -1) {
            return null;
        }

        const halfWidth = view.viewport.width * 0.5;
        const halfHeight = view.viewport.height * 0.5;
        if (layout === WorkspaceLayoutEnum.VERTICAL) {
            return new THREE.Vector2(
                (vector.x * halfWidth),
                (vector.y * halfHeight) + ((view.viewport.y > 0) ? -halfHeight : halfHeight)
            );
        } else if (layout === WorkspaceLayoutEnum.HORIZONTAL) {
            return new THREE.Vector2(
                (vector.x * halfWidth) + ((view.viewport.x > 0) ? halfWidth : -halfWidth),
                (vector.y * halfHeight)
            );
        }
    }
    public static colorToHex(color): number {
        if (color.substr(0, 1) === '#') {
            return color;
        }
        const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
        const red = parseInt(digits[2], 10);
        const green = parseInt(digits[3], 10);
        const blue = parseInt(digits[4], 10);
        const rgb = blue | (green << 8) | (red << 16);
        return rgb;
    }

    public static projectToScreen(chart: GraphEnum, object: THREE.Object3D,
        camera: THREE.Camera, width: number, height: number): THREE.Vector3 {

        const vector = object.position.clone();
        vector.project(camera);
        vector.x = Math.round((vector.x + 1) * width / 2);
        vector.y = Math.round((-vector.y + 1) * height / 2);
        vector.z = 0;
        if (chart === GraphEnum.GRAPH_B) {
            vector.x += width;
        }
        return vector;
    }

    public static getVisibleMeshes(view: VisualizationView, parent: THREE.Group = null): Array<THREE.Object3D> {
        const frustum = new THREE.Frustum();
        const cameraViewProjectionMatrix = new THREE.Matrix4();
        view.camera.matrixWorldInverse.getInverse(view.camera.matrixWorld);
        cameraViewProjectionMatrix.multiplyMatrices(view.camera.projectionMatrix, view.camera.matrixWorldInverse);
        frustum.setFromMatrix(cameraViewProjectionMatrix);
        if (parent === null) {
            parent = view.scene;
        }
        return parent.children.filter(o => o.type === 'Mesh').filter(o => frustum.intersectsObject(o));
    }

    public static getIntersects(
        view: VisualizationView,
        pos: { x: number, y: number, xs: number, ys: number },
        objects: Array<THREE.Object3D>): Array<THREE.Intersection> {
        this.raycaster.setFromCamera(pos, view.camera);
        return this.raycaster.intersectObjects(objects, false);
    }


    private constructor() { }

}
