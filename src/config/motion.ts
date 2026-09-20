/**
 * Motion, hero and material defaults. Values marked "Figma" come from annotations or component
 * descriptions; everything else is a tunable implementation default.
 */
export const motion = {
  // Milliseconds. Figma: button and card interactions use 350 ms Smart Animate.
  transitionMs: 350,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  // Pixels. Figma: floating navigation keeps 24 px from the top of the viewport.
  navigationTopPx: 24,

  /** Hero dot grid (Figma Work Title 35:3846 draws 15 columns × 9 rows of 4 px marks). */
  dots: {
    // Pixels between marks. Figma draws 15 × 9 on the 1472×643 stage (≈105 × 80); the user asked
    // for roughly double that density (2026-09-19), so the grid is derived from this spacing.
    spacingPx: 50,
    // Pixels. Size of one mark when idle.
    sizePx: 4,
    // Figma annotation: pointer influence radius ≈ 75 px, falling off with distance.
    pointerRadiusPx: 75,
    // Multiplier added to the mark size at the pointer centre (1 = doubles the size).
    extraScale: 1.2,
    // 0–1 alpha when idle and the extra alpha added at the pointer centre.
    baseAlpha: 0.85,
    extraAlpha: 0.15,
    // Idle colour is Figma --jg-subtle; the pointer pushes it toward white.
    idleColor: [118, 118, 118] as const,
    litColor: [255, 255, 255] as const,
  },

  /** Three.js hero logo. */
  logo: {
    // Fraction of the stage height the logo occupies; matches the static Figma render (image 1).
    fitHeight: 0.6,
    // Radians. Initial yaw so the first frame matches the static render (front face turned right).
    initialYawRad: 0.62,
    // Radians. Fixed tilt of the whole model (positive = viewer looks slightly from above).
    tiltXRad: 0.08,
    // Radians per second around the vertical axis. Negative reverses the spin.
    rotationYRadPerSecond: 0.32,
    // Camera vertical field of view in degrees and its distance in scene units.
    cameraFovDeg: 30,
    cameraDistance: 8,
    // Camera height in scene units, gives the slight top-down view of the render.
    cameraHeight: 0.9,
    // Renderer tone-mapping exposure (1 = neutral; lower darkens the whole model).
    exposure: 0.7,
    material: {
      // Base colour of the metal (sRGB hex).
      color: 0x8d9197,
      metalness: 0.9,
      // 0 = mirror, 1 = fully diffuse. ~0.3 keeps reflections but lets the pointer light read as a torch.
      roughness: 0.3,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18,
      // Thin-film iridescence adds subtle colour shifts across the surface (0 disables).
      iridescence: 0.35,
      iridescenceIOR: 1.6,
      // Strength of the environment reflections.
      envMapIntensity: 0.9,
    },
    /**
     * Studio environment baked into the reflections: emissive panels in a dark room. Each panel is a
     * plane that faces the origin; `intensity` > 1 makes it a highlight. Panels are what you see
     * sliding across the metal as it turns, so add/move them to change the look.
     */
    environment: {
      // Colour of the room behind the panels (hex) and its brightness (0 = black).
      ambientColor: 0x1b1d22,
      ambientIntensity: 0.25,
      panels: [
        { position: [-6, 5, 3], size: [10, 2.2], color: 0xfff4e2, intensity: 2.5 },
        { position: [7, 3, -2], size: [3, 9], color: 0xcfe0ff, intensity: 1.6 },
        { position: [0, -6, 4], size: [12, 1.6], color: 0xffd9e6, intensity: 1 },
        { position: [2, 7, 1], size: [4, 4], color: 0xffffff, intensity: 2 },
        { position: [-7, -2, -4], size: [3, 6], color: 0xe6eef5, intensity: 0.7 },
      ] as ReadonlyArray<{ position: readonly [number, number, number]; size: readonly [number, number]; color: number; intensity: number }>,
    },
    // Base rect area lights (scene units + colour hex + intensity in nits).
    baseLights: [
      { position: [-4, 3.5, 4], color: 0xfff1de, intensity: 4, size: [4, 4] },
      { position: [4.5, 2, 3], color: 0xd9e6ff, intensity: 3, size: [3, 5] },
      { position: [-2, -4, 3], color: 0xffd6e0, intensity: 2.5, size: [4, 3] },
      { position: [3, -2.5, -3], color: 0xffffff, intensity: 3, size: [4, 4] },
    ] as ReadonlyArray<{ position: readonly [number, number, number]; color: number; intensity: number; size: readonly [number, number] }>,
    /** Pointer-driven torch: a spot light that follows the cursor over the stage. */
    pointerLight: {
      // Candela. Three.js uses physically based units, so hundreds are normal for a torch.
      intensity: 220,
      color: 0xffffff,
      // Scene units: pointer position mapped to ±x/±y, and the light's z distance from the model.
      rangeX: 6,
      rangeY: 4,
      z: 5,
      // Cone angle in radians and softness of its edge (0–1).
      angleRad: 0.42,
      penumbra: 0.7,
      // Seconds for the light to ease toward the pointer (smaller = snappier).
      followSeconds: 0.12,
      // Where the torch rests when the pointer leaves the stage.
      restPosition: [2.5, 2, 5] as readonly [number, number, number],
    },
    // Seconds for the static render to cross-fade into the live model.
    revealSeconds: 0.6,
  },
} as const
