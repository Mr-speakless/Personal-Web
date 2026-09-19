import { useRef, useMemo } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import type { PortalTarget } from '../types/portal.ts'
import { TARGET_PLANE_Z, TARGET_SIZE } from '../utils/constants.ts'

// Circular clip shader for target thumbnails with click pulse animation
const targetVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const targetFragmentShader = /* glsl */ `
precision highp float;
uniform sampler2D uTexture;
uniform float uSelected;
uniform float uClickPulse;
uniform float uHover; // 0 → 1 smooth hover transition
varying vec2 vUv;

void main() {
  vec2 centered = vUv - 0.5;

  // Scale pop: slight zoom during pulse + hover scale-up
  float scaleAnim = 1.0 + sin(uClickPulse * 3.14159) * 0.1 + uHover * 0.06;
  centered /= scaleAnim;

  float dist = length(centered);

  // Circular clip
  if (dist > 0.5) discard;

  // Sample texture with scaled UVs
  vec2 scaledUv = centered + 0.5;
  vec4 texColor = texture2D(uTexture, scaledUv);

  // Border glow when selected
  float border = smoothstep(0.45, 0.48, dist) * uSelected;
  vec3 borderColor = vec3(1.0, 0.82, 0.56);
  texColor.rgb = mix(texColor.rgb, borderColor, border * 0.8);

  // Soft edge
  float alpha = smoothstep(0.5, 0.47, dist);
  texColor.a *= alpha;

  // Subtle shadow/glow around the circle
  float outerGlow = smoothstep(0.5, 0.42, dist) * 0.15;
  texColor.rgb += vec3(1.0, 1.0, 1.0) * outerGlow;

  // Hover: soft bright rim + slight brightness lift
  if (uHover > 0.01) {
    float rim = smoothstep(0.38, 0.47, dist) * uHover;
    texColor.rgb += vec3(1.0, 0.95, 0.85) * rim * 0.6;
    texColor.rgb *= 1.0 + uHover * 0.15;
  }

  // Click pulse: expanding golden ring
  float pulse = sin(uClickPulse * 3.14159); // 0 -> 1 -> 0
  if (pulse > 0.01) {
    float ringRadius = 0.2 + pulse * 0.3;
    float ringDist = abs(dist - ringRadius);
    float ring = smoothstep(0.04, 0.0, ringDist) * pulse;
    texColor.rgb += vec3(1.0, 0.85, 0.6) * ring * 1.5;

    // Brightness boost during pulse
    texColor.rgb *= 1.0 + pulse * 0.3;
  }

  gl_FragColor = texColor;
}
`

interface PortalTargetMeshProps {
  target: PortalTarget
  isSelected: boolean
  isHovered: boolean
}

export function PortalTargetMesh({ target, isSelected, isHovered }: PortalTargetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef(0)
  const wasSelectedRef = useRef(false)

  const texture = useLoader(THREE.TextureLoader, target.image)

  const hoverRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uSelected: { value: 0 },
      uClickPulse: { value: 0 },
      uHover: { value: 0 },
    }),
    [texture],
  )

  useFrame((_, delta) => {
    // Update position every frame (target.x/y are mutated by PortalTargetsSystem)
    if (meshRef.current) {
      meshRef.current.position.set(target.x, target.y, TARGET_PLANE_Z)
    }

    // Detect selection start to trigger pulse
    if (isSelected && !wasSelectedRef.current) {
      pulseRef.current = 0 // Reset pulse on new selection
    }
    wasSelectedRef.current = isSelected

    // Animate pulse
    if (isSelected && pulseRef.current < 1.0) {
      pulseRef.current = Math.min(pulseRef.current + delta * 2.5, 1.0)
    } else if (!isSelected) {
      pulseRef.current = Math.max(pulseRef.current - delta * 4.0, 0)
    }

    // Smooth hover transition
    const hoverTarget = isHovered ? 1.0 : 0.0
    hoverRef.current += (hoverTarget - hoverRef.current) * Math.min(delta * 8, 1)
    uniforms.uHover.value = hoverRef.current

    uniforms.uClickPulse.value = pulseRef.current
    uniforms.uSelected.value = isSelected ? 1.0 : 0.0
  })

  return (
    <mesh
      ref={meshRef}
      position={[target.x, target.y, TARGET_PLANE_Z]}
      renderOrder={isSelected ? 5 : 3}
    >
      <planeGeometry args={[TARGET_SIZE, TARGET_SIZE]} />
      <shaderMaterial
        vertexShader={targetVertexShader}
        fragmentShader={targetFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}
