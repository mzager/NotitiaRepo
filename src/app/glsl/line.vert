attribute posIndex
uniform vec2 u_resolution;
// attribute vec3 displacement;
// attribute vec3 customColor;
// varying vec3 vColor;

void main() {

  // vec3 newPosition = position + amplitude * displacement;
  // vColor = customColor;

  vec3 newPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}
