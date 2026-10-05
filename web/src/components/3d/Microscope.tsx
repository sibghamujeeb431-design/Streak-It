export function Microscope() {
  return (
    <group position={[1.2, 0.84, 0]}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.04, 0.35]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Arm - vertical */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.12, 0.4, 0.15]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Arm - curved support */}
      <mesh position={[0, 0.42, 0.08]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Stage */}
      <mesh position={[0, 0.25, 0.12]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.02, 0.25]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Stage clip left */}
      <mesh position={[-0.08, 0.27, 0.12]} castShadow>
        <boxGeometry args={[0.02, 0.04, 0.15]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Stage clip right */}
      <mesh position={[0.08, 0.27, 0.12]} castShadow>
        <boxGeometry args={[0.02, 0.04, 0.15]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Objective lens housing */}
      <mesh position={[0, 0.55, 0.05]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Objective lens */}
      <mesh position={[0, 0.5, 0.05]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Eyepiece */}
      <mesh position={[0, 0.65, 0.05]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Eyepiece lens */}
      <mesh position={[0, 0.72, 0.05]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#4A90E2" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
      </mesh>

      {/* Focus knob */}
      <mesh position={[0.12, 0.35, 0.08]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Light source */}
      <mesh position={[0, 0.15, 0.22]} castShadow>
        <boxGeometry args={[0.15, 0.08, 0.08]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Light window */}
      <mesh position={[0, 0.15, 0.26]} castShadow>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
