precision mediump float;
uniform vec3 color;
uniform vec3 selectedColor;
uniform sampler2D texture;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4( vColor, 1.0 );
  gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
  if ( gl_FragColor.a < ALPHATEST ) discard;
}
