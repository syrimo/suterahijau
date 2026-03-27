import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { Mesh, ShaderMaterial } from 'three'
import { Vector2 } from 'three'

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Distance from mouse
    float dist = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, dist) * 0.15;

    // Silk wave patterns - multiple overlapping sine waves
    float wave1 = sin(pos.x * 3.0 + uTime * 0.8) * 0.06;
    float wave2 = sin(pos.y * 4.0 + uTime * 0.6) * 0.04;
    float wave3 = sin(pos.x * 2.0 + pos.y * 3.0 + uTime * 1.0) * 0.03;
    float wave4 = sin(pos.x * 5.0 - uTime * 0.4) * 0.02;

    // Mouse ripple effect
    float ripple = sin(dist * 20.0 - uTime * 3.0) * mouseInfluence;

    float elevation = wave1 + wave2 + wave3 + wave4 + ripple;
    pos.z = elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Silk green palette
    vec3 deepGreen = vec3(0.06, 0.34, 0.22);
    vec3 brightGreen = vec3(0.13, 0.55, 0.36);
    vec3 highlight = vec3(0.2, 0.75, 0.5);
    vec3 shadow = vec3(0.03, 0.15, 0.1);

    // Silk sheen based on elevation (light catching folds)
    float sheen = smoothstep(-0.1, 0.15, vElevation);
    float deepShadow = smoothstep(0.05, -0.12, vElevation);

    // Iridescent shift based on viewing angle (simulated via UV)
    float iridescence = sin(vUv.x * 8.0 + vUv.y * 6.0 + uTime * 0.3) * 0.5 + 0.5;

    // Mix colors for silk look
    vec3 color = mix(deepGreen, brightGreen, sheen);
    color = mix(color, highlight, sheen * sheen * 0.6);
    color = mix(color, shadow, deepShadow * 0.5);
    color += vec3(0.02, 0.06, 0.04) * iridescence * sheen;

    // Mouse proximity glow
    float dist = distance(vUv, uMouse);
    float glow = smoothstep(0.4, 0.0, dist) * 0.15;
    color += vec3(0.05, 0.15, 0.1) * glow;

    // Subtle silk grain
    float grain = fract(sin(dot(vUv * 200.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += grain * 0.015;

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

    // Smooth mouse follow
    const target = mouseRef.current
    const current = material.uniforms.uMouse.value
    current.x += (target.x - current.x) * 0.05
    current.y += (target.y - current.y) * 0.05
  })

  const handlePointerMove = (e: { uv?: { x: number; y: number } | null }) => {
    if (e.uv) {
      mouseRef.current.set(e.uv.x, e.uv.y)
    }
  }

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.8, 0, 0]}
      position={[0, -0.3, 0]}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[viewport.width * 1.2, viewport.height * 1.2, 128, 128]} />
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
      {/* 3D Silk Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 50 }}
          style={{ background: '#111111' }}
        >
          <SilkMesh />
        </Canvas>
      </div>

      {/* Overlay Content */}
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] text-white/30 uppercase">Scroll</span>
          <div className="h-8 w-[1px] animate-pulse bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}
