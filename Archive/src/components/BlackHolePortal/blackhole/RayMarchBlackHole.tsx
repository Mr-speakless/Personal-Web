import { useRef, useMemo } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

import { useBlackHolePortalStore } from '../store/useBlackHolePortalStore.ts'
import {
  SCHWARZSCHILD_RADIUS,
  ACCRETION_INNER_RADIUS,
  ACCRETION_OUTER_RADIUS,
  ACCRETION_COLOR_INNER,
  ACCRETION_COLOR_MID,
  ACCRETION_COLOR_OUTER,
  DISK_TILT_ANGLE,
  RAY_MARCH_STEPS,
  LENSING_RADIUS,
} from '../utils/constants.ts'
import {
  rayMarchVertexShader,
  rayMarchFragmentShader,
} from './shaders/rayMarchShaders.ts'
import { withBase } from '../../../lib/basePath.ts'

interface RayMarchBlackHoleProps {
  backgroundTexture: THREE.Texture
}

export function RayMarchBlackHole({ backgroundTexture }: RayMarchBlackHoleProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { camera, size } = useThree()

  // Load starfield background for lensed space rendering
  const spaceTexture = useLoader(
    THREE.TextureLoader,
    withBase('/assets/images/backgrounds/stars-landing.png'),
  )

  // Compute space texture aspect ratio for "cover" UV mapping
  const spaceTextureAspect = useMemo(() => {
    if (spaceTexture.image) {
      return spaceTexture.image.width / spaceTexture.image.height
    }
    return 1
  }, [spaceTexture])

  // Compute disk normal from tilt angle
  // The disk is in the xz plane, tilted slightly toward the camera
  const diskNormal = useMemo(() => {
    // Tilt the disk normal from pure Y-axis by DISK_TILT_ANGLE around X-axis
    // Normal starts as (0,1,0) for xz plane, tilted by DISK_TILT_ANGLE around X
    // Original mesh rotation was [-PI/2 + 0.15, 0, 0], giving normal z-component positive
    return new THREE.Vector3(
      0.0,
      Math.cos(DISK_TILT_ANGLE),
      Math.sin(DISK_TILT_ANGLE),
    )
  }, [])

  const uniforms = useMemo(
    () => ({
      uBackgroundTexture: { value: backgroundTexture },
      uSpaceTexture: { value: spaceTexture },
      uTime: { value: 0 },
      uAspect: { value: size.width / size.height },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },

      // Black hole
      uSchwarzschildRadius: { value: SCHWARZSCHILD_RADIUS },
      uAccretionInner: { value: ACCRETION_INNER_RADIUS },
      uAccretionOuter: { value: ACCRETION_OUTER_RADIUS },

      // Colors
      uColorInner: { value: new THREE.Vector3(...ACCRETION_COLOR_INNER) },
      uColorMid: { value: new THREE.Vector3(...ACCRETION_COLOR_MID) },
      uColorOuter: { value: new THREE.Vector3(...ACCRETION_COLOR_OUTER) },

      // Disk orientation
      uDiskNormal: { value: diskNormal },

      // Camera (updated every frame)
      uCameraPos: { value: new THREE.Vector3() },
      uViewMatrix: { value: new THREE.Matrix4() },
      uProjMatrix: { value: new THREE.Matrix4() },
      uInvViewMatrix: { value: new THREE.Matrix4() },
      uCameraFov: { value: (60 * Math.PI) / 180 },

      // Animation
      uEnteringProgress: { value: 0 },

      // Lensing range
      uLensingRadius: { value: LENSING_RADIUS },

      // Space texture
      uSpaceTextureAspect: { value: spaceTextureAspect },
      uSpaceOpacity: { value: 0.65 },

      // Performance
      uMaxSteps: { value: RAY_MARCH_STEPS },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backgroundTexture],
  )

  useFrame(({ clock }) => {
    const mat = matRef.current
    if (!mat) return

    // Update time
    mat.uniforms.uTime.value = clock.getElapsedTime()

    // Update aspect ratio
    mat.uniforms.uAspect.value = size.width / size.height
    mat.uniforms.uResolution.value.set(size.width, size.height)

    // Responsive black hole sizing for small screens
    const isSmallScreen = size.width < 768
    mat.uniforms.uSchwarzschildRadius.value = isSmallScreen ? 0.2 : SCHWARZSCHILD_RADIUS
    mat.uniforms.uAccretionInner.value = isSmallScreen ? 0.4 : ACCRETION_INNER_RADIUS
    mat.uniforms.uAccretionOuter.value = isSmallScreen ? 5.0 : ACCRETION_OUTER_RADIUS

    // Update camera uniforms
    mat.uniforms.uCameraPos.value.copy(camera.position)
    mat.uniforms.uViewMatrix.value.copy(camera.matrixWorldInverse)
    mat.uniforms.uProjMatrix.value.copy(camera.projectionMatrix)
    mat.uniforms.uInvViewMatrix.value.copy(camera.matrixWorld)

    // Update FOV (may change during entering animation)
    const perspCam = camera as THREE.PerspectiveCamera
    if (perspCam.fov !== undefined) {
      mat.uniforms.uCameraFov.value = (perspCam.fov * Math.PI) / 180
    }

    // Update entering progress
    const portalState = useBlackHolePortalStore.getState().portalState
    const currentProgress = mat.uniforms.uEnteringProgress.value
    const targetProgress = portalState === 'entering' ? 1 : 0
    mat.uniforms.uEnteringProgress.value +=
      (targetProgress - currentProgress) * 0.05

    // Keep background texture ref fresh
    mat.uniforms.uBackgroundTexture.value = backgroundTexture
  })

  return (
    <mesh renderOrder={0} frustumCulled={false} raycast={() => null}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={rayMarchVertexShader}
        fragmentShader={rayMarchFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        transparent={true}
      />
    </mesh>
  )
}
