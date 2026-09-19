// --- Lensing full-screen quad shaders ---

export const lensingVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const lensingFragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uBackgroundTexture;
uniform vec2 uBlackHoleScreenPos;
uniform float uEventHorizonRadius;
uniform float uEinsteinRadius;
uniform float uLensStrength;
uniform float uTime;
uniform float uAspect;
uniform float uEnteringProgress;

varying vec2 vUv;

void main() {
  // Correct for aspect ratio
  vec2 aspectUv = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5);
  vec2 aspectBH = vec2((uBlackHoleScreenPos.x - 0.5) * uAspect, uBlackHoleScreenPos.y - 0.5);

  vec2 diff = aspectUv - aspectBH;
  float dist = length(diff);
  vec2 dir = dist > 0.0001 ? diff / dist : vec2(0.0);

  float ehR = uEventHorizonRadius;
  float eR = uEinsteinRadius;

  // Scale up during entering animation
  float enterScale = 1.0 + uEnteringProgress * 8.0;
  ehR *= enterScale;
  eR *= enterScale;

  // Inside event horizon -> pure black
  if (dist < ehR) {
    // Photon sphere glow at the edge
    float edgeDist = dist / ehR;
    float glow = smoothstep(0.85, 1.0, edgeDist) * 0.15;
    gl_FragColor = vec4(glow * 0.8, glow * 0.6, glow * 0.3, 1.0);
    return;
  }

  // Gravitational lensing: lens equation beta = theta - einsteinRadius^2 / theta
  float theta = dist;
  float deflection = (eR * eR) / theta * uLensStrength;

  // The deflected source position
  float beta = theta + deflection;
  vec2 sourceAspect = aspectBH + dir * beta;

  // Convert back to UV space
  vec2 sourceUv = vec2(sourceAspect.x / uAspect + 0.5, sourceAspect.y + 0.5);

  // Sample background with clamping
  vec2 clampedUv = clamp(sourceUv, 0.0, 1.0);
  vec4 bgColor = texture2D(uBackgroundTexture, clampedUv);

  // Magnification factor - brighter near Einstein radius
  float magFactor = 1.0;
  float einsteinDist = abs(dist - eR);
  magFactor += smoothstep(eR * 0.4, 0.0, einsteinDist) * 1.5;

  // Photon sphere glow
  float photonDist = abs(dist - ehR * 1.5);
  float photonGlow = smoothstep(ehR * 0.5, 0.0, photonDist) * 0.12;
  vec3 glowColor = vec3(1.0, 0.82, 0.56) * photonGlow;

  vec3 finalColor = bgColor.rgb * magFactor + glowColor;

  // Entering animation: vignette darkening
  float vignette = 1.0 - uEnteringProgress * smoothstep(0.5, 0.0, dist) * 2.0;
  finalColor *= max(vignette, 0.0);

  gl_FragColor = vec4(finalColor, 1.0);
}
`

// --- Black hole core sphere shaders (dark sphere + edge glow) ---

export const blackHoleCoreVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const blackHoleCoreFragmentShader = /* glsl */ `
precision highp float;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
  float edgeGlow = pow(fresnel, 4.0) * 0.2;
  vec3 glowColor = vec3(1.0, 0.82, 0.56) * edgeGlow;
  gl_FragColor = vec4(glowColor, 1.0);
}
`
