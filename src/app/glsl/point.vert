attribute float size;
attribute vec3 customColor;
varying vec3 vColor;
uniform vec3 selectedColor;
uniform float animationPos;
attribute vec3 positionFrom;

void main() {
  vColor = customColor;

  vec4 mvPosition = modelViewMatrix * vec4(positionFrom * (1.0 - animationPos) +
   position * animationPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * ( 300.0 / -mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
