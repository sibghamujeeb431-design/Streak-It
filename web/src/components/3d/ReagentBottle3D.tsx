interface ReagentBottle3DProps {
  position: [number, number, number]
  liquidColor: string
  labelColor: string
}

export function ReagentBottle3D({ position, liquidColor, labelColor }: ReagentBottle3DProps) {
  return (
    <group position={position}>
      {/* Bottle body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.2, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} transparent opacity={0.9} />
      </mesh>

      {/* Liquid inside */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.14, 16]} />
        <meshStandardMaterial color={liquidColor} roughness={0.2} metalness={0.1} transparent opacity={0.85} />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.04, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Label */}
      <mesh position={[0, 0.01, 0.07]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.01]} />
        <meshStandardMaterial color={labelColor} roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Label border */}
      <mesh position={[0, 0.01, 0.071]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.082, 0.082, 0.005]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.5} metalness={0.1} />
      </mesh>
    </group>
  )
}
