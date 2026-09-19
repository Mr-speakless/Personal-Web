import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- SHADERS ---
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

// Generate smooth 2D noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  0.366025403784439, -0.577350269189626,  0.024390243902439); 
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Distortion vectors via noise
  float noise1 = snoise(uv * 2.0 + uTime * 0.1);
  float noise2 = snoise(uv * 3.0 - uTime * 0.15 + vec2(100.0, -50.0));
  vec2 distortedUv = uv + vec2(noise1, noise2) * 0.1;
  
  // Create a flowing heightmap noise
  float fluidPattern = snoise(distortedUv * 3.0 - uTime * 0.15);
  
  // Compute normal via finite difference for real 3D light interactions
  float eps = 0.01;
  float nx = snoise((distortedUv + vec2(eps, 0.0)) * 3.0 - uTime * 0.15) - snoise((distortedUv - vec2(eps, 0.0)) * 3.0 - uTime * 0.15);
  float ny = snoise((distortedUv + vec2(0.0, eps)) * 3.0 - uTime * 0.15) - snoise((distortedUv - vec2(0.0, eps)) * 3.0 - uTime * 0.15);
  
  // Assume generic z-depth for the ripples
  vec3 normal = normalize(vec3(-nx * 2.0, -ny * 2.0, 1.0));
  
  // Lighting Setup
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 lightDir = normalize(vec3(-1.0, 1.0, 1.0)); // Top-left light
  vec3 halfVector = normalize(lightDir + viewDir);
  
  // 1. Fresnel (Edge reflection)
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  
  // 2. Specular (Direct light ping)
  float specular = pow(max(dot(normal, halfVector), 0.0), 64.0) * 1.5;
  
  // 3. Caustics / bright refractive bands
  float caustic = smoothstep(0.4, 0.6, abs(fluidPattern)) * 0.5;
  
  // Colors (Extremely subtle base to prioritize transparency)
  vec3 baseColor = vec3(0.02, 0.02, 0.03); 
  
  // Iridescent shift based on normal facing
  vec3 iridescence = vec3(
    0.5 + 0.5 * cos(uTime * 0.3 + normal.x * 3.0 + vec3(0, 2, 4)),
    0.5 + 0.5 * cos(uTime * 0.4 + normal.y * 3.0 + vec3(1, 3, 5)),
    0.5 + 0.5 * cos(uTime * 0.2 + (normal.x+normal.y) * 2.0 + vec3(2, 4, 1))
  );
  
  // Comping the colors
  // Mix base color with iridescence at the prominent ripples
  vec3 glassReflection = mix(baseColor, iridescence, caustic + fresnel * 0.5);
  
  // Add bright highlights
  vec3 finalColor = glassReflection + vec3(specular) + vec3(fresnel * 0.3) + vec3(caustic * 0.2);
  
  // Add slight vignette to the corners for roundness illusion
  float dist = length(vUv - 0.5);
  float vignette = smoothstep(0.4, 0.9, dist);
  finalColor -= vignette * 0.1;

  // Base transparency is very high (alpha ~0.15), peaking at edges and highlights
  float alpha = 0.15 + fresnel * 0.7 + specular + caustic * 0.3;
  
  gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.95)); 
}
`

const LiquidMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent={true}
      depthWrite={false}
    />
  )
}

export function LiquidGlassShader() {
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: true }}
      >
        <mesh>
          <planeGeometry args={[2, 2]} />
          <LiquidMaterial />
        </mesh>
      </Canvas>
    </div>
  )
}
