
import * as createGeometry from 'three-bmfont-text';
import * as loadFont from 'load-bmfont';
import * as THREE from 'three';
import 'rxjs/add/operator/map';

export class FontFactory {

    private static _instance: FontFactory = null;

    private _font;
    private _texture: THREE.Texture;
    private _material: THREE.MeshBasicMaterial;

    public static getInstance(): Promise<FontFactory> {
        return new Promise((resolve, reject) => {
            if (FontFactory._instance != null) {
                resolve(FontFactory._instance);
            } else {
                FontFactory._instance = new FontFactory();
                Promise.all([FontFactory._instance.loadFont(), FontFactory._instance.loadTexture()])
                    .then(() => { resolve(FontFactory._instance); }
                    );
            }
        });
    }

    public get font() { return this._font; }
    public get texture() { return this._texture; }
    public get material() { return this._material; }

    createFontMesh(width: number, align: string, copy: string): THREE.Mesh {
        return new THREE.Mesh(
            this.createFontGeometry(width, align, copy),
            this.material
        );
    }

    createFontGeometry(width: number, align: string, copy: string): any {
        const geometry = createGeometry({
            width: width,
            align: align,
            font: this.font
        });
        geometry.update(copy);
        return geometry;
    }

    private loadFont(): Promise<null> {
        return new Promise((resolve, reject) => {
            loadFont('assets/fonts/Lato-Regular-32.fnt', ((err, font) => {
                this._font = font;
                resolve();
            }));
        });
    }

    private loadTexture(): Promise<null> {
        return new Promise((resolve, reject) => {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load('assets/fonts/lato.png', ((texture) => {
                this._texture = texture;
                this._material = new THREE.MeshBasicMaterial({
                    map: this.texture,
                    transparent: true,
                    color: 0x000000
                });
                resolve();
            }));
        });
    }

    private constructor() { }

}
