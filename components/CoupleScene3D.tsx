'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import type * as THREE_TYPES from 'three'

interface CoupleScene3DProps {
  groomImageUrl?: string
  brideImageUrl?: string
  className?: string
}

function CoupleScene3DInner({
  groomImageUrl = '/images/yudi-3D-full.png',
  brideImageUrl = '/images/kiki-3D-full.png',
  className = '',
}: CoupleScene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    let animFrameId: number
    let renderer: THREE_TYPES.WebGLRenderer | null = null
    let isDestroyed = false

    const init = async () => {
      const THREE = await import('three')
      const container = mountRef.current!
      const W = container.clientWidth || 560
      const H = container.clientHeight || 380

      // ── Scene ─────────────────────────────────────────────────────────────
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
      camera.position.set(0, 0, 5)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      // ── Lighting ──────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 1.2))
      const dir = new THREE.DirectionalLight(0xffe8e0, 0.6)
      dir.position.set(2, 3, 4)
      scene.add(dir)

      // ── Load character texture → PlaneGeometry ────────────────────────────
      const loader = new THREE.TextureLoader()

      const loadCharacter = (url: string, xPos: number) =>
        new Promise<THREE_TYPES.Mesh>((resolve) => {
          const fallback = () => {
            const mesh = new THREE.Mesh(
              new THREE.PlaneGeometry(1.8, 3.2),
              new THREE.MeshStandardMaterial({
                color: xPos < 0 ? 0xd9a0ae : 0xc4788a,
                transparent: true,
                opacity: 0.5,
              })
            )
            mesh.position.set(xPos, 0, 0)
            scene.add(mesh)
            resolve(mesh)
          }

          loader.load(
            url,
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace
              const aspect = texture.image.width / texture.image.height
              const h = 3.2
              const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(h * aspect, h),
                new THREE.MeshStandardMaterial({
                  map: texture,
                  transparent: true,
                  alphaTest: 0.05,
                  side: THREE.DoubleSide,
                  roughness: 0.8,
                  metalness: 0,
                })
              )
              mesh.position.set(xPos, 0, 0)
              scene.add(mesh)
              resolve(mesh)
            },
            undefined,
            fallback
          )
        })

      // ── Petal particles ───────────────────────────────────────────────────
      const petalColors = [0xd9a0ae, 0xe8b4c0, 0xf2dde2, 0xd4b47a, 0xc4788a]
      type PetalData = { mesh: THREE_TYPES.Mesh; vy: number; vx: number; vr: number; phase: number }
      const petals: PetalData[] = []

      for (let i = 0; i < 18; i++) {
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.08, 0.14),
          new THREE.MeshStandardMaterial({
            color: petalColors[i % petalColors.length],
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide,
          })
        )
        mesh.position.set(
          (Math.random() - 0.5) * 7,
          2 + Math.random() * 4,
          (Math.random() - 0.5) * 2 - 0.5
        )
        mesh.rotation.z = Math.random() * Math.PI * 2
        scene.add(mesh)
        petals.push({
          mesh,
          vy: -(0.008 + Math.random() * 0.008),
          vx: (Math.random() - 0.5) * 0.004,
          vr: (Math.random() - 0.5) * 0.04,
          phase: Math.random() * Math.PI * 2,
        })
      }

      // ── Hex frame ornament ────────────────────────────────────────────────
      const hexPts: THREE_TYPES.Vector3[] = []
      for (let i = 0; i < 7; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 6
        hexPts.push(new THREE.Vector3(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, -0.5))
      }
      const hexGeo = new THREE.BufferGeometry().setFromPoints(hexPts)
      const hexLine = new THREE.Line(
        hexGeo,
        new THREE.LineBasicMaterial({ color: 0xd4b47a, transparent: true, opacity: 0.25 })
      )
      scene.add(hexLine)

      // ── Load characters ───────────────────────────────────────────────────
      const [groomMesh, brideMesh] = await Promise.all([
        loadCharacter(groomImageUrl, -1.4),
        loadCharacter(brideImageUrl, 1.4),
      ])

      // ── Mouse / touch parallax ────────────────────────────────────────────
      const mouse = { x: 0, y: 0 }
      const camTarget = { x: 0, y: 0 }

      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          mouse.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 2
          mouse.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2
        }
      }
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })

      // ── Responsive resize ─────────────────────────────────────────────────
      const onResize = () => {
        if (!container || isDestroyed || !renderer) return
        const w = container.clientWidth
        const h = container.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      // ── Animation loop ────────────────────────────────────────────────────
      let t = 0
      const animate = () => {
        if (isDestroyed) return
        animFrameId = requestAnimationFrame(animate)
        t += 0.016

        // Smooth camera parallax
        camTarget.x += (mouse.x * 0.3 - camTarget.x) * 0.05
        camTarget.y += (mouse.y * 0.15 - camTarget.y) * 0.05
        camera.position.x = camTarget.x
        camera.position.y = camTarget.y
        camera.lookAt(0, 0, 0)

        // Floating sinusoidal Y
        groomMesh.position.y = Math.sin(t * 0.8) * 0.12
        brideMesh.position.y = Math.sin(t * 0.8 + Math.PI * 0.6) * 0.12

        // Subtle rotation following mouse
        groomMesh.rotation.y = mouse.x * 0.08
        brideMesh.rotation.y = mouse.x * 0.08
        groomMesh.rotation.x = -mouse.y * 0.04
        brideMesh.rotation.x = -mouse.y * 0.04

        // Hex slow rotation
        hexLine.rotation.z += 0.001

        // Petal physics
        petals.forEach((p, i) => {
          p.mesh.position.y += p.vy
          p.mesh.position.x += p.vx + Math.sin(t * 0.6 + p.phase) * 0.003
          p.mesh.rotation.z += p.vr
          if (p.mesh.position.y < -3) {
            p.mesh.position.y = 3 + Math.random() * 2
            p.mesh.position.x = (Math.random() - 0.5) * 7
          }
          p.mesh.position.x += mouse.x * 0.002 * (i % 3 + 1)
        })

        renderer!.render(scene, camera)
      }
      animate()

      return () => {
        isDestroyed = true
        cancelAnimationFrame(animFrameId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('resize', onResize)
        renderer?.dispose()
        if (container.contains(renderer?.domElement ?? null)) {
          container.removeChild(renderer!.domElement)
        }
      }
    }

    let cleanup: (() => void) | undefined
    init().then(fn => { cleanup = fn })

    return () => {
      isDestroyed = true
      cancelAnimationFrame(animFrameId)
      cleanup?.()
    }
  }, [groomImageUrl, brideImageUrl])

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    />
  )
}

const CoupleScene3DDynamic = dynamic(
  () => Promise.resolve(CoupleScene3DInner),
  { ssr: false }
)

export function CoupleScene3D(props: CoupleScene3DProps) {
  return <CoupleScene3DDynamic {...props} />
}
