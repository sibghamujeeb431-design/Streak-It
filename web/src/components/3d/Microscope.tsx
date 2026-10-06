export function Microscope() {
  return (
    <group position={[1.4, 0.84, -0.2]}>
      {/* Base - larger and more stable */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.04, 0.4]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Arm - vertical, more prominent */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.14, 0.45, 0.18]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Arm - curved support toward stage */}
      <mesh position={[0, 0.45, 0.1]} rotation={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[0.14, 0.28, 0.14]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Stage - larger work area */}
      <mesh position={[0, 0.27, 0.14]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.025, 0.3]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Stage clip left */}
      <mesh position={[-0.1, 0.295, 0.14]} castShadow>
        <boxGeometry args={[0.025, 0.05, 0.18]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Stage clip right */}
      <mesh position={[0.1, 0.295, 0.14]} castShadow>
        <boxGeometry args={[0.025, 0.05, 0.18]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Objective lens turret/revolver */}
      <mesh position={[0, 0.58, 0.06]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Multiple objective lenses */}
      <mesh position={[0, 0.52, 0.06]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.06, 0.52, 0.04]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-0.06, 0.52, 0.04]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.06, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Eyepiece tube */}
      <mesh position={[0, 0.68, 0.06]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.14, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Eyepiece lens housing */}
      <mesh position={[0, 0.76, 0.06]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Eyepiece lens - blue glass */}
      <mesh position={[0, 0.78, 0.06]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.025, 16]} />
        <meshStandardMaterial color="#4A90E2" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
      </mesh>

      {/* Coarse focus knob - larger */}
      <mesh position={[0.14, 0.38, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Fine focus knob - smaller, nested */}
      <mesh position={[0.14, 0.38, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Light source housing */}
      <mesh position={[0, 0.17, 0.25]} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.1]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Light window - circular */}
      <mesh position={[0, 0.17, 0.3]} castShadow>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}
