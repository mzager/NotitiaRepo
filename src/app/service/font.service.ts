import { color } from 'd3';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import 'rxjs/add/operator/map';
import * as createText from 'three-bmfont-text';
import * as SDFShader from 'three-bmfont-text/shaders/sdf';


@Injectable()
export class FontService {


    private _fonts: Array<any>;
    private _texture: THREE.Texture;
    private _material: THREE.MeshBasicMaterial;

    private _ready: boolean = false;
    public get ready(): boolean { return this._ready; }
    public getFont(size: 'small' | 'medium' | 'large' = 'medium') {
        return (size === 'small') ? this._fonts[0] :
            (size === 'medium') ? this._fonts[1] :
                this._fonts[2];
    }
    public get texture() { return this._texture; }
    public get material() { return this._material; }


    public createFontMesh(width: number, copy: string, camera: THREE.Camera, align: 'left' | 'center' | 'right' = 'left', size: 'small' | 'medium' | 'large' = 'medium', letterSpacing: number = 0): THREE.Object3D {


        var geom = createText({
            text: copy,
            font: this.getFont(size),
            align: align,
            flipY: false
        });


        var layout = geom.layout
        const text = new THREE.Mesh(geom, this._material);

        text.position.set(-layout.width, layout.descender - layout.height, 0);
        text.quaternion.copy(camera.quaternion)
        var textAnchor = new THREE.Object3D()
        textAnchor.add(text)
        textAnchor.scale.multiplyScalar(1 / (window.devicePixelRatio || 1))
        text.onBeforeRender = function () {
            text.scale.setY(-1);
            text.quaternion.copy(camera.quaternion);
        }
        return textAnchor;

    }


    private loadFont(): Promise<any> {
        return Promise.all([
            fetch('assets/font/lato16.json'),
            fetch('assets/font/lato32.json'),
            fetch('assets/font/lato64.json')
        ]).then(results => Promise.all(results.map(v => v.json())));

    }

    private loadTexture(): Promise<any> {
        return new Promise((resolve, reject) => {
            const textureLoader = new THREE.TextureLoader();
            const texture = this._texture = textureLoader.load('/assets/font/lato.png', texture => {
                texture.needsUpdate = true;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = true;
                const material = this._material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                    color: 0x666666
                });
                resolve({ texture: texture, material: material });
            });
        });
    }

    public init(): Promise<any> {
        return Promise.all([
            this.loadTexture(),
            this.loadFont()
        ]).then(v => {
            this._fonts = v[1];
            this._ready = true;
        });
    }


    constructor() { this.init(); }

}
