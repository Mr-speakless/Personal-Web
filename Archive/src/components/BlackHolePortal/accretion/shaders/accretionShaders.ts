export const accretionVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPos;

void main() {
  vUv = uv;
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const accretionFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uInnerRadius;
uniform float uOuterRadius;
uniform vec3 uColorInner;
uniform vec3 uColorMid;
uniform vec3 uColorOuter;
uniform float uEnteringProgress;

varying vec2 vUv;
varying vec3 vWorldPos;

// Pseudo-random noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  // Distance from center in XZ plane
  float dist = length(vWorldPos.xz);

  // Normalized distance within disk
  float t = (dist - uInnerRadius) / (uOuterRadius - uInnerRadius);
  t = clamp(t, 0.0, 1.0);

  // Outside disk → discard
  if (dist < uInnerRadius * 0.9 || dist > uOuterRadius * 1.05) {
    discard;
  }

  // Rotation angle
  float angle = atan(vWorldPos.z, vWorldPos.x);

  // Animated rotation - inner parts rotate faster (Keplerian)
  float rotSpeed = 0.3 / (t * 0.5 + 0.5);
  float rotAngle = angle + uTime * rotSpeed;

  // Noise for turbulence
  float n1 = noise(vec2(rotAngle * 3.0, t * 8.0 + uTime * 0.2));
  float n2 = noise(vec2(rotAngle * 6.0 + 100.0, t * 12.0 - uTime * 0.15));
  float turbulence = n1 * 0.6 + n2 * 0.4;

  // Color gradient: inner is brighter, outer fades
  vec3 color;
  if (t < 0.3) {
    color = mix(uColorInner, uColorMid, t / 0.3);
  } else {
    color = mix(uColorMid, uColorOuter, (t - 0.3) / 0.7);
  }

  // Brightness modulation
  float brightness = turbulence * 0.5 + 0.5;
  brightness *= smoothstep(0.0, 0.15, t); // Fade at inner edge
  brightness *= smoothstep(1.0, 0.85, t); // Fade at outer edge

  // Inner glow boost
  brightness *= 1.0 + (1.0 - t) * 0.5;

  // Doppler-like brightening on one side
  float doppler = 1.0 + 0.3 * sin(rotAngle);
  brightness *= doppler;

  // Alpha
  float alpha = brightness * 0.85;
  alpha *= smoothstep(uInnerRadius * 0.9, uInnerRadius, dist);
  alpha *= smoothstep(uOuterRadius * 1.05, uOuterRadius, dist);

  // Entering animation: intensify
  color += vec3(0.2, 0.15, 0.05) * uEnteringProgress;
  alpha *= 1.0 + uEnteringProgress * 0.5;

  gl_FragColor = vec4(color * brightness, alpha);
}
`
