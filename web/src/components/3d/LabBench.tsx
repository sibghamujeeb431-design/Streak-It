export function LabBench() {
  return (
    <group>
      {/* Main bench surface - sized for reference composition */}
      <mesh position={[0, 0.8, 0]} receiveShadow>
        <boxGeometry args={[4.0, 0.08, 1.8]} />
        <meshStandardMaterial color="#E8E4D9" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Bench legs - front left */}
      <mesh position={[-1.8, 0.4, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#B8B0A0" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Bench legs - front right */}
      <mesh position={[1.8, 0.4, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#B8B0A0" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Bench legs - back left */}
      <mesh position={[-1.8, 0.4, 0.7]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#B8B0A0" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Bench legs - back right */}
      <mesh position={[1.8, 0.4, 0.7]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#B8B0A0" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Back shelf */}
      <mesh position={[0, 1.2, 0.75]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.05, 0.3]} />
        <meshStandardMaterial color="#D4D0C4" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Back shelf supports */}
      <mesh position={[-1.6, 1.0, 0.75]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.25]} />
        <meshStandardMaterial color="#B8B0A0" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[1.6, 1.0, 0.75]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.25]} />
        <meshStandardMaterial color="#B8B0A0" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  )
}
