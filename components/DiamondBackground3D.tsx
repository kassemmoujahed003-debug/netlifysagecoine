'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

// Individual floating diamond crystal
function FloatingDiamond({ position, rotationSpeed, scale }: { 
  position: [number, number, number]
  rotationSpeed: number
  scale: number 
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.x += rotationSpeed * 0.001
      meshRef.current.rotation.y += rotationSpeed * 0.0015
      meshRef.current.rotation.z += rotationSpeed * 0.0008
      
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {/* Create a diamond shape using an octahedron (8 faces) */}
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#4A90E2"
        transparent
        opacity={0.15}
        metalness={0.8}
        roughness={0.2}
        emissive="#1E3A5F"
        emissiveIntensity={0.1}
      />
      {/* Add a wireframe for more definition */}
      <mesh>
        <octahedronGeometry args={[1.02, 0]} />
        <meshBasicMaterial
          color="#6BB6FF"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </mesh>
  )
}

// Main 3D scene component
function DiamondScene() {
  // Create multiple floating diamonds at different positions
  const diamonds = useMemo(() => {
    const positions: [number, number, number][] = []
    const scales: number[] = []
    const speeds: number[] = []
    
    // Generate 8-10 diamonds at various positions
    for (let i = 0; i < 10; i++) {
      positions.push([
        (Math.random() - 0.5) * 20, // x: -10 to 10
        (Math.random() - 0.5) * 15, // y: -7.5 to 7.5
        (Math.random() - 0.5) * 30 - 10, // z: -25 to 5 (behind the scene)
      ])
      scales.push(0.8 + Math.random() * 1.5) // Random size
      speeds.push(0.3 + Math.random() * 0.4) // Random rotation speed
    }
    
    return { positions, scales, speeds }
  }, [])

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Directional light for depth */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      
      {/* Point lights for diamond sparkle effects */}
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#4A90E2" />
      <pointLight position={[-10, -10, 10]} intensity={0.3} color="#6BB6FF" />
      
      {/* Render all floating diamonds */}
      {diamonds.positions.map((pos, index) => (
        <FloatingDiamond
          key={index}
          position={pos}
          scale={diamonds.scales[index]}
          rotationSpeed={diamonds.speeds[index]}
        />
      ))}
    </>
  )
}

// Main component that wraps the Canvas
export default function DiamondBackground3D() {
  const [webglError, setWebglError] = useState(false)

  useEffect(() => {
    // Check if WebGL is available
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglError(true)
        return
      }
      
      // Check for context loss
      canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault()
        setWebglError(true)
      }, { once: true })
    } catch (error) {
      console.warn('WebGL check failed, using fallback:', error)
      setWebglError(true)
    }
    
    // Global error handler for WebGL errors
    const handleWebGLError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('WebGL')) {
        console.warn('WebGL error detected, using fallback:', event.message)
        setWebglError(true)
      }
    }
    
    window.addEventListener('error', handleWebGLError)
    return () => {
      window.removeEventListener('error', handleWebGLError)
    }
  }, [])

  // Fallback to simple gradient background if WebGL is not available
  if (webglError) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary-dark to-accent/5"></div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          try {
            // Handle WebGL context loss
            const canvas = gl.domElement
            canvas.addEventListener('webglcontextlost', (event) => {
              event.preventDefault()
              setWebglError(true)
            }, { once: true })
            
            canvas.addEventListener('webglcontextrestored', () => {
              // Context restored, but we'll keep the fallback for stability
              console.log('WebGL context restored')
            }, { once: true })
          } catch (error) {
            console.warn('Error setting up WebGL context handlers:', error)
            setWebglError(true)
          }
        }}
        onError={(error) => {
          console.warn('WebGL error, falling back to gradient:', error)
          setWebglError(true)
        }}
      >
        <DiamondScene />
      </Canvas>
    </div>
  )
}

