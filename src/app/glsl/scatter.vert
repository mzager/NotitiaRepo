precision mediump float;
attribute vec3 gPositionFrom;
attribute vec3 gColor;
attribute float gSize;
attribute float gAlpha;
attribute float gShape;
attribute float gSelected;

varying vec3 vColor;
varying float vAlpha;
varying float vShape;
varying float vSelected;

uniform float uAnimationPos;

void main() {
  vColor = gColor;
  vAlpha = gAlpha;
  vShape = gShape;
  vSelected = gSelected;

  vec4 mvPosition = modelViewMatrix * vec4(gPositionFrom * (1.0 - uAnimationPos) +position * uAnimationPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = gSize * ( 300.0 / -mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
