'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface DiamondIconProps {
  size?: number
  color?: string
  glowColor?: string
}

export default function DiamondIcon({ 
  size = 1, 
  color = '#4A90E2',
  glowColor = '#6BB6FF'
}: DiamondIconProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      // Slow continuous rotation
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group scale={size}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={glowColor}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Glow effect */}
      <mesh>
        <octahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}

