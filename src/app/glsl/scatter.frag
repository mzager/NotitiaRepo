precision mediump float;


#define PI 3.14159265359
#define TWO_PI 6.28318530718

varying vec3 vColor;
varying float vShape;
varying float vSelected;

void circle(vec3 vColor, float vAlpha, float vSelected) {
  float r = 0.0, delta = 0.0, alpha = 1.0;
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  r = dot(cxy, cxy);
  if (r > 0.5) {
      discard;
  }
  if (vSelected == 1.0) {
    vAlpha = 1.0;
  }
  if (r > 0.3) {
    if (vSelected == 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, vAlpha);
    } else {
      gl_FragColor = vec4(vColor, vAlpha);
    }
  }else {
    gl_FragColor = vec4(vColor, vAlpha);
  }
}
void poly(int sides, vec3 vColor, float vAlpha, float vSelected) {
  float size = 8.0;
  vec2 c = 2.0 * gl_PointCoord - 1.0;
  c *= size;
  vec3 color = vec3(0.0);
  float d = 0.0;
  int N = sides;
  // Angle and radius from the current pixel
  float a = atan(c.x,c.y)+PI;
  float r = TWO_PI/float(N);
  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(c);
  color = vec3(1.0 - smoothstep(.5 * size, .5 * size, d));

  if (vSelected == 1.0) {
    vAlpha = 1.0;
  }

  if (d > 0.5 * size ) {
    discard;
  } else if (d > 0.3 * size) {
    if (vSelected == 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, vAlpha);
    } else {
      gl_FragColor = vec4(vColor,vAlpha);
    }
  } else {
    gl_FragColor = vec4(vColor,vAlpha);
  }
}
void kaleido(int loops, vec3 vColor, float vAlpha, float vSelected) {
  float size = 8.0;
  vec2 c = 2.0 * gl_PointCoord - 1.0;
  c *= size;
  vec3 color = vec3(0.0);
  vec2 pos = vec2(0.5)-c;
  float r = length(pos)*2.0;
  r *= size * 0.07;
  float a = atan(pos.y,pos.x);
  float f = 0.0;
  if (loops == 3){
    f = cos(a*3.);
  } else if (loops == 4){
    f = abs(cos(a*2.5))*.5+.3;
  } else if (loops == 5){
    f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
  } else if (loops == 6){
    f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;
  } else if (loops == 7){
    f = abs(cos(a*6.)*sin(a*3.))*.8+.1;
  } else if (loops == 8){
    f = abs(cos(a*2.0))*.5+.3;
  }
  color = vec3( 1.0-smoothstep(f * size,(f+0.02) * size,r) );
  if (color.r  == 0.0 && color.g == 0.0 && color.b == 0.0 ){
    discard;
  }
  if (r > 0.3 * size ) {
    if (vSelected == 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1);
    } else {
      gl_FragColor = vec4(vColor, vAlpha);
    }
  } else {
    gl_FragColor = vec4(vColor, vAlpha);
  }
}

void main() {
  float defaultAlpha = 0.75;

  if (vShape == 0.0) {
    circle(vColor, defaultAlpha, vSelected);
  }
  else if (vShape == 1.0) {
    poly(3, vColor, defaultAlpha, vSelected);
  }
  else if (vShape == 2.0) {
    poly(4, vColor, defaultAlpha, vSelected);
  }
  else if (vShape == 3.0) {
    poly(5,vColor, defaultAlpha, vSelected);
  }
  else if (vShape == 4.0) {
    kaleido(3,vColor, defaultAlpha, vSelected);
  }
  else if (vShape == 5.0) {
    kaleido(4,vColor, defaultAlpha, vSelected);
  }
  else if (vShape == 6.0) {
    kaleido(5,vColor, defaultAlpha, vSelected);
  }
  else if (vShape == 7.0) {
    kaleido(6, vColor, defaultAlpha, vSelected);
  }
  else if (vShape == 8.0) {
    kaleido(7,vColor, defaultAlpha, vSelected);
  }
  else {
    kaleido(8,vColor, defaultAlpha, vSelected);
  }

  if ( gl_FragColor.a < ALPHATEST ) discard;
}
