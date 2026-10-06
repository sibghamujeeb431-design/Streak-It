export function SlideTray() {
  return (
    <group position={[0, 0.84, 0.3]}>
      {/* Tray base - metal rack style */}
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.025, 0.35]} />
        <meshStandardMaterial color="#D8D8D8" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Tray rails - raised edges for slide support */}
      <mesh position={[-0.26, 0.035, 0]} castShadow>
        <boxGeometry args={[0.03, 0.05, 0.35]} />
        <meshStandardMaterial color="#C8C8C8" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0.26, 0.035, 0]} castShadow>
        <boxGeometry args={[0.03, 0.05, 0.35]} />
        <meshStandardMaterial color="#C8C8C8" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Cross rails for rack structure */}
      <mesh position={[0, 0.035, -0.12]} castShadow>
        <boxGeometry args={[0.55, 0.04, 0.025]} />
        <meshStandardMaterial color="#C8C8C8" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.035, 0.12]} castShadow>
        <boxGeometry args={[0.55, 0.04, 0.025]} />
        <meshStandardMaterial color="#C8C8C8" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Glass slide - classic microscope slide proportions */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.006, 0.08]} />
        <meshStandardMaterial color="#F8F8F8" roughness={0.1} metalness={0.0} transparent opacity={0.7} />
      </mesh>

      {/* Slide corners - frosted area indication */}
      <mesh position={[-0.15, 0.062, 0.03]} castShadow>
        <boxGeometry args={[0.06, 0.004, 0.02]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.6} metalness={0.0} />
      </mesh>

      {/* Bacterial smear on slide - more visible */}
      <mesh position={[0, 0.064, 0]} castShadow>
        <circleGeometry args={[0.025, 16]} />
        <meshStandardMaterial color="#E9E4DB" roughness={0.7} metalness={0.0} />
      </mesh>
    </group>
  )
}
