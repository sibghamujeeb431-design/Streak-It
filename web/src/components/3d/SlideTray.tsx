export function SlideTray() {
  return (
    <group position={[-0.8, 0.84, 0.2]}>
      {/* Tray base */}
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color="#E0E0E0" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Tray edges */}
      <mesh position={[-0.24, 0.03, 0]} castShadow>
        <boxGeometry args={[0.02, 0.04, 0.3]} />
        <meshStandardMaterial color="#D0D0D0" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.24, 0.03, 0]} castShadow>
        <boxGeometry args={[0.02, 0.04, 0.3]} />
        <meshStandardMaterial color="#D0D0D0" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.03, -0.14]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.02]} />
        <meshStandardMaterial color="#D0D0D0" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.03, 0.14]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.02]} />
        <meshStandardMaterial color="#D0D0D0" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Slide in tray */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.005, 0.07]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Smear on slide */}
      <mesh position={[0, 0.045, 0]} castShadow>
        <circleGeometry args={[0.02, 16]} />
        <meshStandardMaterial color="#E9E4DB" roughness={0.8} metalness={0.0} />
      </mesh>
    </group>
  )
}
