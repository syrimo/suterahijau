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

    // Draped fabric folds — super slow idle breathing
    float fold1 = sin(pos.x * 2.0 + pos.y * 0.5 + uTime * 0.06) * 0.12;
    float fold2 = sin(pos.y * 1.8 - pos.x * 0.7 + uTime * 0.05) * 0.10;
    float fold3 = sin(pos.x * 3.5 + pos.y * 2.5 + uTime * 0.08) * 0.05;
    float fold4 = cos(pos.x * 1.2 - pos.y * 2.8 + uTime * 0.07) * 0.07;

    // Wrinkle detail — barely moving
    float wrinkle1 = sin(pos.x * 8.0 + pos.y * 6.0 + uTime * 0.1) * 0.015;
    float wrinkle2 = sin(pos.x * 12.0 - pos.y * 9.0 + uTime * 0.06) * 0.008;

    // Mouse drag — fabric follows pointer, pulls cloth toward cursor
    float push = sin(dist * 8.0 - uTime * 1.5) * mouseInfluence;
    float lift = smoothstep(0.35, 0.0, dist) * 0.14;

    float elevation = fold1 + fold2 + fold3 + fold4 + wrinkle1 + wrinkle2 + push + lift;
    pos.z = elevation;
    vElevation = elevation;

    // Calculate normal for lighting
    float dx = cos(pos.x * 2.0 + pos.y * 0.5 + uTime * 0.06) * 2.0 * 0.12
             + cos(pos.x * 3.5 + pos.y * 2.5 + uTime * 0.08) * 3.5 * 0.05;
    float dy = cos(pos.y * 1.8 - pos.x * 0.7 + uTime * 0.05) * 1.8 * 0.10
             - sin(pos.x * 1.2 - pos.y * 2.8 + uTime * 0.07) * 2.8 * 0.07;
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
    // Rich silk green palette
    vec3 deepGreen = vec3(0.04, 0.22, 0.14);
    vec3 midGreen = vec3(0.08, 0.38, 0.24);
    vec3 brightGreen = vec3(0.14, 0.55, 0.36);
    vec3 highlight = vec3(0.25, 0.78, 0.52);
    vec3 shadow = vec3(0.02, 0.08, 0.05);

    // Top-down lighting — light from top-left
    vec3 lightDir = normalize(vec3(-0.3, -0.4, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float specular = pow(max(dot(reflect(-lightDir, vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);

    // Fold shadows and highlights
    float foldLight = smoothstep(-0.15, 0.2, vElevation);
    float foldShadow = smoothstep(0.0, -0.18, vElevation);

    // Base silk color with lighting
    vec3 color = mix(deepGreen, midGreen, diffuse * 0.8);
    color = mix(color, brightGreen, foldLight * diffuse);
    color = mix(color, shadow, foldShadow * 0.6);

    // Silk specular sheen — bright catchlights on folds
    color += highlight * specular * 0.4;

    // Silk iridescence — subtle color shift across fabric
    float irid = sin(vUv.x * 6.0 + vUv.y * 4.0 + uTime * 0.2) * 0.5 + 0.5;
    color += vec3(0.01, 0.04, 0.02) * irid * foldLight;

    // Mouse area — soft warm glow like light touching silk
    float dist = distance(vUv, uMouse);
    float glow = smoothstep(0.35, 0.0, dist) * 0.2;
    color += highlight * glow * 0.3;

    // Subtle silk texture grain
    float grain = fract(sin(dot(vUv * 300.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += grain * 0.01;

    // Soft vignette — darker edges like draped fabric curling
    float vignette = smoothstep(0.0, 0.7, length(vUv - 0.5));
    color = mix(color, shadow, vignette * 0.4);

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
      <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5, 200, 200]} />
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
          src="/logo.png"
          alt="Sutera Hijau"
          className="mb-6 h-16 opacity-95 drop-shadow-lg md:h-20"
        />
        <p className="mt-2 text-sm tracking-[0.3em] text-white/60 uppercase md:text-base">
          Technology Incubator & Digital Solutions
        </p>
        <p className="mt-1 text-xs tracking-[0.2em] text-white/40 uppercase">
          Est. 2017 — Shah Alam, Malaysia
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
