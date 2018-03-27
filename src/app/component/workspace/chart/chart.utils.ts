import { WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphEnum } from 'app/model/enum.model';
import { VisualizationView } from './../../../model/chart-view.model';
import * as THREE from 'three';
import { Box3 } from 'three';

export class ChartUtil {

    private static raycaster: THREE.Raycaster = new THREE.Raycaster();

    public static fitCameraToObject(camera, object: Box3, offset, controls) {

        // offset = offset || 1.25;

        // const boundingBox = object;
        // // get bounding box of object - this will be used to setup controls and camera
        // // boundingBox.setFromObject( object );

        // const center = boundingBox.getCenter();

        // const size = boundingBox.getSize();

        // // get the max side of the bounding box (fits to width OR height as needed )
        // const maxDim = Math.max(size.x, size.y, size.z);
        // const fov = camera.fov * (Math.PI / 180);
        // let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

        // cameraZ *= offset; // zoom out a little so that objects don't fill the screen

        // camera.position.z = cameraZ;

        // const minZ = boundingBox.min.z;
        // const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

        // camera.far = cameraToFarEdge * 3;
        // camera.updateProjectionMatrix();
        // if (controls) {
        //     // set camera to rotate around center of loaded object
        //     controls.target = center;
        //     // prevent camera from zooming out far enough to create far plane cutoff
        //     controls.maxDistance = cameraToFarEdge * 2;
        //     //   controls.saveState();
        // } else {
        //     camera.lookAt(center);
        // }
    }
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

    public static getIntersects(view: VisualizationView, pos: { x: number, y: number, xs: number, ys: number },
        objects: Array<THREE.Object3D>): Array<THREE.Intersection> {
        this.raycaster.setFromCamera(pos, view.camera);
        return this.raycaster.intersectObjects(objects, false);
    }


    private constructor() { }

}
