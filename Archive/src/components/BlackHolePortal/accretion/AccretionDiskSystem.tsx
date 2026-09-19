import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { useBlackHolePortalStore } from '../store/useBlackHolePortalStore.ts'
import {
  ACCRETION_INNER_RADIUS,
  ACCRETION_OUTER_RADIUS,
  ACCRETION_COLOR_INNER,
  ACCRETION_COLOR_MID,
  ACCRETION_COLOR_OUTER,
} from '../utils/constants.ts'
import {
  accretionVertexShader,
  accretionFragmentShader,
} from './shaders/accretionShaders.ts'

export function AccretionDiskSystem() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uInnerRadius: { value: ACCRETION_INNER_RADIUS },
      uOuterRadius: { value: ACCRETION_OUTER_RADIUS },
      uColorInner: { value: new THREE.Vector3(...ACCRETION_COLOR_INNER) },
      uColorMid: { value: new THREE.Vector3(...ACCRETION_COLOR_MID) },
      uColorOuter: { value: new THREE.Vector3(...ACCRETION_COLOR_OUTER) },
      uEnteringProgress: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    const mat = matRef.current
    if (!mat) return

    mat.uniforms.uTime.value = clock.getElapsedTime()

    const portalState = useBlackHolePortalStore.getState().portalState
    const currentProgress = mat.uniforms.uEnteringProgress.value
    const targetProgress = portalState === 'entering' ? 1 : 0
    mat.uniforms.uEnteringProgress.value +=
      (targetProgress - currentProgress) * 0.05
  })

  return (
    <mesh rotation={[-Math.PI / 2 + 0.15, 0, 0]} renderOrder={1}>
      <ringGeometry
        args={[
          ACCRETION_INNER_RADIUS,
          ACCRETION_OUTER_RADIUS,
          128,
          8,
        ]}
      />
      <shaderMaterial
        ref={matRef}
        vertexShader={accretionVertexShader}
        fragmentShader={accretionFragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
