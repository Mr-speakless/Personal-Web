import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { motion } from '../../config/motion'
import { media } from '../../content/media'

const { logo } = motion

/** White→black ramp used to fade a panel along one axis (multiplied with the panel colour). */
function gradientTexture(axis: 'x' | 'y') {
  const canvas = document.createElement('canvas')
  canvas.width = axis === 'x' ? 256 : 1
  canvas.height = axis === 'y' ? 256 : 1
  const ctx = canvas.getContext('2d')!
  const ramp = ctx.createLinearGradient(0, 0, axis === 'x' ? 256 : 0, axis === 'y' ? 256 : 0)
  ramp.addColorStop(0, '#fff')
  ramp.addColorStop(0.55, '#888')
  ramp.addColorStop(1, '#000')
  ctx.fillStyle = ramp
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Dark room with emissive panels; baked by PMREM into the metal's reflections (see motion.logo.environment). */
function buildStudioEnvironment() {
  const env = new THREE.Scene()
  const { ambientColor, ambientIntensity, panels } = logo.environment
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(ambientColor).multiplyScalar(ambientIntensity), side: THREE.BackSide }),
  )
  env.add(room)
  for (const panel of panels) {
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(panel.color).multiplyScalar(panel.intensity), side: THREE.DoubleSide })
    if (panel.gradient) material.map = gradientTexture(panel.gradient)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(panel.size[0], panel.size[1]), material)
    mesh.position.set(...panel.position)
    mesh.lookAt(0, 0, 0)
    env.add(mesh)
  }
  return env
}

/**
 * Hero logo (Figma 35:3846 + annotation): the user's LOGO3D.obj spinning around its vertical axis
 * with a metallic PBR material, four tinted area lights and a pointer-driven torch.
 * The static Figma render stays visible until the first live frame, then cross-fades out so the
 * logo never jumps in size on load. All tunables live in `motion.logo`.
 */
export function LogoScene() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }) }
    catch { return }
    RectAreaLightUniformsLib.init()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = logo.exposure
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(logo.cameraFovDeg, 1, 0.1, 100)
    camera.position.set(0, logo.cameraHeight, logo.cameraDistance)
    camera.lookAt(0, 0, 0)
    const viewHeight = 2 * logo.cameraDistance * Math.tan(THREE.MathUtils.degToRad(logo.cameraFovDeg) / 2)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = buildStudioEnvironment()
    const envMap = pmrem.fromScene(envScene, 0.04).texture
    scene.environment = envMap

    const m = logo.material
    const material = new THREE.MeshPhysicalMaterial({
      color: m.color, metalness: m.metalness, roughness: m.roughness,
      clearcoat: m.clearcoat, clearcoatRoughness: m.clearcoatRoughness,
      iridescence: m.iridescence, iridescenceIOR: m.iridescenceIOR,
      envMapIntensity: m.envMapIntensity,
    })

    // Tilt is applied on an outer pivot so the continuous yaw stays a clean vertical spin.
    const pivot = new THREE.Group()
    pivot.rotation.x = logo.tiltXRad
    const spinner = new THREE.Group()
    spinner.rotation.y = logo.initialYawRad
    pivot.add(spinner)
    scene.add(pivot)

    for (const light of logo.baseLights) {
      const rect = new THREE.RectAreaLight(light.color, light.intensity, light.size[0], light.size[1])
      rect.position.set(...light.position)
      rect.lookAt(0, 0, 0)
      scene.add(rect)
    }
    const p = logo.pointerLight
    const torch = new THREE.SpotLight(p.color, p.intensity, 0, p.angleRad, p.penumbra, 2)
    torch.position.set(...p.restPosition)
    torch.target.position.set(0, 0, 0)
    scene.add(torch, torch.target)
    const torchGoal = new THREE.Vector3(...p.restPosition)

    let loaded = false
    let visible = true
    // Drag-to-rotate state: while dragging, yaw follows the pointer; after release, the fling decays.
    let dragging = false
    let dragLastX = 0
    let dragLastTime = 0
    let flingRadPerSecond = 0
    let raf = 0
    let last = 0
    let disposed = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const step = (dt: number) => {
      if (loaded && !dragging) {
        if (!reduced.matches) spinner.rotation.y += logo.rotationYRadPerSecond * dt
        spinner.rotation.y += flingRadPerSecond * dt
        flingRadPerSecond *= Math.pow(logo.drag.inertiaPerSecond, dt)
        if (Math.abs(flingRadPerSecond) < 0.001) flingRadPerSecond = 0
      }
      torch.position.lerp(torchGoal, 1 - Math.exp(-dt / p.followSeconds))
      renderer.render(scene, camera)
    }
    const render = (time: number) => {
      raf = 0
      if (!visible || document.hidden || disposed) return
      const dt = Math.min((time - last) / 1000 || 0, 0.05)
      last = time
      step(dt)
      const settled = torch.position.distanceTo(torchGoal) < 0.01 && flingRadPerSecond === 0 && !dragging
      if (!reduced.matches || !settled) raf = requestAnimationFrame(render)
    }
    if (import.meta.env.DEV) Object.assign(window, { __logoDebug: { scene, renderer, camera, material, torch, torchGoal, spinner, step } })
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(render) }
    const resize = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      start()
    })
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else { cancelAnimationFrame(raf); raf = 0 } })
    const pointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      torchGoal.set(
        ((event.clientX - rect.left) / rect.width - 0.5) * p.rangeX,
        (0.5 - (event.clientY - rect.top) / rect.height) * p.rangeY,
        p.z,
      )
      start()
    }
    const dragStart = (event: PointerEvent) => {
      if (!loaded || event.button !== 0) return
      dragging = true
      flingRadPerSecond = 0
      dragLastX = event.clientX
      dragLastTime = performance.now()
      host.setPointerCapture(event.pointerId)
      host.classList.add('logo-scene--dragging')
      start()
    }
    const dragMove = (event: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const dx = event.clientX - dragLastX
      const dtSec = Math.max((now - dragLastTime) / 1000, 1 / 240)
      spinner.rotation.y += dx * logo.drag.radPerPx
      flingRadPerSecond = (dx * logo.drag.radPerPx) / dtSec
      dragLastX = event.clientX
      dragLastTime = now
      start()
    }
    const dragEnd = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId)
      host.classList.remove('logo-scene--dragging')
      // A pause before release means no fling.
      if (performance.now() - dragLastTime > 80) flingRadPerSecond = 0
      start()
    }
    const leave = () => { torchGoal.set(...p.restPosition); start() }
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0 } else start() }
    resize.observe(host)
    intersection.observe(host)
    host.addEventListener('pointermove', pointer)
    host.addEventListener('pointerleave', leave)
    host.addEventListener('pointerdown', dragStart)
    host.addEventListener('pointermove', dragMove)
    host.addEventListener('pointerup', dragEnd)
    host.addEventListener('pointercancel', dragEnd)
    document.addEventListener('visibilitychange', onVisibility)
    reduced.addEventListener('change', start)

    new OBJLoader().load('/assets/3d/LOGO3D.obj', (object) => {
      if (disposed) return
      object.traverse((child) => { if (child instanceof THREE.Mesh) child.material = material })
      const box = new THREE.Box3().setFromObject(object)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      object.position.sub(center)
      // Scale so the model's height matches the same fraction of the stage as the static render.
      object.scale.setScalar((viewHeight * logo.fitHeight) / size.y)
      spinner.add(object)
      loaded = true
      // Render one frame before revealing so the cross-fade starts from a drawn model.
      renderer.render(scene, camera)
      setReady(true)
      start()
    }, undefined, () => { /* static Figma render remains visible */ })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      resize.disconnect(); intersection.disconnect()
      host.removeEventListener('pointermove', pointer)
      host.removeEventListener('pointerleave', leave)
      host.removeEventListener('pointerdown', dragStart)
      host.removeEventListener('pointermove', dragMove)
      host.removeEventListener('pointerup', dragEnd)
      host.removeEventListener('pointercancel', dragEnd)
      document.removeEventListener('visibilitychange', onVisibility)
      reduced.removeEventListener('change', start)
      spinner.traverse((child) => { if (child instanceof THREE.Mesh) child.geometry.dispose() })
      material.dispose(); envMap.dispose(); pmrem.dispose(); renderer.dispose()
      envScene.traverse((child) => { if (child instanceof THREE.Mesh) { child.geometry.dispose(); const m = child.material as THREE.MeshBasicMaterial; m.map?.dispose(); m.dispose() } })
      renderer.domElement.remove()
    }
  }, [])
  return <div className={`logo-scene ${ready ? 'logo-scene--live' : ''}`} ref={hostRef} aria-label="Rotating three-dimensional Shuoyue Wu logo">
    <img className="logo-scene__still" src={media.work.imgImage1} alt="" style={{ transitionDuration: `${logo.revealSeconds}s` }} />
  </div>
}
