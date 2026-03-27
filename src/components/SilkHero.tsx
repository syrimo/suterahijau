import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { Mesh, ShaderMaterial } from 'three'
import { Vector2 } from 'three'

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Distance from mouse
    float dist = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, dist) * 0.35;

    // === DEEP FABRIC FOLDS — layered frequencies ===

    // Primary drape — large sweeping folds like heavy silk pooling
    float fold1 = sin(pos.x * 1.5 + pos.y * 0.4 + uTime * 0.06) * 0.18;
    float fold2 = sin(pos.y * 1.3 - pos.x * 0.6 + uTime * 0.05) * 0.15;
    float fold3 = cos(pos.x * 0.8 + pos.y * 1.6 + uTime * 0.04) * 0.12;

    // Secondary folds — medium creases between big drapes
    float fold4 = sin(pos.x * 3.0 + pos.y * 2.2 + uTime * 0.08) * 0.06;
    float fold5 = cos(pos.x * 2.5 - pos.y * 3.0 + uTime * 0.07) * 0.05;
    float fold6 = sin(pos.x * 4.0 + pos.y * 1.5 - uTime * 0.06) * 0.04;

    // Tertiary — fine wrinkles and micro-creases
    float wrinkle1 = sin(pos.x * 7.0 + pos.y * 5.0 + uTime * 0.1) * 0.018;
    float wrinkle2 = sin(pos.x * 11.0 - pos.y * 8.0 + uTime * 0.06) * 0.010;
    float wrinkle3 = cos(pos.x * 15.0 + pos.y * 12.0 + uTime * 0.08) * 0.006;

    // Gathered center — fabric bunches toward center like draped on surface
    float centerDist = length(vec2(pos.x, pos.y) * 0.4);
    float gather = exp(-centerDist * centerDist * 0.8) * 0.10;

    // Mouse drag — fabric follows pointer
    float push = sin(dist * 8.0 - uTime * 1.5) * mouseInfluence;
    float lift = smoothstep(0.35, 0.0, dist) * 0.14;

    float elevation = fold1 + fold2 + fold3 + fold4 + fold5 + fold6
                    + wrinkle1 + wrinkle2 + wrinkle3 + gather + push + lift;
    pos.z = elevation;
    vElevation = elevation;

    // Analytical normal — derivative of all fold layers
    float dx = cos(pos.x * 1.5 + pos.y * 0.4 + uTime * 0.06) * 1.5 * 0.18
             + cos(pos.x * 3.0 + pos.y * 2.2 + uTime * 0.08) * 3.0 * 0.06
             - sin(pos.x * 2.5 - pos.y * 3.0 + uTime * 0.07) * 2.5 * 0.05
             + cos(pos.x * 7.0 + pos.y * 5.0 + uTime * 0.1) * 7.0 * 0.018;
    float dy = cos(pos.y * 1.3 - pos.x * 0.6 + uTime * 0.05) * 1.3 * 0.15
             + cos(pos.x * 0.8 + pos.y * 1.6 + uTime * 0.04) * 1.6 * 0.12
             + cos(pos.x * 3.0 + pos.y * 2.2 + uTime * 0.08) * 2.2 * 0.06;
    vNormal = normalize(vec3(-dx, -dy, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;

  void main() {
    // Deep silk green palette — richer range
    vec3 abyss = vec3(0.01, 0.06, 0.03);
    vec3 deepGreen = vec3(0.03, 0.18, 0.10);
    vec3 midGreen = vec3(0.07, 0.34, 0.22);
    vec3 brightGreen = vec3(0.12, 0.50, 0.33);
    vec3 highlight = vec3(0.22, 0.75, 0.50);
    vec3 sheen = vec3(0.35, 0.90, 0.60);

    // Dual lighting — main from top-left, rim from bottom-right
    vec3 lightDir1 = normalize(vec3(-0.4, -0.5, 1.0));
    vec3 lightDir2 = normalize(vec3(0.3, 0.4, 0.8));
    float diffuse1 = max(dot(vNormal, lightDir1), 0.0);
    float diffuse2 = max(dot(vNormal, lightDir2), 0.0) * 0.3;
    float diffuse = diffuse1 + diffuse2;

    // Anisotropic specular — silk has directional sheen
    float spec1 = pow(max(dot(reflect(-lightDir1, vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 48.0);
    float spec2 = pow(max(dot(reflect(-lightDir1, vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 12.0);
    float specular = spec1 * 0.6 + spec2 * 0.25;

    // Deep fold mapping — more contrast between peaks and valleys
    float foldLight = smoothstep(-0.2, 0.25, vElevation);
    float foldShadow = smoothstep(0.02, -0.25, vElevation);
    float deepCrease = smoothstep(-0.05, -0.3, vElevation);

    // Build color from depth
    vec3 color = mix(deepGreen, midGreen, diffuse * 0.7);
    color = mix(color, brightGreen, foldLight * diffuse * 0.8);
    color = mix(color, abyss, foldShadow * 0.5);
    color = mix(color, abyss * 0.5, deepCrease * 0.4);

    // Silk specular sheen — sharp catchlights on fold ridges
    color += highlight * specular * 0.35;
    color += sheen * spec1 * 0.15;

    // Subsurface scattering — light bleeding through thin folds
    float sss = smoothstep(0.1, 0.3, vElevation) * diffuse;
    color += vec3(0.02, 0.08, 0.04) * sss;

    // Silk iridescence — color shifts across fabric grain
    float irid = sin(vUv.x * 8.0 + vUv.y * 5.0 + uTime * 0.15) * 0.5 + 0.5;
    float irid2 = cos(vUv.x * 3.0 - vUv.y * 7.0 + uTime * 0.1) * 0.5 + 0.5;
    color += vec3(0.01, 0.03, 0.02) * irid * foldLight;
    color += vec3(0.005, 0.02, 0.015) * irid2 * (1.0 - foldShadow);

    // Mouse area — warm spotlight following cursor
    float dist = distance(vUv, uMouse);
    float glow = smoothstep(0.35, 0.0, dist) * 0.2;
    color += highlight * glow * 0.3;
    color += sheen * smoothstep(0.15, 0.0, dist) * 0.08;

    // Visible silk threads — warp and weft pattern
    float warp = sin(vUv.x * 2400.0) * 0.5 + 0.5;
    float weft = sin(vUv.y * 2400.0) * 0.5 + 0.5;
    float threadPattern = warp * weft;
    float threadShadow = smoothstep(0.3, 0.0, threadPattern) * 0.06;
    float threadHighlight = smoothstep(0.7, 1.0, threadPattern) * 0.04;
    color -= vec3(threadShadow) * foldLight;
    color += highlight * threadHighlight * foldLight * 0.3;

    // Diagonal twill weave — silk satin characteristic
    float twill = sin((vUv.x + vUv.y) * 1800.0) * 0.5 + 0.5;
    color += vec3(0.005, 0.015, 0.008) * twill * foldLight;

    // Fine grain noise
    float grain = fract(sin(dot(vUv * 400.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += grain * 0.006 * foldLight;

    // Deep vignette — fabric falls away at edges
    float vignette = smoothstep(0.0, 0.65, length(vUv - 0.5));
    color = mix(color, abyss, vignette * 0.55);

    gl_FragColor = vec4(color, 1.0);
  }
`

function SilkMesh() {
  const meshRef = useRef<Mesh>(null)
  const mouseRef = useRef(new Vector2(0.5, 0.5))
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new Vector2(0.5, 0.5) },
  }), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as ShaderMaterial
    material.uniforms.uTime.value = state.clock.elapsedTime

    const target = mouseRef.current
    const current = material.uniforms.uMouse.value
    current.x += (target.x - current.x) * 0.08
    current.y += (target.y - current.y) * 0.08
  })

  const handlePointerMove = (e: { uv?: { x: number; y: number } | null }) => {
    if (e.uv) {
      mouseRef.current.set(e.uv.x, e.uv.y)
    }
  }

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5, 256, 256]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function SilkHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2.2, 0], fov: 45, near: 0.1, far: 10 }}
          style={{ background: '#0a0a0a' }}
        >
          <SilkMesh />
        </Canvas>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center pointer-events-none">
        <img
          src="/logo-white.png"
          alt="Sutera Hijau"
          className="mb-6 h-14 opacity-90 drop-shadow-lg md:h-18 lg:h-20"
        />
        <p className="mt-2 text-sm tracking-[0.3em] text-white/60 uppercase md:text-base">
          Technology Incubator & Digital Solutions
        </p>
        <p className="mt-1 text-xs tracking-[0.2em] text-white/40 uppercase">
          Est. 2017 — Cyberjaya, Selangor
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] text-white/30 uppercase">Scroll</span>
          <div className="h-8 w-[1px] animate-pulse bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}
