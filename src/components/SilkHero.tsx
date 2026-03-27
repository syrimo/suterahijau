import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import type { Mesh, ShaderMaterial as TShaderMaterial } from 'three'
import { Vector2, TextureLoader } from 'three'

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float dist = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.5, 0.0, dist) * 0.35;

    // Super slow idle breathing
    float fold1 = sin(pos.x * 2.0 + pos.y * 0.5 + uTime * 0.06) * 0.08;
    float fold2 = sin(pos.y * 1.8 - pos.x * 0.7 + uTime * 0.05) * 0.06;
    float fold3 = sin(pos.x * 3.5 + pos.y * 2.5 + uTime * 0.08) * 0.03;
    float wrinkle = sin(pos.x * 8.0 + pos.y * 6.0 + uTime * 0.1) * 0.01;

    // Mouse drag — fabric follows pointer
    float push = sin(dist * 8.0 - uTime * 1.5) * mouseInfluence;
    float lift = smoothstep(0.35, 0.0, dist) * 0.12;

    float elevation = fold1 + fold2 + fold3 + wrinkle + push + lift;
    pos.z = elevation;
    vElevation = elevation;

    float dx = cos(pos.x * 2.0 + pos.y * 0.5 + uTime * 0.06) * 2.0 * 0.08
             + cos(pos.x * 3.5 + pos.y * 2.5 + uTime * 0.08) * 3.5 * 0.03;
    float dy = cos(pos.y * 1.8 - pos.x * 0.7 + uTime * 0.05) * 1.8 * 0.06;
    vNormal = normalize(vec3(-dx, -dy, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform sampler2D uTexture;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;

  void main() {
    // Sample the Aurora silk texture
    vec2 uv = vUv;

    // Subtle UV distortion from folds
    uv.x += vElevation * 0.05;
    uv.y += vElevation * 0.03;

    vec3 texColor = texture2D(uTexture, uv).rgb;

    // Lighting on top of texture
    vec3 lightDir = normalize(vec3(-0.3, -0.4, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float specular = pow(max(dot(reflect(-lightDir, vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 24.0);

    // Apply lighting to texture
    vec3 color = texColor * (0.6 + diffuse * 0.5);

    // Silk specular sheen
    color += vec3(0.3, 0.6, 0.4) * specular * 0.25;

    // Fold shadows
    float foldShadow = smoothstep(0.0, -0.12, vElevation);
    color *= (1.0 - foldShadow * 0.35);

    // Fold highlights
    float foldLight = smoothstep(-0.05, 0.1, vElevation);
    color += texColor * foldLight * 0.1;

    // Mouse glow — soft light where pointer is
    float dist = distance(vUv, uMouse);
    float glow = smoothstep(0.35, 0.0, dist) * 0.2;
    color += vec3(0.15, 0.3, 0.2) * glow;

    // Vignette — dark edges
    float vignette = smoothstep(0.0, 0.75, length(vUv - 0.5));
    color = mix(color, vec3(0.01, 0.03, 0.02), vignette * 0.5);

    gl_FragColor = vec4(color, 1.0);
  }
`

function SilkMesh() {
  const meshRef = useRef<Mesh>(null)
  const mouseRef = useRef(new Vector2(0.5, 0.5))
  const { viewport } = useThree()
  const texture = useLoader(TextureLoader, '/silk.jpg')

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new Vector2(0.5, 0.5) },
    uTexture: { value: texture },
  }), [texture])

  useFrame((state) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as TShaderMaterial
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

function SilkCanvas() {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  if (!ready) return null

  return (
    <Canvas
      camera={{ position: [0, 2.2, 0], fov: 45, near: 0.1, far: 10 }}
      style={{ background: '#050a07' }}
    >
      <SilkMesh />
    </Canvas>
  )
}

export default function SilkHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050a07]">
      <div className="absolute inset-0">
        <SilkCanvas />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center pointer-events-none">
        <img
          src="/logo-white.png"
          alt="Sutera Hijau"
          className="mb-6 h-14 opacity-90 drop-shadow-lg md:h-18 lg:h-20"
        />
        <p className="mt-2 text-sm tracking-[0.3em] text-white/50 uppercase md:text-base">
          Technology Incubator & Digital Solutions
        </p>
        <p className="mt-1 text-xs tracking-[0.2em] text-white/30 uppercase">
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
