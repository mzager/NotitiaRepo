precision mediump float;
// uniform sampler2D uTexture;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform sampler2D uTexture4;
uniform sampler2D uTexture5;
uniform sampler2D uTexture6;
uniform sampler2D uTexture7;

varying vec3 vColor;
varying float vAlpha;
varying float vShape;
varying float vSelected;

void main() {

  if (vSelected == 0.0){
    gl_FragColor = vec4( vColor, vAlpha );
  }

  if (vSelected == 1.0){
    gl_FragColor = vec4( 1.0,0.0,1.0,1.0 );
  }



  if (vShape == 0.0){
    gl_FragColor = gl_FragColor * texture2D( uTexture0, gl_PointCoord );
  }
  if (vShape == 1.0){
    gl_FragColor = gl_FragColor * texture2D( uTexture1, gl_PointCoord );
  }
  if (vShape == 2.0){
    gl_FragColor = gl_FragColor * texture2D( uTexture2, gl_PointCoord );
  }
  if (vShape == 3.0){
    gl_FragColor = gl_FragColor * texture2D( uTexture3, gl_PointCoord );
  }
  if (vShape == 4.0){
    gl_FragColor = gl_FragColor * texture2D( uTexture4, gl_PointCoord );
  }
  if (vShape == 5.0){
    gl_FragColor = gl_FragColor * texture2D( uTexture5, gl_PointCoord );
  }
  if (vShape == 6.0){
    gl_FragColor = gl_FragColor * texture2D( uTexture6, gl_PointCoord );
  }
  if (vShape == 7.0){
    gl_FragColor = gl_FragColor * texture2D( uTexture7, gl_PointCoord );
  }

  if ( gl_FragColor.a < ALPHATEST ) discard;
}
