import { WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphEnum } from 'app/model/enum.model';
import { VisualizationView } from './../../../model/chart-view.model';
import * as THREE from 'three';

export class ChartUtil {

    private static raycaster: THREE.Raycaster = new THREE.Raycaster();

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
                ( vector.x * halfWidth ),
                ( vector.y * halfHeight ) + ((view.viewport.y > 0) ? -halfHeight : halfHeight)
            );
        } else if (layout === WorkspaceLayoutEnum.HORIZONTAL) {
            return new THREE.Vector2(
                ( vector.x * halfWidth ) + (( view.viewport.x > 0) ? halfWidth : -halfWidth),
                ( vector.y * halfHeight )
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
        vector.x = Math.round( (vector.x + 1) * width / 2);
        vector.y = Math.round( (-vector.y + 1) * height / 2);
        vector.z = 0;
        if (chart === GraphEnum.GRAPH_B) {
            vector.x += width;
        }
        return vector;
    }

    public static getVisibleMeshes(view: VisualizationView): Array<THREE.Object3D> {
        const frustum = new THREE.Frustum();
        const cameraViewProjectionMatrix = new THREE.Matrix4();
        view.camera.matrixWorldInverse.getInverse(view.camera.matrixWorld);
        cameraViewProjectionMatrix.multiplyMatrices(view.camera.projectionMatrix, view.camera.matrixWorldInverse);
        frustum.setFromMatrix(cameraViewProjectionMatrix);
        return view.scene.children.filter( o => o.type === 'Mesh' ).filter( o => frustum.intersectsObject(o) );
    }

    public static getIntersects(view: VisualizationView, pos: {x: number, y: number, xs: number, ys: number},
        objects: Array<THREE.Object3D>): Array<THREE.Intersection> {
        this.raycaster.setFromCamera(pos, view.camera);
        return this.raycaster.intersectObjects( objects, false );
    }


    private constructor() {}

}
