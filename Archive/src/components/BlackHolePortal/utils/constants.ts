// ============================================================
// Black hole geometry
// All units are in world-space (arbitrary scale).
// The black hole sits at the origin (0, 0, 0).
// ============================================================
export const EVENT_HORIZON_RADIUS = 0       // Visual radius of the dark sphere (not used in ray marching directly)
export const PHOTON_SPHERE_RADIUS = 0      // Where light can orbit the black hole (= 1.5 × Schwarzschild in real physics)
export const EINSTEIN_RADIUS = 0              // Reference radius for Einstein ring visual effects
export const SCHWARZSCHILD_RADIUS = 0.4       // Controls gravity strength in the ray marching shader. Larger = stronger lensing & bigger shadow
export const ACCRETION_INNER_RADIUS = 0.8       // Inner edge of accretion disk (closest to black hole)
export const ACCRETION_OUTER_RADIUS = 10.0    // Outer edge of accretion disk (how far the disk extends)

// ============================================================
// Ray marching
// Controls quality & performance of the geodesic ray tracer
// ============================================================
export const RAY_MARCH_STEPS = 200            // Max integration steps per pixel. Higher = more accurate but slower
export const RAY_MARCH_MAX_DISTANCE = 50.0    // Rays are terminated if they travel this far from origin
export const DISK_TILT_ANGLE = 0.15           // Tilt of accretion disk toward camera (radians). 0 = edge-on, π/2 = face-on

// ============================================================
// Target plane
// Icons float on a 2D plane behind the black hole.
// The plane is invisible — icons are rendered to an FBO
// which the ray marching shader samples with gravitational lensing.
// ============================================================
export const TARGET_PLANE_Z = -10             // Z position of the icon plane (negative = behind the black hole, away from camera)
export const TARGET_PLANE_WIDTH = 90          // Horizontal extent of the floating area (world units)
export const TARGET_PLANE_HEIGHT = 60         // Vertical extent of the floating area (world units)
export const TARGET_SIZE = 1.8                // Visual diameter of each circular icon (world units)
export const TARGET_COLLISION_RADIUS = 1.2    // Collision radius for icon-to-icon repulsion

// ============================================================
// Camera
// Camera looks at origin from +Z axis. See PortalCameraRig.tsx for full docs.
// ============================================================
export const CAMERA_Z = 12                    // Default camera distance from origin along Z
export const CAMERA_DRIFT_RANGE = 0.3         // Max XY offset from mouse movement (subtle parallax)

// ============================================================
// Motion
// Controls idle floating behavior (Brownian random walk)
// ============================================================
export const IDLE_SPEED_BASE = 2              // Base speed multiplier for idle motion
export const IDLE_SPEED_VARIANCE = 1          // Random variance added to base speed
export const IDLE_DAMPING = 0.985             // Per-frame velocity decay (0–1). Lower = more friction, icons slow faster
export const IDLE_RANDOM_FORCE = 0.6          // Strength of random Brownian perturbation per frame
export const BOUNDARY_REPULSION = 1.0         // Force pushing icons back when they approach plane edges

// ============================================================
// Targeting
// When an icon is selected, it lerps toward center (0,0)
// ============================================================
export const TARGETING_LERP_SPEED = 3.0       // Damped lerp speed toward center (higher = faster approach)
export const ARRIVAL_THRESHOLD = 0.3          // Distance from center at which the icon is considered "arrived"

// ============================================================
// Portal animation
// Sequence: idle → targeting → portalPause → entering → navigating
// ============================================================
export const PORTAL_PAUSE_DURATION = 0.6      // Seconds to hold before the camera plunge begins
export const ENTERING_DURATION = 1.2          // Seconds for the camera to rush into the black hole
export const ENTERING_CAMERA_END_Z = 0.5      // Final camera Z at end of plunge (near the origin)

// ============================================================
// Lensing shader
// Controls how the gravitational lensing effect is applied
// ============================================================
export const LENSING_STRENGTH = 0.6             // Overall gravity multiplier (1 = physically correct, <1 = weaker lensing)
export const LENSING_RADIUS = 0.15              // Aspect-corrected screen-space radius where lensing is at full strength. Now circular (not elliptical)
export const FBO_RESOLUTION = 1024            // Resolution of the offscreen render target for icon textures (px)

// ============================================================
// Accretion disk colors
// Three-point gradient from inner (hottest) to outer (coolest)
// ============================================================
export const ACCRETION_COLOR_INNER = [1.0, 0.765, 0.463] as const  // #ffc376 — bright gold (inner, hottest)
export const ACCRETION_COLOR_MID = [0.894, 0.761, 0.612] as const  // #e4c29c — warm tan (mid)
export const ACCRETION_COLOR_OUTER = [1.0, 0.863, 0.714] as const  // #ffdcb6 — pale gold (outer, coolest)
