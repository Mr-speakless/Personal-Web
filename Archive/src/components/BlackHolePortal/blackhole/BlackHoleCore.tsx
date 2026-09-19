import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh, ShaderMaterial } from 'three'

import { EVENT_HORIZON_RADIUS } from '../utils/constants.ts'
import {
  blackHoleCoreVertexShader,
  blackHoleCoreFragmentShader,
} from './shaders/blackHoleShaders.ts'

export function BlackHoleCore() {
  const meshRef = useRef<Mesh>(null)
  const matRef = useRef<ShaderMaterial>(null)

  useFrame(() => {
    // Core sphere is static, no per-frame updates needed
  })

  return (
    <mesh ref={meshRef} renderOrder={2}>
      <sphereGeometry args={[EVENT_HORIZON_RADIUS, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={blackHoleCoreVertexShader}
        fragmentShader={blackHoleCoreFragmentShader}
        transparent={false}
        depthWrite={true}
      />
    </mesh>
  )
}
