import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { useBlackHolePortalStore } from '../store/useBlackHolePortalStore.ts'
import {
  EVENT_HORIZON_RADIUS,
  EINSTEIN_RADIUS,
  LENSING_STRENGTH,
  CAMERA_Z,
} from '../utils/constants.ts'
import {
  lensingVertexShader,
  lensingFragmentShader,
} from './shaders/blackHoleShaders.ts'

interface LensingSystemProps {
  backgroundTexture: THREE.Texture
}

const bhWorldPos = new THREE.Vector3(0, 0, 0)
const projected = new THREE.Vector3()

export function LensingSystem({ backgroundTexture }: LensingSystemProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { camera, size } = useThree()

  const uniforms = useMemo(
    () => ({
      uBackgroundTexture: { value: backgroundTexture },
      uBlackHoleScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
      uEventHorizonRadius: { value: 0.08 },
      uEinsteinRadius: { value: 0.14 },
      uLensStrength: { value: LENSING_STRENGTH },
      uTime: { value: 0 },
      uAspect: { value: size.width / size.height },
      uEnteringProgress: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backgroundTexture],
  )

  useFrame(({ clock }) => {
    const mat = matRef.current
    if (!mat) return

    // Project black hole world position to screen UV
    projected.copy(bhWorldPos).project(camera)
    const screenX = (projected.x + 1) / 2
    const screenY = (projected.y + 1) / 2

    mat.uniforms.uBlackHoleScreenPos.value.set(screenX, screenY)
    mat.uniforms.uTime.value = clock.getElapsedTime()
    mat.uniforms.uAspect.value = size.width / size.height

    // Calculate screen-space radii based on camera distance
    const camDist = camera.position.z || CAMERA_Z
    const scale = 1.0 / camDist
    mat.uniforms.uEventHorizonRadius.value = EVENT_HORIZON_RADIUS * scale * 0.5
    mat.uniforms.uEinsteinRadius.value = EINSTEIN_RADIUS * scale * 0.5

    // Update entering progress
    const portalState = useBlackHolePortalStore.getState().portalState
    const currentProgress = mat.uniforms.uEnteringProgress.value
    const targetProgress = portalState === 'entering' ? 1 : 0
    mat.uniforms.uEnteringProgress.value +=
      (targetProgress - currentProgress) * 0.05

    mat.uniforms.uBackgroundTexture.value = backgroundTexture
  })

  return (
    <mesh renderOrder={0} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={lensingVertexShader}
        fragmentShader={lensingFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        transparent={true}
      />
    </mesh>
  )
}
