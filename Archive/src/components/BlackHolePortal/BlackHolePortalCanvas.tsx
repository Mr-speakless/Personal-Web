import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree, createPortal } from '@react-three/fiber'
import * as THREE from 'three'

import type { PortalTarget } from './types/portal.ts'
import { CAMERA_Z, FBO_RESOLUTION } from './utils/constants.ts'
import { RayMarchBlackHole } from './blackhole/RayMarchBlackHole.tsx'
import { PortalTargetsSystem } from './targets/PortalTargetsSystem.tsx'
import { PortalCameraRig } from './camera/PortalCameraRig.tsx'
import { PortalTransitionController } from './transition/PortalTransitionController.tsx'
import { PortalTargetMesh } from './targets/PortalTargetMesh.tsx'
import { useBlackHolePortalStore } from './store/useBlackHolePortalStore.ts'

interface SceneContentProps {
  targets: PortalTarget[]
  onEnterStart?: (target: PortalTarget) => void
  onEnterComplete?: (target: PortalTarget) => void
}

function BackgroundRenderer({
  children,
  fbo,
}: {
  children: React.ReactNode
  fbo: THREE.WebGLRenderTarget
}) {
  const bgScene = useMemo(() => new THREE.Scene(), [])
  const { camera, gl } = useThree()

  useFrame(() => {
    gl.setRenderTarget(fbo)
    gl.setClearColor(0x000000, 0)
    gl.clear()
    gl.render(bgScene, camera)
    gl.setRenderTarget(null)
  }, -1) // Run before main render

  return <>{createPortal(children, bgScene)}</>
}

function SceneContent({
  targets,
  onEnterStart,
  onEnterComplete,
}: SceneContentProps) {
  const fbo = useMemo(
    () =>
      new THREE.WebGLRenderTarget(FBO_RESOLUTION, FBO_RESOLUTION, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
      }),
    [],
  )

  const selectedId = useBlackHolePortalStore((s) => s.selectedTargetId)
  const hoveredId = useBlackHolePortalStore((s) => s.hoveredTargetId)

  // Shared mutable target array — PortalTargetsSystem mutates positions,
  // PortalTargetMesh reads them each frame via useFrame.
  const mutableTargets = useRef<PortalTarget[]>(
    targets.map((t) => ({ ...t })),
  )

  return (
    <>
      {/* Background targets rendered to offscreen FBO */}
      <BackgroundRenderer fbo={fbo}>
        {mutableTargets.current.map((target) => (
          <PortalTargetMesh
            key={target.id}
            target={target}
            isSelected={target.id === selectedId}
            isHovered={target.id === hoveredId}
          />
        ))}
      </BackgroundRenderer>

      {/* Ray-marched black hole (lensing + accretion disk + core) */}
      <RayMarchBlackHole backgroundTexture={fbo.texture} />

      {/* Target interaction system (click handling + motion updates) */}
      <PortalTargetsSystem
        mutableTargets={mutableTargets.current}
        onEnterStart={onEnterStart}
      />

      {/* Camera controller */}
      <PortalCameraRig />

      {/* Portal transition (pause → entering → navigating) */}
      <PortalTransitionController
        targets={targets}
        onEnterComplete={onEnterComplete}
      />
    </>
  )
}

interface BlackHolePortalCanvasProps {
  targets: PortalTarget[]
  onEnterStart?: (target: PortalTarget) => void
  onEnterComplete?: (target: PortalTarget) => void
}

export function BlackHolePortalCanvas({
  targets,
  onEnterStart,
  onEnterComplete,
}: BlackHolePortalCanvasProps) {
  return (
    <Canvas
      camera={{
        position: [0, 0, CAMERA_Z],
        fov: 60,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <SceneContent
          targets={targets}
          onEnterStart={onEnterStart}
          onEnterComplete={onEnterComplete}
        />
      </Suspense>
    </Canvas>
  )
}
