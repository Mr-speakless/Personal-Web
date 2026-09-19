// --- Ray-marching black hole shaders ---
// Traces photon geodesics through Schwarzschild spacetime

export const rayMarchVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const rayMarchFragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D uBackgroundTexture; // FBO with icon thumbnails
uniform sampler2D uSpaceTexture;      // Starfield background image
uniform float uTime;
uniform float uAspect;
uniform vec2 uResolution;
uniform float uSchwarzschildRadius;
uniform float uAccretionInner;
uniform float uAccretionOuter;
uniform vec3 uColorInner;
uniform vec3 uColorMid;
uniform vec3 uColorOuter;
uniform vec3 uDiskNormal;
uniform vec3 uCameraPos;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;
uniform mat4 uInvViewMatrix;
uniform float uCameraFov;
uniform float uEnteringProgress;
uniform float uLensingRadius; // screen-space radius where lensing is full strength
uniform int uMaxSteps;
uniform float uSpaceTextureAspect; // width/height of the starfield texture
uniform float uSpaceOpacity;       // background starfield opacity (0-1)

varying vec2 vUv;

// ---- Noise ----

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

// ---- Accretion disk noise ----
// The ENTIRE disk rotates as one rigid body. No differential rotation
// means zero shearing, zero accumulation, guaranteed stable forever.
// Each ring has unique angular frequency + seed for visual variety.

float diskRingNoise(float rotAngle, float ringId, float baseFreq, float seed) {
  // Unique seed per ring
  float rSeed = hash(vec2(ringId, seed)) * 200.0;
  // Unique angular frequency per ring — creates visual variety
  float ringFreq = baseFreq * (0.6 + hash(vec2(ringId, seed + 77.0)) * 0.8);
  float cx = cos(rotAngle) * ringFreq + rSeed;
  float cy = sin(rotAngle) * ringFreq + rSeed * 0.73;
  return noise(vec2(cx, cy));
}

float diskPattern(float rotAngle, float t, float ringCount, float baseFreq, float seed) {
  float rPos = t * ringCount;
  float ringId0 = floor(rPos);
  float ringFrac = fract(rPos);

  float n0 = diskRingNoise(rotAngle, ringId0, baseFreq, seed);
  float n1 = diskRingNoise(rotAngle, ringId0 + 1.0, baseFreq, seed);

  return mix(n0, n1, smoothstep(0.2, 0.8, ringFrac));
}

// Multi-octave version
float diskFBM(float rotAngle, float t, float ringCount, float baseFreq, float seed) {
  float val = 0.0;
  float amp = 0.55;
  float fq = baseFreq;
  float rc = ringCount;
  for (int i = 0; i < 4; i++) {
    val += amp * diskPattern(rotAngle, t, rc, fq, seed + float(i) * 17.3);
    fq *= 1.8;
    rc *= 1.4;
    amp *= 0.5;
  }
  return val;
}

// ---- Accretion disk color ----

vec4 computeAccretionDisk(vec3 hitPos, float hitR, int hitOrder) {
  float t = (hitR - uAccretionInner) / (uAccretionOuter - uAccretionInner);
  t = clamp(t, 0.0, 1.0);

  float angle = atan(hitPos.z, hitPos.x);

  // SINGLE rotation speed for the entire disk — rigid body, zero shearing
  float rotAngle = angle + uTime * 0.3;

  // Large-scale structure
  float large = diskFBM(rotAngle, t, 6.0, 2.5, 0.0);

  // Medium detail
  float med = diskFBM(rotAngle, t, 14.0, 4.5, 50.0);

  // Fine grain
  float fine = diskPattern(rotAngle, t, 25.0, 8.0, 100.0);
  float fine2 = diskPattern(rotAngle, t, 40.0, 12.0, 170.0);

  // Combine
  float pattern = large * 0.4 + med * 0.3 + fine * 0.2 + fine2 * 0.1;

  // Contrast
  pattern = smoothstep(0.12, 0.78, pattern);

  // Color gradient
  vec3 color;
  if (t < 0.3) {
    color = mix(uColorInner, uColorMid, t / 0.3);
  } else {
    color = mix(uColorMid, uColorOuter, (t - 0.3) / 0.7);
  }

  // Brightness
  float brightness = pattern * 0.8 + 0.2;

  // Edge fading
  brightness *= smoothstep(0.0, 0.15, t);
  brightness *= smoothstep(1.0, 0.8, t);

  // Inner glow
  brightness *= 1.0 + (1.0 - t) * 0.7;

  // Doppler brightening
  float doppler = 1.0 + 0.4 * sin(rotAngle);
  brightness *= doppler;

  // Gravitational redshift
  float gFactor = sqrt(max(1.0 - uSchwarzschildRadius / hitR, 0.01));
  brightness *= gFactor;

  // Temperature gradient
  color *= 1.0 + (1.0 - t) * 0.3;

  // Secondary images dimmer
  if (hitOrder > 0) {
    brightness *= 0.6;
  }

  float alpha = brightness * 0.85;
  alpha *= smoothstep(0.0, 0.1, t);
  alpha *= smoothstep(1.0, 0.85, t);

  // Entering animation
  color += vec3(0.2, 0.15, 0.05) * uEnteringProgress;
  alpha *= 1.0 + uEnteringProgress * 0.5;

  return vec4(color * brightness, clamp(alpha, 0.0, 1.0));
}

// ---- Schwarzschild geodesic ----

vec3 geodesicAccel(vec3 pos, float h2, float rs) {
  float r2 = dot(pos, pos);
  float r = sqrt(r2);
  float r5 = r2 * r2 * r;
  return -1.5 * rs * h2 / r5 * pos;
}

vec2 escapedRayToUV(vec3 pos, vec3 vel) {
  vec3 farPoint = pos + normalize(vel) * 100.0;
  vec4 clipPos = uProjMatrix * uViewMatrix * vec4(farPoint, 1.0);
  vec2 ndc = clipPos.xy / clipPos.w;
  return ndc * 0.5 + 0.5;
}

// ---- Main ----

void main() {
  vec2 ndc = (vUv - 0.5) * 2.0;
  float fovScale = tan(uCameraFov * 0.5);
  vec3 rayDirView = normalize(vec3(ndc.x * uAspect * fovScale, ndc.y * fovScale, -1.0));
  vec3 rayDir = normalize((uInvViewMatrix * vec4(rayDirView, 0.0)).xyz);

  vec3 pos = uCameraPos;
  vec3 vel = rayDir;

  float rs = uSchwarzschildRadius;
  float photonSphereR = 1.5 * rs;

  // Lensing strength: 1.0 near center, fades to 0.0 outside uLensingRadius
  // Use aspect-corrected distance so the lensing falloff is circular on screen
  float screenDist = length(vec2(ndc.x * uAspect, ndc.y)) * 0.5;
  float lensingStrength = 1.0 - smoothstep(uLensingRadius, uLensingRadius + 0.15, screenDist);

  float effectiveRs = rs * lensingStrength;

  vec3 hVec = cross(pos, vel);
  float h2 = dot(hVec, hVec);

  vec3 diskColor = vec3(0.0);
  float diskAlpha = 0.0;
  int diskHits = 0;
  float minR = 1e6;
  bool captured = false;

  for (int i = 0; i < 300; i++) {
    if (i >= uMaxSteps) break;

    float r = length(pos);
    minR = min(minR, r);

    if (r < effectiveRs && effectiveRs > 0.01) {
      captured = true;
      break;
    }

    if (r > 50.0 && dot(pos, vel) > 0.0) break;

    // Adaptive step size
    float stepSize;
    float photonDist = abs(r - photonSphereR);

    if (photonDist < rs * 1.0) {
      stepSize = 0.005 + 0.02 * photonDist / rs;
    } else if (r < rs * 4.0) {
      stepSize = 0.02 * r;
    } else {
      stepSize = clamp(0.05 * r, 0.05, 1.5);
    }

    // RK4 with effective rs (gravity scaled by lensing strength)
    vec3 a1 = geodesicAccel(pos, h2, effectiveRs);
    vec3 v1 = vel;
    vec3 p2 = pos + 0.5 * stepSize * v1;
    vec3 v2v = vel + 0.5 * stepSize * a1;
    vec3 a2 = geodesicAccel(p2, h2, effectiveRs);
    vec3 p3 = pos + 0.5 * stepSize * v2v;
    vec3 v3v = vel + 0.5 * stepSize * a2;
    vec3 a3 = geodesicAccel(p3, h2, effectiveRs);
    vec3 p4 = pos + stepSize * v3v;
    vec3 v4v = vel + stepSize * a3;
    vec3 a4 = geodesicAccel(p4, h2, effectiveRs);

    vec3 newPos = pos + (stepSize / 6.0) * (v1 + 2.0 * v2v + 2.0 * v3v + v4v);
    vec3 newVel = vel + (stepSize / 6.0) * (a1 + 2.0 * a2 + 2.0 * a3 + a4);
    newVel = normalize(newVel);

    // Disk intersection (always uses real rs for accretion disk geometry)
    float prevSide = dot(pos, uDiskNormal);
    float currSide = dot(newPos, uDiskNormal);

    if (prevSide * currSide < 0.0) {
      float tHit = prevSide / (prevSide - currSide);
      vec3 hitPos = mix(pos, newPos, tHit);
      float hitR = length(hitPos);

      if (hitR > uAccretionInner && hitR < uAccretionOuter) {
        vec4 dColor = computeAccretionDisk(hitPos, hitR, diskHits);
        diskColor += dColor.rgb * dColor.a * (1.0 - diskAlpha);
        diskAlpha += dColor.a * (1.0 - diskAlpha);
        diskHits++;
      }
    }

    pos = newPos;
    vel = newVel;
  }

  // Background sampling — both space starfield and icon FBO get lensed
  vec3 finalColor = vec3(0.0);
  float finalAlpha = 1.0;

  if (captured) {
    // Inside event horizon: pure black, fully opaque
    finalColor = vec3(0.0);
    finalAlpha = 1.0;
  } else {
    vec2 bgUv = escapedRayToUV(pos, vel);
    bgUv = clamp(bgUv, 0.0, 1.0);

    // Lensed starfield background — "cover" UV to preserve texture aspect ratio
    vec2 spaceUv = bgUv;
    float screenAspect = uAspect;
    float texAspect = uSpaceTextureAspect;
    if (screenAspect > texAspect) {
      // Screen wider than texture: crop top/bottom
      float scale = texAspect / screenAspect;
      spaceUv.y = spaceUv.y * scale + (1.0 - scale) * 0.5;
    } else {
      // Texture wider than screen: crop left/right
      float scale = screenAspect / texAspect;
      spaceUv.x = spaceUv.x * scale + (1.0 - scale) * 0.5;
    }
    vec3 spaceColor = texture2D(uSpaceTexture, spaceUv).rgb * uSpaceOpacity;
    // Lensed icon thumbnails (composited on top of space)
    vec4 iconColor = texture2D(uBackgroundTexture, bgUv);
    // Icons over space
    finalColor = mix(spaceColor, iconColor.rgb, iconColor.a);
    finalAlpha = 1.0;
  }

  // Composite accretion disk
  finalColor = finalColor * (1.0 - diskAlpha) + diskColor;

  // Photon ring glow
  float ringDist = abs(minR - photonSphereR);
  float ringGlow = exp(-ringDist * ringDist / (0.02 * rs * rs)) * 0.4;
  finalColor += vec3(1.0, 0.85, 0.6) * ringGlow;

  // Entering animation
  if (uEnteringProgress > 0.0) {
    float vigDist = length(vUv - 0.5);
    float vignette = 1.0 - uEnteringProgress * smoothstep(0.2, 0.6, vigDist) * 2.0;
    finalColor *= max(vignette, 0.0);
    finalColor *= 1.0 + uEnteringProgress * 0.5;
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
`
